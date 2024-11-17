"use client";

import { motion } from "framer-motion";

import Link from "next/link";
import { Brain } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=2000&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col space-y-6"
          >
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-white">
                Discover Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                  Burnout
                </span>{" "}
                Insights
              </h1>
              <p className="max-w-[600px] text-gray-200 md:text-xl">
                Take our free survey to identify areas of improvement in your{" "}
                <span className="text-blue-300">emotions</span>,{" "}
                <span className="text-indigo-300">mindset</span>,{" "}
                <span className="text-violet-300">lifestyle</span>, and{" "}
                <span className="text-purple-300">work environment</span>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/survey">
                <button
                 size="lg"
                  className=" flex items-center bg-gradient-to-r p-2 from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/50 transition-all duration-300 w-full rounded-lg sm:w-auto"
                >
                  Start the Survey
                  <Brain className="ml-2 h-5 w-5" />
                </button>
              </Link>
             
            </div>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-3 mt-8"
            >
              {["Free Assessment", "5 Minutes", "Expert Insights", "Personalized Report"].map((feature, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full text-sm bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                >
                  {feature}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl opacity-10" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500 rounded-full filter blur-3xl opacity-10" />
    </section>
  );
}