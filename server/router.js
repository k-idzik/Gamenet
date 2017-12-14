const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // Connect as many middleware calls as needed in the order they should run
  // URL, middleware, controller
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getProfile', mid.requiresLogin, controllers.Profile.getProfile);
  app.get('/getMyPals', mid.requiresLogin, controllers.Profile.getMyPals);
  app.get('/getAllPals', mid.requiresLogin, controllers.Profile.getAllPals);
  app.post('/addPal', mid.requiresSecure, controllers.Profile.addPal);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/profile', mid.requiresLogin, controllers.Profile.profilePage);
  app.get('/pals', mid.requiresSecure, controllers.Profile.palsPage);
  app.get('/settings', mid.requiresSecure, controllers.Account.settingsPage);
  app.post('/updateUsername', mid.requiresSecure, controllers.Account.updateUsername);
  app.post('/updatePassword', mid.requiresSecure, controllers.Account.updatePassword);
  app.post('/updateProfile', mid.requiresSecure, controllers.Profile.updateProfile);
  app.get('/updateUsername', mid.requiresSecure, controllers.Account.settingsPage);
  app.get('/updatePassword', mid.requiresSecure, controllers.Account.settingsPage);
  app.get('/updateProfile', mid.requiresSecure, controllers.Account.settingsPage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
