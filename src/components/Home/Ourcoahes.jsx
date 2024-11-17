"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Linkedin, Calendar } from "lucide-react";


const coaches = [
    {
      id: 1,
      name: 'Alina Cristina',
      image: '/Screenshot 2024-11-17 at 10.51.42.png',
      linkedin: 'https://www.linkedin.com/in/alinacbuteica/',
      description: 'Global leadership and mindset coach with over a decade of experience helping leaders and organizations achieve sustainable growth. As the Founder & CEO of Growth Hives, I empower individuals and teams to overcome limiting beliefs and unlock authentic success. I also lead Illuminated Essence, guiding high-achieving female leaders to embrace their intuition and well-being while building aligned lives and businesses. International Best-Selling Author and keynote speaker, I specialize in mindset coaching, leadership development, and innovative strategies for conscious businesses.',
      categories: ['Mindset Coaching', 'Leadership Development', 'Lifestyle'],
      calendlyLink: "https://calendly.com/hmweb77/coach-demo", 
    },
    {
      id: 2,
      name: 'Jonathan OGrady',
      image: '/Screenshot 2024-11-17 at 10.55.38.png',
      linkedin: 'https://www.linkedin.com/in/iamjonathanogrady/',
      description: 'Performance coach dedicated to helping high-performing professionals and entrepreneurs align success with true fulfillment. I specialize in emotional intelligence and agility, guiding clients to master their emotions and thrive personally and professionally. Through the Core Emotional Operating System™ (CEOS), I help individuals break free from stress cycles, build resilience, and lead with clarity, confidence, and balance, unlocking their highest potential without sacrificing happiness or well-being.',
      categories: ['Emotional Intelligence', 'Stress Management', 'Work-Life Balance'],
      calendlyLink: "https://calendly.com/hmweb77/coach-demo", 
    },
    {
      id: 3,
      name: 'Adriana Fernandes',
      image: '/Screenshot 2024-11-17 at 10.55.55.png',
      linkedin: 'https://www.linkedin.com/in/adriana-fernandes-29476a1b7/',
      description: 'Innovator and technology enthusiast exploring the intersection of AI, quantum computing, neuroscience, and spatial analysis. I am passionate about uncovering how these advanced fields intertwine to shape the future of technology and human understanding. With a focus on quantum consciousness and AI integrity, I strive to bridge cutting-edge discoveries with practical applications that drive meaningful progress and innovation.',
      categories: ['Mindset', 'Productivity', 'Innovation'],
      calendlyLink: "https://calendly.com/hmweb77/coach-demo", 
    },
    {
      id: 4,
      name: 'Martina Anguelova',
      image: '/Screenshot 2024-11-17 at 10.55.45.png',
      linkedin: 'https://www.linkedin.com/in/martina-anguelova-95ba20338/',
      description: 'Holistic astrologer and wellness guide, helping individuals unlock their potential through astrology and holistic health practices. With a belief that wholeness is the essence of wellness, I share transformative practices to help others feel whole and aligned. A poet, crystal collector, and kirtan devotee, I bring creativity and spirituality into my approach to well-being, guiding clients to live authentically and achieve balance in every aspect of life.',
      categories: ['Astrology', 'Wellness Practices', 'Work-Life Balance'],
      calendlyLink: "https://calendly.com/hmweb77/coach-demo", 
    },
    {
      id: 5,
      name: 'Dani Heredia',
      image: '/Screenshot 2024-11-17 at 10.55.29.png',
      linkedin: 'https://www.linkedin.com/in/daniel-heredia/',
      description: 'Computer engineer and leader passionate about leveraging technology to make a positive impact. With over 10 years of experience, including 5 in leadership roles, I specialize in bridging technical and business teams to align vision with outcomes. Working with diverse teams worldwide, I foster resilience, motivation, and continuous improvement in both technical and soft skills. Focused on e-commerce and marketplaces, I mentor and empower teams to thrive and achieve their best.',
      categories: ['Leadership & Mentorship', 'Mindset', 'Lifestyle'],
      calendlyLink: "https://calendly.com/hmweb77/coach-demo", 
    },
    // {
    //   id: 6,
    //   name: 'Emily Chen',
    //   image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop',
    //   linkedin: 'https://linkedin.com/in/emilychen',
    //   description: 'Mindfulness and productivity coach helping busy professionals achieve balance and reach their goals. I teach proven techniques to reduce stress, enhance focus, and optimize work-life harmony. My approach combines mindfulness practices with practical strategies to empower clients to lead more intentional and fulfilled lives, overcoming challenges and maximizing their potential in both personal and professional spheres.',
    //   categories: ['Mindset', 'Productivity', 'Work-Life Balance'],
    //   calendlyLink: "https://calendly.com/alinacbuteica", 
    // }
  ];
  

function CalendlyPopup({ calendlyLink, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          ✕
        </button>
        <iframe
          src={calendlyLink}
          className="w-full h-[500px] rounded-b-lg"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default function OurCoach() {
  const [popupCoach, setPopupCoach] = useState(null);

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl text-center font-bold text-white mb-6">Our Coaches</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {coaches.map((coach) => (
            <div key={coach.id} className="bg-gray-100 overflow-hidden shadow-lg rounded-lg">
              <div className="p-8">
                <div className="flex flex-col sm:flex-row items-center mb-6">
                  <Image
                    src={coach.image}
                    alt={coach.name}
                    width={120}
                    height={120}
                    className="rounded-full mb-4 sm:mb-0 sm:mr-6"
                  />
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">{coach.name}</h2>
                    <div className="flex justify-center sm:justify-start space-x-4 mb-4">
                      <a
                        href={coach.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-indigo-500"
                      >
                        <Linkedin className="h-6 w-6" />
                        <span className="sr-only">LinkedIn profile of {coach.name}</span>
                      </a>
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                      {coach.categories.map((category, index) => (
                        <span
                          key={index}
                          className="inline-block bg-indigo-100 rounded-full px-3 py-1 text-sm font-semibold text-indigo-700"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">{coach.description}</p>
                <div className="flex justify-center sm:justify-start">
                  <button
                    onClick={() => setPopupCoach(coach)}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Book a Call
                    <span className="sr-only">with {coach.name}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      {popupCoach && (
        <CalendlyPopup
          calendlyLink={popupCoach.calendlyLink}
          onClose={() => setPopupCoach(null)}
        />
      )}
    </div>
  );
}
