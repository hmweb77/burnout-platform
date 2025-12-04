"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import PaidAssessmentForm from "@/components/survey/PaidAssessmentForm";
import { Loader2 } from "lucide-react";

/**
 * Checkout Page
 * 
 * Displays the payment form for anonymous assessments.
 * Retrieves assessment data from Firestore using assessmentId from URL.
 */
export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessmentId");
  const answersParam = searchParams.get("answers");
  const anonymousId = searchParams.get("anonymousId");

  const [assessmentData, setAssessmentData] = useState(null);
  const [currentAssessmentId, setCurrentAssessmentId] = useState(assessmentId);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Get Stripe price ID from environment or use default
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || "";

  useEffect(() => {
    const loadAssessment = async () => {
      // Case 1: assessmentId exists - fetch from Firestore
      if (currentAssessmentId) {
        try {
          const assessmentRef = doc(db, "assessments", currentAssessmentId);
          const assessmentDoc = await getDoc(assessmentRef);

          if (!assessmentDoc.exists()) {
            // If not found and we have answers, try to create it
            if (answersParam) {
              await createAssessmentFromAnswers();
              return;
            }
            setError("Assessment not found. Please start the assessment again.");
            setIsLoading(false);
            return;
          }

          const data = assessmentDoc.data();
          
          // Check if assessment is already completed
          if (data.status === "completed") {
            setError("This assessment has already been completed.");
            setIsLoading(false);
            return;
          }

          setAssessmentData(data);
          setIsLoading(false);
        } catch (err) {
          console.error("Error fetching assessment:", err);
          // If fetch fails and we have answers, try to create it
          if (answersParam) {
            await createAssessmentFromAnswers();
          } else {
            setError("Failed to load assessment data. Please try again.");
            setIsLoading(false);
          }
        }
      } 
      // Case 2: No assessmentId but we have answers - create assessment
      else if (answersParam) {
        await createAssessmentFromAnswers();
      } 
      // Case 3: Neither assessmentId nor answers
      else {
        setError("Assessment data is missing. Please start the assessment again.");
        setIsLoading(false);
      }
    };

    const createAssessmentFromAnswers = async () => {
      try {
        let answers;
        try {
          answers = JSON.parse(decodeURIComponent(answersParam));
        } catch (e) {
          setError("Invalid assessment data. Please start the assessment again.");
          setIsLoading(false);
          return;
        }

        // Submit assessment via API
        const submitResponse = await fetch("/api/assessments/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers,
            email: null,
            anonymousId: anonymousId,
          }),
        });

        if (!submitResponse.ok) {
          // Try to get the actual error message from the response
          let errorMessage = "Failed to save assessment";
          try {
            const contentType = submitResponse.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const errorData = await submitResponse.json();
              errorMessage = errorData.error || errorData.details || errorMessage;
              console.error("API Error:", errorData);
            } else {
              const text = await submitResponse.text();
              console.error("API Error (non-JSON):", text);
              errorMessage = submitResponse.statusText || errorMessage;
            }
          } catch (parseError) {
            console.error("Error parsing error response:", parseError);
            errorMessage = submitResponse.statusText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        let submitData;
        try {
          submitData = await submitResponse.json();
        } catch (parseError) {
          console.error("Error parsing success response:", parseError);
          throw new Error("Invalid response from server");
        }

        const { assessmentId: newAssessmentId } = submitData;
        if (!newAssessmentId) {
          throw new Error("Assessment ID not received from server");
        }
        setCurrentAssessmentId(newAssessmentId);
        
        // Set assessment data for display
        setAssessmentData({
          answers,
          status: "pending_payment",
          paid: false,
        });
        setIsLoading(false);
      } catch (err) {
        console.error("Error creating assessment:", err);
        const errorMessage = err.message || "Failed to save assessment. Please try again.";
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    loadAssessment();
  }, [currentAssessmentId, answersParam, anonymousId]);

  const handleSuccess = (checkoutData) => {
    console.log("Checkout session created:", checkoutData);
    // Redirect happens automatically in PaidAssessmentForm
  };

  const handleError = (error) => {
    console.error("Checkout error:", error);
    setError(error.message || "An error occurred during checkout setup.");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push("/survey")}
            className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-2 rounded-lg"
          >
            Start Assessment Again
          </button>
        </div>
      </div>
    );
  }

  if (!assessmentData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="container max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Complete Your Payment</h1>
          <p className="text-gray-400">
            Enter your email to proceed to secure checkout
          </p>
        </div>

        <PaidAssessmentForm
          priceId={priceId}
          assessmentAnswers={assessmentData.answers}
          assessmentId={currentAssessmentId}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  );
}


