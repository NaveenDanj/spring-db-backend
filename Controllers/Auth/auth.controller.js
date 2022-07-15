const express = require('express');
const db = require("../../Database");
const {hashPasswod , comparePassword} = require('../../Services/hash.service'); 
const User = db.users;
const router = express.Router();


router.post('/', (req, res) => {

    let validator = Joi.object({
        email : Joi.string().email().required(),
        fullname : Joi.string().required().min(6).max(255),
        password : Joi.string().required().min(6).max(255),
        repeat_password : Joi.ref('password')
    });

    try{

        const val = await validator.validateAsync(req.body , {abortEarly : false});
        let user = await User.findOne({where : {email : val.email}});

        if(user){
            res.status(400).json({
                message : "User already exists"
            });
        }

        const hashedPassword = await hashPasswod(val.password);

        user = await User.create({
            email : val.email,
            fullname : val.fullname,
            password : hashedPassword
        });

        res.status(201).json({
            message : "User created successfully",
            user : user
        });
        
        
    }catch(err){
        res.status(400).json({
            message : err.message
        });
    }
});

module.exports = router;