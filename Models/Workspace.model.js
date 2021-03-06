module.exports = (sequelize, Sequelize) => {
    const Workspace = sequelize.define("workspace", {

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        owner_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
                onDelete: 'cascade'
            }
        },

        workspace_api_key: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
        

    });
    return Workspace;
};