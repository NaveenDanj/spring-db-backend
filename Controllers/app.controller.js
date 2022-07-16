const express = require('express');
const db = require("../Database");
const router = express.Router();
const Joi = require('../Validator/index');

const {
    generateAppToken
} = require('../Services/token.service');


router.get('/get-my-apps/:workspaceId', async (req, res) => {

    try {

        const app_users = await db.app_users.findAll({
            where: {
                user_id: req.user.user.id
            }
        });

        let ret_array = [];

        for (let i = 0; i < app_users.length; i++) {

            const app = await db.app.findOne({
                where: {
                    id: app_users[i].app_id,
                    workspace_id: req.params.workspaceId
                }
            });

            if (app) {
                ret_array.push({
                    app: app.dataValues,
                    app_user: app_users[i].dataValues
                });
            }

        }

        return res.status(200).json({
            apps: ret_array
        });


    } catch (err) {
        return res.status(400).json({
            message: err.message
        });
    }


});


router.post('/add', async (req, res) => {

    let validator = Joi.object({
        app_name: Joi.string().required().min(3).max(255),
        app_api_key: Joi.string().required().min(6).max(255),
        workspace_id: Joi.number().required()
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

        if (!workspace) {
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



        if (!workspaceUser) {
            return res.status(400).json({
                message: "You don't have access to this workspace"
            });
        }


        if (workspaceUser.dataValues.role != 'admin' && workspaceUser.dataValues.role != 'owner') {
            return res.status(400).json({
                message: "You don't have access to this workspace"
            });
        }

        // create the app
        let app = await db.app.create({
            name: val.app_name,
            app_api_key: val.app_api_key,
            workspace_id: val.workspace_id
        });

        // add the owner to the app
        await db.app_users.create({
            user_id: req.user.user.id,
            app_id: app.dataValues.id,
        });


        return res.status(200).json({
            message: "App added successfully",
            app: app
        });

    } catch (err) {
        return res.status(400).json({
            message: err.message
        });
    }

});


router.post('/add-users-to-app', async (req, res) => {

    let validator = Joi.object({
        user_ids: Joi.array().items(Joi.number()).required(),
        app_id: Joi.number().required()
    });

    try {

        let val = await validator.validateAsync(req.body, {
            abortEarly: false
        });

        // check if user id's are valid
        for (let i = 0; i < val.user_ids.length; i++) {

            let user = await db.users.findOne({
                where: {
                    id: val.user_ids[i]
                }
            });

            if (!user) {
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

        if (!app) {
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

        if (!workspace_users) {
            return res.status(400).json({
                message: "You don't have access to this workspace"
            });
        }

        if (workspace_users.dataValues.role != 'admin' && workspace_users.dataValues.role != 'owner') {
            return res.status(400).json({
                message: "You don't have access to this workspace"
            });
        }

        // add users to app
        for (let i = 0; i < val.user_ids.length; i++) {

            // check if user is already added to the app
            let app_user = await db.app_users.findOne({
                where: {
                    app_id: val.app_id,
                    user_id: val.user_ids[i]
                }
            });

            if (!app_user) {
                let user = await db.app_users.create({
                    app_id: val.app_id,
                    user_id: val.user_ids[i]
                });
            }


        }


        return res.status(200).json({
            message: "Users added to app successfully"
        });

    } catch (err) {

        return res.status(400).json({
            message: err.message
        });

    }

});


router.delete('/remove-app-users/:userId/:appId', async (req, res) => {

    try {

        // check if user id is valid
        let user = await db.users.findOne({
            where: {
                id: req.params.userId
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        // check if app id is valid
        let app = await db.app.findOne({
            where: {
                id: req.params.appId
            }
        });

        if (!app) {
            return res.status(400).json({
                message: "App not found"
            });
        }

        // check if user is in the app
        let app_user = await db.app_users.findOne({
            where: {
                user_id: req.params.userId,
                app_id: req.params.appId
            }
        });

        if (!app_user) {
            return res.status(400).json({
                message: "User not found in the app"
            });
        }

        // check if app is owned by the user
        let workspace_users = await db.workspace_users.findOne({
            where: {
                workspace_id: app.dataValues.workspace_id,
                user_id: req.user.user.id
            }
        });

        if (!workspace_users) {
            return res.status(400).json({
                message: "You don't have access to this workspace"
            });
        }

        if (workspace_users.dataValues.role != 'admin' && workspace_users.dataValues.role != 'owner') {
            return res.status(400).json({
                message: "You don't have access to this workspace"
            });
        }


        // remove user from the app
        await db.app_users.destroy({
            where: {
                user_id: req.params.userId,
                app_id: req.params.appId
            }
        });

        return res.status(200).json({
            message: "User removed from app successfully"
        });

    } catch (err) {

        return res.status(400).json({
            message: err.message
        });


    }



});

router.put('/update/:appId', async (req, res) => {

    let validator = Joi.object({
        app_name: Joi.string().required(),
        app_api_key: Joi.string().required(),
    });

    try {

        let val = await validator.validateAsync(req.body, {
            abortEarly: false
        });

        await checkAuthority(req, res);

        // update the app detail
        let updated_app = await db.app.update({
            name: val.app_name,
            app_api_key: val.app_api_key
        }, {
            where: {
                id: req.params.appId
            }

        });

        return res.status(200).json({
            message: "App details updated successfully",
            app: updated_app
        });


    } catch (err) {

        return res.status(400).json({
            message: err.message
        })

    }

});


router.post('/generate-key/:appId', async (req, res) => {

    try {

        await checkAuthority(req, res);

        // generate api key
        return res.status(200).json({
            message: "App api key generated successfully",
            app_api_key: generateAppToken()
        });

    } catch (err) {

        return res.status(400).json({
            message: err.message
        });

    }


});


const checkAuthority = (req, res) => {

    return new Promise(async (resolve, reject) => {

        try {

            // check if app id is valid
            let app = await db.app.findOne({
                where: {
                    id: req.params.appId
                }
            });

            if (!app) {
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


            if (!workspace_users) {
                return res.status(400).json({
                    message: "You don't have access to this workspace"
                });
            }

            if (workspace_users.dataValues.role != 'admin' && workspace_users.dataValues.role != 'owner') {
                return res.status(400).json({
                    message: "You don't have access to this workspace"
                });
            }

            resolve(true);

        } catch (err) {
            reject(err);
        }


    });



}


module.exports = router;