var express = require('express');
var router = express.Router();
var middleware = require('../middleware/middleware');
const multer = require('multer');
var request = require('request');
var fs = require('fs');
var auth = require('../Controllers/auth');
var user = require('../Controllers/user');
var config = require('../config');

var url = config.SERVICE_CONN_STRING;

//MULTER CONFIG: to get file photos to temp server storage
const multerConfig = {

  //specify diskStorage (another option is memory)
  storage: multer.diskStorage({

    //specify destination
    destination: function(req, file, next){
      next(null, './public/storage');
    },

    //specify the filename to be unique
    filename: function(req, file, next){
      console.log(file);
      //get the file mimetype ie 'image/jpeg' split and prefer the second value ie'jpeg'
      const ext = file.mimetype.split('/')[1];
      //set the file fieldname to a unique name containing the original name, current datetime and the extension.
      next(null, file.originalname+ '.'+ext);
    }
  }),

  // filter out and prevent non-image files.
  fileFilter: function(req, file, next){
        if(!file){
          next();
        }

      // only permit image mimetypes
      const image = file.mimetype.startsWith('image/');
      if(image){
        console.log('photo uploaded');
        next(null, true);
      }else{
        console.log("file not supported")
        //TODO:  A better message response to user on failure.
        return next();
      }
  }
};

router.get('/', function (req, res, next) {
  res.send("Hello World!");
});

router.post('/login', auth.emailLogin);

router.get('/user',middleware.ensureAuthenticated, function (req, res, next) {
  user.getUser(req, res, next);
});

router.post('/user',middleware.ensureAuthenticated, function (req, res, next) {
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Error de contraseña.');
    err.status = 400;
    res.send("contraseñas no coinciden");
    return next(err);
  }

  if (req.body.email &&
    req.body.password &&
    req.body.passwordConf) {

      user.insertUser(req, res, next);

    } else {
      var err = new Error('Todos los campos son requeridos.');
      err.status = 400;
      return next(err);
    }
});

router.get('/profile',middleware.ensureAuthenticated, function (req, res, next) {
});

router.post('/upload', multer(multerConfig).single('input'),function(req, res){
  request.post(url, {
    formData: {
    photo:fs.createReadStream('./public/storage/'+req.file.filename)
  },
  json: true
}, function (err, resp, body) {
  res.send(body);
});
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
});

module.exports = router;
