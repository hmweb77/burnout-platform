"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft } from "lucide-react";
import EmailCaptureModal from "./EmailCaptureModal";

const questions = {
  physicalWellbeing: [
    { question: "I manage my screen time to prevent eye strain.", subtitle: "Consider the past two weeks" },
    { question: "I recover well after intense physical or mental effort.", subtitle: "Consider the past two weeks" },
    { question: "I feel physically energized throughout most of my days.", subtitle: "Consider the past two weeks" },
  ],
  emotionalWellbeing: [
    { question: "I experience moments of joy or appreciation throughout the day.", subtitle: "Consider the past two weeks" },
    { question: "I rarely end the day feeling emotionally drained or overwhelmed.", subtitle: "Consider the past two weeks" },
    { question: "I am able to notice early signs of emotional burnout before it escalates.", subtitle: "Consider the past two weeks" },
  ],
  mindsetWellbeing: [
    { question: "I avoid perfectionism when it slows me down or increases stress.", subtitle: "Consider the past two weeks" },
    { question: "I choose perspectives that reduce stress and improve clarity.", subtitle: "Consider the past two weeks" },
    { question: "I bounce back effectively after making mistakes or facing setbacks.", subtitle: "Consider the past two weeks" },
  ],
  lifestyleBalance: [
    { question: "I get enough downtime each week to fully recharge.", subtitle: "Consider the past two weeks" },
    { question: "I can disconnect from work without guilt or pressure.", subtitle: "Consider the past two weeks" },
    { question: "I engage in activities that bring calm, joy, or creativity.", subtitle: "Consider the past two weeks" },
  ],
};

// Scale options (1-5)
const scaleOptions = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

