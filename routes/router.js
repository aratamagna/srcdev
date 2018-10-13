var express = require('express');
var router = express.Router();
var middleware = require('../middleware/middleware');
var auth = require('../Controllers/auth');
var user = require('../Controllers/user');

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

app.post('/upload', multer(multerConfig).single('input'),function(req, res){
      //Here is where I could add functions to then get the url of the new photo
      //And relocate that to a cloud storage solution with a callback containing its new url
      //then ideally loading that into your database solution.   Use case - user uploading an avatar...
      res.send('Complete! Check out your public/photo-storage folder.  Please note that files not encoded with an image mimetype are rejected. <a href="index.html">try again</a>');
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
});

module.exports = router;
