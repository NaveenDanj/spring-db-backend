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
            validate: {
                length: {
                    args: [6, 255],
                    msg: "Password must be at least 6 characters long"
                }
            }
        }

    });
    return User;
};