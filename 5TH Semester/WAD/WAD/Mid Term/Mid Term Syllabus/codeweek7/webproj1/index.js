const express = require('express') 
const app = express() //app is object of express
const mon = require('mongoose')
const db = require('./db')
const Person = require('./person')
const { ObjectId } = require('mongodb');

const port = 3000  

app.listen(port, ()=>{              
    console.log("the server is open")
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




// Delete API by body
app.delete('/DeletePersons/:id', async (req, res) => {
    try {
        
        const persons = await Person.deleteOne({id:req.params.id}); // 1st id is the database field name, and 2nd id (req.params.id) is the value coming from the frontend URL.
        // req.params.id gets the ID sent from the frontend via the URL, e.g., /DeletePersons/123 makes req.params.id = 123.
        res.status(200).json(persons);   //await waits for a task to finish before moving to the next line.
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
//http://localhost:3000/DeletePersons/1


app.put('/:id', async (req, res) => {
    try {
      const personId = req.params.id; // Extract the id of Person from the URL parameter
      const updatedPersonData = req.body; // Updated data for the Person
      
      // Use findOneAndUpdate because we are using a custom 'id' field
      const response = await Person.findOneAndUpdate(
        { id: personId }, // Search based on custom 'id' field
        updatedPersonData, 
        {
          new: true, // Return the updated document
          runValidators: true, // Run Mongoose validation
        }
      );
  
      if (!response) {
        return res.status(404).json({ error: 'Person not found' });
      }
  
      console.log('Data updated');
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
