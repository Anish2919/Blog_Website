const express = require('express'); 

const controller = require('../controllers/UserControllers'); 
const verifyPayloads = require('../middleware/VerifyPayloads'); 

// config router 
const router = express.Router(); 

// multer 
const multer = require('multer'); 
const uploadMiddleware = multer({dest:'uploads/'}); 



// register user 
router.post("/signup",verifyPayloads.verifyRegisterSchema, controller.signUpUserController); 
// login user 
router.post('/signin', controller.signInUserController); 
// logout route 
router.get('/logout', controller.logoutController); 
// check profile 
router.get('/profile', controller.checkProfileController); 


// POST 
router.post('/createpost',uploadMiddleware.single('file'), controller.createPostController); 

router.get('/post', controller.getPostController); // get posts 

router.get('/post/:id', controller.getSiglePostController);  // get Single Post Router 


module.exports = router; 
