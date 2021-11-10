const fs = require('fs');
const path = require('path');
const uglifyEs = require('uglify-es'); // 压缩es5+
const genEntry = path.resolve(__dirname, './entry.js');
const webDir = path.resolve(__dirname, '../beeto/');

// 版本号
const webEntry = path.resolve(webDir, `entry20211109_1.js`);
const hasWebEntry = fs.existsSync(webDir);
!hasWebEntry && fs.mkdirSync(webDir);

let loadCount = 0;
function isLoadComplete() {
  loadCount++;
  if (loadCount === 1) {
    console.log('入口文件生成完毕!');
  }
}
module.exports = function(assetManifest) {
  fs.readFile(genEntry, 'utf8', (err, data) => {
    if (err) throw err;
    data =
      ';;document.addEventListener("DOMContentLoaded",function(){const assetManifest = ' +
      JSON.stringify(assetManifest) +
      ';;' +
      data +
      ';;init();;});;';
    fs.writeFile(webEntry, uglifyEs.minify(data).code, isLoadComplete);
  });
};
