const { getArticles, getArticle, getArticlesCount } = require('../mysql/dbHelper');
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send({ status: 'success' })
  // res.render('index', { title: 'Express' });
});


router.get('/api/articles', function (req, res, next) {
  let { page = 1, pageSize = 15 } = req.query;
  getArticlesCount((total) => {
    getArticles(page, pageSize, (list) => {
      res.send({
        status: 'success',
        total,
        page,
        pageSize,
        list,
      })
    });
  })

});

router.get('/api/articles/:id', function (req, res, next) {
  let id = req.params.id;
  getArticle(id, (row) => {
    res.send({
      status: 'success',
      new: row
    })
  });
});

module.exports = router;
