"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const coaches = [
  {
    name: "Alina Cristina",
    specialization: "Leadership & Mindset Coach",
    content:
      "Alina empowers individuals and organizations to achieve sustainable growth by unlocking their potential and overcoming limiting beliefs. She specializes in mindset coaching and leadership development.",
    image: "/Screenshot 2024-11-17 at 10.51.42.png",
    urlC: "https://calendly.com/hmweb77/coach-demo",
  },
  {
    name: "Jonathan OGrady",
    specialization: "Performance & Emotional Intelligence Coach",
    content:
      "Jonathan helps high-performing professionals align success with fulfillment through emotional agility and resilience. He specializes in helping clients master their emotions and thrive personally and professionally.",
    image: "/Screenshot 2024-11-17 at 10.55.38.png",
    urlC: "https://calendly.com/hmweb77/coach-demo",
  },
  {
    name: "Adriana Fernandes",
    specialization: "Innovator & Technology Enthusiast",
    content:
      "Adriana explores the intersection of AI, quantum computing, neuroscience, and spatial analysis. She bridges cutting-edge discoveries with practical applications for meaningful progress and innovation.",
    image: "/Screenshot 2024-11-17 at 10.55.55.png",
    urlC: "https://calendly.com/hmweb77/coach-demo",
  },
  {
    name: "Martina Anguelova",
    specialization: "Astrology & Wellness Guide",
    content:
      "Martina helps individuals unlock their potential through astrology and holistic health practices. She focuses on aligning clients with transformative practices for well-being and balance.",
    image: "/Screenshot 2024-11-17 at 10.55.45.png",
    urlC: "https://calendly.com/hmweb77/coach-demo",
  },
  {
    name: "Dani Heredia",
    specialization: "Technology & Leadership Coach",
    content:
      "Dani combines over 10 years of experience in technology and leadership to bridge technical and business teams. He fosters resilience and continuous improvement in diverse teams worldwide.",
    image: "/Screenshot 2024-11-17 at 10.55.29.png",
    urlC: "https://calendly.com/hmweb77/coach-demo",
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
                </div>
              </div>
              <p className="text-gray-600 text-justify dark:text-gray-300">
                {testimonial.content}
              </p>
              <div className="flex justify-center mt-4">
                <button className=" bg-gradient-to-r p-2 from-violet-500 to-blue-500 hover:from-blue-600 hover:to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/50 transition-all rounded-lg px-4 sm:w-auto">
                 <Link href="/coaches">
                 Details
                 </Link> 
                </button>
                </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-8 items-center">
        <Link href="/coaches">
        
        
        <button
          size="lg"
          className=" flex justify-center items-center bg-gradient-to-r p-2 from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/50 transition-all duration-300 w-full rounded-lg px-10 sm:w-auto"
        >
          More
        </button>
        </Link>
      </div>
    </section>
  );
}
