"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, BarChart3, Award, Target, ArrowRight, Star, Shield } from "lucide-react";

const premiumFeatures = [
  {
    text: "Comprehensive 40-question deep dive analysis",
    icon: BarChart3,
  },
  {
    text: "Detailed personalized report with actionable insights",
    icon: Award,
  },
  {
    text: "Professional recommendations tailored to your results",
    icon: Target,
  },
  {
    text: "Priority support and follow-up resources",
    icon: Shield,
  },
];

export default function PaidAssessment() {
  return (
    <section className="py-20 bg-gradient-to-br from-violet-900/20 via-purple-900/20 to-blue-900/20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="container relative z-10 px-4 md:px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Visual/Premium Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-violet-500/30 via-purple-500/30 to-blue-500/30 rounded-2xl p-8 border border-violet-500/40 backdrop-blur-sm relative overflow-hidden">
              {/* Premium Badge */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                  <Star className="h-3 w-3 fill-current" />
                  PREMIUM
                </div>
              </div>

              <div className="space-y-6 mt-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full mb-4 shadow-lg">
                    <BarChart3 className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">Full Assessment</h3>
                  <p className="text-gray-300">Comprehensive 40-question analysis</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/60 rounded-lg p-4 text-center border border-gray-700">
                    <div className="text-4xl font-bold text-violet-400 mb-1">40</div>
                    <div className="text-sm text-gray-400">Questions</div>
                  </div>
                  <div className="bg-gray-800/60 rounded-lg p-4 text-center border border-gray-700">
                    <div className="text-4xl font-bold text-purple-400 mb-1">100%</div>
                    <div className="text-sm text-gray-400">Detailed</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-center gap-2 text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 text-center">
                    Trusted by professionals worldwide
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-full text-sm font-medium text-violet-300">
                <Star className="h-4 w-4" />
                Premium Assessment
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Get the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">
                Complete Picture
              </span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Take our comprehensive 40-question paid assessment for an in-depth analysis of your burnout levels. Receive a detailed personalized report with professional recommendations and actionable insights to transform your wellbeing.
            </p>

            {/* Premium Features List */}
            <div className="space-y-4 mb-8">
              {premiumFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 p-2 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-lg border border-violet-500/30">
                    <feature.icon className="h-5 w-5 text-violet-400" />
                  </div>
                  <p className="text-gray-300">{feature.text}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <Link href="/survey">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group w-full md:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg shadow-violet-500/25 hover:shadow-violet-500/50 transition-all duration-300"
              >
                Get Full Assessment
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            {/* Trust Indicator */}
            <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Secure payment • Money-back guarantee</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

