"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, TrendingUp, Lightbulb, ArrowRight, Sparkles, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-4xl mx-auto px-4"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Our Platform
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Your journey to better wellbeing starts with understanding
          </p>
        </div>

        {/* Introduction Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl mb-8"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-violet-600/20 to-purple-600/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-800/95 to-gray-800/90"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl"></div>
          
          {/* Content */}
          <div className="relative z-10 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Understanding Burnout
              </h2>
            </div>
            
            <div className="space-y-6 text-gray-200 leading-relaxed">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-violet-400"></div>
                </div>
                <p className="text-lg">
                  Burnout isn't just feeling tired—it's a state of <span className="text-blue-300 font-semibold">emotional, physical, and mental exhaustion</span> that can happen when you've been under stress for a long time. It can make you feel overwhelmed, disconnected, and less effective in your daily life.
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-400 to-purple-400"></div>
                </div>
                <p className="text-lg">
                  The good news? <span className="text-violet-300 font-semibold">Burnout is something you can recognize, understand, and work through.</span> That's why we created this platform—to give you the tools and insights you need to take care of yourself and build resilience over time.
                </p>
              </div>
            </div>

            {/* Highlight Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 p-6 bg-gradient-to-r from-blue-500/20 to-violet-500/20 border border-blue-500/30 rounded-xl backdrop-blur-sm"
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
        </motion.div>

        {/* How We Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800 rounded-xl shadow-lg p-8 md:p-10 mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">
            How We Help You
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-start">
              <div className="bg-blue-500/20 p-3 rounded-lg mb-4">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Track Your Progress
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our assessment helps you see where you are today and track improvements over time. Every step forward matters.
              </p>
            </div>

            <div className="flex flex-col items-start">
              <div className="bg-violet-500/20 p-3 rounded-lg mb-4">
                <Lightbulb className="h-6 w-6 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Build Awareness
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Understanding your patterns is the first step to making positive changes. Our insights help you see what's working and what needs attention.
              </p>
            </div>

            <div className="flex flex-col items-start">
              <div className="bg-purple-500/20 p-3 rounded-lg mb-4">
                <Heart className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Support Your Wellness
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We focus on your overall wellbeing—physical, emotional, and mental health. Small, consistent improvements lead to lasting change.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gray-800 rounded-xl shadow-lg p-8 md:p-10 mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">
            What We Value
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Guidance, Not Judgment</h3>
                <p className="text-gray-400 text-sm">
                  We're here to support you, not to judge. Everyone's journey is different, and that's okay.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Awareness First</h3>
                <p className="text-gray-400 text-sm">
                  Knowing where you stand helps you make informed decisions about your wellbeing.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Mental Wellness Matters</h3>
                <p className="text-gray-400 text-sm">
                  Your mental health is just as important as your physical health. We treat it that way.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Progress Over Perfection</h3>
                <p className="text-gray-400 text-sm">
                  Improvement happens gradually. We celebrate every step forward, no matter how small.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl shadow-lg p-8 md:p-10 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Take our free burnout assessment to understand your current wellbeing and discover areas where you can grow. It only takes a few minutes, and you'll get personalized insights to help guide your journey.
          </p>
          <Link href="/survey">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto">
              Take the Survey
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            Remember: This platform is designed to support your wellbeing journey. If you're experiencing severe distress, please reach out to a qualified mental health professional.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

