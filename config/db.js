//we are making our mongo db connection on a seperate file

const mongoose=require('mongoose');
//config is a package which is used to store global variable
const config=require('config');

// bringing the MongoURI
const db=config.get('mongoURI');

//function for connecting to database (this connect function returns a promise so we will use async-await)
const connectDB=async ()=>{
    try {
        await mongoose.connect(db,{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true});
        console.log('mongoDB connected');

    } catch (error) {
        console.error(err.message);
        //exit process with failure  
        process.exit(1); 
    }   
}


//exporting so that we can use this in other files
module.exports=connectDB;


