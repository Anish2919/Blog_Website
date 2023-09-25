const express = require('express'); 
const app = express(); 

const cors = require('cors');  
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser'); 

const userRouter = require('./routes/UserRouter');  
const { handleTryCatch } = require('./middleware/TryCatchMiddleware');


app.use(cors({origin:'http://127.0.0.1:5173', credentials:true})); 
app.use(express.json()); 
app.use(cookieParser()); 

// public uploads folder 
app.use('/uploads', express.static(__dirname  + '/uploads'));  


// post 
const PORT = 5500; 
const MONGOOSE_PW = 'yo7Lr9l4ZFXLRDSo'; 
const MONGOOSE_URL = 'mongodb+srv://blog:yo7Lr9l4ZFXLRDSo@cluster0.d1s21io.mongodb.net/?retryWrites=true&w=majority'; 



app.use('/user', userRouter);  

// try catch middleware 
app.use(handleTryCatch); 


mongoose.connect(MONGOOSE_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log('App running in: ', PORT); 
        })
    })
    .catch(err => {
        console.log('errors: ', err); 
    })

// username and password/ mongoodb atlas  
// blog 
// yo7Lr9l4ZFXLRDSo 