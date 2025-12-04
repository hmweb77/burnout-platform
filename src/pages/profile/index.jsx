"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { auth, db } from "@/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import BurnoutRadarChart from "@/components/survey/radar-chart";

/**
 * Calculate category results from answer array format
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
    else if (numValue === 5) always++;
  });

  const total = answers.length;
  const score = total > 0
    ? ((never * 1 + rarely * 2 + often * 3 + always * 4) / (4 * total)) * 100
    : 0;

  return { never, rarely, often, always, score };
};

export default function ProfilePage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState([]);
  const [latestAssessment, setLatestAssessment] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          router.push("/login");
          return;
        }

        // Fetch user's assessments
        const assessmentsRef = collection(db, "users", userId, "assessments");
        
        // Try to query with orderBy, fallback to simple query if field doesn't exist
        let querySnapshot;
        try {
          const q = query(assessmentsRef, orderBy("paidAt", "desc"), limit(10));
          querySnapshot = await getDocs(q);
        } catch (orderByError) {
          // If orderBy fails (field doesn't exist or no index), try without it
          console.warn("orderBy failed, fetching without sort:", orderByError);
          querySnapshot = await getDocs(assessmentsRef);
        }

        const fetchedAssessments = [];
        querySnapshot.forEach((doc) => {
          fetchedAssessments.push({ id: doc.id, ...doc.data() });
        });

        // Sort by paidAt if available (client-side fallback)
        fetchedAssessments.sort((a, b) => {
          const aTime = a.paidAt?.seconds || a.paidAt?._seconds || 0;
          const bTime = b.paidAt?.seconds || b.paidAt?._seconds || 0;
          return bTime - aTime; // Descending order
        });

        setAssessments(fetchedAssessments);

        if (fetchedAssessments.length > 0) {
          const latest = fetchedAssessments[0];
          setLatestAssessment(latest);

          // Calculate results from latest assessment
          if (latest.answers) {
            const emotionsResults = calculateCategoryResultsFromAnswers(
              latest.answers.emotionalWellbeing || []
            );
            const mindsetResults = calculateCategoryResultsFromAnswers(
              latest.answers.mindsetWellbeing || []
            );
            const lifestyleResults = calculateCategoryResultsFromAnswers(
              latest.answers.lifestyleBalance || []
            );
            const physicalResults = calculateCategoryResultsFromAnswers(
              latest.answers.physicalWellbeing || []
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
          }
        }
      } catch (err) {
        console.error("Error fetching assessments:", err);
        setError("Failed to load assessment results");
      } finally {
        setLoading(false);
      }
    };

    // Wait for auth to be ready
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchAssessments();
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-2 rounded-lg"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!results || !latestAssessment) {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4 text-white">No Assessments Found</h1>
          <p className="text-gray-400 mb-8">
            You haven't completed any assessments yet.
          </p>
          <Link href="/survey">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Take an Assessment
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
      ],
    },
    {
      name: "Physical Wellbeing",
      results: results.workEnvironment,
      color: "from-purple-500 to-pink-500",
      tips: [
        "Manage screen time: Take regular breaks to prevent eye strain.",
        "Schedule preventive health checkups: Regular checkups help catch issues early.",
        "Recover well after intense effort: Allow time for rest and recovery.",
      ],
    },
  ];

  const radarData = categories.map((category) => ({
    category: category.name,
    score: category.results.score,
  }));

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-lg shadow-lg p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">Your Assessment Results</h1>
            <p className="text-gray-400">
              Based on your latest assessment, here's a detailed analysis of your well-being.
            </p>
            {latestAssessment.paidAt && (
              <p className="text-sm text-gray-500 mt-2">
                Completed: {new Date(latestAssessment.paidAt.seconds * 1000).toLocaleDateString()}
              </p>
            )}
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
                className="bg-gray-900 p-6 rounded-lg"
              >
                <h3 className="text-xl font-semibold mb-4 text-white">{category.name}</h3>
                <div className="relative w-full h-3 bg-gray-300 rounded-lg overflow-hidden mb-4">
                  <div
                    className={`h-full bg-gradient-to-r ${category.color}`}
                    style={{ width: `${category.results.score}%` }}
                  />
                </div>
                {category.results.score < 80 ? (
                  <ul className="text-sm text-gray-400">
                    {category.tips.map((tip, index) => (
                      <li key={index} className="mb-2">
                        - {tip}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">
                    You are doing great in this area! Keep up the good work by maintaining your progress.
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/survey">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Take Another Assessment
              </button>
            </Link>
            <Link href="/">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-300 hover:bg-gray-700">
                Return Home
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

