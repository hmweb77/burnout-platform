"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { auth } from "@/firebase"; // Ensure this path matches your project structure
import { onAuthStateChanged, signOut } from "firebase/auth";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Survey", href: "/survey" },
  { name: "Result", href: "/results" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("You have been logged out.");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-violet-500 text-white shadow sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/">
            <span className="text-2xl font-bold text-white">Recharge Hub</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex lg:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium ${
                pathname === link.href ? "text-teal-300" : "hover:text-teal-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Login/Logout Button */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <Link href="/login">
              <button className="bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-violet-600 transition">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            className="text-white focus:outline-none"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gradient-to-r from-blue-400 to-violet-500 text-white shadow transition-all duration-300">
          <nav className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium ${
                  pathname === link.href ? "text-teal-300" : "hover:text-teal-300"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <Link href="/login">
                <button
                  className="bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-violet-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
