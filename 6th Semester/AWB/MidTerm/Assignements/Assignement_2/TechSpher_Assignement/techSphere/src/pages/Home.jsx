function Home() {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">Home Page</p>
        <h1>Welcome to TechSphere</h1>
        <p>
          This single page application demonstrates routing, theme switching,
          and API data fetching using modern React features.
        </p>
      </div>

      <div className="hero-panel">
        <h2>What this project includes</h2>
        <ul>
          <li>Light and dark mode with Context API</li>
          <li>Page navigation using React Router</li>
          <li>Employee data fetched with Axios and useEffect</li>
          <li>Simple responsive styling for both themes</li>
        </ul>
      </div>
    </section>
  )
}

export default Home
