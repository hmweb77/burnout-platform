"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, FileText, Sparkles, ArrowRight } from "lucide-react";
import MiniSurveyModal from "./MiniSurveyModal";

const benefits = [
  {
    text: "Get personalized insights into your wellbeing",
    icon: Sparkles,
  },
  {
    text: "Identify areas for improvement across 4 key dimensions",
    icon: FileText,
  },
  {
    text: "Takes only 5 minutes to complete",
    icon: Clock,
  },
  {
    text: "100% free with no commitment required",
    icon: CheckCircle,
  },
];

export default function Features() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
        
        <div className="container relative z-10 px-4 md:px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Understand Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                Burnout Level?
              </span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Take our comprehensive burnout assessment and discover personalized insights about your emotional wellbeing, mindset, lifestyle, and work environment. Get started on your journey to better health today.
            </p>

            {/* Benefits List */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 p-2 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-lg border border-blue-500/30">
                    <benefit.icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <p className="text-gray-300">{benefit.text}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={handleOpenModal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group w-full md:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/50 transition-all duration-300"
            >
              Start Free Assessment
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Right Column - Visual/Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-blue-500/20 via-violet-500/20 to-purple-500/20 rounded-2xl p-8 border border-blue-500/30 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full mb-4">
                    <FileText className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Quick & Easy</h3>
                  <p className="text-gray-300">Just 5 minutes to get started</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                    <div className="text-3xl font-bold text-blue-400 mb-1">4</div>
                    <div className="text-sm text-gray-400">Key Dimensions</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                    <div className="text-3xl font-bold text-violet-400 mb-1">100%</div>
                    <div className="text-sm text-gray-400">Free</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 text-center">
                    Join thousands who have already taken the assessment
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        </div>
      </section>

      {/* Survey Modal */}
      <MiniSurveyModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}