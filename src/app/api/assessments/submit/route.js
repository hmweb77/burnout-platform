import { NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
let adminDb = null;

try {
  if (!getApps().length) {
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG || "{}");
    
    if (!firebaseConfig.projectId) {
      throw new Error("FIREBASE_CONFIG is missing or invalid");
    }

    initializeApp({
      credential: cert({
        projectId: firebaseConfig.projectId,
        clientEmail: firebaseConfig.clientEmail,
        privateKey: firebaseConfig.privateKey?.replace(/\\n/g, "\n"),
      }),
    });
  }
  adminDb = getFirestore();
} catch (error) {
  console.error("Firebase Admin initialization error:", error);
  // adminDb will remain null, will be handled in route
}

/**
 * API Route: Submit Assessment
 * 
 * Accepts assessment answers and optional email.
 * Saves to Firestore with paid: false.
 * Returns assessmentId for checkout.
 */
export async function POST(request) {
  try {
    // Check if Firebase Admin is initialized
    if (!adminDb) {
      return NextResponse.json(
        { error: "Server configuration error: Firebase Admin not initialized" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { answers, email, anonymousId } = body;

    // Validation
    if (!answers) {
      return NextResponse.json(
        { error: "Answers are required" },
        { status: 400 }
      );
    }

    // Validate answers structure
    const requiredCategories = [
      "physicalWellbeing",
      "emotionalWellbeing",
      "mindsetWellbeing",
      "lifestyleBalance",
    ];

    for (const category of requiredCategories) {
      if (!Array.isArray(answers[category])) {
        return NextResponse.json(
          { error: `Invalid answers format: ${category} must be an array` },
          { status: 400 }
        );
      }
      if (answers[category].length === 0) {
        return NextResponse.json(
          { error: `Invalid answers: ${category} cannot be empty` },
          { status: 400 }
        );
      }
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create assessment document
    const assessmentData = {
      answers,
      email: email || null,
      anonymousId: anonymousId || null,
      paid: false,
      createdAt: new Date(),
      status: "pending_payment",
    };

    const docRef = await adminDb.collection("assessments").add(assessmentData);
    const assessmentId = docRef.id;

    console.log("✅ Assessment submitted:", assessmentId);

    return NextResponse.json({
      success: true,
      assessmentId,
    });
  } catch (error) {
    console.error("Error submitting assessment:", error);
    
    // Ensure we always return JSON, never HTML
    try {
      return NextResponse.json(
        {
          error: "Failed to submit assessment",
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
          error: "Failed to submit assessment",
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

