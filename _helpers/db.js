const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
require('dotenv').config();


module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    //const connection = await mysql.createConnection({ host, port, user, password });
    const connection = await mysql.createConnection({ 
        host: process.env.DB_HOST, 
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD, 
        port: process.env.DB_PORT
        });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE}\`;`);

    // connect to db
    const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, { dialect: 'mysql' });

    // init models and add them to the exported db object
    db.User = require('../users/user.model')(sequelize);

    db.Pic = require('../users/user_pic.model')(sequelize);

    // sync all models with database
    await sequelize.sync({ alter: true });
}