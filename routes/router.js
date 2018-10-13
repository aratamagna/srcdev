var express = require('express');
var router = express.Router();
var middleware = require('../middleware/middleware');
const multer = require('multer');
var auth = require('../Controllers/auth');
var user = require('../Controllers/user');

//MULTER CONFIG: to get file photos to temp server storage
const multerConfig = {

  //specify diskStorage (another option is memory)
  storage: multer.diskStorage({

    //specify destination
    destination: function(req, file, next){
      next(null, './public/photo-storage');
    },

    //specify the filename to be unique
    filename: function(req, file, next){
      console.log(file);
      //get the file mimetype ie 'image/jpeg' split and prefer the second value ie'jpeg'
      const ext = file.mimetype.split('/')[1];
      //set the file fieldname to a unique name containing the original name, current datetime and the extension.
      next(null, file.fieldname + '-' + Date.now() + '.'+ext);
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

router.get('/user',middleware.ensureAuthenticated, user.listUsers);

//POST route for updating data
router.post('/user',middleware.ensureAuthenticated, function (req, res, next) {
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Error de contraseña.');
    err.status = 400;
    res.send("contraseñas no coinciden");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

      user.insertUser(req, res, next);

    } else {
      var err = new Error('Todos los campos son requeridos.');
      err.status = 400;
      return next(err);
    }
});

router.put('/user', function (req, res, next) {
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Error de contraseña.');
    err.status = 400;
    res.send("contraseñas no coinciden");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

      user.updateUser(req, res, next);

    } else {
      var err = new Error('Todos los campos son requeridos.');
      err.status = 400;
      return next(err);
    }
});

router.delete('/user', function (req, res) {});

router.get('/user/:codigo', function (req, res, next) {
});

router.get('/profile',middleware.ensureAuthenticated, function (req, res, next) {
});

router.post('/upload', multer(multerConfig).single('input'),function(req, res){
      res.send('Complete! Check out your public/photo-storage folder.  Please note that files not encoded with an image mimetype are rejected. <a href="index.html">try again</a>');
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
});

module.exports = router;
