const mysql = require('mysql2');
require('dotenv').config();
const conn = mysql.createConnection({
    host: process.env.Host,  
    port: process.env.Port,
    user: process.env.User,
    password: process.env.Password,
    database: process.env.Database 
    
});

conn.connect((err)=> {
  if(err){
    console.log("Error connecting to the database: ", err);
    return;
  } 
  console.log("connected to the database");
});

module.exports = conn;
