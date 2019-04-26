const fs = require('fs');
const moment = require('moment');

const cleaner = function () {

  const savePath = './public/images/';

  // 读取所有图片
  fs.readdir(savePath, (err, files) => {

    if (files && files.length) {

      files.forEach(file => {
        // 读取图片信息
        let filePath = savePath + file;

        fs.stat(filePath, (err, stats) => {
          // 如果存取时间超过14天删除

          if (!err) {
            let currentDate = moment();
            let birthDate = moment(stats.mtime);
            // 与当前时间间隔天数
            let diff = currentDate.diff(birthDate, 'days');
            if (diff >= 14) {
              fs.unlink(filePath, err => {
                if (!err) {
                  console.log(filePath, '删除成功！');
                }
              })
            }
          }
        })
      })
    }
  })
};


module.exports = cleaner;