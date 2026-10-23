const Profile = ({name,city})=>{
    const s ={
        minHeight : "150px",
        minWidth  : "150px",
       backgroundColor : "indigo"
    }

    return(
        <div style={s}>
            <h4>Your Name is : {name}  </h4>
            <h3>Your City is : {city}</h3>
            
        </div>
    )
}

export default Profile