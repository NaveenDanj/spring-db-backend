const jwt = require('jsonwebtoken');

module.exports = {

    generateToken(email){
        // expire in 30 days
        return jwt.sign(email , process.env.JWT_SECRET , {expiresIn: '30d'});
    }


};