import React from "react";
import { useState } from "react";

function DarkModeToggle() {
  const [isDark, setDark] = useState(false);
  const style = {
    backgroundColor: isDark ? "black" : "white",
    color: isDark ? "white" : "black",
    padding: "40px",
    margin: "40px",
  };

  const toggle = () => {
    setDark(!isDark);
  };
  return (
    <div style={style}>
      <h3 onClick={toggle}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe deleniti
        consequuntur officiis itaque perferendis aut, eos corpori s excepturi
        dolorem perspiciatis consectetur molestiae aliquam maiores nobis fuga
        quod quas eius at.
      </h3>

      <button onClick={toggle} className="mx-48,p-5,m-5">
        {isDark ? "Dark" : "Light"}
      </button>
    </div>
  );
}

export default DarkModeToggle;

// import React, { useState } from "react";

// function DarkModeToggle() {
//   const [isDark, setDark] = useState(false);

//   const myStyles = {
//     backgroundColor: isDark ? "black" : "white",
//     color: isDark ? "white" : "black",
//     height: "100vh",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//   };

//   const toggle = () => {
//     setDark(!isDark);
//   };
//   return (
//     <div className="p-5 m-5 w-5xl" style={myStyles}>
//       <p>Hello Bhatti</p>
//       <button onClick={toggle}>
//       {isDark ? "Light Mode":"Dark Mode"}
//       </button>
//     </div>
//   );
// }

// export default DarkModeToggle;
