import React, { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function ContactModal({ isOpen, onClose }) {
  const { darkMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to a backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div
        className={`rounded-lg shadow-2xl w-96 max-w-full mx-4 animate-slideUp ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Get In Touch</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-blue-500 transition"
          >
            ✕
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 rounded border transition ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-100 border-gray-300"
              }`}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 rounded border transition ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-100 border-gray-300"
              }`}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className={`w-full px-4 py-2 rounded border transition ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-100 border-gray-300"
              }`}
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition transform hover:scale-105"
              >
                Send Message
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-2 rounded transition transform hover:scale-105 ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 text-center">
            <p className="text-lg font-semibold text-green-500">
              ✓ Message sent successfully!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactModal;
