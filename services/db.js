const mysql = require('mysql2');
require('dotenv').config();
const conn = mysql.createConnection({
    host: 'db-mysql-lon1-64334-do-user-13476731-0.b.db.ondigitalocean.com',  
    port: '25060',
    user: 'doadmin',
    password: 'AVNS_SZQJCJN3dyLY-mdI7Xy',
    database: 'birrama_db'
    
});

conn.connect((err)=> {
  if(err){
    console.log("Error connecting to the database: ", err);
    return;
  } 
  console.log("connected to the database");
});

module.exports = conn;

  /* host: 'localhost',
    user: 'root',
    password: 'Hab21@sql',
    database: 'asbeza_db'
     */