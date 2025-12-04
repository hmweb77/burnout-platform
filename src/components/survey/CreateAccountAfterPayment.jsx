"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Mail, Lock, Loader2, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { clearAnonymousSession } from "@/utils/anonymousSession";

/**
 * CreateAccountAfterPayment Component
 * 
 * Displays after successful Stripe payment.
 * Allows user to create an account and links their anonymous assessment data.
 */
export default function CreateAccountAfterPayment({ assessmentId, email: prefillEmail, onSuccess }) {
  const [email, setEmail] = useState(prefillEmail || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!password) {
      setError("Password is required");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    if (!assessmentId) {
      setError("Assessment ID is missing. Please contact support.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create Firebase Auth user
      console.log("👤 Creating user account...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      console.log("✅ User created:", uid);

      // Step 2: Link assessment to user account (client-side Firestore update)
      console.log("🔗 Linking assessment to user account...");
      
      // Get the assessment document
      const assessmentRef = doc(db, "assessments", assessmentId);
      const assessmentDoc = await getDoc(assessmentRef);

      if (!assessmentDoc.exists()) {
        throw new Error("Assessment not found");
      }

      const assessmentData = assessmentDoc.data();

      // Update assessment with user ID
      await updateDoc(assessmentRef, {
        uid: uid,
        email: email,
        status: "completed",
        linkedAt: serverTimestamp(),
      });

      // Copy to user's surveys subcollection for easy access
      if (assessmentData.answers) {
        const userSurveyRef = doc(db, "users", uid, "surveys", assessmentId);
        await setDoc(userSurveyRef, {
          answers: assessmentData.answers,
          formikValues: assessmentData.formikValues || {},
          submittedAt: assessmentData.createdAt || serverTimestamp(),
          source: "paid_assessment",
        });
      }

      console.log("✅ Assessment linked to user account");

      // Step 3: Clear anonymous session
      clearAnonymousSession();

      // Step 4: Show success and redirect
      setSuccess(true);
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess({ uid, assessmentId });
        } else {
          // Default: redirect to results page with assessmentId
          window.location.href = `/results?assessmentId=${assessmentId}`;
        }
      }, 2000);

    } catch (error) {
      console.error("❌ Error creating account:", error);
      
      let errorMessage = "Failed to create account. ";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered. Please sign in instead.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak. Please use a stronger password.";
          break;
        default:
          errorMessage = error.message || "Please try again.";
      }

      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-8">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
        <p className="text-gray-400 text-sm">
          Create an account to access your assessment results anytime
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
              disabled={isSubmitting || !!prefillEmail}
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="At least 6 characters"
              disabled={isSubmitting}
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              placeholder="Re-enter your password"
              disabled={isSubmitting}
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
          </div>
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
            <span>Account created! Redirecting to your results...</span>
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
              Creating Account...
            </>
          ) : success ? (
            <>
              <CheckCircle className="h-5 w-5" />
              Account Created!
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>

        {/* Skip Option */}
        <button
          type="button"
          onClick={() => {
            clearAnonymousSession();
            if (assessmentId) {
              window.location.href = `/results?assessmentId=${assessmentId}`;
            } else {
              window.location.href = "/results";
            }
          }}
          className="w-full text-sm text-gray-400 hover:text-gray-300 transition-colors"
        >
          Skip for now (you can create an account later)
        </button>
      </form>
    </div>
  );
}

