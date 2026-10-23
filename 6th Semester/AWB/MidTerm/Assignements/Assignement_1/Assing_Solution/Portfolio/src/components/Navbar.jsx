import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function Navbar({ onContactClick }) {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`sticky top-0 z-40 p-4 transition-all duration-300 shadow-md ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wide text-blue-600">
          Arham
        </h1>

        {/* Links */}
        <div className="space-x-6 hidden md:flex">
          <a
            href="#about"
            onClick={(e) => handleScroll(e, "about")}
            className="hover:text-blue-500 transition duration-300 font-medium"
          >
            About
          </a>
          <a
            href="#skills"
            onClick={(e) => handleScroll(e, "skills")}
            className="hover:text-blue-500 transition duration-300 font-medium"
          >
            Skills
          </a>
          <a
            href="#projects"
            onClick={(e) => handleScroll(e, "projects")}
            className="hover:text-blue-500 transition duration-300 font-medium"
          >
            Projects
          </a>
        </div>

        {/* Controls */}
        <div className="flex gap-3 items-center">
          <button
            onClick={onContactClick}
            className="hidden sm:block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition transform hover:scale-105 font-medium"
          >
            Contact
          </button>
          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-lg transition transform hover:scale-105 font-medium ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {darkMode ? "Light" : "Black"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;