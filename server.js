//bring express 
const express=require('express');
//bringing the database
const connectDB=require('./config/db.js');


//connecting to database
connectDB();

//create an app
const app=express();



// setting the first route
//we will use postman for testing routes
app.get('/',(req,res)=>{
res.send('API running');
})


const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));




