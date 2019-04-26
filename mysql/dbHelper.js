const db = require('./index');
const parseSQLRows = require('../utils/parseSQLRows');

//save

const saveArticles = (params) => {
  const insertSql = 'INSERT INTO articles(sid,aid,title,inputtime,thumb,label,url_show) VALUES ? ON DUPLICATE KEY UPDATE aid=VALUES(aid)';
  db.query(insertSql, [params], (rows) => {
    console.log(rows);
  })
};

const selectWithoutCont = (callback) => {
  const sql = 'SELECT * FROM articles WHERE content is NULL';
  db.query(sql, [], (rows) => {
    if (rows && rows.length) {
      callback(parseSQLRows(rows))
    }
  })
};

const saveContent = (params) => {
  const sql = 'UPDATE articles SET content = ? WHERE sid = ?';
  db.query(sql, params, (rows) => {
    console.log(rows);
  })
};


//select

const getArticles = (callback) => {
  const sql = 'SELECT sid, aid, title, inputtime, thumb, label FROM articles WHERE content is not NULL ORDER BY sid DESC LIMIT 15';
  db.query(sql, [], (rows) => {
    callback(parseSQLRows(rows))
  })
};

const getArticle = (params, callback) => {
  const sql = 'SELECT * FROM articles WHERE sid = ?';
  db.query(sql, params, (rows) => {
    callback(parseSQLRows(rows[0]))
  })
};

// delete
const deleteTwoWeeksAgo = () => {
  const sql = `DELETE FROM articles where DATE_SUB(CURDATE(), INTERVAL 14 DAY) >= date(inputtime)`;
  db.query(sql, [], () => {
  })
}




module.exports = {
  saveArticles,
  selectWithoutCont,
  saveContent,

  getArticles,
  getArticle,

  deleteTwoWeeksAgo
}