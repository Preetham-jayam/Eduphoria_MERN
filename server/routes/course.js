const express=require('express');
const router=express.Router();

const courseController =require ('../controllers/course');

router.get('/',courseController.getAllCourses);
router.get('/:cid',courseController.getCourseById);
router.get('/reviews/:id',courseController.getCourseReviews);

module.exports=router;