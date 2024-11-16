"use client";

import { motion } from "framer-motion";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="py-24 px-24">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center space-y-4"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Start Your Journey?</h2>
          <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
            Take the first step towards better understanding and managing your well-being
          </p>
          <Link href="/survey">
  <button size="lg" className=" flex justify-center items-center bg-gradient-to-r p-2 from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/50 transition-all duration-300 w-full rounded-lg px-10 sm:w-auto">
    Get Started Now
    <ArrowRight className="ml-2 h-4 w-4" />
  </button>
</Link>
        </motion.div>
      </div>
    </section>
  );
}