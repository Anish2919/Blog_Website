const joi = require('joi'); 

//password pattern 
const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;


const registerSchema = joi.object({
    username:joi.string().min(4).max(20).required().messages({
        'string.min': 'Username must be at least 4 characters long',
        'string.max': 'Username cannot be longer than 20 characters', 
        'string.empty': 'Username is required'
    }),
    password: joi.string().required().min(5).pattern(passwordPattern).messages({
        'string.min': 'Password must be at least 5 character long', 
        'string.pattern.base':'Password must include at least one Uppsercase, lowercase, character and number', 
        'string.empty':'Password is rerquired', 
    })
}); 
const verifyRegisterSchema = async(req, res, next) => {
    try{
        // validate the sent body against the schema 
        const {error} = await registerSchema.validate(req.body); 
        console.log(error); 
        if(error) return res.status(400).json({msg: error.details[0].message}); 

        next(); 
    } catch(err) {
        return res.status(400).json({msg: 'Internal Server Error'}); 
    }
}


module.exports = {
    verifyRegisterSchema, 
}