import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function Footer() {
  const { darkMode } = useContext(ThemeContext);
  const year = new Date().getFullYear();

  const socialLinks = [
    { name: "GitHub", icon: "🐙", link: "#" },
    { name: "LinkedIn", icon: "💼", link: "#" },
    { name: "Twitter", icon: "𝕏", link: "#" },
    { name: "Email", icon: "✉️", link: "mailto:arham@example.com" }
  ];

  return (
    <footer
      className={`transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-800 text-gray-300"
      }`}
    >
      {/* Social Links */}
      <div className="max-w-6xl mx-auto px-6 py-8 border-b border-gray-700">
        <p className="text-center text-sm font-semibold mb-4">Connect With Me</p>
        <div className="flex justify-center gap-6 flex-wrap">
          {socialLinks.map((social, idx) => (
            <a
              key={idx}
              href={social.link}
              className="flex items-center gap-2 hover:text-blue-400 transition transform hover:scale-110"
              title={social.name}
            >
              <span className="text-2xl">{social.icon}</span>
              <span className="hidden sm:inline">{social.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center py-6">
        <p className="text-sm">
          © {year} Muhammad Arham Bhatti. All rights reserved.
        </p>
        <p className="text-xs mt-2 text-gray-500">
          Built with React & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}

export default Footer;