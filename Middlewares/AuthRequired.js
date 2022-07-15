const jwt = require('jsonwebtoken');
const db = require("../Database");

const AuthRequired = (userRole) => {

    return async (req , res , next) => {

        const token = req.headers['authorization'];
        
        if(!token){
            return res.status(401).send({error: 'Unauthenticated'});
        }

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
                
                // deselect the password from the user object

                let user = await db.users.findOne({
                    where: {
                        email: userObject.email
                    },
                    attributes: {
                        exclude: ['password']
                    }
                });

                // get the user's workspace
                const workspace = await db.workspaces.findOne({
                    where: {
                        owner_id: user.id
                    }
                });

                const userObjects = {
                    user: user,
                    workspace: workspace
                }

                if(!user){
                    return res.status(403).json({message: 'Unauthenticated'});
                }
            
                // if( roleMapper[user.role] < roleMapper[userRole] ){
                //     return res.status(403).send({error: 'You are not authorized'})
                // }
                
                req.user = userObjects;
                next();

            }catch(err){
                return res.status(401).send({error: 'Unauthenticateds'})
            }

        })

    }

}

module.exports = AuthRequired;