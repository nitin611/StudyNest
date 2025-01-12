const express = require("express");
const Router = express.Router();
const {createCourse,getAllCourse,getCourseDetails}=require("../controllers/course")
const {createCategory,getAllCategorys,CategoryPageDetails}=require("../controllers/Category")
const {createRating,getAvgRating,getAllRating}=require("../controllers/RatingAndReview")
const {createSection,updateSection,deleteSection}=require("../controllers/Section")
const {createSubSection,updatedSubSection,deleteSubSection}=require("../controllers/subSection")
const {auth,isAdmin,isInstructor}=require("../middleware/auth")
// Routes for course-
Router.post("/createCourse",auth,isInstructor,createCourse)
Router.get("/getAllCourse",getAllCourse)
Router.post("/getCourseDetails",getCourseDetails)

// Routes for category-
Router.post("/createCategory",auth,isAdmin,createCategory)
Router.get("/getAllCategory",getAllCategorys)
Router.post("/categoryDetails",CategoryPageDetails)

// Routes for Rating and Reviews-
Router.post("/createRating",createRating)
Router.get("/getRating",getAvgRating)
Router.get("/allRating",getAllRating)

// Routes for sections-
Router.post("/createSection",auth,createSection)
Router.put("/updateSection",auth,updateSection)
Router.delete("/deleteSection/:id",auth,deleteSection)

// Routes for sub-Section-
Router.post("/createSubSection",auth,createSubSection)
Router.put("/updateSubSection",updatedSubSection)
Router.delete("/deleteSubSection",deleteSubSection)


module.exports=Router