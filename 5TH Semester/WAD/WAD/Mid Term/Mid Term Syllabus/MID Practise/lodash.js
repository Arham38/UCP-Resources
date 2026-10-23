// const fs=require("fs");

// fs.writeFile("write.txt","Hello Arham",(err)=>{
//     if(err){
//         throw err;
//     }
//     console.log("File Created And Data Written ");
// })

// fs.readFile("write.txt","utf8",(err,data)=>{
//     if(err){
//         throw err;
//     }
//     console.log("Data Read Succeasfully: "+`${data}`)
// })


// const student=
//     {
//         name:'Ali',
//         age:20
//     }

// const convertObject=JSON.stringify(student);
// const convertString=JSON.parse(convertObject);
// console.log(convertObject);
// console.log(convertString);


// const os=require("os");
// console.log("os CPU Deatils",os.cpus());
// console.log("TOTAL MEMORY: ",os.totalmem());
const fs=require("fs");
fs.appendFile("write.txt","\nHello Ansir",(err)=>{
    if(err){
        throw err;
    }
    console.log("File Data append Successfully");
})
