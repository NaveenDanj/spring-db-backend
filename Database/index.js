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

console.log('the db config is : ' , dbConfig);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("../Models/User.model")(sequelize, Sequelize);
module.exports = db;