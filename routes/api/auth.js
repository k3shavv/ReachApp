const express=require('express');
//including the express router
//this creates a mini app
const router=express.Router();

const User=require('../../models/User')
const auth=require('../../middleware/auth');
const config=require('config');
const {check,validationResult}=require('express-validator');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs')



//we wont do app.get() or app.post() intead we'll use router and app.use in server.js to access respective routers

//@route    GET api/auth
//desc      test route  
//access    private
router.get('/',auth,async (req,res)=>{
try {
    const user=await User.findById(req.user.id).select('-password');
    res.json(user);    
} catch (error) {
    res.status(500).send('server error');
}


});


//@route    POST api/auth
//desc      Login user & get token
//access    public

const userRegvalidationRules=[
    check('email','Please include a valid email').isEmail(),
    check('password','Password is required').exists(),
    ]
    
    router. post('/',userRegvalidationRules,async(req,res)=>{
        
        const errors=validationResult(req);
        if(!errors.isEmpty())
        {
            //400:bad request
            return res.status(400).json({errors:errors.array()});
        }
        
        const {email,password}=req.body;
    
        try {
            // see if user already exist
            let user=await User.findOne({email:email});
            
            //if user exist
            if(!user)
            {
                //process will end here with error
              return  res.status(400).json({errors:"Invalid Credentials"});
    
            }

            //check password
            const isMatch=await bcrypt.compare(password,user.password);
            if(!isMatch){
              return  res.status(400).json({errors:"Invalid Credentials"});

            }

            
            //return json webtoken (we want the users to get logged as soon as he registers)
            // passing the user id as the payload
            const payload={
                user:{
                    id:user.id
                }
    
            }
            jwt.sign(payload,config.get('jwtSecret'),{expiresIn:36000},(err,token)=>{
    
                if(err)throw err;
                res.json({token});   
    
            });
             
            
        } catch (error) {
            
            console.error(error.message);
            //500:server error
            res.status(500).send('server error');
        }
    
    });


module.exports=router;