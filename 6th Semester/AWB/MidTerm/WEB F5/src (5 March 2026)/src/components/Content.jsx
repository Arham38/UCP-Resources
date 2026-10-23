const Content = ()=>{

    let msg = "UCP Lahore"
    const s = {
        color: "red",
        backgroundColor: "yellow",
        fontSize:"60px"
    }
    function hello(){
        alert("Button Clicked!")
    }

    return(
        <div>
            <h1 style={s}>Welcome to {msg}</h1>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit dolore ullam sed laudantium molestiae? Consequatur numquam itaque consequuntur temporibus minima ipsa dicta tenetur porro nisi ad accusamus eaque iure voluptatibus deleniti modi sapiente nobis ducimus quo, quis harum repellendus iste omnis tempora totam. Laborum, laudantium eius debitis in quae possimus assumenda saepe unde eligendi aut quia corporis odit voluptatem cum consequatur vitae voluptatum dolore molestias sed consequuntur neque, perspiciatis nobis reiciendis maxime? Assumenda quibusdam, aliquam officia aspernatur repudiandae rerum necessitatibus? Voluptatibus ad, minima facere ullam harum dolorem, excepturi, dignissimos fuga voluptates dolorum corrupti sequi cumque dolore placeat facilis! Libero, laborum.</p>
            <button onClick={hello}>Click Me!</button>
        </div>
    )
}

export default Content