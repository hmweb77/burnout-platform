"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const questions = {
  physicalWellbeing: [
    { question: "I consistently get at least 7 hours of quality sleep per night.", subtitle: "Consider the past two weeks" },
    { question: "I maintain a regular exercise routine that supports my overall health.", subtitle: "Consider the past two weeks" },
    { question: "I have healthy posture and work ergonomics at my desk or workspace.", subtitle: "Consider the past two weeks" },
    { question: "My daily nutrition gives me sustained energy throughout the day.", subtitle: "Consider the past two weeks" },
    { question: "I take regular breaks to stretch or move during work hours.", subtitle: "Consider the past two weeks" },
    { question: "I rarely experience ongoing aches or physical discomfort related to work.", subtitle: "Consider the past two weeks" },
    { question: "I drink enough water to stay well-hydrated.", subtitle: "Consider the past two weeks" },
    { question: "I manage my screen time to prevent eye strain.", subtitle: "Consider the past two weeks" },
    { question: "I recover well after intense physical or mental effort.", subtitle: "Consider the past two weeks" },
    { question: "I schedule preventive health checkups when needed.", subtitle: "Consider the past two weeks" },
  ],
  emotionalWellbeing: [
    { question: "I feel emotionally resilient during high-pressure situations.", subtitle: "Consider the past two weeks" },
    { question: "I have healthy ways to process stress and emotions.", subtitle: "Consider the past two weeks" },
    { question: "I feel supported by peers, friends, or my community when work is challenging.", subtitle: "Consider the past two weeks" },
    { question: "I can express my emotions openly without judgment.", subtitle: "Consider the past two weeks" },
    { question: "I can shift from frustration or overwhelm into calm fairly quickly.", subtitle: "Consider the past two weeks" },
    { question: "I find purpose and fulfillment in my work.", subtitle: "Consider the past two weeks" },
    { question: "I maintain empathy even when under stress.", subtitle: "Consider the past two weeks" },
    { question: "I experience moments of joy or appreciation throughout the day.", subtitle: "Consider the past two weeks" },
    { question: "I rarely end the workday feeling emotionally drained.", subtitle: "Consider the past two weeks" },
    { question: "I practice gratitude or reflection to maintain perspective.", subtitle: "Consider the past two weeks" },
  ],
  mindsetWellbeing: [
    { question: "I approach challenges with a solution-oriented mindset.", subtitle: "Consider the past two weeks" },
    { question: "I believe I have influence over my success even in uncertainty.", subtitle: "Consider the past two weeks" },
    { question: "I set and maintain healthy boundaries with work demands.", subtitle: "Consider the past two weeks" },
    { question: "I prioritize meaningful tasks over multitasking.", subtitle: "Consider the past two weeks" },
    { question: "I adapt quickly when circumstances change.", subtitle: "Consider the past two weeks" },
    { question: "I take time to plan and reflect on goals.", subtitle: "Consider the past two weeks" },
    { question: "I view setbacks as opportunities to learn and grow.", subtitle: "Consider the past two weeks" },
    { question: "I avoid perfectionism when it slows me down or increases stress.", subtitle: "Consider the past two weeks" },
    { question: "I make decisions using both logic and intuition.", subtitle: "Consider the past two weeks" },
    { question: "I choose perspectives that reduce stress and improve clarity.", subtitle: "Consider the past two weeks" },
  ],
  lifestyleBalance: [
    { question: "I maintain a healthy work–life balance most weeks.", subtitle: "Consider the past two weeks" },
    { question: "I make time for hobbies or personal passions.", subtitle: "Consider the past two weeks" },
    { question: "I spend enough time outdoors to feel refreshed.", subtitle: "Consider the past two weeks" },
    { question: "I regularly enjoy quality time with loved ones.", subtitle: "Consider the past two weeks" },
    { question: "I take breaks or vacations without constantly checking work.", subtitle: "Consider the past two weeks" },
    { question: "I limit exposure to negative or draining media.", subtitle: "Consider the past two weeks" },
    { question: "I invest in personal growth beyond work.", subtitle: "Consider the past two weeks" },
    { question: "I maintain financial habits that reduce money stress.", subtitle: "Consider the past two weeks" },
    { question: "I have daily routines that help me start and end my day well.", subtitle: "Consider the past two weeks" },
    { question: "I get enough downtime each week to fully recharge.", subtitle: "Consider the past two weeks" },
  ],
};

