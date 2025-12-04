import { NextResponse } from "next/server";

/**
 * API Route: Save Anonymous Assessment
 * 
 * This route saves assessment data to Firestore.
 * Since we're using client-side Firebase SDK, this route validates the data
 * and returns instructions, but the actual write should happen client-side
 * with proper Firestore security rules.
 * 
 * For production, consider using Firebase Admin SDK for server-side writes.
 */

export async function POST(request) {
  try {
    const body = await request.json();
    const { answers, anonymousId, formikValues } = body;

    // Validation
    if (!answers) {
      return NextResponse.json(
        { error: "Answers are required" },
        { status: 400 }
      );
    }

    if (!anonymousId) {
      return NextResponse.json(
        { error: "Anonymous ID is required" },
        { status: 400 }
      );
    }

    // Validate answers structure
    const requiredCategories = ['physicalWellbeing', 'emotionalWellbeing', 'mindsetWellbeing', 'lifestyleBalance'];
    for (const category of requiredCategories) {
      if (!Array.isArray(answers[category])) {
        return NextResponse.json(
          { error: `Invalid answers format: ${category} must be an array` },
          { status: 400 }
        );
      }
    }

    // Return success - the actual write will happen client-side
    // This route validates the data structure
    return NextResponse.json({
      success: true,
      message: "Assessment data validated",
      anonymousId: anonymousId,
    });
  } catch (error) {
    console.error("Error validating assessment:", error);
    return NextResponse.json(
      {
        error: "Failed to validate assessment data",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}

