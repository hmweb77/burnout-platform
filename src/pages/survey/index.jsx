"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/firebase";
import { collection, addDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import SurveyForm from "@/components/survey/SurveyForm";
import { getAnonymousSessionId } from "@/utils/anonymousSession";

/**
 * Survey Page - Accessible without login
 * 
 * Supports both authenticated and anonymous users:
 * - Authenticated: saves to users/{uid}/surveys/{surveyId}
 * - Anonymous: saves to assessments collection with anonymousId
 */
function SurveyPage() {
  const router = useRouter();
  const [anonymousId, setAnonymousId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get or create anonymous session ID (only if not logged in)
    if (!auth.currentUser) {
      const anonId = getAnonymousSessionId();
      setAnonymousId(anonId);
      console.log("Anonymous session ID:", anonId);
    }
    setIsLoading(false);
  }, []);

  const handleSurveySubmit = async (values) => {
    try {
      const userId = auth.currentUser?.uid;
      const isAuthenticated = !!userId;

      // Convert Formik values to assessment answers format
      const allQuestions = Object.values({
        physicalWellbeing: [
          // { question: "I manage my screen time to prevent eye strain.", subtitle: "Consider the past two weeks" },
          // { question: "I recover well after intense physical or mental effort.", subtitle: "Consider the past two weeks" },
          { question: "I schedule preventive health checkups when needed.", subtitle: "Consider the past two weeks" },
        ],
        emotionalWellbeing: [
          // { question: "I experience moments of joy or appreciation throughout the day.", subtitle: "Consider the past two weeks" },
          // { question: "I rarely end the workday feeling emotionally drained.", subtitle: "Consider the past two weeks" },
          { question: "I practice gratitude or reflection to maintain perspective.", subtitle: "Consider the past two weeks" },
        ],
        mindsetWellbeing: [
          // { question: "I avoid perfectionism when it slows me down or increases stress.", subtitle: "Consider the past two weeks" },
          // { question: "I make decisions using both logic and intuition.", subtitle: "Consider the past two weeks" },
          { question: "I choose perspectives that reduce stress and improve clarity.", subtitle: "Consider the past two weeks" },
        ],
        lifestyleBalance: [
          { question: "I maintain financial habits that reduce money stress.", subtitle: "Consider the past two weeks" },
          // { question: "I have daily routines that help me start and end my day well.", subtitle: "Consider the past two weeks" },
          // { question: "I get enough downtime each week to fully recharge.", subtitle: "Consider the past two weeks" },
        ],
      }).flat();

      // Convert Formik format (q1, q2, etc.) to category format
      const answers = {
        physicalWellbeing: [],
        emotionalWellbeing: [],
        mindsetWellbeing: [],
        lifestyleBalance: [],
      };

      // Process all form values and map them to categories
      // The form uses q1, q2, q3, q4... format
      // Map each question to its category in order
      const categoryOrder = ["physicalWellbeing", "emotionalWellbeing", "mindsetWellbeing", "lifestyleBalance"];
      let questionIndex = 1;
      
      for (const category of categoryOrder) {
        // Get the value for this question
        const value = values[`q${questionIndex}`];
        if (value) {
          answers[category].push(parseInt(value));
        }
        questionIndex++;
      }

      if (isAuthenticated) {
        // Authenticated user: save to user's surveys subcollection
        const surveyId = Date.now().toString();
        const surveyRef = doc(db, "users", userId, "surveys", surveyId);
        
        await setDoc(surveyRef, {
          ...values,
          answers: answers,
          submittedAt: serverTimestamp(),
        });

        alert("Survey submitted successfully!");
        router.push("/results");
      } else {
        // NEW FLOW: Use API route for anonymous users
        try {
          // Step 1: Submit assessment via API
          const submitResponse = await fetch("/api/assessments/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              answers,
              email: null, // Will be collected at checkout
              anonymousId: anonymousId,
            }),
          });

          if (!submitResponse.ok) {
            // Try to parse JSON error, fallback to status text
            let errorMessage = "Failed to submit assessment";
            try {
              const contentType = submitResponse.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                const errorData = await submitResponse.json();
                errorMessage = errorData.error || errorData.details || errorMessage;
              } else {
                errorMessage = submitResponse.statusText || errorMessage;
              }
            } catch (e) {
              errorMessage = submitResponse.statusText || errorMessage;
            }
            console.error("Submit assessment error:", errorMessage);
            // Fallback: redirect to checkout page (it will handle submission)
            router.push(`/checkout?answers=${encodeURIComponent(JSON.stringify(answers))}&anonymousId=${anonymousId}`);
            return;
          }

          let submitData;
          try {
            submitData = await submitResponse.json();
          } catch (e) {
            console.error("Failed to parse submit response:", e);
            // Fallback: redirect to checkout page
            router.push(`/checkout?answers=${encodeURIComponent(JSON.stringify(answers))}&anonymousId=${anonymousId}`);
            return;
          }

          const { assessmentId } = submitData;
          if (!assessmentId) {
            console.error("Assessment ID not received");
            // Fallback: redirect to checkout page
            router.push(`/checkout?answers=${encodeURIComponent(JSON.stringify(answers))}&anonymousId=${anonymousId}`);
            return;
          }
          console.log("✅ Assessment submitted:", assessmentId);

          // Step 2: Create checkout session
          const checkoutResponse = await fetch("/api/checkout/create-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              assessmentId,
            }),
          });

          if (!checkoutResponse.ok) {
            // Try to parse JSON error, fallback to status text
            let errorMessage = "Failed to create checkout session";
            try {
              const contentType = checkoutResponse.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                const errorData = await checkoutResponse.json();
                errorMessage = errorData.error || errorData.details || errorMessage;
              } else {
                errorMessage = checkoutResponse.statusText || errorMessage;
              }
            } catch (e) {
              errorMessage = checkoutResponse.statusText || errorMessage;
            }
            console.error("Create checkout error:", errorMessage);
            // Fallback: redirect to checkout page with assessmentId
            router.push(`/checkout?assessmentId=${assessmentId}`);
            return;
          }

          let checkoutData;
          try {
            checkoutData = await checkoutResponse.json();
          } catch (e) {
            console.error("Failed to parse checkout response:", e);
            // Fallback: redirect to checkout page
            router.push(`/checkout?assessmentId=${assessmentId}`);
            return;
          }

          const { url } = checkoutData;
          if (!url) {
            console.error("Checkout URL not received");
            // Fallback: redirect to checkout page
            router.push(`/checkout?assessmentId=${assessmentId}`);
            return;
          }
          console.log("✅ Checkout session created, redirecting...");

          // Step 3: Redirect to Stripe Checkout
          window.location.href = url;
        } catch (apiError) {
          console.error("API error:", apiError);
          // Final fallback: redirect to checkout page with answers
          router.push(`/checkout?answers=${encodeURIComponent(JSON.stringify(answers))}&anonymousId=${anonymousId}`);
        }
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert(`Error: ${error.message || "Failed to submit survey. Please try again."}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-3xl mx-auto px-4"
      >
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2 text-white">Assessment Survey</h1>
            <p className="text-gray-400">
              Take a moment to honestly answer these questions about your well-being.
            </p>
            {!auth.currentUser && (
              <p className="text-sm text-gray-500 mt-2">
                No account required • Complete the assessment and proceed to payment
              </p>
            )}
          </div>

          {/* Survey Form */}
          <SurveyForm onSurveySubmit={handleSurveySubmit} onProgressChange={() => {}} />
        </div>
      </motion.div>
    </div>
  );
}

export default SurveyPage;