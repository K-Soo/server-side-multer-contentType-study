require('dotenv').config();
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const app = express();

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEYSS,
});

const storage = multerS3({
  s3: s3,
  bucket: 'book-stroy',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    cb(null, 'profile/' +  Date.now().toString() + '_' + file.originalname);
    // cb ( new  Error ( 'I don\'t have노라! ' ))
  },
});

const upload = multer({
  storage,
  // fileFilter,
}).array('image');

app.use(express.urlencoded({ extended: true })); // Content-Type: application/x-www-form-urlencoded 분석
app.use(express.json()); // Content-Type: application/json; 분석
app.use(cors());

app.use('/req-json', (req, res) => {
  console.log('req-json: ', req.body);
  res.status(200).json({ result: 1 });
});

app.use('/form-urlencoded', (req, res) => {
  console.log('req-old: ', req.body);
  res.send('<h1>hi</h1>')
});

app.use('/req-form', (req, res) => {
  console.log('req-form: ', req.body);
  res.status(200).json({ result: 1 });
});

app.use('/req-files', (req, res, next) => {
  upload(req, res, err => {
    console.log('err: ', err);
    console.log('err instanceof multer.MulterError: ', err instanceof multer.MulterError);
    console.log('req.files: ', req.files);
    console.log('req.body: ', req.body);
    if (err instanceof multer.MulterError) {
      console.log('multer error');
    } else if (err) {
      console.log('걍 에러');
    }
    // const { title, stroy } = req.body;
    next();
  })
  res.status(200).json({ result: 1 });
});

// app.use('/',(req,res) => {
//   console.log('req: ', req.body);
//   res.status(200).json({result:1});
// });

app.use('/add-product', (req, res) => {
  res.send('<form action="/product" method="POST"><input type="text" name="title"/><button type="submit">전송</button></form>');
});

app.use('/product', (req, res) => {
  console.log('req: ', req.body);
  // res.send('<form action="/product" method="POST"><input type="text" name="title"/></form>');
  res.json({ suss: true });
});

app.listen(8070, () => {
  console.log(`✅ server port 8070 successfully!`)
});