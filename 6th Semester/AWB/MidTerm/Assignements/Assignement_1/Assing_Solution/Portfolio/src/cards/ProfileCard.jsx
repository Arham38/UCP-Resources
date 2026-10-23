import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import profileimage from "../assets/profile.jpeg";

function ProfileCard({ onContactClick }) {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div
      className={`max-w-md mx-auto rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      {/* Header Gradient */}
      <div className="h-32 bg-blue-600" />

      {/* Profile Section */}
      <div className="text-center px-6 pb-6">
        {/* Profile Image */}
        <div className="-mt-16 mb-4">
          <img
            className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg mx-auto object-cover"
            src={profileimage}
            alt="Muhammad Arham"
          />
        </div>

        {/* Name & Title */}
        <h2 className="text-2xl font-bold">Muhammad Arham</h2>
        <p className={`mt-1 font-semibold text-lg ${
          darkMode ? "text-blue-400" : "text-blue-600"
        }`}>
          AI Engineer & Full-Stack Developer
        </p>

        {/* Bio */}
        <p className={`mt-3 text-sm ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}>
          Building innovative solutions with modern technologies
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap justify-center mt-4 gap-2">
          {["React.js", "Node.js", "AI/ML", "Java"].map((skill, idx) => (
            <span
              key={idx}
              className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-fadeIn"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onContactClick}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition transform hover:scale-105 font-semibold"
          >
            Contact Me
          </button>
          <button className={`flex-1 py-2 rounded-lg transition transform hover:scale-105 font-semibold ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}>
            Resume
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;