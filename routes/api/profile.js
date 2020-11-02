const express=require('express');
//including the express router
//this creates a mini app
const router=express.Router();


//we wont do app.get() or app.post() intead we'll use router and app.use in server.js to access respective routers

//@route    GET api/profile
//desc      test route
//access    public
router.get('/',(req,res)=>{res.send('profile route');});


module.exports=router;