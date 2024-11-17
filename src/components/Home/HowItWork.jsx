"use client";

import { motion } from "framer-motion";
import { ClipboardList, LineChart, BookOpen } from "lucide-react";

const steps = [
  {
    title: "Take a quick 20-question survey",
    description: "Answer simple questions about your daily experiences and feelings",
    icon: ClipboardList,
  },
  {
    title: "View your personalized results",
    description: "Get detailed insights into your current burnout status",
    icon: LineChart,
  },
  {
    title: "Access expert resources",
    description: "Explore curated content to improve your well-being",
    icon: BookOpen,
  },
];

export default function HowItWorks() {
  return (
    <section className="p-4 sm:p-24 bg-gray-900">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
          <p className="mt-4 text-gray-400">Three simple steps to better understanding your well-being</p>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 p-4 bg-gray-800 rounded-full shadow-lg">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}