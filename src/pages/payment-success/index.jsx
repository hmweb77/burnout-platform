"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword, signInWithCustomToken } from "firebase/auth";
import { auth } from "@/firebase";
import { Loader2, CheckCircle, Lock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Payment Success Page
 * 
 * Displayed after successful Stripe payment.
 * Shows password form to create account or sign in.
 * Links assessment to user account and redirects to profile.
 */
export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const assessmentId = searchParams.get("assessment_id");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Silently fetch email in the background if sessionId is available
    const fetchEmailSilently = async () => {
      if (sessionId) {
        try {
          const verifyResponse = await fetch(`/api/payment/verify?session_id=${sessionId}`);
          if (verifyResponse.ok) {
            const { email: customerEmail } = await verifyResponse.json();
            if (customerEmail) {
              setEmail(customerEmail);
            }
          }
        } catch (err) {
          // Silently handle errors - don't show to user
          console.error("Payment verification error:", err);
        }
      }
    };

    fetchEmailSilently();
  }, [sessionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsSubmitting(false);
      return;
    }

    try {
      setStatus("Creating your account...");

      // Validate required fields silently
      if (!sessionId || !assessmentId) {
        setError("Please complete your payment to continue.");
        setIsSubmitting(false);
        return;
      }

      // Call API to create account and link assessment
      const response = await fetch("/api/payment/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          password,
          assessmentId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create account");
      }

      const { customToken, userId, isNewUser } = await response.json();

      setStatus("Signing you in...");

      if (isNewUser) {
        // New user: sign in with custom token (password already set in account creation)
        await signInWithCustomToken(auth, customToken);
      } else {
        // Existing user: verify password by signing in with email/password
        // This verifies the password is correct
        try {
          await signInWithEmailAndPassword(auth, email, password);
          // Password verified - user is now signed in and assessment is linked
        } catch (signInError) {
          // If password is wrong, throw error
          if (signInError.code === "auth/wrong-password" || 
              signInError.code === "auth/invalid-credential" ||
              signInError.code === "auth/user-not-found") {
            throw new Error("Incorrect password. Please try again.");
          }
          // For other errors, try custom token as fallback
          console.warn("Sign in error, using custom token fallback:", signInError);
          await signInWithCustomToken(auth, customToken);
        }
      }

      console.log("✅ User signed in:", userId);

      setStatus("Redirecting to your profile...");

      // Redirect to profile
      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    } catch (err) {
      console.error("Account creation error:", err);
      setError(err.message || "Failed to create account. Please try again.");
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-2xl border border-gray-700 p-8">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
          <p className="text-gray-400 text-sm">
            Create an account to access your assessment results
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field (read-only, only show if email is available) */}
          {email && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                This email was used for your payment
              </p>
            </div>
          )}

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Create Password
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
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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

          {/* Status Message */}
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 text-sm"
            >
              <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
              <span>{status}</span>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !password}
            className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account & View Results
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            If you already have an account, enter your existing password to sign in
          </p>
        </form>
      </div>
    </div>
  );
}
