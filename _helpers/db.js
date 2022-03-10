const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
require('dotenv').config();


module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
   // const { host, port, user, password, database } = config.database;
    //const connection = await mysql.createConnection({ host, port, user, password });
    console.log(process.env.DB_HOST);
    console.log(process.env.DB_USERNAME);
    console.log(process.env.DB_PASSWORD);
    console.log(process.env.DB_PORT);
    const connection = await mysql.createConnection({ 
        host: process.env.DB_HOST, 
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD, 
        port: process.env.DB_PORT
        });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE}\`;`);

    // connect to db
    const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        host : process.env.DB_HOST,
        dialectOptions: {
            ssl: 'Amazon RDS'
        },
        dialect : 'mysql',
        replication:{
            read :[
                {host: process.env.DB_HOST, username: process.env.DB_USERNAME, password:process.env.DB_PASSWORD}
            ],
            write : {host : process.env.DB_HOST,username:process.env.DB_USERNAME, password:process.env.DB_PASSWORD}
        },
        pool : {
            max : 5,
            min : 0,
            acquire : 30000,
            idle : 10000 
        }
    });

    // init models and add them to the exported db object
    db.User = require('../users/user.model')(sequelize);

    db.Pic = require('../users/user_pic.model')(sequelize);

    // sync all models with database
    await sequelize.sync({ alter: true });
}