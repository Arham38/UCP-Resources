const express = require('express')
const app = express()
const port = 3000


app.listen(port, ()=>{  
console.log("server is open now")
})

app.get("/page1", (req, resp)=>{ 
resp.send("helo word")
})

const os = require('os');
console.log(`Platform: ${os.platform()}`);
console.log(`CPU Architecture: ${os.arch()}`);
console.log(`Free Memory: ${os.freemem()} bytes`);

const fs = require('fs');

// Writing to a file
fs.writeFile('example.txt', 'Hello, Node.js!', (err) => {
    if (err) throw err;
    console.log('File created and written to.');

    // Reading from the file
    fs.readFile('example.txt', 'utf8', (err, data) => {
        if (err) throw err;
        console.log(`File contents: ${data}`);
    });
});

const _ = require('lodash');

const numbers = [1, 2, 3, 4, 5];

// Filter even numbers
const evens = _.filter(numbers, num => num % 2 === 0);
console.log(evens); // Output: [2, 4]


app.use(express.json()) // Informs Node.js that incoming data will be in JSON format (key-value pairs as an object)
let obj= {} //object created

app.get("/page1", (req, resp)=>{ 
    resp.send("helo helloooo")
    })
   
    
    

    app.post('/post-data', (req, res)=>{  //rout and call back function, assum login form
        _.set(obj, 'item', req.body.itemName) //.set is loadash function used store data in any object, it has 3 parameters
        //1. obj. The data coming from the frontend etc. will be stored in this variable.
        //2. Since we are sending data in JSON format, we need to provide a key here, and the data coming from the frontend will be the value for this key.
        // It means that when the user sends the name of the item, this name comes in req.body under itemName
        res.send(obj)
    })
//http://localhost:3000/post-data
