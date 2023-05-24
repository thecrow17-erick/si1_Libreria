import {Sequelize} from 'sequelize';
import {config} from 'dotenv';

config({path: '.env'})

const db = new Sequelize(process.env.NAMEDATABASE, process.env.USERNAMEDB, process.env.DBPASSWORD,{
    host: process.env.HOST,
    port: 3306,
    dialect: 'mysql'
});

export default db;