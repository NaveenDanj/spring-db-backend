module.exports = (sequelize, Sequelize) => {
    const WorkspaceUsers = sequelize.define("workspace_users", {

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
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

        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
                onDelete: 'cascade'
            }
        },

        role: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isIn: [['owner', 'admin', 'user']],
                notEmpty: true,
                notNull: true
            }
        }
        

    });
    return Workspace;
};