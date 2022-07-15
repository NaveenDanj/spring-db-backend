const express = require('express');
const db = require("../Database");
const AuthRequired = require("../Middlewares/AuthRequired");
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

        console.log('data' , workspaceUser.dataValues);

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

module.exports = router;