import { useState } from "react";

const UserForm = () => {

  const [formData, setFormData] = useState({
    fname: "",
    email: "",
    password: "",
    country:""
  });




  const handleChange = (e) => {
         
    setFormData({...formData, [e.target.name]:[e.target.value]})
  
  };


   const handleSubmit = (e) => {

    e.preventDefault();                                 // 1 form ko submit hone se rokna

    if(formData.fname.length < 10){                          //2 jo values user ne enter ki hain object ke ander on per validation lgana
      console.log("Name MUST BE GREATER THAN 10 CHARACTERS");
    }

                              //3 Object ko backend ko send kerna 

    setFormData({              //4 reset object or form input feilds
    fname: "",
    email: "",
    password: "",
    country:""
  })


 
  };

  return (
    <div>

      <h2>User Registration Form</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="fname"
          placeholder="Enter Full Name"
          value={formData.fname}
          onChange={handleChange}
          className="p-5 border-2"
        />
        <br /><br />
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          className="p-5 border-2"
        />
        <br /><br />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          className="p-5 border-2"
        />

        <br /><br />

         <input
          type="text"
          name="country"
          placeholder="Enter your country"
          value={formData.country}
          onChange={handleChange}
          className="p-5 border-2"
        />

        <br /><br />

        <button type="submit" className="bg-indigo-500 p-5 ">Submit</button>

      </form>

    </div>
  );
}

export default UserForm;



