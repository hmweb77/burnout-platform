import { NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import Stripe from "stripe";

// Initialize Firebase Admin SDK
let adminDb = null;
let adminAuth = null;
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
  adminAuth = getAuth();
  
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-11-20.acacia",
    });
  }
} catch (error) {
  console.error("Initialization error:", error);
}

/**
 * API Route: Create Account and Link Assessment
 * 
 * 1. Verifies Stripe payment session
 * 2. Creates or signs in Firebase Auth user
 * 3. Saves assessment results to users/{uid}/assessments/{assessmentId}
 * 4. Returns user info and redirect URL
 */
export async function POST(request) {
  try {
    if (!adminDb || !adminAuth) {
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
    const { sessionId, password, assessmentId } = body;

    // Validation
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password is required and must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (!assessmentId) {
      return NextResponse.json(
        { error: "Assessment ID is required" },
        { status: 400 }
      );
    }

    // Step 1: Verify Stripe payment session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    const customerEmail = session.customer_email || session.customer_details?.email;
    if (!customerEmail) {
      return NextResponse.json(
        { error: "Customer email not found in payment session" },
        { status: 400 }
      );
    }

    // Step 2: Get or create assessment data
    const assessmentRef = adminDb.collection("assessments").doc(assessmentId);
    const assessmentDoc = await assessmentRef.get();

    if (!assessmentDoc.exists) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    const assessmentData = assessmentDoc.data();

    // Step 3: Create or get Firebase Auth user
    let user;
    let isNewUser = false;

    try {
      // Try to get existing user by email
      user = await adminAuth.getUserByEmail(customerEmail);
      console.log("Existing user found:", user.uid);
      // For existing users, password verification happens client-side
      // We'll just link the assessment and return custom token
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        // Create new user with password
        user = await adminAuth.createUser({
          email: customerEmail,
          emailVerified: true,
          password: password,
        });
        isNewUser = true;
        console.log("New user created:", user.uid);
      } else {
        throw error;
      }
    }

    // Step 5: Save assessment to user's assessments subcollection
    const userAssessmentRef = adminDb
      .collection("users")
      .doc(user.uid)
      .collection("assessments")
      .doc(assessmentId);

    await userAssessmentRef.set({
      answers: assessmentData.answers,
      submittedAt: assessmentData.createdAt || new Date(),
      paidAt: new Date(),
      stripeSessionId: sessionId,
      status: "completed",
    });

    // Step 6: Update main assessment document to link to user
    await assessmentRef.update({
      uid: user.uid,
      email: customerEmail,
      paid: true,
      paidAt: new Date(),
      status: "completed",
    });

    // Step 7: Create or update user document
    const userRef = adminDb.collection("users").doc(user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        email: customerEmail,
        createdAt: new Date(),
        assessments: [assessmentId],
      });
    } else {
      const userData = userDoc.data();
      const assessments = userData.assessments || [];
      if (!assessments.includes(assessmentId)) {
        await userRef.update({
          assessments: [...assessments, assessmentId],
        });
      }
    }

    // Step 8: Generate custom token for client-side sign-in
    const customToken = await adminAuth.createCustomToken(user.uid);

    console.log("✅ Account created/linked and assessment saved:", {
      userId: user.uid,
      email: customerEmail,
      assessmentId,
      isNewUser,
    });

    return NextResponse.json({
      success: true,
      customToken,
      userId: user.uid,
      email: customerEmail,
      isNewUser,
      assessmentId,
    });
  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json(
      {
        error: "Failed to create account",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}

