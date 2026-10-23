import { NavLink } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="brand">
          TechSphere
        </NavLink>

        <nav className="nav-links" aria-label="Main navigation">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link${isActive ? ' active-link' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/employees"
            className={({ isActive }) =>
              `nav-link${isActive ? ' active-link' : ''}`
            }
          >
            Employees
          </NavLink>
        </nav>

        <button type="button" className="theme-button" onClick={toggleTheme}>
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>
    </header>
  )
}

export default Header
