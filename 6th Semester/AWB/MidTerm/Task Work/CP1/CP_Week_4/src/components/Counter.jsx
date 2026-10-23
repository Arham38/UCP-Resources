// import React, { useState } from "react";

// function Counter() {
//   const [counter, setCounter] = useState(0);

//   const increment = () => setCounter(prev => prev + 1); // safer
//   const decrement = () => setCounter(prev => prev - 1);
//   const reset=()=>setCounter(0);
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <p className="text-2xl font-bold mb-4 text-black">Counter = {counter}</p>

//       <div className="flex space-x-4">
//         <button
//           onClick={increment}
//           className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
//         >
//           +
//         </button>

//         <button
//           onClick={decrement}
//           className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
//         >
//           -
//         </button>

//         <button
//           onClick={reset}
//           className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
//         >
//           C
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Counter;

import React from "react";
import { useState } from "react";
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount((prev) => prev + 1);
  };

  const decrement = () => {
    setCount((prev) => prev - 1);
  };
  return (
    <>
      <h2>Count={count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </>
  );
}
export default Counter;