export default function MiniSurveyModal({ isOpen, onClose }) {
  // Flatten all questions into a single array with category info
  const allQuestions = Object.entries(questions).flatMap(([category, categoryQuestions]) =>
    categoryQuestions.map((q, index) => ({
      ...q,
      category,
      questionIndex: index,
    }))
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({
    physicalWellbeing: [],
    emotionalWellbeing: [],
    mindsetWellbeing: [],
    lifestyleBalance: [],
  });
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setAnswers({
        physicalWellbeing: [],
        emotionalWellbeing: [],
        mindsetWellbeing: [],
        lifestyleBalance: [],
      });
      setShowEmailModal(false);
      setAssessmentScore(null);
    }
  }, [isOpen]);

  const currentQuestion = allQuestions[currentQuestionIndex];
  const totalQuestions = allQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Get current answer for this question
  const currentAnswer = answers[currentQuestion.category]?.[currentQuestion.questionIndex] || null;

  const handleAnswerChange = (value) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      if (!newAnswers[currentQuestion.category]) {
        newAnswers[currentQuestion.category] = [];
      }
      newAnswers[currentQuestion.category][currentQuestion.questionIndex] = value;
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentAnswer && currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Helper function to get category, color, interpretation, and recommendation based on dimension score
  const getScoreCategory = (score, dimension) => {
    if (score >= 3 && score <= 6) {
      // Low wellbeing - specific recommendations by dimension
      const lowRecommendations = {
        physicalWellbeing: "Focus on sleep quality, maintain good posture, stay hydrated, and take regular movement breaks throughout your day.",
        emotionalWellbeing: "Practice journaling to process emotions, use emotional grounding techniques, and build support networks with friends, family, or professionals.",
        mindsetWellbeing: "Set clear boundaries with work and personal time, reduce perfectionism patterns, and practice self-compassion.",
        lifestyleBalance: "Prioritize rest and recreation, schedule digital detox periods, engage in hobbies, and ensure you take regular time off.",
      };
      
      return {
        category: "Low wellbeing (high burnout risk)",
        levelColor: "red",
        interpretation: "This area needs immediate attention to prevent burnout and improve your overall wellbeing.",
        recommendation: lowRecommendations[dimension] || "Focus on building healthy habits in this area.",
      };
    } else if (score >= 7 && score <= 11) {
      // Moderate wellbeing - improvement strategies
      const moderateRecommendations = {
        physicalWellbeing: "Continue building healthy physical habits. Consider adding more movement, improving sleep routines, and maintaining consistent hydration.",
        emotionalWellbeing: "You're on the right track. Strengthen emotional awareness through mindfulness, deepen your support connections, and practice stress management techniques.",
        mindsetWellbeing: "Keep refining your mindset. Work on maintaining boundaries, challenge perfectionist tendencies, and develop more flexible thinking patterns.",
        lifestyleBalance: "Build on your current balance. Schedule more downtime, create boundaries around work, and make time for activities that bring you joy and relaxation.",
      };
      
      return {
        category: "Moderate wellbeing (improvable)",
        levelColor: "yellow",
        interpretation: "This area has room for growth. With focused effort, you can strengthen your resilience and wellbeing.",
        recommendation: moderateRecommendations[dimension] || "Continue working on improvement strategies in this area.",
      };
    } else if (score >= 12 && score <= 15) {
      // High wellbeing - reinforcement
      const highRecommendations = {
        physicalWellbeing: "Excellent! You're maintaining strong physical wellbeing. Continue prioritizing sleep, movement, and self-care to sustain this level.",
        emotionalWellbeing: "Wonderful! Your emotional resilience is strong. Keep nurturing your emotional health through continued self-awareness and connection.",
        mindsetWellbeing: "Great work! Your mindset is serving you well. Maintain your healthy boundaries and continue practicing flexible, growth-oriented thinking.",
        lifestyleBalance: "Fantastic! You have good work-life balance. Keep protecting your downtime and maintaining activities that recharge you.",
      };
      
      return {
        category: "Strong wellbeing & resilience",
        levelColor: "green",
        interpretation: "This is a strength area for you. Celebrate this achievement and continue maintaining these positive habits.",
        recommendation: highRecommendations[dimension] || "Continue maintaining your strong habits in this area.",
      };
    }
    // Fallback for edge cases
    return {
      category: "Unable to determine",
      levelColor: "gray",
      interpretation: "Unable to assess this dimension.",
      recommendation: "Please complete all questions to get accurate recommendations.",
    };
  };

  // Calculate assessment score from answers
  // Each dimension has 3 questions, answers range 1-5
  // Dimension scores: sum of 3 answers (range 3-15)
  // Total score: sum of all dimension scores (max 60)
  const calculateScore = (answers) => {
    // Calculate dimension scores (sum of answers in each category)
    const physicalScore = (answers.physicalWellbeing || []).reduce(
      (sum, answer) => sum + (answer || 0),
      0
    );
    
    const emotionalScore = (answers.emotionalWellbeing || []).reduce(
      (sum, answer) => sum + (answer || 0),
      0
    );
    
    const mindsetScore = (answers.mindsetWellbeing || []).reduce(
      (sum, answer) => sum + (answer || 0),
      0
    );
    
    const lifestyleScore = (answers.lifestyleBalance || []).reduce(
      (sum, answer) => sum + (answer || 0),
      0
    );

    // Calculate total score (sum of all dimension scores)
    const totalScore = physicalScore + emotionalScore + mindsetScore + lifestyleScore;

    // Get categories, interpretations, and recommendations for each dimension
    const physicalCategory = getScoreCategory(physicalScore, "physicalWellbeing");
    const emotionalCategory = getScoreCategory(emotionalScore, "emotionalWellbeing");
    const mindsetCategory = getScoreCategory(mindsetScore, "mindsetWellbeing");
    const lifestyleCategory = getScoreCategory(lifestyleScore, "lifestyleBalance");

    // Create dimension results
    const dimensions = {
      physical: {
        score: physicalScore,
        category: physicalCategory.category,
        levelColor: physicalCategory.levelColor,
        interpretation: physicalCategory.interpretation,
        recommendation: physicalCategory.recommendation,
      },
      emotional: {
        score: emotionalScore,
        category: emotionalCategory.category,
        levelColor: emotionalCategory.levelColor,
        interpretation: emotionalCategory.interpretation,
        recommendation: emotionalCategory.recommendation,
      },
      mindset: {
        score: mindsetScore,
        category: mindsetCategory.category,
        levelColor: mindsetCategory.levelColor,
        interpretation: mindsetCategory.interpretation,
        recommendation: mindsetCategory.recommendation,
      },
      lifestyle: {
        score: lifestyleScore,
        category: lifestyleCategory.category,
        levelColor: lifestyleCategory.levelColor,
        interpretation: lifestyleCategory.interpretation,
        recommendation: lifestyleCategory.recommendation,
      },
    };

    // Find strongest and weakest dimensions
    const dimensionScores = [
      { name: "physical", score: physicalScore },
      { name: "emotional", score: emotionalScore },
      { name: "mindset", score: mindsetScore },
      { name: "lifestyle", score: lifestyleScore },
    ];

    const strongestDimension = dimensionScores.reduce((max, dim) => 
      dim.score > max.score ? dim : max
    );
    const weakestDimension = dimensionScores.reduce((min, dim) => 
      dim.score < min.score ? dim : min
    );

    // Generate overall insight
    const averageScore = totalScore / 4;
    let overallInsight = "";
    if (averageScore <= 6) {
      overallInsight = "Your assessment indicates areas that need attention. Focus on the weakest dimensions first, and consider seeking support from professionals or your support network. Small, consistent changes can make a significant difference.";
    } else if (averageScore >= 7 && averageScore <= 11) {
      overallInsight = "You're in a moderate range with room for growth. Continue building on your strengths while addressing areas that need improvement. Consistent effort in your weakest areas will help you build greater resilience.";
    } else {
      overallInsight = "Congratulations! You're demonstrating strong overall wellbeing and resilience. Continue maintaining your healthy habits, especially in your strongest areas, while staying mindful of all dimensions to sustain this level of wellbeing.";
    }

    return {
      physical: dimensions.physical,
      emotional: dimensions.emotional,
      mindset: dimensions.mindset,
      lifestyle: dimensions.lifestyle,
      totalSummary: {
        totalScore,
        strongestDimension: strongestDimension.name,
        weakestDimension: weakestDimension.name,
        overallInsight,
      },
      // Additional calculated values for display
      maxPossibleScore: 60,
      percentage: ((totalScore / 60) * 100).toFixed(1),
    };
  };

  const handleSubmit = () => {
    // Calculate score from answers
    const score = calculateScore(answers);
    setAssessmentScore(score);
    
    // Store answers for logging
    console.log("Survey Answers:", answers);
    console.log("Assessment Score:", score);
    
    // Show email capture modal instead of closing
    setShowEmailModal(true);
  };

  // Handle email submission
  const handleEmailSubmit = async (email, score) => {
    try {
      // Call API to send results by email
      const response = await fetch("/api/send-assessment-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          answers,
          score,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Failed to send email");
      }

      const data = await response.json();
      console.log("Email sent successfully:", data);
    } catch (error) {
      console.error("Error sending email:", error);
      // For now, we'll still show success even if API fails
      // You can modify this behavior as needed
      throw error;
    }
  };

  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-gray-700 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">Burnout Assessment</h2>
              <p className="text-sm text-gray-400">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pt-4">
            <div className="w-full bg-gray-800 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full transition-all duration-300"
              />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {currentQuestion.category
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())
                    .trim()}
                </span>
              </div>

              {/* Question */}
              <h3 className="text-2xl font-semibold text-white mb-2">
                {currentQuestion.question}
              </h3>
              <p className="text-sm text-gray-400 mb-8">{currentQuestion.subtitle}</p>

              {/* Answer Options */}
              <div className="space-y-3">
                {scaleOptions.map((option) => {
                  const isSelected = currentAnswer === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleAnswerChange(option.value)}
                      className={`w-full text-left px-4 py-4 rounded-lg border-2 transition-all duration-200 ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-500/20 to-violet-500/20 border-blue-500 text-white shadow-lg shadow-blue-500/10"
                          : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800/70"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-sm text-gray-400">({option.value})</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Footer with Navigation */}
          <div className="p-6 border-t border-gray-700 bg-gray-800/50">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={isFirstQuestion}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isFirstQuestion
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>

              {isLastQuestion ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!currentAnswer}
                  className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    currentAnswer
                      ? "bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white shadow-lg shadow-blue-500/25"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Submit
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    currentAnswer
                      ? "bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white shadow-lg shadow-blue-500/25"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      </AnimatePresence>

      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => {
          setShowEmailModal(false);
          onClose(); // Close the main survey modal after email modal closes
        }}
        onEmailSubmit={handleEmailSubmit}
        score={assessmentScore}
      />
    </>
  );
}

