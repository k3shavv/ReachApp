//we need express router for putting routes in different files and then connecting them to the server file

const express=require('express');
//including the express router
//this creates a mini app
const router=express.Router();


//for verifying input data through forms
const {check,validationResult}=require('express-validator');

//bringing the user model
const User=require('../../models/User');

const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const config=require('config');



//we wont do app.get() or app.post() intead we'll use router and app.use in server.js to access respective routers

//@route    POST api/user
//desc      Register user
//access    public

const userRegvalidationRules=[
check('name','Name is required').not().isEmpty(),
check('email','Please include a valid email').isEmail(),
check('password','please enter a password with six or more character').isLength({min:6}),
 
]

router. post('/',userRegvalidationRules,async(req,res)=>{
    
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        //400:bad request
        return res.status(400).json({errors:errors.array()});
    }
    
    const {name,email,password}=req.body;

    try {
        // see if user already exist
        let user=await User.findOne({email:email});
        
        //if user exist
        if(user)
        {
            //process will end here with error
          return  res.status(400).json({errors:"user already exists"});

        }

        //get user Gravatar
        const avatar=gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        })

        // creating a new instance of user collection(this does not saves it to the database)
        user=new User({
            name,
            email,
            avatar,
            password
        }); 

        //encrypt password
        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(password,salt);

        await user.save();

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