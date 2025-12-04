"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/firebase";
import { Loader2, CheckCircle } from "lucide-react";

/**
 * Payment Success Page
 * 
 * Displayed after successful Stripe payment.
 * Auto-signs in user with custom token and redirects to results.
 */
export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const assessmentId = searchParams.get("assessment_id");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      if (!sessionId) {
        setError("Payment session ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setStatus("Verifying payment...");
        
        // Step 1: Verify payment and get custom token
        const verifyResponse = await fetch(`/api/payment/verify?session_id=${sessionId}`);
        
        if (!verifyResponse.ok) {
          const errorData = await verifyResponse.json();
          throw new Error(errorData.error || "Payment verification failed");
        }

        const { customToken, userId, email, assessmentId: verifiedAssessmentId } = await verifyResponse.json();
        
        if (!customToken) {
          throw new Error("Custom token not received");
        }

        setStatus("Signing you in...");

        // Step 2: Sign in with custom token
        const userCredential = await signInWithCustomToken(auth, customToken);
        console.log("✅ User signed in:", userCredential.user.uid);

        setStatus("Redirecting to results...");

        // Step 3: Redirect to results
        const finalAssessmentId = assessmentId || verifiedAssessmentId;
        setTimeout(() => {
          router.push(`/results?assessmentId=${finalAssessmentId}`);
        }, 1000);
      } catch (err) {
        console.error("Payment success error:", err);
        setError(err.message || "Failed to complete payment. Please contact support.");
        setIsLoading(false);
      }
    };

    handlePaymentSuccess();
  }, [sessionId, assessmentId, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-2 rounded-lg"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
        </div>
        
        <div className="space-y-4">
          <Loader2 className="h-6 w-6 animate-spin text-violet-500 mx-auto" />
          <p className="text-gray-400">{status}</p>
        </div>
      </div>
    </div>
  );
}


