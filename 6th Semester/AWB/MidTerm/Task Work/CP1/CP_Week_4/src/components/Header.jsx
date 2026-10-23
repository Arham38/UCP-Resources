import React from "react";
import s from './Button.module.css'
function Header() {
  const name = "Arham";
  const age = 21;
  const isLoggedIn = true;
  const items = [1, 2, 3, 4,"Arham Bhatti"];

  const styles={
    backgroundColor:"black",
    color:"white",
    padding:"30px",
    margin:"40px"
  }
  return (
    <>
      <h3 style={styles}>{isLoggedIn ? "Welcome Logged In " : "Please Log In First"}</h3>
      <h3>{isLoggedIn && <h1>Welcome Bhatti</h1>}</h3>
      <p>Name={name}</p>
      <p>age={age + 1}</p>
      <p>
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </p>

      <button className={s.primaryBtn}>Click Me</button>
      
    </>
  );
}

export default Header;
