import { useState } from "react"

const UserProfile = () => {
    
  const [user, setUser] = useState({
    name: "Usama",
    age: 22
  })

  const changeAge = () => {
    setUser({ ...user, age: 23 })
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.age}</p>

      <button onClick={changeAge}>
        Update Age
      </button>
    </div>
  )
}

export default UserProfile