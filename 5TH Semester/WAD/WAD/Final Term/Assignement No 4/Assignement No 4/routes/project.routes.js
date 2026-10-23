const express = require("express");
const routes = express.Router();
const projectcontroller = require("../controllers/project.controller");
const authenticate = require("../middleware/authentication");
const roleMiddleware = require("../middleware/roleMiddleware");

routes.post("/addProject", authenticate, roleMiddleware("student"), projectcontroller.createProject);

routes.get("/getProject", authenticate, projectcontroller.getproject);

routes.get("/getBYid/:id", authenticate, projectcontroller.getByid);

routes.delete("/delete/:id", authenticate, roleMiddleware("supervisor"), projectcontroller.deleteProject);

module.exports = routes;
