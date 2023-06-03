const mysql = require('mysql2');
require('dotenv').config();
//const conn = mysql.createConnection({
const pool = mysql.createConnection({
    host: process.env.Host,  
    port: process.env.Port,
    user: process.env.User,
    password: process.env.Password,
    database: process.env.Database,
    connectionLimit:50, // Adjust the connection limit as per your needs
    waitForConnections: true,
    queueLimit: 0 
    
});

/* conn.connect((err)=> {
  if(err){
    console.log("Error connecting to the database: ", err);
    return;
  } 
  console.log("connected to the database");
}); */
conn = pool.promise();

module.exports = conn;
