"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const coaches = [
  {
    name: "Dr. Laura Bennett",
    specialization: "Mindfulness & Stress Management Coach",
    content:
      "Dr. Bennett specializes in mindfulness practices and meditation techniques. She provides tailored strategies to help clients build resilience and find balance in their lives.",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop",
  },
  {
    name: "James Carter",
    specialization: "Work-Life Balance Strategist",
    content:
      "With a background in organizational psychology, James helps clients create sustainable work-life balance by focusing on effective time management and boundary-setting.",
    image:
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=100&h=100&fit=crop",
  },
  {
    name: "Sophia Kim",
    specialization: "Wellness & Lifestyle Coach",
    content:
      "Sophia focuses on holistic wellness, emphasizing nutrition, sleep, and fitness to help her clients regain energy and reduce stress.",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
  },
  {
    name: "Ryan Patel",
    specialization: "Career & Performance Coach",
    content:
      "Ryan helps professionals optimize their work habits and manage career challenges to prevent burnout while achieving their goals.",
    image:
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=100&h=100&fit=crop",
  },
  {
    name: "Emily Nguyen",
    specialization: "Emotional Wellbeing Specialist",
    content:
      "Emily offers emotional support and practical techniques for managing anxiety and improving emotional health during challenging times.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop",
  },
  {
    name: "Daniel Torres",
    specialization: "Fitness & Stress Reduction Expert",
    content:
      "Daniel combines physical activity with stress management techniques to help clients build healthier habits and reduce tension effectively.",
    image:
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=100&h=100&fit=crop",
  },
];

export default function Testimonials() {
  return (
    <section className="p-4 sm:p-24 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Our Coaches
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Our professional coaches that will help you to overcome your burnout
          </p>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-3">
          {coaches.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-4">
                <Image
                  src={testimonial.image}
                  width={100}
                  height={100}
                  alt={testimonial.name}
                  className="inline-block size-8 rounded-full"
                />
                <div className="ml-4">
                  <h3 className="font-bold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {testimonial.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-8 items-center">
      <button
        size="lg"
        className=" flex justify-center items-center bg-gradient-to-r p-2 from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/50 transition-all duration-300 w-full rounded-lg px-10 sm:w-auto"
      >
        More
      </button>
      </div>
     
    </section>
  );
}
