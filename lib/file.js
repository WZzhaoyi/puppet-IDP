const fs = require('fs');
const request = require('request')
const path = require('path');

function createFolder(path, mask, callback) {
  if (typeof mask == 'function') { // allow the `mask` parameter to be optional
    callback = mask;
    mask = 0777;
  }
  fs.mkdir(path, mask, function (err) {
    if (err) {
      if (err.code == 'EEXIST') { callback(null); } // ignore the error if the folder already exists
      else { callback(err); } // something else went wrong
    } else { callback(null); } // successfully created folder
  });
}

function extension(element) {
  var extName = path.extname(element);
  return extName === '.png';
};

function cleanFolder(user) {
  fs.readdir(user, function (err, files) {
    if (err) { console.log('Warning: folder not found'); }
    else {
      //for (const file of files) {
      files.filter(extension).forEach(function (file) {
        fs.unlink(user + '/' + file, function (err) {
          if (err) { console.log('Warning: unable to delete file :' + file); }
        });
      });
      console.log(user + ' folder has been emptied.');
    }
  });
}

function createFolder(path, mask, cb) {
  if (typeof mask == 'function') { // allow the `mask` parameter to be optional
    cb = mask;
    mask = 0777;
  }
  fs.mkdir(path, mask, function (err) {
    if (err) {
      if (err.code == 'EEXIST') { cb(null); } // ignore the error if the folder already exists
      else { cb(err); } // something else went wrong
    } else { cb(null); } // successfully created folder
  });
}

// download img
function downloadImg(uri, path, callback) {
  request.head(uri, function (err, res, body) {
    request(uri)
      .pipe(fs.createWriteStream(`${path}`))
      .on('close', function () {
        console.log(`Finish Copy Images:${path}`)
      })
  })
}

function storeLog(meta, path) {
  fs.writeFile(`${path}`, meta, err => {
    if (err) {
      console.log(`Fail to store log:${path}`)
    }
    else {
      console.log(`Meta store in ${path}.`)
    }
  })
}

module.exports = {
  createFolder,
  cleanFolder,
  downloadImg,
  storeLog
}