import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function About() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <section
      id="about"
      className={`p-6 md:p-8 rounded-lg transition-all duration-300 ${
        darkMode ? "bg-gray-800" : "bg-gray-50"
      }`}
    >
      <h2 className="text-3xl font-bold mb-4 text-blue-600">
        About Me
      </h2>
      <p className="text-lg leading-relaxed mb-4">
        I am <span className="font-semibold">Muhammad Arham Bhatti</span>, a
        Computer Science student passionate about building innovative solutions
        and learning cutting-edge technologies.
      </p>
      <div className="space-y-3">
        <p className="flex items-start gap-2">
          <span className="text-blue-500 mt-1">💻</span>
          <span>
            <strong>Backend Development:</strong> Experienced with Node.js and
            .NET frameworks for building scalable applications.
          </span>
        </p>
        <p className="flex items-start gap-2">
          <span className="text-purple-500 mt-1">🎨</span>
          <span>
            <strong>Frontend Development:</strong> Skilled in React.js and
            responsive design with Tailwind CSS.
          </span>
        </p>
        <p className="flex items-start gap-2">
          <span className="text-green-500 mt-1">🤖</span>
          <span>
            <strong>AI & Machine Learning:</strong> Exploring AI and ML to build
            smart systems and intelligent applications.
          </span>
        </p>
      </div>
    </section>
  );
}

export default About;