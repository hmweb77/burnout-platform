"use client";

import { motion } from "framer-motion";

import SurveyForm from "@/components/survey/SurveyForm";
import { useState } from "react";

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
            <h1 className="text-3xl font-bold mb-2">Burnout Assessment Survey</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Take a moment to honestly answer these questions about your well-being.
            </p>
          </div>
          
          <div className="mb-8">
            <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
              {progress}% Complete
            </p>
          </div>

          <SurveyForm onProgressChange={setProgress} />
        </div>
      </motion.div>
    </div>
  );
}
