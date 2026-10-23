import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      <ul style={{ display: "flex", gap: "20px", listStyle: "none" }}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Header;