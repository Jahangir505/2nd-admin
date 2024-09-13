/**
 * OAuthController
 *
 * @description :: Server-side logic for managing Oauths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  'apiuser-token': function(req,res){
   console.log('I am in Outh Controller apiuser-token Action ');
   // console.log('Sendnnn: ',OAuth.sendToken);
    //This Data Comes from Sails Api->'Services->Oauth->exchangePasswordHandler()'
    //this username, password catch in oauth2orize >lib > exchange >password.js
    // console.log('reqreqreq', req);
    
    API(OAuth.sendTokenApiUser,req,res);
  },

  token: function(req,res){
    console.log('I am in Outh Controller Token Action ');
    // console.log('Sendnnn: ',OAuth.sendToken);
     //This Data Comes from Sails Api->'Services->Oauth->exchangePasswordHandler()'
     //this username, password catch in oauth2orize >lib > exchange >password.js
     API(OAuth.sendToken,req,res);
   },

  'token-info': function(req,res){
    API(OAuth.tokenInfo,req,res);
  }

};

