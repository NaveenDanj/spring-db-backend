const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("../Models/User.model")(sequelize, Sequelize);
db.access_token = require("../Models/AccessToken.model")(sequelize, Sequelize);
db.workspaces = require("../Models/Workspace.model")(sequelize, Sequelize);
db.workspace_users = require("../Models/WorkspaceUser.model")(sequelize, Sequelize);
db.instance = require("../Models/Instance.model")(sequelize, Sequelize);
db.backup = require("../Models/Backup.model")(sequelize, Sequelize);
db.app = require("../Models/App.model")(sequelize, Sequelize);
module.exports = db;