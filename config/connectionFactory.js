let mysql = require('mysql')

var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.connect(err => {
    if (err) throw err

 })
connection.query('USE ' + dbconfig.database);
  
module.exports = connection;