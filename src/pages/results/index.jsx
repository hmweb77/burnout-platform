"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Download, Share2 } from "lucide-react";

import BurnoutRadarChart from "@/components/survey/radar-chart";

export default function ResultsPage() {
  const [results, setResults] = useState(null);

  useEffect(() => {
    const responses = JSON.parse(localStorage.getItem("surveyResponses") || "{}");

    const calculateCategoryResults = (startIndex, endIndex) => {
      let never = 0, rarely = 0, often = 0, always = 0;

      for (let i = startIndex; i <= endIndex; i++) {
        const response = responses[`q${i}`];
        if (response === "1") never++;
        else if (response === "2") rarely++;
        else if (response === "3") often++;
        else if (response === "4") always++;
      }

      const score = ((never * 1 + rarely * 2 + often * 3 + always * 4) / (4 * 5)) * 100;
      return { never, rarely, often, always, score };
    };

    const emotionsResults = calculateCategoryResults(1, 5);
    const mindsetResults = calculateCategoryResults(6, 10);
    const lifestyleResults = calculateCategoryResults(11, 15);
    const workEnvironmentResults = calculateCategoryResults(16, 20);

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
  }, []);

  if (!results) {
    return <div>Loading...</div>;
  }

  const categories = [
    { name: "Emotions", results: results.emotions, color: "from-red-500 to-orange-500" },
    { name: "Mindset", results: results.mindset, color: "from-blue-500 to-cyan-500" },
    { name: "Lifestyle", results: results.lifestyle, color: "from-green-500 to-emerald-500" },
    { name: "Work Environment", results: results.workEnvironment, color: "from-purple-500 to-pink-500" },
  ];

  const radarData = categories.map((category) => ({
    category: category.name,
    score: category.results.score,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Burnout Assessment Results</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Based on your responses, here's a detailed analysis of your well-being.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Overall Score</h2>
            <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
              <div className="relative w-full h-4 bg-gray-300 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  style={{ width: `${results.overall.score}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Low Risk</span>
                <span>Moderate Risk</span>
                <span>High Risk</span>
              </div>
            </div>
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
                className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg"
              >
                <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
                <div className="relative w-full h-3 bg-gray-300 rounded-lg overflow-hidden mb-4">
                  <div
                    className={`h-full bg-gradient-to-r ${category.color}`}
                    style={{ width: `${category.results.score}%` }}
                  />
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{category.results.never}</div>
                    <div className="text-sm text-gray-500">Never</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{category.results.rarely}</div>
                    <div className="text-sm text-gray-500">Rarely</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{category.results.often}</div>
                    <div className="text-sm text-gray-500">Often</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{category.results.always}</div>
                    <div className="text-sm text-gray-500">Always</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Download className="w-4 h-4" />
              Download Report
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
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
    </div>
  );
}
