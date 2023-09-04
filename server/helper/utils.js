const createNewError = (msg, statusCode) => {
    const newError = new Error(msg); 
    newError.status = statusCode; 
    return newError; 
} 

const checkCookiesFromTheResponse = (req) => {
    const {token} = req.cookies; 
    if(!token) {
        const newError = createNewError('Missing Token', 400); 
        throw newError; 
    } 
}  


module.exports = {
    createNewError, 
    checkCookiesFromTheResponse, 
}