// Requires
const controllers = require('./controllers');
const multer = require('multer')
const upload = multer();
const mid = require('./middleware');

// Create the Router Function
const router = (app) => {
  // Homepage Routes
  app.get('/home', controllers.Song.homePage);

  // Login/Signup/Password Change Routes
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  // Account Page Routes
  app.get('/account', controllers.Song.accountPage);


  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  /*
  // Login Routes
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  // Signup Routes
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  // Logout Routes
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // Maker Routes
  app.get('/maker', mid.requiresLogin, controllers.Song.homePage);
  app.post('/maker', mid.requiresLogin, upload.single('songFile'), controllers.Song.saveSong);

  app.get('/account', mid.requiresLogin, controllers.Account.accountPage);
  */

  // Get Domos
  //app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);

  //app.post('/deleteDomo', mid.requiresLogin, controllers.Domo.deleteDomo);

  // Default Route
  app.get('/', controllers.Song.homePage);
};

// exports
module.exports = router;
