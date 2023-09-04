import { config } from "../config/default.json";
import { createNewError } from "../helper/utils";
const jwt = require('jsonwebtoken'); 

 const checkCookies = (req, res, next) => {
    const {token} = req.cookies; 
    if(!token) {
        const newError = createNewError('Missing Token', 400); 
        throw newError; 
    } else {
        next(); 
    }
}  

// verify cookies 
const verifyCookiesAndToken = (req, res, next) => {
    const {token} = req.cookies; 
    jwt.verify(token, config.JWT_SECRET, (err, userInfo) => {
        if(err) {
            const newError = createNewError('Unauthorized token', 401); 
            throw newError; 
        } else {
            next(); 
        }
    })
}

module.exports = {
    checkCookies, 
    verifyCookiesAndToken, 
}

