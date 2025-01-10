const express = require("express");
const Router = express.Router();
const {createCourse,getAllCourse,getCourseDetails}=require("../controllers/course")
const {createCategory,getAllCategorys,CategoryPageDetails}=require("../controllers/Category")
const {createRating,getAvgRating,getAllRating}=require("../controllers/RatingAndReview")
const {createSection,updateSection,deleteSection}=require("../controllers/Section")
const {createSubSection,updatedSubSection,deleteSubSection}=require("../controllers/subSection")

// Routes for course-
Router.post("/createCourse",createCourse)
Router.post("/getAllCourse",getAllCourse)
Router.post("/getCourseDetails",getCourseDetails)

// Routes for category-
Router.post("/createCategory",createCategory)
Router.get("/getAllCategory",getAllCategorys)
Router.post("/categoryDetails",CategoryPageDetails)

// Routes for Rating and Reviews-
Router.post("/createRating",createRating)
Router.get("/getRating",getAvgRating)
Router.get("/allRating",getAllRating)

// Routes for sections-
Router.post("/createSection",createSection)
Router.put("/updateSection",updateSection)
Router.delete("/deleteSection/:id",deleteSection)

// Routes for sub-Section-
Router.post("/createSubSection",createSubSection)
Router.put("/updateSubSection",updatedSubSection)
Router.delete("/deleteSubSection",deleteSubSection)


module.exports=Router