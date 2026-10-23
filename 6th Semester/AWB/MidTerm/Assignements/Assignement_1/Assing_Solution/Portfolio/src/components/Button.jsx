import React from "react";

function Button({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition transform hover:scale-105 flex-1 font-semibold"
    >
      {text}
    </button>
  );
}

export default Button;