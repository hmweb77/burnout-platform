"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
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
      router.push("/survey"); // Redirect to the survey page after login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
//     <div className="min-h-screen flex items-center justify-center ">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white p-6 rounded shadow-md w-full max-w-sm"
//       >
//         <h2 className="text-2xl font-bold mb-4">Login</h2>
//         {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="mb-4 text-black w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="mb-4 text-black  w-full p-2 border rounded"
//           required
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
//         >
//           Login
//         </button>
//         <p className="mt-4 text-sm text-center">
//           Don’t have an account?{" "}
//           <a href="/signup" className="text-blue-500 hover:underline">
//             Sign up
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }


<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="container max-w-3xl mx-auto px-4"
>
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold mb-2">Login</h1>
     
    </div>
    {/* Signup Form */}
    <form  onSubmit={handleLogin} className="space-y-4">
     
     
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        required
      />
      <Link href="/survey">
      <button
        type="submit"
        className="bg-blue-500 mt-10 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition"
      >
     Login
      </button>
      </Link>
      <Link href="/signup">
                <button
                 size="lg"
                  className="bg-gradient-to-r mt-8 p-2 from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/50 transition-all duration-300 w-full rounded-lg "
                >
                Sign Up
             
                </button>
              </Link>
             
    </form>

    {/* Start Survey Button */}
    {/* <Link href="/survey">
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
    </Link> */}
  </div>
</motion.div>
</div>
);
}
