import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 px-6 py-12">
      {/* Container */}
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center mb-8">About Me</h1>

        {/* Intro Section */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4">👋 Hello!</h2>
          <p className="text-lg leading-relaxed">
            I'm a passionate web developer with experience in building modern
            web applications using React, Node.js, and MongoDB. I enjoy solving
            real-world problems and creating user-friendly interfaces.
          </p>
        </div>

        {/* Skills Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4">💻 Technical Skills</h2>
            <ul className="space-y-2">
              <li className="bg-gray-200 px-4 py-2 rounded-lg">React.js</li>
              <li className="bg-gray-200 px-4 py-2 rounded-lg">Node.js</li>
              <li className="bg-gray-200 px-4 py-2 rounded-lg">Express.js</li>
              <li className="bg-gray-200 px-4 py-2 rounded-lg">MongoDB</li>
              <li className="bg-gray-200 px-4 py-2 rounded-lg">Tailwind CSS</li>
            </ul>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4">🧠 Soft Skills</h2>
            <ul className="space-y-2">
              <li className="bg-gray-200 px-4 py-2 rounded-lg">
                Problem Solving
              </li>
              <li className="bg-gray-200 px-4 py-2 rounded-lg">Team Work</li>
              <li className="bg-gray-200 px-4 py-2 rounded-lg">
                Communication
              </li>
              <li className="bg-gray-200 px-4 py-2 rounded-lg">
                Time Management
              </li>
            </ul>
          </div>
        </div>

        {/* Education / Experience */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4">🎓 Education</h2>
          <p className="text-lg">
            BS Computer Science (Continue) <br />
            Your University Name
          </p>
        </div>

        {/* Projects */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">🚀 Projects</h2>
          <p className="text-lg leading-relaxed">
            Developed a Learning Management System (LMS) with React, Node.js,
            and MongoDB featuring role-based dashboards for students,
            instructors, and admin.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
