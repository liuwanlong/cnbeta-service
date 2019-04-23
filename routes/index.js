const { getArticles, getArticle } = require('../mysql/dbHelper');
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send({status: 'success'})
  // res.render('index', { title: 'Express' });
});


router.get('/articles', function (req, res, next) {
  getArticles((list) => {
    res.send({
      status: 'success',
      list
    })
  });
});

router.get('/articles/:id', function (req, res, next) {
  let id = req.params.id;
  getArticle(id, (row) => {
    res.send({
      status: 'success',
      new: row
    })
  });
});

module.exports = router;
