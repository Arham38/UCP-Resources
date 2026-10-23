import { Route, Routes } from 'react-router-dom'
import SiteFooter from './components/SiteFooter'
import Header from './components/Header'
import { useTheme } from './context/ThemeContext'
import Employees from './pages/Employees'
import Home from './pages/Home'

function App() {
  const { theme } = useTheme()

  return (
    <div className={`app-shell ${theme}`}>
      <Header />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employees" element={<Employees />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
