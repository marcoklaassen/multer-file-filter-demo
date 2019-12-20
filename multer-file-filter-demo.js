const express = require('express');
const multer  = require('multer');
const cors = require('cors');
const bodyParser= require('body-parser');

const app = express();

let counter = 0;

app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

let upload = multer({
  storage: storage,
  // use file filter to check the request, the file params or anything else
  fileFilter: function (req, file, cb) {
    if (++counter % 2 === 0) {
      console.log('no upload -> file will not be saved');
      return cb(null, false);
    }
    console.log('upload -> file will be saved');
    cb(null, true);
  }
});

app.post('/file-upload', upload.single('file'), (req, res, next) => {
  // check if any file passed the fileFilter
  let uploaded = !!req.file;
  res.send('{"uploaded": "'+uploaded+'}"}');
});

app.listen(3000, function () {
  console.log('multer file-filter-demo listening on port 3000!');
});
