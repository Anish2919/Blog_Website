
const handleTryCatch = async(req, res, next) => {
    try {
        next(); 
    } catch(error) {
        if(error && error.status && error.message) {
            return res.status(error.status).json({msg: error.message}); 
        } else {
            return res.status(500).json({msg:'Internal Server Error!'}); 
        }
    }
} 

module.exports = {
    handleTryCatch, 
}

