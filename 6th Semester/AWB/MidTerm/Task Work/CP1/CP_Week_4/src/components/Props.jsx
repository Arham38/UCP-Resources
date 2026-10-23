import React, { createContext } from "react";
import GrandParent from "./GrandParent";

export const userData = createContext();
function Props() {
  const name = "Aram Bhatti";
  const age = 21;
  const city = "Faisalabad";
  return (
    <div>
      <userData.Provider value={{ name, age, city }}>
        <GrandParent />
      </userData.Provider>
    </div>
  );
}

export default Props;

// import React, { useState } from "react";
// import Props2 from "../components/Props2";

// function Props() {
//   const name = "Arham";
//   const age = 21;
//   return (
//     <div>
//       <Props2 name={name} age={age} />
//     </div>
//   );
// }

// export default Props;
