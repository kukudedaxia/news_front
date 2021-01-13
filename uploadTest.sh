#!/bin/bash
version=$1  # 版本

rsync -avpz --delete /Users/lenghui/Desktop/work/beeto_pc/beeto 10.92.160.217::www

result=`curl -s 'www.whale.weibo.com/api/help/js/official/v/get' | grep data`
echo "上一版本 : ${result}"

curl -s www.whale.weibo.com/help/js/official/v/set -G -d 'v='${version}

result=`curl -s 'www.whale.weibo.com/api/help/js/official/v/get' | grep data`
echo "最新版本 : ${result}"

echo "update version finished."