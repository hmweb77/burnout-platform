"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Linkedin, Calendar } from "lucide-react";

const coaches = [
  {
    id: 1,
    name: "Alina Cristina",
    image: "/Screenshot 2024-11-17 at 10.51.42.png",
    linkedin: "https://www.linkedin.com/in/alinacbuteica/",
    description: "Global leadership and mindset coach helping individuals and organizations achieve sustainable growth. Founder of Growth Hives and Illuminated Essence, I specialize in mindset coaching, leadership development, and guiding female leaders to align intuition and well-being with success.",
    categories: ["Mindset Coaching", "Leadership Development", "Lifestyle"],
    calendlyLink: "https://calendly.com/hmweb77/coach-demo",
  },
  {
    id: 2,
    name: "Jonathan OGrady",
    image: "/Screenshot 2024-11-17 at 10.55.38.png",
    linkedin: "https://www.linkedin.com/in/iamjonathanogrady/",
    description:
      "Performance coach dedicated to helping high-performing professionals and entrepreneurs align success with true fulfillment. I specialize in emotional intelligence and agility, guiding clients to master their emotions and thrive personally and professionally.",
    categories: ["Emotional Intelligence", "Stress Management", "Work-Life Balance"],
    calendlyLink: "https://calendly.com/hmweb77/coach-demo",
  },
  {
    id: 3,
    name: "Adriana Fernandes",
    image: "/Screenshot 2024-11-17 at 10.55.55.png",
    linkedin: "https://www.linkedin.com/in/adriana-fernandes-29476a1b7/",
    description:
      "Innovator and technology enthusiast exploring the intersection of AI, quantum computing, neuroscience, and spatial analysis. I am passionate about uncovering how these advanced fields intertwine to shape the future of technology and human understanding.",
    categories: ["Mindset", "Productivity", "Innovation"],
    calendlyLink: "https://calendly.com/hmweb77/coach-demo",
  },
];

function SuggestCoach() {
  const [suggestedCoach, setSuggestedCoach] = useState(null);

  useEffect(() => {
    // Randomly select one coach
    const randomCoach = coaches[Math.floor(Math.random() * coaches.length)];
    setSuggestedCoach(randomCoach);
  }, []);

  if (!suggestedCoach) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 sm:px-6 lg:px-48 text-center">
      <h1 className="text-3xl font-bold text-white mb-8">Our Suggestion</h1>
      <div className="bg-white overflow-hidden shadow-sm rounded-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <Image
            src={suggestedCoach.image}
            alt={suggestedCoach.name}
            width={96}
            height={96}
            className="rounded-full mb-4"
          />
          <h2 className="text-2xl font-semibold text-gray-900">{suggestedCoach.name}</h2>
          <div className="flex space-x-4 mt-2">
            <a
              href={suggestedCoach.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-indigo-500"
            >
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
        <p className="text-gray-600 mb-6">{suggestedCoach.description}</p>
        <div className="flex justify-center">
          <a
            href={suggestedCoach.calendlyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Book a Call
          </a>
        </div>
      </div>
    </div>
  );
}

export default SuggestCoach;
