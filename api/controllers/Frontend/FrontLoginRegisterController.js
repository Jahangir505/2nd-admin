/**
 * FrontLoginRegisterController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let moment = require('moment');
let Promise = require('bluebird');
let _ = require('lodash');
let zeCommon = sails.config.zeCommon;
module.exports = {
    _config: {
        actions: false,
        shortcuts: false,
        rest: true
    },
    // ********* Business Start *************
    businessRegister: function(req,res){
        console.log('I am at FrontLoginRegisterController Business register');
        // API(Registration.registerUser,req,res);
        API(Registration.registerBusiness,req,res);
    },

    businessVarify: function(req,res){
        console.log('I am at FrontLoginRegisterController businessVarify');
        API(Registration.verifyBusiness,req,res);
    },

    

    // ********* Business End ***************


    // ********* Common Login Start *************
    loginForToken: function(req,res){
        console.log('I am in FrontLoginRegisterController loginForToken Action ');
        // console.log('Sendnnn: ',OAuth.sendToken);
            //This Data Comes from Sails Api->'Services->Oauth->exchangePasswordHandler()'
            //this username, password catch in oauth2orize >lib > exchange >password.js
            // console.log('reqreqreq', req);
        API(OAuth.sendForToken,req,res);
    },
    // ********* Common Login End ***************
    
    
    // ********* Customer Start *************
    customerRegister: function(req,res){
        console.log('I am at FrontCustomerController register');
        // API(Registration.registerUser,req,res);
        API(Registration.registerCustomer,req,res);
    },

    customerVarify: function(req,res){
        console.log('I am at FrontCustomerController varifyCustomer');
        API(Registration.verifyCustomer,req,res);
    },
    // ********* Customer End ***************
  

};

