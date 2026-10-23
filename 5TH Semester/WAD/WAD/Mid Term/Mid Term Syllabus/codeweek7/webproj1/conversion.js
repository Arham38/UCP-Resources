// JSON string
const jsonString = '{"name": "Ali", "age": 25}';
console.log(typeof jsonString);
// Convert JSON to JavaScript object
const jsObject = JSON.parse(jsonString);

// Output the object
console.log(jsObject); // { name: 'Ali', age: 25 }
///////

// JavaScript object
//const jsObject = { name: "Ali", age: 25 };

// Convert JavaScript object to JSON
//const jsonString = JSON.stringify(jsObject);

// Output the JSON string
//console.log(jsonString); // {"name":"Ali","age":25}
