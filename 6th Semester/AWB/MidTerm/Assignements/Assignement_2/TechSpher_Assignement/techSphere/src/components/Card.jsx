function Card({ user }) {
  return (
    <article className="employee-card">
      <div className="employee-avatar">{user.name.charAt(0)}</div>

      <h3>{user.name}</h3>
      <p className="employee-role">Team Member</p>

      <div className="employee-details">
        <p>
          <span>Email:</span> {user.email}
        </p>
        <p>
          <span>Phone:</span> {user.phone}
        </p>
      </div>
    </article>
  )
}

export default Card
