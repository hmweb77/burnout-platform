"use client";

import { motion } from "framer-motion";
import { Heart, Brain, Compass, Building2 } from "lucide-react";

const features = [
  {
    title: "Emotional Well-being",
    description: "Track and understand your emotional patterns ",
    icon: Heart,
  },
  {
    title: "Mindset Analysis",
    description: "Gain insights into your thought patterns and mental resilience",
    icon: Brain,
  },
  {
    title: "Lifestyle Assessment",
    description: "Evaluate your daily habits and work-life balance",
    icon: Compass,
  },
  {
    title: "Work Environment",
    description: "Analyze your workplace dynamics and professional relationships",
    icon: Building2,
  },
];

export default function Features() {
  return (
    <section className="p-4 sm:p-24">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
          <p className="mt-4 text-gray-400">Comprehensive analysis across four essential dimensions</p>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-lg border bg-background p-6 hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-bold">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}