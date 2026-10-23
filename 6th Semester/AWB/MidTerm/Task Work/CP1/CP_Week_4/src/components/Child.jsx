import React, { use, useContext } from "react";
import { userData } from "./Props";
function Child() {
  const user = useContext(userData);
  console.log(user);
  return (
    <div>
      <p>Name={user.name}</p>
      <p>Age={user.age}</p>
      <p>City={user.city}</p>
    </div>
  );
}

export default Child;
