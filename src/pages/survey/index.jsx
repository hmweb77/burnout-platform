"use client";
import { db, auth } from "@/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import withAuth from "@/components/withAuth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import SurveyForm from "@/components/survey/SurveyForm";

function SurveyPage() {
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
              Take a moment to honestly answer these questions about your well-being.
            </p>
          </div>

          {/* Survey Form */}
          <SurveyForm onSurveySubmit={handleSurveySubmit} onProgressChange={() => {}} />
        </div>
      </motion.div>
    </div>
  );
}

export default withAuth(SurveyPage);