const validationSchema = Yup.object().shape(
  Object.values(questions)
    .flat()
    .reduce((acc, _, index) => {
      acc[`q${index + 1}`] = Yup.string().required("Please select an answer");
      return acc;
    }, {})
);

const initialValues = Object.keys(questions)
  .flatMap((category) => questions[category])
  .reduce((values, _, index) => {
    values[`q${index + 1}`] = "";
    return values;
  }, {});

const options = [
  { value: "1", label: "Strongly Disagree" },
  { value: "2", label: "Disagree" },
  { value: "3", label: "Neutral / Sometimes True" },
  { value: "4", label: "Agree" },
  { value: "5", label: "Strongly Agree" },
];

export default function SurveyForm({ onSurveySubmit, onProgressChange }) {
  const router = useRouter();
  const allQuestions = Object.values(questions).flat();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    // Ensure progress is reset initially
    onProgressChange(0);
  }, [onProgressChange]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSurveySubmit}
    >
      {({ values, handleChange, errors, touched, setFieldTouched }) => {
        useEffect(() => {
          // Calculate progress after values change
          const calculateProgress = () => {
            const answeredQuestions = Object.values(values).filter(Boolean).length;
            return Math.round((answeredQuestions / allQuestions.length) * 100);
          };

          const progress = calculateProgress();
          onProgressChange(progress);
        }, [values, onProgressChange]);

        const currentQuestion = allQuestions[currentQuestionIndex];
        const questionNumber = currentQuestionIndex + 1;
        const totalQuestions = allQuestions.length;
        const fieldName = `q${questionNumber}`;
        const progress = Math.round((questionNumber / totalQuestions) * 100);
        const progressPercentage = Math.round((questionNumber / totalQuestions) * 100);

        const handleNext = () => {
          if (values[fieldName]) {
            if (currentQuestionIndex < allQuestions.length - 1) {
              setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
          } else {
            setFieldTouched(fieldName, true);
          }
        };

        const handlePrevious = () => {
          if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
          }
        };

        const handleOptionSelect = (value) => {
          handleChange({
            target: {
              name: fieldName,
              value: value,
            },
          });
        };

        const isLastQuestion = currentQuestionIndex === allQuestions.length - 1;
        const isFirstQuestion = currentQuestionIndex === 0;

        return (
          <Form>
            <div className="flex items-center justify-center min-h-screen px-4 py-8">
              <div className="w-full max-w-2xl">
              {/* Header with Question Number and Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-400">
                    Question {questionNumber} of {totalQuestions}
                  </p>
                  <p className="text-sm text-gray-400">{progressPercentage}%</p>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Main Question Card */}
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900/50 rounded-xl p-8 mb-6"
              >
                {/* Question Text */}
                <h2 className="text-2xl font-bold text-white mb-2">
                  {currentQuestion.question}
                </h2>
                <p className="text-sm text-gray-400 mb-8">
                  {currentQuestion.subtitle}
                </p>

                {/* Answer Options */}
                <div className="space-y-3">
                  {options.map((option) => {
                    const isSelected = values[fieldName] === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleOptionSelect(option.value)}
                        className={`w-full text-left px-4 py-4 rounded-lg border-2 transition-all duration-200 ${
                          isSelected
                            ? "bg-gray-800 border-blue-500 text-white"
                            : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800/70"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>

                {/* Error Message */}
                {touched[fieldName] && errors[fieldName] && (
                  <p className="text-red-500 text-sm mt-4">
                    {errors[fieldName]}
                  </p>
                )}
              </motion.div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mb-4">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={isFirstQuestion}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isFirstQuestion
                      ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Previous
                </button>
                {isLastQuestion ? (
                  <button
                    type="submit"
                    disabled={!values[fieldName]}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                      values[fieldName]
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Submit Survey
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!values[fieldName]}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                      values[fieldName]
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Next
                  </button>
                )}
              </div>

              {/* Footer Note */}
              <p className="text-xs text-gray-500 text-center">
                Takes about 6-8 minutes • Free & anonymous • No account required
              </p>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
