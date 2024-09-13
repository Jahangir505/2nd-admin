/**
 * FrontCustomerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var moment = require('moment');
var Promise = require('bluebird');
var Q = require('q');
var _ = require('lodash');
let zeCommon = sails.config.zeCommon;
module.exports = {
    _config: {
        actions: false,
        shortcuts: false,
        rest: true
      },
      register: function(req,res){
        console.log('I am at FrontCustomerController register');
        // API(Registration.registerUser,req,res);
        API(Registration.registerCustomer,req,res);
      },

      varifyCustomer: function(req,res){
        console.log('I am at FrontCustomerController varifyCustomer');
        API(Registration.verifyCustomer,req,res);
      },

      loginForToken: function(req,res){
        console.log('I am in Outh Controller apiuser-token Action ');
        // console.log('Sendnnn: ',OAuth.sendToken);
         //This Data Comes from Sails Api->'Services->Oauth->exchangePasswordHandler()'
         //this username, password catch in oauth2orize >lib > exchange >password.js
         // console.log('reqreqreq', req);
         API(OAuth.sendForTokenCustomer,req,res);
       },

};

