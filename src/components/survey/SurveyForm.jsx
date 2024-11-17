"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const questions = {
  emotions: [
    "How often do you feel overwhelmed by your workload",
   "Do you find it hard to stay motivated during work hours",
   "How frequently do you experience anxiety or stress due to work",
   "How often do you feel drained at the end of the day",
   "Do you feel positive about the outcomes of your work",
  ],
  mindset: [
    "How often do you find yourself doubting your abilities",
      "Do you set realistic goals for yourself",
   "Are you open to constructive criticism at work",
   "How often do you procrastinate on difficult tasks",
   "Do you see failures as opportunities to learn",
  ],
  lifestyle: [
    "Do you maintain a healthy and balanced diet",
    "How often do you exercise or engage in physical activity",
   "Do you take regular breaks during work hours",
   "Do you feel in control of your work-life balance",
   "How often do you spend time on hobbies or interests outside of work",
  ],
  workEnvironment: [
    "Do you feel your workload is manageable",
    "How often do you collaborate effectively with colleagues",
    "Do you feel the workplace culture aligns with your values",
    "Do you have opportunities to develop your skills at work",
    "How often do you receive feedback on your performance",
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
  { value: "1", label: "Never" },
  { value: "2", label: "Rarely" },
  { value: "3", label: "Often" },
  { value: "4", label: "Always" },
];

export default function SurveyForm({ onSurveySubmit,onProgressChange }) {
  const router = useRouter();
  const allQuestions = Object.values(questions).flat();

//   const initialValues = allQuestions.reduce((acc, _, index) => {
//     acc[`q${index + 1}`] = "";
//     return acc;
//   }, {});

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
      {({ values, handleChange, errors, touched }) => {
        useEffect(() => {
          // Calculate progress after values change
          const calculateProgress = () => {
            const answeredQuestions = Object.values(values).filter(Boolean).length;
            return Math.round((answeredQuestions / allQuestions.length) * 100);
          };

          const progress = calculateProgress();
          onProgressChange(progress);
        }, [values, onProgressChange]);

        return (
          <Form className="space-y-8">
            {Object.entries(questions).map(
              ([category, categoryQuestions], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                  className="space-y-6"
                >
                  {/* <h2 className="text-xl font-semibold capitalize mb-4">
                    {category.replace(/([A-Z])/g, " $1").trim()}
                  </h2> */}
                  {categoryQuestions.map((question, index) => {
                    const questionNumber = categoryIndex * 5 + index + 1;
                    const fieldName = `q${questionNumber}`;

                    return (
                      <div
                        key={fieldName}
                        className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg"
                      >
                        <p className="mb-4 font-medium">{question}</p>
                        <div className="grid grid-cols-4 gap-2">
                          {options.map((option) => (
                            <div
                              key={option.value}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="radio"
                                id={`${fieldName}-${option.value}`}
                                name={fieldName}
                                value={option.value}
                                checked={values[fieldName] === option.value}
                                onChange={handleChange}
                                className="cursor-pointer"
                              />
                              <label
                                htmlFor={`${fieldName}-${option.value}`}
                                className="text-sm"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                        {touched[fieldName] && errors[fieldName] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[fieldName]}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              )
            )}

            <div className="flex justify-end pt-6">
              <button
               type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
              >
                Submit Survey
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
