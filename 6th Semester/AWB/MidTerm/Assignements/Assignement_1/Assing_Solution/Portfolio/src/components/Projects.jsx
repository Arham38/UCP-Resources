import React, { useContext } from "react";
import Button from "./Button";
import { ThemeContext } from "../context/ThemeContext";

function Projects() {
  const { darkMode } = useContext(ThemeContext);

  const projects = [
    {
      name: "AI Learning Roadmap",
      description: "A comprehensive website that guides beginners through AI concepts step-by-step with interactive content.",
      category: "Web Development",
      link: "#",
      demo: "#"
    },
    {
      name: "Student Form Validation",
      description: "React form with advanced validation using hooks, Tailwind CSS, and real-time error feedback.",
      category: "React",
      link: "#",
      demo: "#"
    },
    {
      name: "E-Commerce Platform",
      description: "Full-stack e-commerce application with product catalog, shopping cart, and payment integration.",
      category: "Full Stack",
      link: "#",
      demo: "#"
    }
  ];

  const handleViewProject = (project) => {
    alert(`Project: ${project.name}\n\nComing soon! Demo link will be available soon.`);
  };

  return (
    <section
      id="projects"
      className={`p-6 md:p-8 transition-all duration-300 ${
        darkMode ? "bg-gray-800" : "bg-gray-50"
      }`}
    >
      <h2 className="text-3xl font-bold mb-8 text-blue-600">
        Projects
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className={`rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="h-40 bg-blue-600 flex items-center justify-center">
              <span className="text-white text-4xl">📁</span>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{project.name}</h3>
                <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                  {project.category}
                </span>
              </div>
              <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {project.description}
              </p>
              <div className="flex gap-3">
                <Button
                  text="View Project"
                  onClick={() => handleViewProject(project)}
                />
                <button className={`flex-1 py-2 rounded transition transform hover:scale-105 font-medium ${
                  darkMode
                    ? "bg-gray-600 hover:bg-gray-500"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}>
                  Live Demo
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;