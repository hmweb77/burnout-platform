"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { Mail, Loader2, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

/**
 * PaidAssessmentForm Component
 * 
 * Handles the complete flow for paid assessment submission WITHOUT requiring login:
 * 1. Collects user email and assessment answers
 * 2. Creates Firestore assessment document with "pending_payment" status
 * 3. Creates Stripe checkout session via API
 * 4. Redirects to Stripe checkout page
 * 
 * No Firebase Auth user creation required - users can take assessment without account.
 */
export default function PaidAssessmentForm({ priceId, assessmentAnswers, assessmentId, onSuccess, onError }) {
  // Form state
  const [email, setEmail] = useState("");
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Default placeholder assessment answers if not provided
  // In production, this should come from the actual assessment form
  const defaultAnswers = assessmentAnswers || {
    physicalWellbeing: [4, 3, 5],
    emotionalWellbeing: [2, 4, 3],
    mindsetWellbeing: [5, 5, 4],
    lifestyleBalance: [1, 2, 3],
  };

  /**
   * Validates form inputs before submission
   */
  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required to receive your assessment results");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  /**
   * Main submission handler
   * Orchestrates the entire flow: Firestore → Auth → Stripe
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Validate priceId
    if (!priceId) {
      setError("Price ID is required. Please contact support.");
      return;
    }

    setIsSubmitting(true);

    let assessmentDocRef = null;
    let finalAssessmentId = assessmentId;

    try {
      // If assessmentId is provided, update existing assessment
      // Otherwise, create new one
      if (assessmentId) {
        console.log("📝 Updating existing assessment:", assessmentId);
        assessmentDocRef = doc(db, "assessments", assessmentId);
        await updateDoc(assessmentDocRef, {
          email: email,
          status: "pending_payment",
        });
        finalAssessmentId = assessmentId;
        console.log("✅ Assessment updated with email");
      } else {
        // Step 1: Create Firestore assessment document (fallback if no assessmentId)
        console.log("📝 Creating new assessment document in Firestore...");
        
        const assessmentData = {
          status: "pending_payment",
          answers: defaultAnswers,
          createdAt: serverTimestamp(),
          email: email, // Store email for receiving results
          // No uid required - user doesn't need to be logged in
        };

        assessmentDocRef = await addDoc(collection(db, "assessments"), assessmentData);
        finalAssessmentId = assessmentDocRef.id;
        
        console.log("✅ Assessment document created:", finalAssessmentId);
      }

      // Step 2: Create Stripe checkout session
      console.log("💳 Creating Stripe checkout session...");
      
      const checkoutResponse = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assessmentId: finalAssessmentId,
          email: email, // Pass email instead of uid
          priceId: priceId,
        }),
      });

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Failed to create checkout session");
      }

      const checkoutData = await checkoutResponse.json();
      
      if (!checkoutData.url) {
        throw new Error("No checkout URL received from server");
      }

      console.log("✅ Checkout session created, redirecting...");

      // Step 4: Redirect to Stripe checkout
      setSuccess(true);
      
      // Small delay to show success state before redirect
      setTimeout(() => {
        window.location.href = checkoutData.url;
      }, 1000);

      if (onSuccess) onSuccess(checkoutData);

    } catch (error) {
      console.error("❌ Error in assessment submission:", error);
      
      // Rollback: Delete assessment document if checkout creation fails
      if (assessmentDocRef) {
        try {
          await deleteDoc(assessmentDocRef);
          console.log("🔄 Rollback: Assessment document deleted");
        } catch (deleteError) {
          console.error("⚠️ Failed to delete assessment document during rollback:", deleteError);
        }
      }

      setError(error.message || "An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
      if (onError) onError(error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Complete Your Payment</h2>
        <p className="text-gray-400 text-sm">
          Enter your email to receive your detailed assessment results
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="your.email@example.com"
              disabled={isSubmitting}
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            We'll send your assessment results to this email address
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm"
          >
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <span>Redirecting to secure checkout...</span>
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || success}
          className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : success ? (
            <>
              <CheckCircle className="h-5 w-5" />
              Redirecting...
            </>
          ) : (
            <>
              Continue to Payment
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>

        {/* Security Note */}
        <p className="text-xs text-gray-500 text-center">
          No account required. Your information is secure and we use industry-standard encryption to protect your data.
        </p>
      </form>
    </div>
  );
}

