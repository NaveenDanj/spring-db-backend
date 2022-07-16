module.exports = (sequelize, Sequelize) => {
    const AppUser = sequelize.define("app_users", {

        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
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

        user_id : {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
                onDelete: 'cascade'
            }
        }

    });
    return AppUser;
};