"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Lightbulb, Heart, Shield } from "lucide-react";

export default function AboutUs() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            About Us
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Your journey to better wellbeing starts with understanding
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Introduction */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-violet-600/20 to-purple-600/20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-800/95 to-gray-800/90"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                  Understanding Burnout
                </h3>
              </div>
              <p className="text-gray-200 leading-relaxed mb-4">
                Burnout isn't just feeling tired—it's a state of <span className="text-blue-300 font-semibold">emotional, physical, and mental exhaustion</span> that can happen when you've been under stress for a long time. It can make you feel overwhelmed, disconnected, and less effective in your daily life.
              </p>
              <p className="text-gray-200 leading-relaxed">
                The good news? <span className="text-violet-300 font-semibold">Burnout is something you can recognize, understand, and work through.</span> That's why we created this platform—to give you the tools and insights you need to take care of yourself and build resilience over time.
              </p>
            </div>
          </motion.div>

          {/* Right Column - How We Help */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800 rounded-xl shadow-lg p-8"
          >
            <h3 className="text-2xl font-semibold text-white mb-6">
              How We Help You
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Track Your Progress
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Our assessment helps you see where you are today and track improvements over time. Every step forward matters.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-violet-500/20 p-3 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Build Awareness
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Understanding your patterns is the first step to making positive changes. Our insights help you see what's working and what needs attention.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <Heart className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Support Your Wellness
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    We focus on your overall wellbeing—physical, emotional, and mental health. Small, consistent improvements lead to lasting change.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Highlight Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-blue-500/20 to-violet-500/20 border border-blue-500/30 rounded-xl backdrop-blur-sm p-6"
        >
          <div className="flex items-start gap-4">
            <Shield className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-2">You're Not Alone</h3>
              <p className="text-gray-300 text-sm">
                Many people experience burnout at some point in their lives. Recognizing it is the first step toward recovery, and we're here to support you every step of the way.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

