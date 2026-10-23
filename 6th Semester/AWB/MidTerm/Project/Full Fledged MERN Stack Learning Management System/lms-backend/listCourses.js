const mongoose=require('mongoose');
const Course=require('./models/Course.model');

(async()=>{
 try{
   await mongoose.connect('mongodb://localhost:27017/LMS_Final_Project');
   const courses=await Course.find();
   console.log('courses in db:', courses);
 }catch(e){console.error(e);}finally{process.exit();}
})();