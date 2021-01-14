version=$1  # 版本
projectPath=/root/www/htdocs/www.bee.to/
webTar=$2   # 压缩包
webName=$3  # cdn包

time_echo(){
    echo `date '+%Y-%m-%d %H:%M:%S'` $1
}

if [ ! -n "${version}" ]; then
  echo "输入版本！"
  exit 1
  fi


if [ ! -n "${webTar}" ]; then
  echo "输入tar包！"
  exit 1
  fi

if [ ! -n "${webName}" ]; then
  echo "输入上传cdn包名"
  exit 1
  fi
  
time_echo "start to deploy "

# 查看上一个版本
result=`curl -s 'm.bee.to/api/help/js/v/get' | grep data`
echo "current js version : ${result}"

# 打包之前的资源
cd ${projectPath}

times=`date '+%Y-%m-%d_%H_%M_%S'`

tar -zcvf ${webName}${times}.bak.tar ${webName}/

mv ${webName}${times}.bak.tar history/

# 解压新资源


time_echo '解压缩 tar'

if [ ! -f "${webTar}.tar" ];then
  time_echo "没有找到指定tar包"
  exit 1
  fi

echo "移除旧文件"

rm -rf ${webName}

echo "解压缩新文件 ${webTar}.tar"

tar -xvf "${webTar}.tar"

# mv ${webTar} ${webName}

# 删除之后tar包
rm -rf ${webTar}.tar

echo "删除 ${webTar}.tar 包成功"

exit 0

echo "执行oss命令"

cd /usr/local/ossutil/

sh upload_H5.sh

curl -s www.bee.to/api/help/js/official/v/set -G -d 'v='${version}

time_echo "update version finished."

result=`curl -s 'www.bee.to/api/help/js/official/v/get' |grep data`

echo "current js version : ${result}"
