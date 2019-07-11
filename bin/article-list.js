const _ = require('lodash');
const { saveArticles } = require('../mysql/dbHelper');
const request = require('request');
const fs = require('fs');
const https = require('https');
const getFileNameByURL = require('../utils/getFileNameByURL');

const { ARTICLE_LIST_URL } = require('../config/constants');


const getArticleList = async () => {
  // 获取新闻列表
  await request(ARTICLE_LIST_URL, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let sourceList = JSON.parse(body).result.list;
      let articleList = [];
      sourceList.forEach(item => {
        articleList.push([
          item.sid,
          item.aid,
          item.title,
          item.inputtime,
          //本地路径
          `/images/${getFileNameByURL(item.thumb)}`,
          item.label,
          item.source,
          !_.startsWith(item.url_show, 'http:') ? 'http:' + item.url_show : item.url_show
        ])
      });
      saveImages(sourceList);
      saveArticles(articleList);
    }
  })
};

const saveImages = (list) => {

  let savePath = './public/images/';

  // 遍历已存在文件
  fs.readdir(savePath, (err, files) => {

    if (!err) {

      let needSaveList = [];
      if (!files || !files.length) {
        files = [];
      }

      list.forEach(({ thumb }) => {

        let name = getFileNameByURL(thumb);

        if (files.find(f => f.indexOf(name) > -1)) {
          // 已存在
          console.log(name, "已存在");
        } else {
          // 不存在
          needSaveList.push(thumb);
        }
      });

      if (needSaveList.length) {

        needSaveList.forEach(thumb => {

          let name = getFileNameByURL(thumb);

          //download && save
          https.get(thumb, (res) => {

            let imgData = '';
            res.setEncoding('binary');
            res.on("data", (chunk) => {
              imgData += chunk;
            });

            res.on("end", () => {
              // 写文件
              fs.writeFile(savePath + name, imgData, 'binary', err => {
                if (err) {
                  console.log('save-image-error', err);
                }
              })
            });
          })
        })
      }
    }
  });
};

module.exports = getArticleList;



