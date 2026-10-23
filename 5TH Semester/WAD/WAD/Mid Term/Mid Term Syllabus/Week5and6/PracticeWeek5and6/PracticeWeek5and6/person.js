const mongoose = require('mongoose')

// Define the Person Schema
const personSchema = new mongoose.Schema ({
name: {
type: String, required: true
},
age: {
type: Number},
work: {
type: String,
enum: ['chef', 'owner', 'manager', 'waiter'], 
    required: true
},
mobile: {
type: String, required: true
},
email: {
type: String, required: true, unique: true
},

address: {
type: String
},
salary: {
type: Number, // Corrected "number" to "Number"
required: true
}
})
// Create a person model
const Person = mongoose.model ('Person', personSchema, 'person');
// Model name used in your application
// Schema that defines the structure of the data
// Collection name in the database

// Export Person Model
module. exports = Person;