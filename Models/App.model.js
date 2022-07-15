module.exports = (sequelize, Sequelize) => {
    const App = sequelize.define("apps", {

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: Sequelize.STRING,
            allowNull: false
        },

        workspace_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'workspaces',
                key: 'id',
                onDelete: 'cascade'
            }
        },

        app_api_key: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },

    });
    return App;
};