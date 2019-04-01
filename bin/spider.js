const cleaner = require('./cleaner');
const getArticleList = require('./article-list');
const getWithoutContList = require('./content');
require('../mysql/index');

const start = async () => {
  getArticleList();
  getWithoutContList();
};

let spiderTimmer = setInterval(start, 1000 * 60);

let cleanerTimmer = setInterval(() => {
  cleaner();
}, 1000);
