const mysql = require('mysql');
require('dotenv').config();
const conn = mysql.createConnection({
   
    host: 'localhost',
    user: 'root',
    password: 'Hab21@sql',
    database: 'asbeza_db'
    
   /*
    host: process.env.Host,
    user: process.env.User,
    password: process.env.Password,
    database: process.env.Database,
    port: process.env.Port
    */
});

conn.connect();

module.exports = conn;