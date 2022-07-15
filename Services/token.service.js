const jwt = require('jsonwebtoken');
const Uuid = require('uuid');

module.exports = {

    generateToken(email){
        // expire in 30 days
        return jwt.sign( {email : email} , process.env.JWT_SECRET , {expiresIn: '30d'});
    },

    generateAppToken(){
        return Uuid.v4();
    }


};