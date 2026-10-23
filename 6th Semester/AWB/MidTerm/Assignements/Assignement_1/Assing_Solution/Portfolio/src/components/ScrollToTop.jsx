import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function ScrollToTop() {
  const { darkMode } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center transition transform hover:scale-110 shadow-lg animate-fadeIn ${
          darkMode
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
        aria-label="Scroll to top"
      >
        ↑
      </button>
    )
  );
}

export default ScrollToTop;
