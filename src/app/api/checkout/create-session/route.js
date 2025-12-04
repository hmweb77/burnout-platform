import { NextResponse } from "next/server";
import Stripe from "stripe";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
let adminDb = null;
let stripe = null;

try {
  if (!getApps().length) {
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG || "{}");
    
    if (firebaseConfig.projectId) {
      initializeApp({
        credential: cert({
          projectId: firebaseConfig.projectId,
          clientEmail: firebaseConfig.clientEmail,
          privateKey: firebaseConfig.privateKey?.replace(/\\n/g, "\n"),
        }),
      });
    }
  }
  adminDb = getFirestore();
  
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-11-20.acacia",
    });
  }
} catch (error) {
  console.error("Initialization error:", error);
}

/**
 * API Route: Create Stripe Checkout Session
 * 
 * Creates a Stripe Checkout session for the assessment.
 * Includes assessmentId in metadata for webhook processing.
 */
export async function POST(request) {
  try {
    // Check if services are initialized
    if (!adminDb) {
      return NextResponse.json(
        { error: "Server configuration error: Firebase Admin not initialized" },
        { status: 500 }
      );
    }

    if (!stripe) {
      return NextResponse.json(
        { error: "Server configuration error: Stripe not initialized" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { assessmentId, email } = body;

    // Validation
    if (!assessmentId) {
      return NextResponse.json(
        { error: "Assessment ID is required" },
        { status: 400 }
      );
    }

    // Verify assessment exists and is not already paid
    const assessmentRef = adminDb.collection("assessments").doc(assessmentId);
    const assessmentDoc = await assessmentRef.get();

    if (!assessmentDoc.exists) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    const assessmentData = assessmentDoc.data();
    
    if (assessmentData.paid === true) {
      return NextResponse.json(
        { error: "Assessment already paid" },
        { status: 400 }
      );
    }

    // Get price ID from environment or use default
    const priceId = process.env.STRIPE_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
    
    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price ID not configured" },
        { status: 500 }
      );
    }

    // Get base URL
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email || assessmentData.email || undefined,
      success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&assessment_id=${assessmentId}`,
      cancel_url: `${baseUrl}/checkout?assessmentId=${assessmentId}`,
      metadata: {
        assessmentId: assessmentId,
        email: email || assessmentData.email || "",
      },
      allow_promotion_codes: true,
    });

    console.log("✅ Checkout session created:", session.id);

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    
    // Ensure we always return JSON, never HTML
    try {
      return NextResponse.json(
        {
          error: "Failed to create checkout session",
          details: error.message || String(error),
        },
        { 
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (jsonError) {
      // Last resort: return plain text error
      return new NextResponse(
        JSON.stringify({
          error: "Failed to create checkout session",
          details: "Internal server error",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
}

