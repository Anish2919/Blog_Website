const User = require('../models/User');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const config = require('../config/default.json'); 

const mongoose = require('mongoose'); 
const { createNewError, checkCookiesFromTheResponse } = require('../helper/utils'); 


const fs = require('fs'); 
const PostModel = require('../models/Post');
const { response } = require('express');



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
            const newError = createNewError('User not Found! Please register first', 404); 
            throw newError;
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
 

// create new post Controller 
const createPostController = async(req, res) => {
    try{
        const {token} = req.cookies; 
        const {originalname, path} = req.file;
        const parts = originalname.split('.'); 
        const ext = parts[parts.length - 1]; 
        const newPath = path+'.'+ ext;
        fs.renameSync(path, newPath);
        
        const {title, summary, content} = req.body; 

        jwt.verify(token, config.JWT_SECRET, async (err, info) => {
            if(err) throw createNewError('Unauthorized token', 401); 

            const newPost = await PostModel.create({title, summary, content, author:info.id, cover: newPath}); 
            if(!newPost) {
                const postError = createNewError('Something wrong with the file!', 400); 
                throw postError; 
            } 
            res.status(201).json({msg:'Post created successfully.'}); 
        })

    } catch(error) {
        if(error && error.status && error.message) {
            return res.status(error.status).json({msg:error.message}); 
        }
        return res.status(500).json(error); 
    }
}

// get post controller 
const getPostController = async(req, res) => {
    try{
        const posts = await PostModel.find()
            .populate('author', 'username')
            .sort({createdAt:-1}) 
        return res.status(200).json({posts:posts}); 

    } catch(error) {
        if(error && error.status && error.message) {
            return res.status(error.status).json({msg:error.message}); 
        } 
        return res.status(500).json({msg:'Internal Server Error'}); 
    }
} 

// get single Post 
const getSiglePostController = async(req, res) => {
    try {
        // getting post id from params 
        const {id} = req.params; 
        
        // finding post by id
        const post = await PostModel.findById({_id:id}).populate('author', ['username']); 

        // if there is no post, create new error with 404 status code and throw
        if(!post) {
            const postError = createNewError('Post not found', 404); 
            throw postError; 
        }

        // if post is available return post details
        return res.status(200).json(post); 

    } catch (error) {
        // if there any custom error, return customer error code and message, else send internal server error. 
        if(error && error.status && error.message) {
            return res.status(error.status).json({msg: error.message}); 
        } else {
            return res.status(500).json({msg:'Internal Server Error!'}); 
        }
    }
}

const updatePostController = async(req, res) => {
    let newPath = null, oldCoverPhotoUrl = null;  
    const {id, title, summary, content } = req.body; 
    try {
        // if request has file, then save 
      if(req.file) {
        console.log(req.file); 
        const {originalname, path} = req.file; 
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1]; 
        newPath = path + '.' + ext; 
        fs.renameSync(path,newPath);  
      }
      
      // get token from the cookies 
      const {token} = req.cookies;  

      // verify token 
      await jwt.verify(token,config.JWT_SECRET, async(err, userInfo) => {
        if(err) throw createNewError('Unauthorized Error', 401); 

        // check if the postDoc is available 
        const postDoc = await PostModel.findById({_id: id});
        console.log('postDoc: ', postDoc) 

        if(!postDoc) throw createNewError('Post is not available.', 404);  

        // setting old cover photo url 
        if(newPath) {
            // delete old photo 
            oldCoverPhotoUrl = postDoc.cover; 
            fs.unlinkSync(oldCoverPhotoUrl); 
        }

        // checking if the Authors owns the post 
        const isAuthor = postDoc.author.toString() === userInfo.id.toString(); 
        console.log(isAuthor);  
        if(!isAuthor) throw createNewError('Author doesnot match the post author.', 401);  

        // if owns the post, update the post 
        const updatedPost = await postDoc.updateOne({
            title: title, 
            summary: summary, 
            content: content, 
            cover: newPath ? newPath : postDoc.cover, 
        }); 

        // checking if the update is complete and successfull. 
        if(updatedPost.modifiedCount <= 0 ) {
            throw createNewError('Something wrong with updating post.', 400); 
        }   

        // if update is successfull, delete old picture from the file 


        return res.status(200).json({msg: "Updated successfully."}); 
      }); 
    // 2. verify the post is available  
    // 3. verify the post author is correct 
    } catch (error) {
        if(error && error.status && error.message) {
            return res.status(error.status).json({msg: error.message}); 
        } else {
            return res.status(500).json({msg:'Internal Server Error!'}); 
        }
    }
}


const deletePostController = async(req, res) => {
    try {
        const {token} = req.cookies; 
        const {postId} = req.params; 
    
        // verify token 
        await jwt.verify(token, config.JWT_SECRET, async (err, userInfo) => {
            if(err) throw createNewError('Unauthorized user.', 401); 
    
            // check post availability 
            const postDoc = await PostModel.findById({_id:postId}); 
            if(!postDoc) throw createNewError('Post not found', 404); 

            // file path 
            const coverPhotoUrl = postDoc.cover; 

            // check post authority 
            const isAuthor = postDoc.author.toString() === userInfo.id; 
            if(!isAuthor) throw createNewError('User doesnot owns the post')

            // delete post 
            const deletePost = await postDoc.deleteOne({_id:postId}); 
            if(!deletePost) throw createNewError('No post found.', 404);  

            // delete cover photo from the upload 
            if(fs.readFileSync(deletePost.cover)) fs.unlinkSync(deletePost.cover);  

            return res.status(200).json({msg: 'Post deleted successfully'}); 
        })
    } catch (error) {
        if(error && error.status && error.message) {
            return res.status(error.status).json({msg: error.message}); 
        } else {
            return res.status(500).json({msg: error.message}); 
        }
    }

}

module.exports = {
    signUpUserController, 
    signInUserController,
    checkProfileController, 
    logoutController, 
    createPostController,
    getPostController, 
    getSiglePostController, 
    updatePostController, 
    deletePostController
}

