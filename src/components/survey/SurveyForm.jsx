"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const questions = {
  emotions: [
    "I feel emotionally drained at the end of the workday",
    "I find it difficult to emotionally connect with colleagues or clients",
    "I feel frustrated with my work more often than not",
    "I experience mood swings during work hours",
    "I feel anxious about work-related tasks",
  ],
  mindset: [
    "I feel a sense of accomplishment from my work",
    "I doubt the significance of my work",
    "I can maintain focus on tasks effectively",
    "I feel optimistic about my professional future",
    "I find myself becoming cynical about my job",
  ],
  lifestyle: [
    "I maintain a healthy work-life balance",
    "I get adequate sleep most nights",
    "I engage in regular physical exercise",
    "I have time for hobbies and personal interests",
    "I maintain healthy eating habits during work hours",
  ],
  workEnvironment: [
    "I feel supported by my colleagues",
    "My workload feels manageable",
    "I have clear expectations about my role",
    "I have the resources needed to do my job effectively",
    "I feel valued in my workplace",
  ],
};

const validationSchema = Yup.object().shape(
  Object.values(questions).flat().reduce((acc, _, index) => {
    acc[`q${index + 1}`] = Yup.string().required("Please select an answer");
    return acc;
  }, {})
);

const options = [
    { value: "1", label: "Never" },
    { value: "2", label: "Sometimes" },
    { value: "3", label: "Always" },
  ];

export default function SurveyForm({ onProgressChange }) {
  const router = useRouter();
  const allQuestions = [
    ...questions.emotions,
    ...questions.mindset,
    ...questions.lifestyle,
    ...questions.workEnvironment,
  ];

  const initialValues = allQuestions.reduce((acc, _, index) => {
    acc[`q${index + 1}`] = "";
    return acc;
  }, {});

  const calculateProgress = (values) => {
    const answeredQuestions = Object.values(values).filter(Boolean).length;
    return Math.round((answeredQuestions / allQuestions.length) * 100);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("result",values)
        localStorage.setItem('surveyResponses', JSON.stringify(values));
        router.push("/results");
      }}
    >
      {({ values, handleChange, errors, touched }) => {
        const progress = calculateProgress(values);
        onProgressChange(progress);

        return (
          <Form className="space-y-8">
            {Object.entries(questions).map(([category, categoryQuestions], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold capitalize mb-4">
                  {category.replace(/([A-Z])/g, " $1").trim()}
                </h2>
                {categoryQuestions.map((question, index) => {
                  const questionNumber = categoryIndex * 5 + index + 1;
                  const fieldName = `q${questionNumber}`;

                  return (
                    <div key={fieldName} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                      <p className="mb-4 font-medium">{question}</p>
                      <div className="grid grid-cols-5 gap-2">
                        {options.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={`${fieldName}-${option.value}`}
                              name={fieldName}
                              value={option.value}
                              checked={values[fieldName] === option.value}
                              onChange={handleChange}
                              className="cursor-pointer"
                            />
                            <label htmlFor={`${fieldName}-${option.value}`} className="text-sm">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      {touched[fieldName] && errors[fieldName] && (
                        <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            ))}

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
