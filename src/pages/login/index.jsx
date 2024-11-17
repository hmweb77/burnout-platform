"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation"; // Use 'next/navigation' instead of 'next/router'
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/survey"); // Redirect to the survey page after successful login
    } catch (err) {
      setError(err.message); // Display error if login fails
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
            <h1 className="text-3xl font-bold mb-2">Login</h1>
            {error && (
              <p className="text-red-500 text-sm mt-2">
                {error}
              </p>
            )}
          </div>
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded bg-gray-700 border-gray-600"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded bg-gray-700 border-gray-600"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 mt-10 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition"
            >
              Login
            </button>
          </form>
          <Link href="/signup">
            <button
              size="lg"
              className="bg-gradient-to-r mt-8 p-2 from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/50 transition-all duration-300 w-full rounded-lg"
            >
              Sign Up
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
