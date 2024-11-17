"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Survey", href: "/survey" },
  { name: "Result", href: "/results" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // Get the current path to highlight active link

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-violet-500 text-white shadow sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" aria-label="Recharge Hub Home">
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

        {/* Login Button */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link href="/login">
            <button
              className="bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-violet-600 transition"
            >
              Login
            </button>
          </Link>
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
              className={`text-sm font-medium ${
                pathname === link.href ? "text-teal-300" : "hover:text-teal-300"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/login">
            <button
              className="bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-violet-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </button>
          </Link>
        </nav>
      </div>
    </div>
  );
}
