"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { auth, db } from "@/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { Download, Share2 } from "lucide-react";
import BurnoutRadarChart from "@/components/survey/radar-chart";
import SuggestCoach from '@/components/survey/suggestCoach'

/**
 * Calculate category results from answer array format
 * answers format: [1, 2, 3] where 1-5 are the response values
 */
const calculateCategoryResultsFromAnswers = (answers) => {
  if (!Array.isArray(answers) || answers.length === 0) {
    return { never: 0, rarely: 0, often: 0, always: 0, score: 0 };
  }

  let never = 0,
    rarely = 0,
    often = 0,
    always = 0;

  answers.forEach((value) => {
    const numValue = typeof value === "string" ? parseInt(value) : value;
    if (numValue === 1) never++;
    else if (numValue === 2) rarely++;
    else if (numValue === 3) often++;
    else if (numValue === 4) always++;
    else if (numValue === 5) always++; // Treat 5 as always
  });

  const total = answers.length;
  const score = total > 0
    ? ((never * 1 + rarely * 2 + often * 3 + always * 4) / (4 * total)) * 100
    : 0;

  return { never, rarely, often, always, score };
};

/**
 * Calculate category results from old format (q1, q2, etc.)
 * Legacy support for old survey format
 */
const calculateCategoryResults = (responses, startIndex, endIndex) => {
  let never = 0,
    rarely = 0,
    often = 0,
    always = 0;

  for (let i = startIndex; i <= endIndex; i++) {
    const response = responses[`q${i}`];
    if (response === "1") never++;
    else if (response === "2") rarely++;
    else if (response === "3") often++;
    else if (response === "4") always++;
    else if (response === "5") always++;
  }

  const total = endIndex - startIndex + 1;
  const score = total > 0
    ? ((never * 1 + rarely * 2 + often * 3 + always * 4) / (4 * total)) * 100
    : 0;

  return { never, rarely, often, always, score };
};

