module.exports = (sequelize, Sequelize) => {
    const Instance = sequelize.define("instance", {

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate : {
                notEmpty: true,
                notNull: true,
                isIn: [['FREE', 'STARTER' , 'PRO' , 'UNLIMITED']],
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

        owned_by: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
                onDelete: 'cascade'
            }
        },

        bandwidth : {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate : {
                notEmpty: true,
                notNull: true,
                isIn: [[500 , 1024 , 10240 , -1]],
            }
        },

        database : {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate : {
                notEmpty: true,
                notNull: true,
                isIn: [[1 , 3 , 5 , -1]],
            }
        },

        user_account : {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate : {
                notEmpty: true,
                notNull: true,
                isIn: [[1 , 5 , 10 , -1]],
            }
        },

        disk_space : {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate : {
                notEmpty: true,
                notNull: true,
                isIn: [[1024 , 5024 , 15000 , 25000]],
            }
        },

        backup_count : {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate : {
                notEmpty: true,
                notNull: true,
                isIn: [[20 , 30 , 60 , -1]],
            }
        }

    });
    
    return Instance;
};