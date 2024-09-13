/**
 * Tokens.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var Promise = require('bluebird'),
  promisify = Promise.promisify,
  randToken = require('rand-token');

module.exports = {


  attributes: {

    access_token: {
      type: 'string',
      required: true,
      unique: true
    },

    refresh_token: {
      type: 'string',
      required: true,
      unique: true
    },

    code: {
      type: 'string',
      unique: true
    },

    user_id: {
      type: 'string'
    },

    expiration_date: {
      type: 'date'
    },

    client_id: {
      type: 'string',
      required: true
    },

    security_level: {
      type: 'string'
    },

    scope: {
      type: 'string'
    },

    calc_expires_in: function () {
      // This return in second 
      // console.log('expiration_date', this.expiration_date.toString());
      // console.log('expiration_date time', this.expiration_date.getTime());
      // console.log('New Date', new Date().toString());
      // console.log('New Date Time', new Date().getTime());
      return Math.floor(new Date(this.expiration_date).getTime() / 1000 - new Date().getTime() / 1000);
    },

    toJSON: function () {
      var hiddenProperties = ['id','access_token','refresh_token','code','user_id','client_id'],
        obj = this.toObject();

      // obj.expires_in = this.expires_in();
      obj.expires_in = sails.config.security.oauth.token.expiration;

      hiddenProperties.forEach(function(property){
        delete obj[property];
      });

      return obj;
    }

  },


  authenticate_ok: function (criteria) {
    var tokenInfo,
      $Tokens = API.Model(Tokens),
      $Users = API.Model(Users),
      $Clients = API.Model(Clients),
      $result;

    if (criteria.access_token) {
      $result = $Tokens.findOne({access_token: criteria.access_token});
    }
    else if (criteria.code) {
      $result = $Tokens.findOne({code: criteria.code});
    }
    else {
      //Bad Token Criteria
      return Promise.reject("Unauthorized");
      // return Promise.reject({
      //   status: 'error',
      //   err: 'Unauthorized'
      // });
    }

    return $result.then(function (token) {
      if (!token) return null;

      // Handle expired token
      if (token.expiration_date && new Date() > token.expiration_date) {
        return $Tokens.destroy({access_token: token}).then(function () {
          return null
        });
      }

      tokenInfo = token;
      if (token.user_id != null) {
        return $Users.findOne({id: token.user_id});
        // var sinUser = $Users.findOne({id: token.user_id});
        // delete sinUser.password;
        // return sinUser;
      }
      else {
        //The request came from a client only since userID is null
        //therefore the client is passed back instead of a user
        return $Clients.findOne({client_id: token.client_id});
      }

    }).then(function (identity) {
      // console.log('Here is user identity',identity);
      // to keep this example simple, restricted scopes are not implemented,
      // and this is just for illustrative purposes
      if (!identity) return null;
      else if (criteria.type == 'verification') {
        if (identity.email != criteria.email) return null;
      }
      // Otherwise if criteria.type != 'verfication'
      else if (!identity.date_verified) return null;
      return {
        identity: identity,
        authorization: {
          scope: tokenInfo.scope? tokenInfo.scope: 'empty',
          token: tokenInfo
        }
      };
    });
  },

  authenticate: function (criteria) {
    var tokenInfo,
      $Tokens = API.Model(Tokens),
      $Users = API.Model(Users),
      $Clients = API.Model(Clients),
      $result;

    if (criteria.access_token) {
      $result = $Tokens.findOne({access_token: criteria.access_token});
    }
    else if (criteria.code) {
      console.log('Criteria code', criteria.code);
      $result = $Tokens.findOne({code: criteria.code});
    }
    else {
      //Bad Token Criteria
      return Promise.reject("Unauthorized");
      // return Promise.reject({
      //   status: 'error',
      //   err: 'Unauthorized'
      // });
    }

    return $result.then(function (token) {
     
      if (!token) return null;

      // Handle expired token
      if (token.expiration_date && (new Date() > token.expiration_date)) {
          return $Tokens.destroy({access_token: token}).then(function () {
            return null
          });
      }
      // console.log('TToken', token);
      tokenInfo = token;
      if (token.user_id != null) {
        return $Users.findOne({id: token.user_id});
        // return $Users.findOne({id: token.user_id}, {select: ['username', 'email', 'user_role', 'is_token_based_user']});
      }
      else {
        //The request came from a client only since userID is null
        //therefore the client is passed back instead of a user
        return $Clients.findOne({client_id: token.client_id});
      }

    }).then(function (identity) {
      // console.log('Here is user identity',identity);
      // to keep this example simple, restricted scopes are not implemented,
      // and this is just for illustrative purposes
      if (!identity)
      {
        // console.log('i am at verification not identity');
        return null;
      } 
      else if (criteria.type == 'verification') {
        
        if (identity.email != criteria.email){
          // console.log('i am at verification not same email');
          return null;
        } 
      }
      // Otherwise if criteria.type != 'verfication'
      else if (!identity.date_verified) {
        // console.log('i am at verification not date_verified');
        return null;
      }
      //  else {
        // console.log('i am at verification date_verified');
          return {
            identity: identity,
            authorization: {
              scope: tokenInfo.scope? tokenInfo.scope: 'empty',
              token: tokenInfo
            }
          };
      // }
      
    });
  },

  generateTokenString: function () {
    return randToken.generate(sails.config.security.oauth.token.length);
  },
  
  generateToken: function (criteria) {
    //if (err) return next(err);
    // console.log('I am At api/models/Tokens.js For Generate Token criteria Is', criteria);
    var token = {},
      accessToken,
      $Tokens = API.Model(Tokens),
      $Users = API.Model(Users)
      ;

    if (!criteria.client_id)
    {
      console.log('I am At api/models/Tokens.js Not Found client_id');
      return Promise.resolve(null);
    } 

    token.client_id = criteria.client_id;
    token.user_id = criteria.user_id || undefined;


    token.access_token = accessToken = Tokens.generateTokenString();

    token.refresh_token = Tokens.generateTokenString();
    token.code = Tokens.generateTokenString();

    // Here i can set Criteria define Token Expite date By Else Statment Below If****
    if (!criteria.expiration_date) {
      // console.log('I am At api/models/Tokens.js Not Set expiration_date');
      token.expiration_date = new Date();
      // console.log('Initial Date', token.expiration_date);
      // console.log('Initial Get Date', token.expiration_date.getTime());
      // ==============New add Start============
      $Users.findOne({id: criteria.user_id}).then(function (sinUser){
        if(sinUser.is_apiuser){
          // console.log('I am API User api/models/Tokens.js');
          token.expiration_date.setTime(token.expiration_date.getTime() + sails.config.security.oauth.token.apiuser_expiration * 1000 + 999);
          // token.expiration_date.setTime(token.expiration_date.getTime() + sails.config.security.oauth.token.expiration * 1000 + 999);
          console.log('I am API User api/models/Tokens.js expiration_date is',token.expiration_date);
        } else {
          console.log('I am Not API User api/models/Tokens.js');
          token.expiration_date.setTime(token.expiration_date.getTime() + sails.config.security.oauth.token.expiration * 1000 + 999);
          // console.log('I am Not API User api/models/Tokens.js expiration_date is',token.expiration_date);
        }
      });
      // ==============New add End==============
      // token.expiration_date.setTime(token.expiration_date.getTime() + sails.config.security.oauth.token.expiration * 1000 + 999);
    }

    return $Tokens.findOrCreate(criteria, token).then(function (retrievedToken) {
      if (retrievedToken.access_token != accessToken) {
        return $Tokens.update(criteria, token).then(function (updatedTokens) {
          return updatedTokens[0];
        });
      }
      return retrievedToken;
    });

  }

};

