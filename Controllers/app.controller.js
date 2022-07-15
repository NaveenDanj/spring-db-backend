const express = require('express');
const db = require("../Database");
const AuthRequired = require("../Middlewares/AuthRequired");
const router = express.Router();
const Joi = require('../Validator/index');


router.post('/add' , (req , res) =>{

    let validator = Joi.object({
        app_name: Joi.string().required().min(6).max(255),
        app_api_key: Joi.string().required().min(6).max(255),
        app_description: Joi.string().required().min(6).max(255)
    });

    try {

        const val = validator.validateAsync(req.body, {
            abortEarly: false
        });

        let app = await db.app.create({
            name: val.app_name,
            api_key: val.app_api_key,
            description: val.app_description,
            workspace_id : 1
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