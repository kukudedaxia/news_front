import SparkMD5 from 'spark-md5';
const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;

const readChunk = (file, start, end) => {
  return new Promise(resolve => {
    const fileReader = new FileReader();
    console.log(fileReader, 'fileReader');
    fileReader.onload = evt => resolve(evt.target.result);
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  });
};

// 计算切片Md5
const calChunkMd5 = async (file, start, end) => {
  const spark = new SparkMD5.ArrayBuffer();
  spark.append(await readChunk(file, start, end));
  return spark.end();
};

const calcmd5 = async file => {
  return new Promise(resolve => {
    const sliceLength = 10;
    const chunkSize = Math.ceil(file.size / sliceLength);
    const fileReader = new FileReader();
    const md5 = new SparkMD5();
    let index = 0;
    const loadFile = () => {
      const slice = file.slice(index, index + chunkSize);
      fileReader.readAsArrayBuffer(slice);
    };
    loadFile();
    fileReader.onload = e => {
      md5.appendBinary(e.target.result);
      if (index < file.size) {
        index += chunkSize;
        console.log(index, 'index');
        loadFile();
      } else {
        let res = md5.end();
        console.log(res, 'end');
        resolve(res);
      }
    };
  });
};

// 计算文件Md5
const calFileMd5 = async file => {
  const fileSize = file.size;
  console.log(fileSize, 'fileSize');
  // const spark = new SparkMD5.ArrayBuffer();
  // const chunk = await readChunk(file, 0, fileSize);
  // spark.append(chunk);
  // return spark.end();
  let md5 = await calcmd5(file);
  console.log(md5, 'end1');
  return md5;
};

export { readChunk, calChunkMd5, calFileMd5 };
