"use client";
import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Survey", href: "/survey" },
  { name: "Result", href: "/results" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-gradient-to-r from-blue-400 to-violet-500 text-white shadow">
      <div className="container mx-auto flex justify-between items-center p-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/">
            <span className="text-2xl font-bold text-white">TheShield</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex lg:gap-12 lg:justify-center lg:flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium hover:text-teal-300"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Login Button */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <button className="bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-violet-600 transition">
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
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
      <div
        className={`lg:hidden bg-gradient-to-r from-blue-400 to-violet-500 text-white shadow transition-all duration-300 ${
          mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <nav className="flex flex-col items-center space-y-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium hover:text-teal-300"
              onClick={() => setMobileMenuOpen(true)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
          <button
            className="bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-violet-600 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Login
          </button>
    </div>
  );
}
