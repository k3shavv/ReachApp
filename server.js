//bring express 
const express=require('express');
//bringing the database
const connectDB=require('./config/db.js');



//connecting to database
connectDB();

//create an app
const app=express();

//Init body parser Middleware(this will be used for all routes)
//we need a body parsing middleware to parse the body of the request in some format(json,csv,xml)
app.use(express.json({extended:false}));




// setting the first route
//we will use postman for testing routes 
app.get('/',(req,res)=>{
res.send('API running');
})

//creating different files for storing routes
//we are making routes(same type) in a seperate file in the routes\api directory


//define routes
app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/post',require('./routes/api/post'));




const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));