function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [surveys, setSurveys] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const userId = auth.currentUser?.uid;
        const assessmentId = searchParams?.get("assessmentId");

        // If assessmentId is provided (from payment success), fetch from assessments collection
        if (assessmentId) {
          console.log("Fetching assessment results:", assessmentId);
          const assessmentRef = doc(db, "assessments", assessmentId);
          const assessmentDoc = await getDoc(assessmentRef);

          if (assessmentDoc.exists()) {
            const assessmentData = assessmentDoc.data();
            
            // Check if assessment has answers in new format
            if (assessmentData.answers) {
              const emotionsResults = calculateCategoryResultsFromAnswers(
                assessmentData.answers.emotionalWellbeing || []
              );
              const mindsetResults = calculateCategoryResultsFromAnswers(
                assessmentData.answers.mindsetWellbeing || []
              );
              const lifestyleResults = calculateCategoryResultsFromAnswers(
                assessmentData.answers.lifestyleBalance || []
              );
              const physicalResults = calculateCategoryResultsFromAnswers(
                assessmentData.answers.physicalWellbeing || []
              );

              const overall = {
                never: emotionsResults.never + mindsetResults.never + lifestyleResults.never + physicalResults.never,
                rarely: emotionsResults.rarely + mindsetResults.rarely + lifestyleResults.rarely + physicalResults.rarely,
                often: emotionsResults.often + mindsetResults.often + lifestyleResults.often + physicalResults.often,
                always: emotionsResults.always + mindsetResults.always + lifestyleResults.always + physicalResults.always,
                score: (emotionsResults.score + mindsetResults.score + lifestyleResults.score + physicalResults.score) / 4,
              };

              setResults({
                emotions: emotionsResults,
                mindset: mindsetResults,
                lifestyle: lifestyleResults,
                workEnvironment: physicalResults, // Map physical to workEnvironment for display
                overall,
              });
              setLoading(false);
              return;
            }
          } else {
            setError("Assessment not found");
            setLoading(false);
            return;
          }
        }

        // If user is authenticated, fetch from user's surveys
        if (userId) {
          const surveysRef = collection(db, "users", userId, "surveys");
          const querySnapshot = await getDocs(surveysRef);

          const fetchedSurveys = [];
          querySnapshot.forEach((doc) => {
            fetchedSurveys.push({ id: doc.id, ...doc.data() });
          });

          if (fetchedSurveys.length > 0) {
            setSurveys(fetchedSurveys);
            const latestSurvey = fetchedSurveys[fetchedSurveys.length - 1];

            // Check if survey has new format (answers object)
            if (latestSurvey.answers) {
              const emotionsResults = calculateCategoryResultsFromAnswers(
                latestSurvey.answers.emotionalWellbeing || []
              );
              const mindsetResults = calculateCategoryResultsFromAnswers(
                latestSurvey.answers.mindsetWellbeing || []
              );
              const lifestyleResults = calculateCategoryResultsFromAnswers(
                latestSurvey.answers.lifestyleBalance || []
              );
              const physicalResults = calculateCategoryResultsFromAnswers(
                latestSurvey.answers.physicalWellbeing || []
              );

              const overall = {
                never: emotionsResults.never + mindsetResults.never + lifestyleResults.never + physicalResults.never,
                rarely: emotionsResults.rarely + mindsetResults.rarely + lifestyleResults.rarely + physicalResults.rarely,
                often: emotionsResults.often + mindsetResults.often + lifestyleResults.often + physicalResults.often,
                always: emotionsResults.always + mindsetResults.always + lifestyleResults.always + physicalResults.always,
                score: (emotionsResults.score + mindsetResults.score + lifestyleResults.score + physicalResults.score) / 4,
              };

              setResults({
                emotions: emotionsResults,
                mindset: mindsetResults,
                lifestyle: lifestyleResults,
                workEnvironment: physicalResults,
                overall,
              });
            } else {
              // Legacy format: use old calculation method
              const emotionsResults = calculateCategoryResults(latestSurvey, 1, 5);
              const mindsetResults = calculateCategoryResults(latestSurvey, 6, 10);
              const lifestyleResults = calculateCategoryResults(latestSurvey, 11, 15);
              const workEnvironmentResults = calculateCategoryResults(latestSurvey, 16, 20);

              const overall = {
                never: emotionsResults.never + mindsetResults.never + lifestyleResults.never + workEnvironmentResults.never,
                rarely: emotionsResults.rarely + mindsetResults.rarely + lifestyleResults.rarely + workEnvironmentResults.rarely,
                often: emotionsResults.often + mindsetResults.often + lifestyleResults.often + workEnvironmentResults.often,
                always: emotionsResults.always + mindsetResults.always + lifestyleResults.always + workEnvironmentResults.always,
                score: (emotionsResults.score + mindsetResults.score + lifestyleResults.score + workEnvironmentResults.score) / 4,
              };

              setResults({
                emotions: emotionsResults,
                mindset: mindsetResults,
                lifestyle: lifestyleResults,
                workEnvironment: workEnvironmentResults,
                overall,
              });
            }
          }
        } else if (!assessmentId) {
          // No user and no assessmentId - show error
          setError("Please log in or provide an assessment ID to view results");
        }
      } catch (error) {
        console.error("Error fetching survey results:", error.message);
        setError(error.message || "Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Loading results...</div>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4 text-white">No Results Found</h1>
          <p className="text-gray-400 mb-8">
            {error || "You haven't completed any surveys yet. Please take a survey to view your results."}
          </p>
          <Link href="/survey">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Take a Survey
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const categories = [
    {
      name: "Emotions",
      results: results.emotions,
      color: "from-red-500 to-orange-500",
      tips: [
        "Practice gratitude journaling: Write down three things you're thankful for each day.",
        "Practice deep breathing: Inhale for 4 seconds, hold for 7 seconds, and exhale for 8 seconds.",
        "Engage in creative outlets like drawing, writing, or playing music to release stress.",
      ],
    },
    {
      name: "Mindset",
      results: results.mindset,
      color: "from-blue-500 to-cyan-500",
      tips: [
        "Reframe negative thoughts: Replace 'I can't do this' with 'I can try and learn from this.'",
        "Set small, achievable goals: Break larger goals into smaller steps to boost confidence.",
        "Focus on growth: Embrace challenges as learning opportunities to build resilience.",
        "Celebrate small wins: Recognize even the smallest achievements to stay motivated.",
      ],
    },
    {
      name: "Lifestyle",
      results: results.lifestyle,
      color: "from-green-500 to-emerald-500",
      tips: [
        "Create a consistent bedtime routine: Go to bed and wake up at the same time daily.",
        "Incorporate daily movement: Start with 10-minute morning activities like walking or stretching.",
        "Add more vegetables and fruits to your meals: Fill half your plate with them.",
        "Schedule check-ins with friends or family: Small efforts strengthen relationships.",
      ],
    },
    {
      name: "Work Environment",
      results: results.workEnvironment,
      color: "from-purple-500 to-pink-500",
      tips: [
        "Encourage open communication: Foster a culture of feedback and idea-sharing.",
        "Declutter your workspace: Keep it organized to reduce stress and boost focus.",
        "Celebrate successes: Acknowledge team achievements to build morale.",
        "Promote work-life balance: Take breaks and use vacation time to recharge.",
        "Organize team bonding: Host casual activities or online discussions for remote teams.",
      ],
    },
  ];

  const radarData = categories.map((category) => ({
    category: category.name,
    score: category.results.score,
  }));

  return (
    <div className="min-h-screen  bg-gray-900 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className=" bg-gray-800 rounded-lg shadow-lg p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Assessment Results</h1>
            <p className=" text-gray-400">
              Based on your responses, here's a detailed analysis of your
              well-being.
            </p>
          </div>

          <div className="mb-8">
            <BurnoutRadarChart data={radarData} />
          </div>
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {categories.map((category) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className=" bg-gray-900 p-6 rounded-lg"
              >
                <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
                <div className="relative w-full h-3 bg-gray-300 rounded-lg overflow-hidden mb-4">
                  <div
                    className={`h-full bg-gradient-to-r ${category.color}`}
                    style={{ width: `${category.results.score}%` }}
                  />
                </div>
                {category.results.score < 80 ? (
                  <ul className="text-sm  text-gray-400">
                    {category.tips.map((tip, index) => (
                      <li key={index} className="mb-2">
                        - {tip}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm  text-gray-400">
                    You are doing great in this area! Keep up the good work by
                    maintaining your progress. Remember, continuous effort helps
                    reinforce your success.
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg  hover:bg-gray-700">
              <Share2 className="w-4 h-4" />
              Share Results
            </button>
            <Link href="/">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Return Home
              </button>
            </Link>
          </div>
        </motion.div>
      
      </div>
      <SuggestCoach/>
    </div>
  );
}

export default ResultsPage;
