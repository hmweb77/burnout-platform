"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { auth, db } from "@/firebase"; // Update this path to your Firebase config
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    typeOfWork: "",
  });
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Update progress based on filled fields
    const filledFields = Object.values({ ...formData, [e.target.name]: e.target.value }).filter(
      (value) => value !== ""
    ).length;
    setProgress((filledFields / Object.keys(formData).length) * 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, age, typeOfWork } = formData;

    try {
      // Firebase authentication and Firestore integration
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(db, "users", userId), { name, email, age, typeOfWork });

      alert("Signup successful!");
      setFormData({ name: "", email: "", password: "", age: "", typeOfWork: "" });
      setProgress(0);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-3xl mx-auto px-4"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Sign Up</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Please fill out the form to create your account and start your survey.
            </p>
          </div>

          

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <input
              type="text"
              name="typeOfWork"
              placeholder="Type of Work"
              value={formData.typeOfWork}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
             <Link href="/survey">
                <button
                 size="lg"
                  className=" flex items-center mt-8 bg-gradient-to-r p-2 from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/50 transition-all duration-300 w-full rounded-lg sm:w-auto"
                >
                  Start the Survey
                 
                </button>
              </Link>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

