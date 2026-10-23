import { useEffect, useState } from 'react'
import axios from 'axios'
import Card from '../components/Card'

function Employees() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          'https://jsonplaceholder.typicode.com/users',
        )
        setUsers(response.data)
      } catch {
        setError('Unable to load employees right now.')
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  return (
    <section className="employees-section">
      <div className="section-heading">
        <p className="eyebrow">Employees Page</p>
        <h1>Our Team</h1>
        <p>Meet the employees loaded from the remote API.</p>
      </div>

      {loading && <p className="status-message">Loading employees...</p>}
      {error && <p className="status-message error-message">{error}</p>}

      {!loading && !error && (
        <div className="employee-grid">
          {users.map((user) => (
            <Card key={user.id} user={user} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Employees
