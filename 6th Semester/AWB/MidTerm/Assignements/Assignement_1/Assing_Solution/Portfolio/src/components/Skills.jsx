import { useContext } from "react";
import SkillCard from "../cards/SkillCard";
import { ThemeContext } from "../context/ThemeContext";

function Skills() {
  const { darkMode } = useContext(ThemeContext);

  const skillCategories = {
    Frontend: [
      { name: "React.js", level: 9 },
      { name: "Tailwind CSS", level: 9 },
      { name: "JavaScript", level: 8 }
    ],
    Backend: [
      { name: "Node.js", level: 8 },
      { name: ".NET", level: 7 },
      { name: "C#", level: 7 }
    ],
    Programming: [
      { name: "Java", level: 8 },
      { name: "JavaScript", level: 8 },
      { name: "Python", level: 6 }
    ],
    "AI/ML": [
      { name: "Machine Learning", level: 6 },
      { name: "Artificial Intelligence", level: 6 },
      { name: "Data Analysis", level: 5 }
    ]
  };

  return (
    <section
      id="skills"
      className={`p-6 md:p-8 transition-all duration-300 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h2 className="text-3xl font-bold mb-8 text-blue-600">
        Skills
      </h2>

      {Object.entries(skillCategories).map((category) => (
        <div key={category[0]} className="mb-8">
          <h3
            className={`text-xl font-semibold mb-4 pb-2 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            {category[0]}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {category[1].map((skill, index) => (
              <SkillCard key={index} skill={skill} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default Skills;