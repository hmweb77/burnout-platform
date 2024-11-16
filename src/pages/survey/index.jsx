"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import SurveyForm from "@/components/survey/SurveyForm";

export default function SurveyPage() {
  const [progress, setProgress] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-3xl mx-auto px-4"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Assessment Survey</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Take a moment to honestly answer these questions about your well-being.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div
              className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden"
              aria-live="polite"
            >
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  progress === 100 ? "bg-green-500" : "bg-blue-500"
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
              {progress}% Complete
            </p>
          </div>

          {/* Tooltip for progress */}
          {progress === 100 && (
            <p className="text-center text-green-500 font-medium">
              You have completed the survey!
            </p>
          )}

          {/* Survey Form */}
          <SurveyForm onProgressChange={setProgress} />
        </div>
      </motion.div>
    </div>
  );
}
