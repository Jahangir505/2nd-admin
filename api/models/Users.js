/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */


var promisify = require('bluebird').promisify;
// var bcrypt = require('bcrypt-nodejs');
var bcrypt = require('bcrypt');
let randToken = require('rand-token');

module.exports = {
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,

  attributes: {
    email: {
      type: 'email',
      unique: true,
      required: true
    },
    password: {
      type: 'string',
      required: true,
      columnName: 'encrypted_password',
      minLength: 6
    },
    password_reset_code: {
      type: 'string',
      unique: true
    },
    // is_superadmin=1,is_admin=2, is_backend_user=3, is_business=4, is_customer=5 
    user_type: {
      type: 'integer',
      required: true,
      defaultsTo: 0
    },
    first_name: {
      type: 'string',
      defaultsTo: ''
    },
    last_name: {
      type: 'string',
      defaultsTo: ''
    },
    //no need
    image: {
      type: 'text',
    },
    //not_selected=0, male=1, girl=2, other=3
    // gender: {
    //   type: 'integer',
    //   defaultsTo: 0
    // },
    mobile_no: {
      type: 'string',
      defaultsTo: ''
    },
    
//no need
    // street_address: {
    //   type: 'string',
    //   defaultsTo: ''
    // },
    //no need
    // city: {
    //   type: 'string',
    //   defaultsTo: ''
    // },
    //no need
    // zip: {
    //   type: 'string',
    //   defaultsTo: ''
    // },
    
    date_registered: {
      type: 'date'
    },
    date_verified: {
      type : 'date'
    },
    // status: 1  //   type: "boolean",
    //   defaultsTo: false
    // },
    // active=1, inactive=2, pending=3, suspend=4 
    status: {
      type: 'integer',
      required: true,
      defaultsTo: 2
    },
    //is_token_based_user=true who used token , is_token_based_user = false who are Backend User
    is_token_based_user: {
      type: "boolean",
      defaultsTo: true
    },
    is_approved: {
      type: "boolean",
      defaultsTo: false
    },
    //Relation
    //Rolepermission
    rolePermission:{
      model: 'rolepermission',
      required: false
    },
    // country: {
    //   model: 'country',
    // },
    // state: {
    //   model: 'state',
    // },
    //One to one relation
    businessProfile: {
      model: 'businessprofile',
      via: 'user'
    },

    //One to one relation
    customerProfile: {
      model: 'customerProfile',
      via: 'user'
    },
    // Created By
    createdBy:{
      model: 'users',
      required: false,
      defaultsTo: ''
    },
    createdByObj: {
      type: 'json',
      defaultsTo: {email: ''}
    },
    updatedBy:{
      model: 'users',
      required: false,
      defaultsTo: ''
    },
    updatedByObj: {
      type: 'json',
      defaultsTo: {email: ''}
    },
    // Relation End
    
    comparePassword: function(password) {
      // console.log('hgh******************', bcrypt.compareSync(password, this.password));
      // console.log('hgh******************', bcrypt.compare(password, this.password));
      // console.log('hgh****password**************', password);
      // console.log('hgh****this password**************', this.password);
      return bcrypt.compareSync(password, this.password);
    },
    
    

    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }

  },
  beforeCreate: function(user, next) {
    if (user.hasOwnProperty('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
      next(false, user);
    } else {
      next(null, user);
    }
  },
 
  beforeUpdate: function(user, next) {
    if (user.hasOwnProperty('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
      next(false, user);
    } else {
      next(null, user);
    }
  },

 
  generateTokenString: function () {
    return randToken.generate(sails.config.security.oauth.token.length);
  },

  authenticate: function (email, password) {
    return API.Model(Users).findOne({email: email, status: 1}).then(function(user){
      return (user && user.date_verified && user.comparePassword(password))? user : null;
    });
  },

// This Method Use For To get Access Token By Username/Pass, grant_type And client_id From Frontend
    
  authenticateForToken: function (username, password) {
    // console.log('I am in User Model');
      return API.Model(Users).findOne({email: username, status: 1, is_token_based_user: true, user_type: [4,5]}).then(function(user){
      if(user && user.date_verified){
        // console.log('I am in User Model Success');
        let userObj= {
          email: user.email,
          user_type: user.user_type,
          // country: user.country,
          // county: user.county,
          // phone: user.phone,
          id: user.id,
      };

      if(user.user_type == 4){
        userObj.isApproved =  user.is_approved;
        userObj.isBusiness =  true;
      }

      if(user.user_type == 5){
        userObj.isCustomer =  true;
      }


      //check for as sails user
      console.log('password', password);
      console.log('thispassword', user.password);
        if(user.comparePassword(password, user.password)){  
          console.log('password chk 1');
          return userObj;
        } else {
          console.log('password chk 2');
          return null;
        }
      }else{
        console.log('password chk 3');
        return null;
      }
    });
  },

  authenticateForToke2: function (username, password) {
    console.log('I am in User Model2');
      return API.Model(Users).findOne({email: username, status: 1, is_token_based_user: true, user_type: [4,5]}).then(function(user){
      if(user && user.date_verified){
        console.log('I am in User Model Success');
        let userObj= {
          email: user.email,
          user_type: user.user_type,
          // country: user.country,
          // county: user.county,
          // phone: user.phone,
          id: user.id,
      };

      if(user.user_type == 4){
        userObj.isApproved =  user.is_approved;
        userObj.isBusiness =  true;
      }

      if(user.user_type == 5){
        userObj.isCustomer =  true;
      }


      //check for as sails user
      console.log('password', password);
      console.log('thispassword', user.password);
        if(user.comparePassword(password)){  
          console.log('password chk 1');
          return userObj;
        } else {
          console.log('password chk 2');
          return null;
        }
      }else{
        console.log('password chk 3');
        return null;
      }
    });
  },





};

