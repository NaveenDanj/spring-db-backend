const express = require('express');
const db = require("../../Database");
const AuthRequired = require("../../Middlewares/AuthRequired");
const {
    hashPasswod,
    comparePassword
} = require('../../Services/hash.service');
const {
    generateToken,
    generateAppToken
} = require('../../Services/token.service');
const User = db.users;
const AccessToken = db.access_token;
const router = express.Router();
const Joi = require('../../Validator/index');


router.post('/register', async (req, res) => {

    let validator = Joi.object({
        email: Joi.string().email().required(),
        fullname: Joi.string().required().min(6).max(255),
        password: Joi.string().required().min(6).max(255),
        repeat_password: Joi.ref('password')
    });

    try {

        const val = await validator.validateAsync(req.body, {
            abortEarly: false
        });
        let user = await User.findOne({
            where: {
                email: val.email
            }
        });

        if (user) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await hashPasswod(val.password);

        user = await User.create({
            email: val.email,
            fullname: val.fullname,
            password: hashedPassword
        });

        // create a workspace for the user
        const workspace = await db.workspaces.create({
            name: user.fullname +  "'s workspace",
            owner_id: user.id,
            workspace_api_key : generateAppToken()
        });

        // create a workspace user for the user
        await db.workspace_users.create({
            user_id: user.id,
            workspace_id: workspace.id,
            role: "owner"
        });

        // create a default instance for the user
        await db.instance.create({
            name: "FREE",
            workspace_id: workspace.id,
            owned_by : user.id,
            bandwidth : 500,
            database : 1,
            user_account : 1,
            disk_space : 1024,
            backup_count : 20
        });


        return res.status(201).json({
            message: "User created successfully",
            user: user
        });


    } catch (err) {
        return res.status(400).json({
            message: err.message
        });
    }
});


router.post('/login', async (req, res) => {

    let validator = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6).max(255)
    });

    try {

        const val = await validator.validateAsync(req.body, {
            abortEarly: false
        });
        let user = await User.findOne({
            where: {
                email: val.email
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "Email or password is incorrect"
            });
        }

        const isValid = await comparePassword(val.password, user.password);

        if (!isValid) {
            return res.status(400).json({
                message: "Email or password is incorrect"
            });
        }

        // Generate token
        const token = generateToken(user.email);

        // Save token to database
        await AccessToken.create({
            token: token,
            user_id: user.id
        });

        return res.status(200).json({
            message: "Login successful",
            user: user,
            token: token
        });

    } catch (err) {
        return res.status(400).json({
            message: err.message
        });
    }

});

router.get('/me' , AuthRequired('User') ,  async(req , res) => {

    try{

        return res.status(200).json({
            user: req.user
        });

    }catch(err){
        return res.status(400).json({
            message: err.message
        });
    }

});

router.get('/user-workspaces' , AuthRequired('User') , async(req , res) => {

    try{

        // get all workspaces of the user
        const workspaces = await db.workspace_users.findAll({
            where: {
                user_id: req.user.user.id
            }
        });

        // get the workspace details
        let ret_array = [];
        for(let i = 0; i < workspaces.length; i++){

            const workspace_details = await db.workspaces.findOne({
                where: {
                    id: workspaces[i].workspace_id
                }
            });

            ret_array.push({
                workspace : workspaces[i],
                workspace_details: workspace_details.dataValues,
            });

        }

        return res.status(200).json({
            workspaces: ret_array
        });


    }catch(err){
        return res.status(400).json({
            message: err.message
        });
    }


});

module.exports = router;