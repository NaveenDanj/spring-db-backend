module.exports = (sequelize, Sequelize) => {
    const ErrorLog = sequelize.define("error_log", {

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        app_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'apps',
                key: 'id',
                onDelete: 'cascade'
            }
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

        error_message: {
            type: Sequelize.STRING,
            allowNull: false
        },

    });
    return ErrorLog;
};