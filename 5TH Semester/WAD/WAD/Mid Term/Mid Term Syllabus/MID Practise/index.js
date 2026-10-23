const express=require("express");
const mongoose=require("mongoose")
const port=3000
const app=express();
const db=require('./db');
const Book=require('./schema');
app.use(express.json());
app.listen(port,()=>{
    console.log("Server IS Conected on port ",port);
})

app.post("/books",async(req,res)=>{
    try{
    const data=req.body;
    const book=new Book(data);
    await book.save();
    res.status(200).json(book)
    }catch(error){
        res.status(500).json(error);
    }
})

app.post("/multipleBooks",(req,res)=>{
    const data=req.body;
   Book.insertMany(data);
   res.send(data)
})

app.delete("/delete/:id",(req,res)=>{
    const deleteBookByID=Book.findByIdAndDelete({id:req.params.id});
    res.send(200,deleteBookByID);
})

app.get("/bookQuery", (req, res) => {
  const { slary, title } = req.query;

  res.send({
    slary: { $gte: Number(slary) },  // remove the extra {}
    title: title
  });
});
// localhost:3000/bookQuery?salary>=jkjsa&title=falalal

app.put("/books/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndDelete(
      { id: Number(req.params.id) }, // find book by id
      req.body,                      // update fields from request body
      { new: true }                  // return the updated document
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book updated successfully", book: updatedBook });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});
