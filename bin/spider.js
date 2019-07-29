const getArticleList = require('./article-list');
const getWithoutContList = require('./content');
const cleaner = require('./cleaner');
require('../mysql/index');

const spiderList = async () => {
  await getArticleList();
};

const spiderContent = async () => {
  await getWithoutContList();
};

let spiderListTimmer = setInterval(spiderList, 1000 * 60 * 3);
let spiderContentTimmer = setInterval(spiderContent, 1000 * 60);
// let spiderTimmer = setInterval(start, 1000 * 5);

let cleanerTimmer = setInterval(() => {
  cleaner();
}, 1000 * 60 * 60 * 24);
