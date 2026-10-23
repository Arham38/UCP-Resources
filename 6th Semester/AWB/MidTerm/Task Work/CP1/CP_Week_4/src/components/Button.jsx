import React from 'react'

function Button({text}) {

  const myStyle={
        backgroundColor: "blue",
        color: "white",
        padding: "10px 15px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
  }

    const  handelClick=()=>{
        alert("Button Clicked")
    }
  return (
    <div>
      <button style={myStyle} onClick={handelClick}>
        {text}
      </button>
    </div>
  )
}

export default Button
