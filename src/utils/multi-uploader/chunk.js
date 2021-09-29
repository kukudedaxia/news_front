import SparkMD5 from 'spark-md5';
const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;

const readChunk = (file, start, end) => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = (evt) => resolve(evt.target.result);
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  });
};

// 计算切片Md5
const calChunkMd5 = async (file, start, end) => {
  const spark = new SparkMD5.ArrayBuffer();
  spark.append(await readChunk(file, start, end));
  return spark.end();
};

// 计算文件Md5
const calFileMd5 = async (file) => {
  const fileSize = file.size;
  const spark = new SparkMD5.ArrayBuffer();
  const chunk = await readChunk(file, 0, fileSize);
  spark.append(chunk);
  return spark.end();
};

export { readChunk, calChunkMd5, calFileMd5 };
