import React, { useState } from "react";

function UserForm() {
  const [form, setForm] = useState({
    name: "",
    age: "",
  });

  const handelChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.name.length < 5) {
      alert("Name at least 5 chracters");
    }
    if (form.age <= 18) {
      alert("age must be greater then 18");
    }

    setForm({
      name: "",
      age: "",
    });
  };
  return (
    <div onSubmit={handleSubmit}>
      <form action="">
        <input
          type="text"
          name="name"
          value={form.name}
          required
          placeholder="Enter Your Name"
          className="bg-gray-300 text-black"
          onChange={handelChange}
        />
        <br /><br />
        <input
          type="number"
          name="age"
          value={form.age}
          required
          placeholder="Enter Your Age"
          className="bg-gray-300 text-black"
          onChange={handelChange}
        />
        <br /><br />
        <button className="border border-amber-950 bg-gray-800 text-shadow-fuchsia-400">Submit</button>

        <h2>Details</h2>
        <p>Name:{form.name}</p>
        <p>age:{form.age}</p>
      </form>
    </div>
  );
}

export default UserForm;

// // export default UserForm
// import React, { useState } from "react";

// function UserForm() {
//   const [formdata, setformdata] = useState({
//     name: "",
//   });

//   const onHandleChange = (e) => {

//     setformdata({ ...formdata, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (formdata.name.length < 6) {
//       alert("Name must be at least 6 characters");
//       return;
//     }

//     alert("Form Submitted Successfully");

//     setformdata({
//       name: "",
//     });
//   };

//   console.log(formdata.name);

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         name="name"
//         value={formdata.name}
//         className="bg-gray-300 text-black"
//         placeholder="Enter Your Name"
//         onChange={onHandleChange}
//       />

//       <button type="submit" onClick={() => console.log("Button Clicked")}>
//         Submit
//       </button>

//       <p>Your Name: {formdata.name}</p>
//     </form>
//   );
// }

// export default UserForm;
