/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {

  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

 
  adminLoginDo: function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {

      if ((err) || (!user)) {
        var loginmsg = {
          message: info.message,
          user: user
        };
        return res.view('auth/login-fail-re-login',{loginmsg: loginmsg});
      }

      req.logIn(user, function(err) {
        if (err){
          res.send(err);
          var loginmsg = err;
          return res.view('auth/login-fail-re-login',{loginmsg: loginmsg});
        }

        var loginmsg = {
          message: info.message,
          user: user
        };

        // return res.view('auth/login-controler',{loginmsg: loginmsg});
        return res.redirect('/admin/dashboard');

      });

    })(req, res);
  },

  adminLogout: function(req, res) {
    req.logout();
    res.redirect('/adminlogin');
  }
};



