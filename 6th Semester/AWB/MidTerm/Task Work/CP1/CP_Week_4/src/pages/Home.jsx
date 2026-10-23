import React from "react";

const Home = () => {
  return (
    <div className="bg-gray-100 text-gray-800">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Build Your Future with{" "}
              <span className="text-blue-600">Learning</span>
            </h1>

            <p className="text-lg mb-6">
              A modern Learning Management System where students, instructors,
              and admins collaborate seamlessly.
            </p>

            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition">
                Get Started
              </button>

              <button className="border border-gray-400 px-6 py-3 rounded-xl hover:bg-gray-200 transition">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
              alt="Learning"
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Platform Features</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded-2xl shadow">
              <h3 className="text-xl font-semibold mb-3">📚 Courses</h3>
              <p>Access structured courses with videos, notes, and quizzes.</p>
            </div>

            <div className="bg-gray-100 p-6 rounded-2xl shadow">
              <h3 className="text-xl font-semibold mb-3">👨‍🏫 Instructors</h3>
              <p>Expert instructors manage and upload course content.</p>
            </div>

            <div className="bg-gray-100 p-6 rounded-2xl shadow">
              <h3 className="text-xl font-semibold mb-3">📊 Dashboard</h3>
              <p>Track progress, performance, and analytics easily.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-4xl font-bold text-blue-600">100+</h2>
            <p className="mt-2">Courses Available</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-4xl font-bold text-blue-600">50+</h2>
            <p className="mt-2">Expert Instructors</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-4xl font-bold text-blue-600">1000+</h2>
            <p className="mt-2">Active Students</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>

        <p className="mb-6">Join now and explore a smarter way to learn.</p>

        <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
          Join Now
        </button>
      </section>
    </div>
  );
};

export default Home;
