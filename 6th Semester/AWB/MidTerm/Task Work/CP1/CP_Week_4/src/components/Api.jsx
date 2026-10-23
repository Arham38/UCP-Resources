import React, { useEffect, useState } from "react";
import axios from "axios";
function Api() {
  const [user, setUser] = useState([]);
  const [fetchdata, setFetchData] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (fetchdata) {
      setLoading(true);
      axios
        .get("https://jsonplaceholder.typicode.com/users")
        // .then((response) => response.json())
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });

      setFetchData(false);
    }
  }, [fetchdata]);
  return (
    <div>
      <h3>User List</h3>
      <button
        onClick={() => setFetchData(true)}
        className="bg-gray-200 text-black p-4 m-4"
      >
        FetchData
      </button>
      {loading && <p>Loading........</p>}
      <ul>
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {user.map((user) => (
              <tr key={user.id}>
                <td>Name:{user.name}</td>
                <td>Email:{user.email}</td>
                <td>Address:{user.address.street}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ul>
    </div>
  );
}

export default Api;
