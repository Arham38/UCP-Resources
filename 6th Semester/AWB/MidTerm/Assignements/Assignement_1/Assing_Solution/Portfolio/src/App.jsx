import React, { useContext, useState } from "react";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import ProfileCard from "./cards/ProfileCard";
import ContactModal from "./components/ContactModal";
import ScrollToTop from "./components/ScrollToTop";

function AppContent() {
  const { darkMode } = useContext(ThemeContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={`transition-colors duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
    }`}>
      <Navbar onContactClick={() => setIsModalOpen(true)} />
      <div className="max-w-5xl mx-auto">
        <ProfileCard onContactClick={() => setIsModalOpen(true)} />
        <About />
        <Skills />
        <Projects />
      </div>
      <Footer />
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ScrollToTop />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;