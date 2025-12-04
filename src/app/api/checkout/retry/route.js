import { NextResponse } from "next/server";
import Stripe from "stripe";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
if (!getApps().length) {
  try {
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
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

const adminDb = getFirestore();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
});

/**
 * API Route: Retry Payment
 * 
 * Allows users to retry payment for an unpaid assessment.
 * Reuses the same assessmentId.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { assessmentId } = body;

    if (!assessmentId) {
      return NextResponse.json(
        { error: "Assessment ID is required" },
        { status: 400 }
      );
    }

    // Verify assessment exists
    const assessmentRef = adminDb.collection("assessments").doc(assessmentId);
    const assessmentDoc = await assessmentRef.get();

    if (!assessmentDoc.exists) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    const assessmentData = assessmentDoc.data();

    // Check if already paid
    if (assessmentData.paid === true) {
      return NextResponse.json(
        { error: "Assessment already paid" },
        { status: 400 }
      );
    }

    // Get price ID
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

    // Create new checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: assessmentData.email || undefined,
      success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&assessment_id=${assessmentId}`,
      cancel_url: `${baseUrl}/checkout?assessmentId=${assessmentId}`,
      metadata: {
        assessmentId: assessmentId,
        email: assessmentData.email || "",
      },
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Error creating retry checkout session:", error);
    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}

