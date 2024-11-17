"use client";
import { db, auth } from "@/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import withAuth from "@/components/withAuth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import SurveyForm from "@/components/survey/SurveyForm";

function SurveyPage() {
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const handleSurveySubmit = async (values) => {
    try {
      const userId = auth.currentUser?.uid; // Get current user's ID
      if (!userId) throw new Error("You must be logged in to submit the survey.");

      const surveyId = Date.now().toString(); // Unique survey ID
      
      const surveyRef = doc(db, "users", userId, "surveys", surveyId);

      // Save survey results in Firestore
      await setDoc(surveyRef, {
        ...values,
        submittedAt: new Date(),
      });
 
      alert("Survey submitted successfully!");
      router.push("/results"); 
    } catch (error) {
      console.error("Error submitting survey:", error.message);
    }
  };
  const handleProgressChange = (newProgress) => {
    setProgress(newProgress);
  };

  return (
    <div className="min-h-screen  bg-gray-900 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-3xl mx-auto px-4"
      >
        <div className=" bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Assessment Survey</h1>
            <p className=" text-gray-400">
              Take a moment to honestly answer these 20 questions about your well-being.
            </p>
          </div>

          {/* Progress Bar */}
          <div
  className="mb-8 sticky top-0  bg-gray-900 z-50 p-4"
  aria-live="polite"
>
  <div
    className="relative w-full  bg-gray-700 rounded-full h-2 overflow-hidden"
  >
    <div
      className={`h-2 rounded-full transition-all duration-300 ${
        progress === 100 ? "bg-green-500" : "bg-blue-500"
      }`}
      style={{ width: `${progress}%` }}
    ></div>
  </div>
  <p className="text-sm  text-gray-400 mt-2 text-center">
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
          <SurveyForm onSurveySubmit={handleSurveySubmit} onProgressChange={handleProgressChange} />
        </div>
      </motion.div>
    </div>
  );
}

export default withAuth(SurveyPage);