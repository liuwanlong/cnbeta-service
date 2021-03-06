const _ = require('lodash');
const { selectWithoutCont, saveContent } = require('../mysql/dbHelper');
const request = require('request');
const fs = require('fs');
const https = require('https');
const http = require('http');
const cheerio = require('cheerio');
const getFileNameByURL = require('../utils/getFileNameByURL');


const styleReg = {
  reg: / style="[^"]*"/g,
  replace: '',
};

const scriptReg = {
  reg: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/ig,
  replace: '',
};

const getWithoutContList = () => {
  // 没有content的news
  selectWithoutCont((list) => {
    list.forEach(item => {
      getContent(item);
    })
  });
};


const getContent = async (item) => {
  await request(item.url_show, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(body, {
        decodeEntities: false
      });
      // const serverAssetPath = process.env.NODE_ENV === 'production' ?
      //   `<img src="https://api.battleangel.online/images/` :
      //   `<img src="http://localhost:3001/images/`;
      const serverAssetPath = `<img src="https://api.battleangel.online/images/`;
      const srcReg = /<img [^>]*src=[\'\"]?([^\'\"]*)\//g;

      $('.cnbeta-article-body .article-summary .topic a').removeAttr('href');
      $('.cnbeta-article-body .article-summary .topic a').removeAttr('target');
      let html = `<div class="article-summary">${$('.cnbeta-article-body .article-summary').html()}</div><div class="article-content">${$('.cnbeta-article-body .article-content').html()}</div>`;
      // 保存源图片路径
      let imgList = [];
      // 获取content中所有图片src
      $('.cnbeta-article-body .article-summary img,.cnbeta-article-body .article-content img').each((index, dom) => {
        let src = dom.attribs.src;
        imgList.push(src);
      });
      // 过滤style、script，替换图片src
      let content = html
        .replace(styleReg.reg, styleReg.replace)
        .replace(scriptReg.reg, scriptReg.replace)
        .replace(srcReg, serverAssetPath)
        .replace(/[\r\n]/g, "")
        .replace(/(^\s*)|(\s*$)/g, "");

      //保存content
      saveContent([content, item.sid]);

      // 保存图片
      if (imgList && imgList.length) {
        saveImages(imgList);
      }
    }
  })
};


const saveImages = (list) => {

  let savePath = './public/images/';

  //遍历已存在文件
  fs.readdir(savePath, (err, files) => {

    if (!err) {

      let needSaveList = [];

      if (!files || !files.length) {
        files = [];
      }

      list.forEach(thumb => {

        let name = getFileNameByURL(thumb);

        if (files.find(f => f.indexOf(name) > -1)) {
          //已存在
          console.log(name, '已存在');
        } else {
          //不存在
          needSaveList.push(thumb);
        }
      });

      if (needSaveList.length) {

        needSaveList.forEach(thumb => {
          // download方式

          let protocol = '';
          if (_.startsWith(thumb, '//')) {
            protocol = https;
            thumb = 'https:' + thumb;
          } else {
            protocol = (_.startsWith(thumb, 'https:') ? https : http);
          }

          let name = getFileNameByURL(thumb);
          console.log(thumb);
          // download
          protocol.get(thumb, (res) => {
            let imgData = '';
            res.setEncoding('binary');
            res.on("data", (chunk) => {
              imgData += chunk;
            });
            res.on("end", () => {
              // save
              fs.writeFile(savePath + name, imgData, 'binary', err => {
                if (err) {
                  console.log('save-image-error', err);
                } else {
                  // console.log(savePath + name);
                }
              })
            });
          })
        })
      }
    }
  })
};


module.exports = getWithoutContList;