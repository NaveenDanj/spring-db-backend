const jwt = require('jsonwebtoken');
const db = require("../Database");

const AuthRequired = (userRole) => {

    return async (req , res , next) => {

        const token = req.headers['authorization'];
        
        if(!token){
            return res.status(401).send({error: 'Unauthenticated'});
        }

        // in future check if token is in blacklist(logged out before token expired)
        try{

            let checkExists = await db.access_token.findOne({
                where: {
                    token: token
                }
            });
            
            if(!checkExists){
                return res.status(401).send({error: 'Unauthenticated'})
            }

            if(checkExists.blocked){
                return res.status(401).send({error: 'Unauthenticated'})
            }

        }catch(err){
            return res.status(401).send({error: 'Unauthenticated'})
        }
        

        jwt.verify(token, process.env.JWT_SECRET, async(err, userObject) => {
        
            if (err) return res.status(403).json({message: 'Unauthenticated'});
        
            try{
                let user = await User.findOne({email : userObject.email}).select('-password');

                if(!user){
                    return res.status(403).json({message: 'Unauthenticated'});
                }
            
                // if( roleMapper[user.role] < roleMapper[userRole] ){
                //     return res.status(403).send({error: 'You are not authorized'})
                // }

                req.user = user;
                next();

            }catch(err){
                return res.status(401).send({error: 'Error while finding user'})
            }

        })

    }

}

module.exports = AuthRequired;