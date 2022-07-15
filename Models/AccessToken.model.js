module.exports = (sequelize, Sequelize) => {
    const AccessToken = sequelize.define("access_token", {

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        token: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: [1, 1024]
            }
        },

        blocked: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }


    });
    return AccessToken;
};