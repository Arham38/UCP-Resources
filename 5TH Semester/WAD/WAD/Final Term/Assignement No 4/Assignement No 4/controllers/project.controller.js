const projectModel = require("../models/project.model");


const createProject=async(req,res)=>{
   try {
     const {title,description,studentId,status}=req.body;
    const project=await projectModel.create({
        title,description,studentId,status
    });
    res.status(201).json({success:true,message:"Project Created Successfully",project});
   } catch (error) {
    console.log(error);
    console.log("Error",error);
    res.json("server Error");
   }
}

const getproject = async (req, res) => {
  try {
    let projects;

    if (req.user.role === "student") {
      projects = await projectModel.find({ studentId: req.user.id });
    } else {
      projects = await projectModel
        .find()
        .populate("studentId", "name email")
        .populate("supervisorId");
    }

    return res.status(200).json(projects);
  } catch (err) {
    console.log("GET PROJECT ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


const getByid=async(req,res)=>{
     const project = await projectModel.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (
    req.user.role === "student" &&
    project.studentId.toString() !== req.user.id) 
    {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json(project);
}; 

const deleteProject=async (req,res)=>{
    const project=await projectModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Project deleted" });
};

module.exports={createProject,getproject,getByid,deleteProject};