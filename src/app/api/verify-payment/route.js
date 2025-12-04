import { NextResponse } from "next/server";

/**
 * API Route: Verify Stripe Payment
 * 
 * Verifies a Stripe checkout session and returns payment details.
 * 
 * Required environment variables:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
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

    // Check if Stripe is configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return NextResponse.json(
        { error: "Payment system is not configured. Please contact support." },
        { status: 500 }
      );
    }

    // Dynamically import Stripe (only if available)
    let Stripe;
    try {
      Stripe = (await import("stripe")).default;
    } catch (importError) {
      console.error("Stripe package not installed:", importError);
      return NextResponse.json(
        { error: "Payment system is not available. Please contact support." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if payment was successful
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Return payment details
    return NextResponse.json({
      success: true,
      email: session.customer_email || session.customer_details?.email || "",
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
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

