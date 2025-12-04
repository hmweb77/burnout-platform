import { NextResponse } from "next/server";
import Stripe from "stripe";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

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

const adminAuth = getAuth();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
});

/**
 * API Route: Verify Payment and Get Auth Token
 * 
 * Verifies Stripe payment session and returns Firebase custom token
 * for client-side sign-in.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    // Verify payment status
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    const customerEmail = session.customer_email || session.customer_details?.email;

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Customer email not found" },
        { status: 400 }
      );
    }

    // Get or create Firebase user
    let user;
    try {
      user = await adminAuth.getUserByEmail(customerEmail);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        // User should have been created by webhook, but create if missing
        user = await adminAuth.createUser({
          email: customerEmail,
          emailVerified: true,
        });
      } else {
        throw error;
      }
    }

    // Generate custom token for client-side sign-in
    const customToken = await adminAuth.createCustomToken(user.uid);

    return NextResponse.json({
      success: true,
      customToken,
      userId: user.uid,
      email: customerEmail,
      assessmentId: session.metadata?.assessmentId || null,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      {
        error: "Failed to verify payment",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}

