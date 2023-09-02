const express = require('express'); 

const controller = require('../controllers/UserControllers'); 
const verifyPayloads = require('../middleware/VerifyPayloads'); 

// config router 
const router = express.Router(); 


// register user 
router.post("/signup",verifyPayloads.verifyRegisterSchema, controller.signUpUserController); 

// login user 
router.post('/signin', controller.signInUserController); 


// GET Requests 
router.get('/test', (req, res) => {
    res.status(400).send('successfull get request.'); 
})


module.exports = router; 
