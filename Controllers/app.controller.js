const express = require('express');
const db = require("../Database");
const router = express.Router();
const Joi = require('../Validator/index');


router.post('/add' , async(req , res) =>{

    let validator = Joi.object({
        app_name: Joi.string().required().min(3).max(255),
        app_api_key: Joi.string().required().min(6).max(255),
        workspace_id : Joi.number().required()
    });

    try {

        const val = await validator.validateAsync(req.body, {
            abortEarly: false
        });

        // check if workspace is valid and have access to the user
        const workspace = await db.workspaces.findOne({
            where: {
                id: val.workspace_id
            }
        });

        if(!workspace){
            return res.status(400).json({
                message: "Workspace not found"
            });
        }

        const workspaceUser = await db.workspace_users.findOne({
            where: {
                workspace_id: val.workspace_id,
                user_id: req.user.user.id
            }
        });



        if(!workspaceUser){
            return res.status(400).json({
                message: "You don't have access to this workspace"
            });
        }


        if(workspaceUser.dataValues.role != 'admin' && workspaceUser.dataValues.role != 'owner'){
            return res.status(400).json({
                message: "You don't have access to this workspace"
            });
        }

        // create the app
        let app = await db.app.create({
            name: val.app_name,
            app_api_key : val.app_api_key,
            workspace_id : val.workspace_id
        });


        return res.status(200).json({
            message: "App added successfully",
            app : app
        });

    } catch (err) {
        return res.status(400).json({
            message: err.message
        });
    }

});


router.post('/add-users-to-app' , async(req , res) => {

    let validator = Joi.object({
        user_ids: Joi.array().items(Joi.number()).required(),
        app_id: Joi.number().required()
    });

    try{

        let val = await validator.validateAsync(req.body, {
            abortEarly: false
        });
        
        // check if user id's are valid
        for(let i = 0; i < val.user_ids.length; i++ ){

            let user = await db.users.findOne({
                where: {
                    id: val.user_ids[i]
                }
            });

            if(!user){
                return res.status(400).json({
                    message: "User not found"
                });
            }

        }

        // check if app id is valid
        let app = await db.app.findOne({
            where: {
                id: val.app_id
            }
        });

        if(!app){
            return res.status(400).json({
                message: "App not found"
            });
        }

        // check if app is owned by the user
        let workspace_users = await db.workspace_users.findOne({
            where: {
                workspace_id: app.dataValues.workspace_id,
                user_id: req.user.user.id
            }
        });
        
        if(!workspace_users){
            return res.status(400).json({
                message: "You don't have access to this workspace"
            });
        }

        if(workspace_users.dataValues.role != 'admin' && workspace_users.dataValues.role != 'owner'){
            return res.status(400).json({
                message: "You don't have access to this workspace"
            });
        }

        // add users to app
        for(let i = 0; i < val.user_ids.length; i++ ){

            // check if user is already added to the app
            let app_user = await db.app_users.findOne({
                where: {
                    app_id: val.app_id,
                    user_id: val.user_ids[i]
                }
            });

            if(!app_user){
                let user = await db.app_users.create({
                    app_id: val.app_id,
                    user_id: val.user_ids[i]
                });
            }


        }


        return res.status(200).json({
            message: "Users added to app successfully"
        });

    }catch(err){

        return res.status(400).json({
            message: err.message
        });

    }

});

module.exports = router;