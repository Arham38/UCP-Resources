import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function SkillCard({ skill }) {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div
      className={`rounded-lg p-4 text-center transition-all duration-300 transform hover:scale-105 cursor-default ${
        darkMode
          ? "bg-gray-700 hover:bg-blue-600"
          : "bg-white hover:bg-blue-500"
      } shadow-md hover:shadow-lg`}
    >
      <h3
        className={`font-semibold text-lg mb-2 ${
          darkMode ? "hover:text-white" : "hover:text-white"
        }`}
      >
        {skill.name}
      </h3>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-300 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-300"
            style={{ width: `${skill.level * 10}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-gray-500 min-w-[30px]">
          {skill.level}/10
        </span>
      </div>
    </div>
  );
}

export default SkillCard;