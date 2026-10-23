const express = require('express') 
const app = express() //app is object of express
const mon = require('mongoose')
const db = require('./db')
const Person = require('./person')
const port = 3000  


app.listen(port, ()=>{              
    console.log("server is open")
})


const bodyParser = require('body-parser') 
app.use(bodyParser.json())

app.post('/person', async(req,res)=>{
    try
    {
        const data = req.body
        const newPerson = new Person(data) //schema 
        const response = await newPerson.save()
        console.log('Data Saved')
        res.status(200).json(response) //status code use hoty hain k api chali ni chali crash etc, differnt code hoty
    }
    catch
    (err)
    {
        console.log(err)
        res.status(500).json(err)
    }
}
)



// GET API: Retrieve all persons from the database
app.get('/GetPersons', async (req, res) => {
    try {
        const persons = await Person.find(); // Retrieve all documents from the 'person' collection
        res.status(200).json(persons);   //await waits for a task to finish before moving to the next line.
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});