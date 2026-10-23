import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function fetchEmployees() {
      try {
        setLoading(true)
        setError('')
        const response = await axios.get('https://jsonplaceholder.typicode.com/users')
        if (!cancelled) setEmployees(response.data ?? [])
      } catch (e) {
        if (!cancelled) setError('Failed to load employees. Please try again later.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchEmployees()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="ts-page">
      <h1 className="ts-page__title">Our Team</h1>

      {loading && <p className="ts-muted">Loading employees...</p>}
      {error && <p className="ts-error">{error}</p>}

      {!loading && !error && (
        <ul className="ts-employee-list">
          {employees.map((employee) => (
            <li key={employee.id} className="ts-card">
              <h2 className="ts-card__name">{employee.name}</h2>
              <p className="ts-card__line">
                <span className="ts-label">Email:</span>{' '}
                <a className="ts-link" href={`mailto:${employee.email}`}>
                  {employee.email}
                </a>
              </p>
              <p className="ts-card__line">
                <span className="ts-label">Phone:</span> {employee.phone}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

