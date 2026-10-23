import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        
        <h1 className="text-xl font-bold text-red-500">
          MyApp
        </h1>

        <div className="space-x-6">
          <Link to="/" className="hover:text-red-400">Home</Link>
          <Link to="/about" className="hover:text-red-400">About</Link>
          <Link to="/contact" className="hover:text-red-400">Contact</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;