import React from 'react'

function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 mt-10">
      <div className="w-full mx-auto  p-6 md:flex md:items-center md:justify-between">
        
        
        <span className="text-sm sm:text-center">
          © 2026 <a href="#" className="hover:text-blue-400 transition">TechSphere™</a>. All Rights Reserved.
        </span>

        {/* Links Section */}
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium sm:mt-0">
          <li>
            <a href="#" className="hover:text-white me-4 md:me-6 transition">About</a>
          </li>
          <li>
            <a href="#" className="hover:text-white me-4 md:me-6 transition">Privacy Policy</a>
          </li>
          <li>
            <a href="#" className="hover:text-white transition">Contact</a>
          </li>
        </ul>
        
      </div>
    </footer>
  )
}

export default Footer