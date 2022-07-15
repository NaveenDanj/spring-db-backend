module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        fullname: {
            type: Sequelize.STRING,
            allowNull: false
        },

        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },

        password: {
            type: Sequelize.STRING,
            allowNull : false,
        }


        // title: {
        //     type: Sequelize.STRING,
        //     allowNull: false,
        //     validate: {
        //         notEmpty: true
        //     }
        // },
        // description: {
        //     type: Sequelize.STRING
        // },
        // published: {
        //     type: Sequelize.BOOLEAN
        // }
    });
    return User;
};