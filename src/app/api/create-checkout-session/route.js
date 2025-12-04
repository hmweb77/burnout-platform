import { NextResponse } from "next/server";

/**
 * API Route: Create Stripe Checkout Session
 * 
 * Creates a Stripe checkout session for anonymous assessment payment.
 * 
 * Required environment variables:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
 * - NEXT_PUBLIC_STRIPE_PRICE_ID: The Stripe price ID for the assessment
 * - NEXT_PUBLIC_BASE_URL: Your application base URL (e.g., http://localhost:3000)
 */

export async function POST(request) {
  try {
    const body = await request.json();
    const { assessmentId, email, priceId } = body;

    // Validation
    if (!assessmentId) {
      return NextResponse.json(
        { error: "Assessment ID is required" },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
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

    // Get base URL for success/cancel URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    "http://localhost:3000";

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&assessment_id=${assessmentId}`,
      cancel_url: `${baseUrl}/checkout?assessmentId=${assessmentId}`,
      metadata: {
        assessmentId: assessmentId,
        email: email,
      },
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}

