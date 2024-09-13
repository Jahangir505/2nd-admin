var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    Users.findOne({ id: id } , function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    Users.findOne({or: [{username: email},{email: email}]}, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect Username/Email.' });
      }

      if (user) {
        // console.log('useruser aa', user);
        console.log('useruser aa i am in config > passport');
        if (user.status == 2) {
          return done(null, false, { message: 'You are not active user' });
        }

        if (user.status == 3) {
          return done(null, false, { message: 'You are pending user' });
        }

        if (user.status == 4) {
          return done(null, false, { message: 'You are suspended user' });
        }
        console.log('hh1', user.is_token_based_user);
        if (user.is_token_based_user) {
          console.log('hh', user.is_token_based_user);
          return done(null, false, { message: 'You are not Backend user' });
        }

        if ((user.status == 1) && (!user.is_token_based_user)) {
          console.log('passwordpassword', password);
          bcrypt.compare(password, user.password, function (err, res) {
            if (!res)
              return done(null, false, {
                message: 'Invalid Password'
              });
            var returnUser = {
              email: user.email,
              createdAt: user.createdAt,
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
            };
            return done(null, returnUser, {
              message: 'Logged In Successfully'
            });

          });
        } else {
          return done(null, false, { message: 'You are not Backend user' });
        }

      }

    });
  }
));
