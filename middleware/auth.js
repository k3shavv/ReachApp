const jwt=require('jsonwebtoken');
const config=require('config');
module.exports=function(req,res,next){

//get token from header
const token=req.header('x-auth-token');


//check if token exists 
if(!token)
{
    //401:no authorization
    return res.status(401).json({msg:"no Token ,authorization denied"});

}

//verify token
try {

    //decoding the token 
    const decoded=jwt.verify(token,config.get('jwtSecret'));
    // after decoding we have the passed in paload which is the user id in this case

    // setting the req.user to decoded.user so that we can use req.user in any protected routes
    req.user=decoded.user;
    next();
} catch (error) {
    
    res.status(401).json({msg:"token is not valid"});

}



}