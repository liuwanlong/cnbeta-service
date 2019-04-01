let mysql = require('mysql');

let db = {};
let pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'lwl951006',
  database: 'cnbeta'
});

db.query = (sql, params = [], callback) => {
  pool.getConnection((error, connection) => {
    if (error) {
      console.log(error);
    } else {
      connection.query(sql, params, (err, rows, fields) => {
        if (err) {
          console.log(err);
          return;
        }
        connection.release();
        callback(rows, fields);
      })
    }
  })
};

module.exports = db;





