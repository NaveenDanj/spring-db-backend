module.exports = (sequelize, Sequelize) => {
    const Backup = sequelize.define("backups", {

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        instance_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'instances',
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

        app_id : {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'apps',
                key: 'id',
                onDelete: 'cascade'
            }
        },

        backup_path : {
            type: Sequelize.STRING,
            allowNull: false
        },

        backup_status: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isIn: [['completed', 'failed']],
                notEmpty: true,
                notNull: true
            }
        },

    });
    return Backup;
};