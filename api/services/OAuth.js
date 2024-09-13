/**
 * Module dependencies.
 */
var promisify = require('bluebird').promisify;
var passport1 = require('passport');
var oauth2orize = require('oauth2orize');



var PublicClientPasswordStrategy = require('passport-oauth2-public-client').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var server = oauth2orize.createServer(); // create OAuth 2.0 server service
var validateAndSendToken = promisify(server.token());
var tokenErrorMessage = server.errorHandler();

//Handlers
var publicClientVerifyHandler;
var bearerVerifyHandler;
var exchangePasswordHandler;
var exchangeRefreshTokenHandler;

/**
 * Public Client strategy
 *
 * The OAuth 2.0 public client authentication strategy authenticates clients
 * using a client ID. The strategy requires a verify callback,
 * which accepts those credentials and calls done providing a client.
 */

publicClientVerifyHandler = function (clientId, next) {
  // console.log('next',next);
  console.log('1.I am in publicClientVerifyHandler At At api/services/OAuth.js')
  process.nextTick(function () {
    API.Model(Clients).findOne({client_id: clientId}).nodeify(next);
  });
};

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token).  If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
// bearerVerifyHandler_old_ok = function(token, next) {
//   console.log('1.I am in Berer Token Handler Method bearerVerifyHandler At api/services/OAuth.js send it api/models/Tokens.js')
//   process.nextTick(function () {
//     Tokens.authenticate({access_token:token}).nodeify(function (err, info) {
//       console.log('2.I am in Berer Token Handler Method bearerVerifyHandler At api/services/OAuth.js send it api/models/Tokens.js method authenticate')
//       if (!info || !info.identity) return next(null, null);
//       next(null, info.identity, info.authorization);
//     });
//   });
// };

bearerVerifyHandler = function(token, next) {
  process.nextTick(function () {
    Tokens.authenticate({access_token:token}).nodeify(function (err, info) {
      if (!info || !info.identity){
        return next(null, null);
      }
      next(null, info.identity, info.authorization);
    });
  });
};

/**
 * Exchange user id and password for access tokens.
 *
 * The callback accepts the `client`, which is exchanging the user's name and password
 * from the token request for verification. If these values are validated, the
 * application issues an access token on behalf of the user who authorized the code.
 */

exchangePasswordHandler = function(client, username, password, scope, next) {
  // console.log('next is ',next);
  //  console.log('I am At api/services/OAuth.js client is', client);
  if (!client){
    console.log('I am At api/services/OAuth.js If Not Found Client');
    return next(null, false); //passport-oauth2-client-password needs to be configured
  } 
  //Validate the user
  console.log('oauth username ===', username);
  console.log('oauth password ===', password);
  Users.authenticateForToke2(username, password).then(function (user) {
    console.log('oauth user', user);
    if (!user) {
      console.log('I am At api/services/OAuth.js If Not Found User');
      console.log('I am At api/services/OAuth.js next', next);
      return next(null, false);
      // return next(null, false, { message: 'You are not active user' });
    } else if(user && user.user_type == 4){
      // console.log(' I am apiuser trrtrtrtrtrt');
      return Tokens.findOne({user_id: user.id}).then(function(existToken){
        let is_token_exprire_flag = 2; // 1=expire, 2 = not_expire
      //  console.log('existToken', existToken);
          if(existToken){
            // console.log('calc_expires_in', existToken.calc_expires_in());
            if (existToken.expiration_date && (new Date() < existToken.expiration_date)) {
              // is_token_exprire_flag = 2;
              // console.log('existTokenexistToken', is_token_exprire_flag);
              return next(null, existToken.access_token, null, {
                expires_in: existToken.calc_expires_in(), user: user, status: 'success'
              });
            } else {
              is_token_exprire_flag = 1;
            }
          } 

          if(!existToken || (is_token_exprire_flag == 1)){
            return Tokens.generateToken({
              client_id: client.client_id,
              user_id: user.id
            }).then(function (token) {

              return next(null, token.access_token, null, {
                expires_in: token.calc_expires_in(), user: user, status: 'success'
              });
      
            });

          }


      });



   }
    else{

      
      
      // console.log('I am At api/services/OAuth.js If Found User', user);
      // Here i can set Token expire time User wise By check Which type of user ****
      return Tokens.generateToken({
        client_id: client.client_id,
        user_id: user.id
      }).then(function (token) {

        
        // console.log('I am At api/services/OAuth.js with token', token);
        // return next(null, token.access_token, token.refresh_token, {
        //   expires_in: token.calc_expires_in()
        // });

        //Below Code Ok
        // next it is Fiered 'node_module/oauth2orize/lib/exchange/password.js->issued()'
        // return next(null, token.access_token, token.refresh_token, {
        //   expires_in: token.calc_expires_in(), user: user, status: 'success'
        // });

        return next(null, token.access_token, null, {
          expires_in: token.calc_expires_in(), user: user, status: 'success'
        });

      });
    }

  });
};

/**
 * Exchange the refresh token for an access token.
 *
 * The callback accepts the `client`, which is exchanging the client's id from the token
 * request for verification.  If this value is validated, the application issues an access
 * token on behalf of the client who authorized the code
 */
exchangeRefreshTokenHandler = function (client, refreshToken, scope, done) {

  API.Model(Tokens).findOne({
    refresh_token: refreshToken
  }).then(function (token) {
    if (!token) return done(null, null);

    return Tokens.generateToken({
      user_id: token.user_id,
      client_id: token.client_id
    }).then(function (token) {
      return done(null, token.access_token, token.refresh_token, {
        expires_in: token.calc_expires_in()
      });

    });
  }).catch(function (err) {
    console.error(err);
    done(err);
  });

};

//Initialize Passport Strategies
passport1.use(new PublicClientPasswordStrategy(publicClientVerifyHandler));
passport1.use(new BearerStrategy(bearerVerifyHandler));
server.exchange(oauth2orize.exchange.password(exchangePasswordHandler));
server.exchange(oauth2orize.exchange.refreshToken(exchangeRefreshTokenHandler));

// console.log(' I am Passport--', passport1)
module.exports = {
  authenticator1: passport1,
  server: server,

  //OAuth Token Services
  sendToken_Org: function (data, context, req, res) {
    if (req.method != 'POST') throw 'Unsupported method';
    return validateAndSendToken(req, res).catch(function (err) {
      tokenErrorMessage(err, req, res);
    });
  },

  sendForToken: function (data, context, req, res) {
    // console.log('DDDDDD data', data );
    // console.log('DDDDDD context', context );
    // console.log('DDDDDD req', req );
    if (req.method != 'POST') throw 'Unsupported method';
    return validateAndSendToken(req, res).catch(function (err) {
      // tokenErrorMessage(err, req, res);
      // console.log('errerr', err);
      return{
        status: 'error',
        err: err
      }
    });
  },

  sendToken: function (data, context, req, res) {
    // console.log('DDDDDD data', data );
    // console.log('DDDDDD context', context );
    // console.log('DDDDDD req', req );
    if (req.method != 'POST') throw 'Unsupported method';
    return validateAndSendToken(req, res).catch(function (err) {
      // tokenErrorMessage(err, req, res);
      // console.log('errerr', err);
      return{
        status: 'error',
        err: err
      }
    });
  },

  tokenInfo: function (data, context) {
    var token = context.authorization.token;
    token.expires_in = token.calc_expires_in();
    return {
      identity: context.identity,
      authorization: context.authorization
    };
  }
};
