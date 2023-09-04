const User = require('../models/User');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const config = require('../config/default.json'); 

const mongoose = require('mongoose'); 
const { createNewError, checkCookiesFromTheResponse } = require('../helper/utils');



const signUpUserController = async(req, res) => {
    // start transition 
    const session = await mongoose.startSession(); 
    session.startTransaction(); 

    try{
        const {username, password} = req.body; 

    // checking if the user already exists 
    const existingUser = await User.findOne({username}); 

    // if user exist return with error message 
    if(existingUser) {
        return res.status(400).json({msg: `User with the ${username} already exists.`}); 
    }

    // // hasing password using bcrypt 
    const hashedPassword = await bcrypt.hashSync(password, config.SALT); 

    // bcrypt.genSalt(10, function(err, salt) {
    //     bcrypt.hash(password, salt, function(err, hash) {
    //         console.log('hash: ', hash)
    //     });
    // });
  
    const newUser = await User.create({username, password:hashedPassword}); 

    // // create token 
    // const token = await jwt.sign({
    //     username:username, 
    //     _id: newUser._id
    // }, config.JWT_SECRET, {expiresIn:"1h"});
    
    // commit transition and end session  
    await session.commitTransaction(); 
    session.endSession(); 
    
    res.status(201).json({msg:'successfully registered.'}); 
    } catch(error) {
        // aboart transition and end session 
        await session.abortTransaction(); 
        session.endSession(); 

        res.status(400).send('internal server error'); 
    }
} 


// LOGIN USER 
const signInUserController = async(req, res) => {
    try{
        const {username, password} = req.body; 
        // check if user is available 
        const userDoc = await User.findOne({username}); 
        if(!userDoc) {
            const userNotFoundError = new Error('User not Found!'); 
            userNotFoundError.status = 404; 
            throw userNotFoundError; 
        }
        const checkPwd = bcrypt.compareSync(password, userDoc.password); 
        if(checkPwd) {
            jwt.sign({
                username:username, 
                id: userDoc._id, 
            }, config.JWT_SECRET, {expiresIn:'1h'}, function(err, token) {
                if(err) throw err; 

                res.cookie('token', token, {
                    secure: true, // Set to true when using HTTPS
                    sameSite: 'none', // Specify the SameSite attribute
                }).json({msg:'Successfully Logged In', id:userDoc._id, username:username}); 
            });  
        } else {
            return res.status(400).json({msg:'Password doesnot match.'})
        }
    } catch(error) {
        if(error.status === 404) {
            return res.status(404).json({msg:error.message})
        }
        res.status(500).json({msg:'Internal Server Error'}); 
    }
}

const checkProfileController = async(req, res) => { 
    try{
        const {token} = req.cookies ;  
        if(!token) {
            const newError = await createNewError('Token missing.', 400); 
            throw newError; 
        }
    
        jwt.verify(token, config.JWT_SECRET, (err, info) => {
            if(err) throw createNewError('Unauthorized token', 401); 
            res.json(info); 
        })
    } catch(err) {
        if(err.status && err.message) {
            return res.status(err.status).json({msg:err.message}); 
        } else {
            return res.status(500).json({msg: 'Internal Server Error!'}); 
        }
    }
}

// logout controller 
const logoutController = async (req, res) => {
    try{
        await checkCookiesFromTheResponse(req); 
        res.cookie('token', '', {
            secure:true, 
            sameSite:'none'
        }).json('ok'); 
    } catch(err) {
        if(err.status && err.message) {
            return res.status(err.status).json({msg:err.message})
        } else {
            return res.status(500).json({msg:'Internal Server Error!'}); 
        }
    }
}

module.exports = {
    signUpUserController, 
    signInUserController,
    checkProfileController, 
    logoutController, 
}