module.exports = (sequelize, Sequelize) => {
    const Workspace = sequelize.define("workspace", {

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
            allowNull : false
        }

    });
    return Workspace;
};