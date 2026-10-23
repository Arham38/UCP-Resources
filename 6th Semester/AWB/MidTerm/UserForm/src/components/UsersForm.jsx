import { useState } from "react";

const UsersForm = () => {

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [users, setUsers] = useState([]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add new user to users array
    setUsers([...users, user]);

    // Clear form
    setUser({
      name: "",
      email: "",
      password: ""
    });
  };

  return (
    <div>

      <h2>User Registration</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={user.name}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={user.email}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={user.password}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">Add User</button>

      </form>

      <h3>Users List</h3>

      <ul>
        {users.map((u, index) => (
          
          <li key={index}>
            {u.name} - {u.email}
          </li>
        ))}
      </ul>

    </div>
  );
}

export default UsersForm;