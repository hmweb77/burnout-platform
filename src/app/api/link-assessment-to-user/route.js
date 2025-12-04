import { NextResponse } from "next/server";

/**
 * API Route: Link Anonymous Assessment to User Account
 * 
 * This route is called from the client-side after account creation.
 * The actual Firestore update happens client-side for security reasons.
 * This API route can be used for server-side validation/logging if needed.
 * 
 * Note: For production, consider using Firebase Admin SDK for server-side operations.
 */

/**
 * API Route: Link Anonymous Assessment to User Account
 * 
 * After payment and account creation, this route:
 * 1. Retrieves the anonymous assessment by assessmentId
 * 2. Updates it with the user's uid
 * 3. Optionally copies to user's surveys subcollection
 * 4. Updates status to "completed"
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { assessmentId, uid, email } = body;

    // Validation
    if (!assessmentId) {
      return NextResponse.json(
        { error: "Assessment ID is required" },
        { status: 400 }
      );
    }

    if (!uid) {
      return NextResponse.json(
        { error: "User ID (uid) is required" },
        { status: 400 }
      );
    }

    // For now, this API route just validates the request
    // The actual Firestore update happens client-side in CreateAccountAfterPayment component
    // This allows the update to use the authenticated user's token
    
    // In production, you can add server-side logging or validation here
    console.log("Assessment linking request:", {
      assessmentId,
      uid,
      email,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Assessment linking validated",
      assessmentId: assessmentId,
      uid: uid,
    });
  } catch (error) {
    console.error("Error in link-assessment API:", error);
    return NextResponse.json(
      {
        error: "Failed to process linking request",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}

