const express = require('express');
const db = require("../../Database");
const {
    hashPasswod,
    comparePassword
} = require('../../Services/hash.service');
const {
    generateToken
} = require('../../Services/token.service');
const User = db.users;
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

module.exports = router;