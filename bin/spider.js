const cleaner = require('./cleaner');
const getArticleList = require('./article-list');
const getWithoutContList = require('./content');
require('../mysql/index');

const start = async () => {
    await getArticleList();
    getWithoutContList();
};

let spiderTimmer = setInterval(start, 1000 * 60 * 3);
// let spiderTimmer = setInterval(start, 1000 * 5);

let cleanerTimmer = setInterval(() => {
    cleaner();
}, 1000 * 60 * 60 * 24);
