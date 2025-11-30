"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Mail, Download } from "lucide-react";

export default function EmailFormModal({ isOpen, onClose, resource }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // POST to /api/send-resource
      const response = await fetch("/api/send-resource", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          resourceId: resource.id,
        }),
      });
console.log('responsetest ;;;;', response);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = errorData.error || errorData.message || `Failed to send resource (${response.status})`;
        
        // Include details if available
        if (errorData.details) {
          errorMessage += `: ${errorData.details}`;
        }
        
        console.error("API Error Response:", errorData);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setSuccess(true);
      
      // Reset form and close modal after a short delay
      setTimeout(() => {
        setEmail("");
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      console.error("Error submitting email:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-gray-800 rounded-xl shadow-2xl max-w-md w-full border border-gray-700"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Mail className="h-5 w-5 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Get Your Resource</h2>
            </div>

            <p className="text-gray-400 mb-6">
              Enter your email address to access <strong className="text-white">{resource.title}</strong>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Hidden resourceId field */}
              <input
                type="hidden"
                name="resourceId"
                value={resource.id}
              />

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isSubmitting}
                />
                {error && (
                  <p className="mt-2 text-sm text-red-400">{error}</p>
                )}
                {success && (
                  <p className="mt-2 text-sm text-green-400">
                    Resource sent successfully! Check your email.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || success}
                className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : success ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Sent!
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Get Resource
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 text-xs text-gray-500 text-center">
              We respect your privacy. Your email will only be used to send you this resource.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

