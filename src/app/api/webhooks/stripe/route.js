import { NextResponse } from "next/server";
import Stripe from "stripe";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
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

const adminDb = getFirestore();
const adminAuth = getAuth();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Stripe Webhook Handler
 * 
 * Handles checkout.session.completed event:
 * 1. Marks assessment as paid: true
 * 2. Creates Firebase Auth user if doesn't exist
 * 3. Links assessment to user
 * 4. Handles idempotency
 */
export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const assessmentId = session.metadata?.assessmentId;
    const customerEmail = session.customer_email || session.customer_details?.email;

    if (!assessmentId) {
      console.error("Missing assessmentId in session metadata");
      return NextResponse.json(
        { error: "Missing assessmentId in metadata" },
        { status: 400 }
      );
    }

    if (!customerEmail) {
      console.error("Missing email in session");
      return NextResponse.json(
        { error: "Missing customer email" },
        { status: 400 }
      );
    }

    try {
      // Use Firestore transaction for idempotency
      await adminDb.runTransaction(async (transaction) => {
        const assessmentRef = adminDb.collection("assessments").doc(assessmentId);
        const assessmentDoc = await transaction.get(assessmentRef);

        if (!assessmentDoc.exists) {
          throw new Error("Assessment not found");
        }

        const assessmentData = assessmentDoc.data();

        // Idempotency check: if already paid, skip
        if (assessmentData.paid === true) {
          console.log("Assessment already paid, skipping:", assessmentId);
          return;
        }

        // Mark assessment as paid
        transaction.update(assessmentRef, {
          paid: true,
          paidAt: new Date(),
          stripeSessionId: session.id,
          stripeCustomerId: session.customer,
          status: "completed",
        });

        // Create or get Firebase Auth user
        let user;
        try {
          // Try to get user by email
          user = await adminAuth.getUserByEmail(customerEmail);
          console.log("Existing user found:", user.uid);
        } catch (error) {
          if (error.code === "auth/user-not-found") {
            // Create new user
            user = await adminAuth.createUser({
              email: customerEmail,
              emailVerified: true,
              disabled: false,
            });
            console.log("New user created:", user.uid);
          } else {
            throw error;
          }
        }

        // Link assessment to user
        transaction.update(assessmentRef, {
          uid: user.uid,
          email: customerEmail,
        });

        // Create user document in Firestore if doesn't exist
        const userRef = adminDb.collection("users").doc(user.uid);
        const userDoc = await transaction.get(userRef);

        if (!userDoc.exists) {
          transaction.set(userRef, {
            email: customerEmail,
            createdAt: new Date(),
            assessments: [assessmentId],
          });
        } else {
          // Add assessment to user's assessments array if not already present
          const userData = userDoc.data();
          const assessments = userData.assessments || [];
          if (!assessments.includes(assessmentId)) {
            transaction.update(userRef, {
              assessments: [...assessments, assessmentId],
            });
          }
        }

        // Copy assessment to user's surveys subcollection for easy access
        const surveyRef = adminDb
          .collection("users")
          .doc(user.uid)
          .collection("surveys")
          .doc(assessmentId);

        transaction.set(surveyRef, {
          answers: assessmentData.answers,
          submittedAt: assessmentData.createdAt,
          paidAt: new Date(),
          source: "paid_assessment",
        });

        console.log("✅ Assessment marked as paid and linked to user:", {
          assessmentId,
          userId: user.uid,
          email: customerEmail,
        });
      });

      return NextResponse.json({ received: true });
    } catch (error) {
      console.error("Error processing webhook:", error);
      return NextResponse.json(
        {
          error: "Failed to process webhook",
          details: error.message || String(error),
        },
        { status: 500 }
      );
    }
  }

  // Return 200 for other event types
  return NextResponse.json({ received: true });
}

// Disable body parsing for webhook route (Next.js default)
export const runtime = "nodejs";

