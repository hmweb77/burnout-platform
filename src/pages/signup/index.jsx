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
  });
  const [progress, setProgress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    const { name, email, password } = formData;

    if (!name || !password) {
      alert("Username and Password are required.");
      return;
    }

    try {
      // Firebase authentication and Firestore integration
      const userCredential = await createUserWithEmailAndPassword(auth, email || `${name}@example.com`, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(db, "users", userId), { name, email });

      alert("Signup successful!");
      setFormData({ name: "", email: "", password: "" });
      setProgress(0);
      setIsSubmitted(true);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen  bg-gray-900 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-3xl mx-auto px-4"
      >
        <div className=" bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Sign Up</h1>
            <p className=" text-gray-400">
              Please fill out the form to create your account and start your survey.
            </p>
            <p className=" text-gray-400">
              Note: You can sign up with your username only. However, if you don't provide an email, you will not be able to recover your password.
            </p>
          </div>
          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Username"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-700 border-gray-600"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-700 border-gray-600"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-700 border-gray-600"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition"
            >
              Sign Up
            </button>
          </form>

          {/* Start Survey Button */}
          <Link href="/survey">
            <button
              disabled={!isSubmitted}
              className={`mt-8 w-full flex items-center justify-center px-4 py-2 rounded-lg shadow-lg transition-all ${
                isSubmitted
                  ? "bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              Start the Survey
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
