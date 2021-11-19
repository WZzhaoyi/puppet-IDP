const fs = require('fs');
const request = require('request')
const path = require('path');

function createFolder(path) {
  fs.mkdir(path, (error) => {
    if (error) {
      console.log('Fail to mkdir:', error)
    }
  });
}

function extension(element, ext = ['.png']) {
  let extName = path.extname(element);
  if (Array.isArray(ext)) {
    return ext.includes(extName);
  }
  else if (typeof ext === 'string') {
    return ext === extName
  }
  else {
    throw new Error('Type required: string | string[]')
  }
};

async function cleanFolder(filePath) {
  let stat = await fs.stat(filePath, () => { })
  if (stat.isFile()) {
    await fs.unlink(filePath, () => { })
  } else {
    let dirs = await fs.readdir(filePath, () => { })
    dirs = dirs.map(dir => cleanFolder(path.join(filePath, dir)))
    await Promise.all(dirs)
    await fs.rmdir(filePath, () => { })
  }
}

// download img
function downloadImg(uri, path, callback) {
  request.head(uri, function (err, res, body) {
    request(uri)
      .pipe(fs.createWriteStream(`${path}`))
      .on('close', callback)
  })
}

function storeLog(meta, path) {
  fs.appendFile(`${path}`, meta, err => {
    if (err) {
      console.log(`Fail to store log:${path}`)
    }
  })
}

module.exports = {
  createFolder,
  cleanFolder,
  downloadImg,
  storeLog
}