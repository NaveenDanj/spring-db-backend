const express = require('express');
const db = require("../Database");
const router = express.Router();
const Joi = require('../Validator/index');

router.post('/add-user-workspace' , async (req ,res) => {
    
    let validator = Joi.object({
        email : Joi.string().email().required(),
        role : Joi.string().required().valid('admin', 'member'),
        apps : Joi.array().items(Joi.number().required()).required(),
        workspace_id : Joi.number().required()
    });

    try{

        let val = await validator.validateAsync(req.body , {
            abortEarly: false
        });

        // validate apps
        for(let i = 0; i < val.apps.length; i++){

            let app = await db.app.findOne({
                where : {
                    id : val.apps[i],
                    workspace_id : val.workspace_id
                }
            });

            if(!app){
                return res.status(400).json({
                    message : "App not found"
                });
            }

        }

        // validate workspace
        let workspace = await db.workspace_users.findOne({
            where : {
                workspace_id : val.workspace_id,
                user_id : req.user.user.id
            }
        });

        if(!workspace){
            return res.status(400).json({
                message : "Workspace not found"
            });
        }

        if(workspace.dataValues.role != 'admin' && workspace.dataValues.role != 'owner' ){
            return res.status(400).json({
                message : "You are not allowed to add users to this workspace"
            });
        }

        // validate user
        let user = await db.users.findOne({
            where : {
                email : val.email
            }
        });

        if(!user){
            return res.status(400).json({
                message : "User not found"
            });
        }

        // create user workspace
        let ret_user = await db.workspace_users.create({
            user_id : user.id,
            workspace_id : val.workspace_id,
            role : val.role
        });

        // add usert to apps
        for(let i = 0; i < val.apps.length; i++){
                
            let app = await db.app_users.create({
                app_id : val.apps[i],
                user_id : user.id
            });
    
        }

        return res.status(200).json({
            message : "User added to workspace",
            user : ret_user
        });

    }catch(err){
        return res.status(400).json({
            message : err.message
        });
    }

});


module.exports = router;