var Promise = require('bluebird'),
  promisify = Promise.promisify,
  mailer = require('nodemailer'),
  emailGeneratedCode,
  transporter;
let randToken = require('rand-token');
let zeCommon = sails.config.zeCommon;
// const Users = require('../models/Users');


transporter = mailer.createTransport({
  service: 'gmail',
  auth: {
    user: sails.config.security.admin.email.address,
    pass: sails.config.security.admin.email.password
  }
});

emailGeneratedCode = function (options) {
  var url = options.verifyURL,
    email = options.email;


  message = 'Hello!';
  message += '<br/>';
  message += 'Please visit the verification link to complete the registration process.';
  message += '<br/><br/>';
  message += 'Account with ' + options.type + " : " + options.id;
  message += '<br/><br/>';
  message += '<a href="';
  message += url;
  message += '">Verification Link</a>';
  message += '<br/>';

  transporter.sendMail({
    from: sails.config.security.admin.email.address,
    to: email,
    subject: 'Tbo Oauth App Account Registration',
    html: message
  }, function (err, info) {
    console.log("Email Response:", info);
  });

  return {
    status: 'success',
    url: url
  }
};

module.exports = {
  emailGeneratedCode: emailGeneratedCode,
  // **************Other Block Start******************
  currentUser: function(data,context){
    // console.log('cccccc data  :',context);
    // console.log('cccccc context  :',context);
    return context.identity;
    // res.json(context.identity);
  },
  registerUser_org: function (data, context) {
    var date = new Date();
    return API.Model(Users).create({
      username: data.username,
      email: data.email,
      password: data.password,
      is_active: true,
      is_customer: true,
      date_registered: date,
      date_verified: date
    }).then(function (user) {
      context.id = user.username;
      context.type = 'Username';
      return Tokens.generateToken({
        user_id: user.id,
        client_id: Tokens.generateTokenString()
      });
    }).then(function (token) {
      return emailGeneratedCode({
        id: context.id,
        type: context.type,
        verifyURL: sails.config.security.server.url + "/users/verify/" + data.email + "?code=" + token.code,
        email: data.email
      });
    });

  },

  // ---------------------------------
  registerUser_combo_v1: function (data, context) {
    var date = new Date();
    return API.Model(Users).create({
      // username: data.username,
      username: data.username,
      email: data.email,
      password: data.password,
      first_name: data.first_name ? data.first_name: '',
      last_name: data.last_name ? data.last_name: '',
      location: data.location ? data.location: '',
      phone: data.phone ? data.phone: '',
      is_active: true,
      is_customer: true,
      date_registered: date,
      date_verified: date
    }).then(function (user) {
      context.id = user.username;
      context.type = 'Username';
      return Tokens.generateToken({
        user_id: user.id,
        client_id: Tokens.generateTokenString()
      });
    }).then(function (token) {
      return {
        status: 'success',
        id: context.id,
        type: context.type,
        verifyURL: sails.config.security.server.url + "/users/verify/" + data.email + "?code=" + token.code,
        email: data.email,
      };
    }).catch(function(err){
      return {
        status: 'error',
        fieldErrors: err.Errors
      }
    });

  },
  // This registerUser Method Use For Only Api Based Registration
  registerUser: function (data, context) {
    let date = new Date();
    // ===============Custom Start======================
    let _formData = {
      username: data.username ? data.username.trim() : '',
      email: data.email ? data.email.trim() : '',
      password: data.password ? data.password.trim() : '',
      password_reset_code: Users.generateTokenString(),
      user_role: 4,
      nickname: '',
      first_name: data.first_name ? data.first_name.trim() : '',
      last_name: data.last_name ? data.last_name.trim() : '',
      display_name: '',
      date_registered: date,
      date_verified: date,
      is_active: true,
      is_superadmin: false,
      is_manager: false,
      is_apiuser: false,
      is_customer: true,
      is_show_menu: false,
      is_show_record_list: false,
      is_create_record: false,
      is_edit_record: false,
      is_delete_record: false,
      is_show_record: false,
      is_token_based_user: true,
      createdBy: '',
      createdByObj: {username: '', email: '', display_name: ''},
      updatedBy: '',
      updatedByObj: {username: '', email: '', display_name: ''}
    };
    // ***************Custom error hendle Start************
    // let first_name = data.first_name ? data.first_name.trim() : '';
    // let last_name= data.last_name ? data.last_name.trim() : '';
    // console.log('last_namelast_name', last_name);
    const customFieldErrors = {};
    if (!_formData.username) {
      customFieldErrors.username = {message: 'Username is Required'};
    }
    if (!_formData.email) {
      customFieldErrors.email = {message: 'Email is Required'};
    } else {
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (reg.test(_formData.email) == false) 
        {
            customFieldErrors.email = {message: 'Provide valid email address'};
        }
    }
    if (!_formData.password) {
      customFieldErrors.password = {message: 'Password is Required'};
    } else {
      if(_formData.password.length < 6) {
        customFieldErrors.password = {message: 'Password Min length is 6'};
      }
    }
    if (!_formData.first_name) {
      customFieldErrors.first_name = {message: 'First Name is Required'};
    }
    
    // if (!last_name) {
    //   customFieldErrors.last_name = {message: 'Last Nname is Required'};
    // }
    // console.log('Iam hereee', _formData)
    // console.log('Iam hereeerrRRR', customFieldErrors)
    return Promise.all([
      API.Model(Users).findOne({username: _formData.username}),
      API.Model(Users).findOne({email: _formData.email})
      ]).spread(function(extUsername, extEmail) {
        // console.log('BF extEmail---', extEmail);
        // console.log('BFextEmail---', extEmail);
        if(extUsername){
          // console.log('extUsername---', extUsername)
          customFieldErrors.username = {message: 'Username is already taken'};
        }
        if(extEmail){
          // console.log('extEmail---', extEmail)
          customFieldErrors.email = {message: 'Email Address is already taken'};
        }

        if (Object.keys(customFieldErrors).length) {
          throw customFieldErrors;
        } else {
      //  =================Create Start====================
      _formData.nickname = _formData.username ? (_formData.username).toLowerCase() : '';
      _formData.display_name = (_formData.first_name ? _formData.first_name : '') + (_formData.last_name ? (' ' + _formData.last_name) : '');
      return API.Model(Users).create(_formData).then(function (user) {
      context.id = user.username;
      context.type = 'Username';
      return Tokens.generateToken({
        user_id: user.id,
        // client_id: Tokens.generateTokenString() //If this line execute it will Create Again , When Login Because previous Cliend_id Not found at Client Table
        client_id: zeCommon.front_client_id
      });
    }).then(function (token) {
      return {
        status: 'success',
        id: context.id,
        type: context.type,
        verifyURL: sails.config.security.server.url + "/users/verify/" + data.email + "?code=" + token.code,
        email: data.email,
      };
    })
      //  =================Create End======================
        }
      }).catch(function(err){
        return {
          status: 'error',
          fieldErrors: err
        }
      });
    // ***************Custom error hendle End**************
    // ===============Custom End========================
  },
  
  // ---------------------------------
// This registerLocalUser Method use For Only User registration From Backend Who need User Token For Login By Access Token From Frontend
  registerLocalUser: function (data, context) {
    var date = new Date();
    return API.Model(Users).create({
      username: data.username,
      email: data.email,
      password: data.password,
      is_active: true,
      is_superadmin: true,
      date_registered: date,
      date_verified: date
    }).then(function (user) {
      context.id = user.username;
      context.type = 'Username';
      return Tokens.generateToken({
        user_id: user.id,
        client_id: Tokens.generateTokenString()
      });
    }).then(function (token) {
      return {
        status: 'success',
        url: sails.config.security.server.url + "/users/verify/" + data.email + "?code=" + token.code
      }
      // return emailGeneratedCode({
      //   id: context.id,
      //   type: context.type,
      //   verifyURL: sails.config.security.server.url + "/users/verify/" + data.email + "?code=" + token.code,
      //   email: data.email
      // });
    });

  },

  verifyUser: function (data, context) {
    return Tokens.authenticate({
      code: data.code,
      type: 'verification',
      email: data.email
    }).then(function (info) {
      var date = new Date();
      if (!info) return Promise.reject('Unauthorized');

      API.Model(Users).update(
        {
          username: info.identity.username
        },
        {
          date_verified: date
        }
      );

      return {
        verified: true,
        email: info.identity.email
      }
    });
  },
  // **************Other Block End********************
  

  
  // **************Client Block Start******************
  registerClient: function (data, context) {
    console.log('I am here '+'registerClient registration js')
    console.log('I am here tokes '+Tokens.generateTokenString())
    var date = new Date();
    return API.Model(Clients).create({
      client_id: Tokens.generateTokenString(),
      client_secret: Tokens.generateTokenString(),
      email: data.email,
      date_registered: date,
      date_verified: date
    }).then(function (client) {
      context.id = client.client_id;
      context.type = 'Client ID';

      return Tokens.generateToken({
        client_id: client.client_id
      });
    }).then(function (token) {
      return {
        status: 'success',
        url: sails.config.security.server.url + "/clients/verify/" + data.email + "?code=" + token.code
      }
    });
  },

  verifyClient: function (data, context) {
    console.log('In verification ');
    console.log('In verification Data is ==',data);

    return Tokens.authenticate({
      type: 'verification',
      code: data.code,
      email: data.email
    }).then(function (info) {
      var date = new Date();
      if (!info) return Promise.reject('Unauthorized');

      API.Model(Clients).update(
        {
          client_id: info.identity.client_id
        },
        {
          date_verified: date
        }
      );
console.log('In verify Client Id is  == ',info.identity.client_id);
      return {
        verified: true,
        email: info.identity.email
      };
    });
  },
  // **************Client Block End********************

  

  // **************Customer Block Start******************
  registerCustomer_old: function (data, context) {
    console.log('I am at REgitration registerCustomer');
    let date = new Date();
    // ===============Custom Start======================
    let _formData = {
      email: data.email ? data.email.trim() : '',
      password: data.password ? data.password.trim() : '',
      confirm_password: data.confirm_password ? data.confirm_password.trim() : '',
      password_reset_code: Users.generateTokenString(),
      user_type: 5,
      first_name: data.first_name ? data.first_name.trim() : '',
      last_name: data.last_name ? data.last_name.trim() : '',
      mobile_no: '',
      date_registered: date,
      date_verified: date,
      status: 2,
      is_token_based_user: true,
      createdBy: '',
      createdByObj: {username: '', email: '', display_name: ''},
      updatedBy: '',
      updatedByObj: {username: '', email: '', display_name: ''}
    };
    // ***************Custom error hendle Start************
    
    const customFieldErrors = {};
    
    if (!_formData.email) {
      customFieldErrors.email = {message: 'Email is Required'};
    } else {
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (reg.test(_formData.email) == false) 
        {
            customFieldErrors.email = {message: 'Provide valid email address'};
        }
    }

    if (!_formData.password) {
      customFieldErrors.password = {message: 'Password is Required'};
    } else {
      if(_formData.password.length < 6) {
        customFieldErrors.password = {message: 'Password Min length is 6'};
      } else{
        if(_formData.password != _formData.confirm_password) {
          customFieldErrors.confirm_password = {message: 'confirm Password not match'};
        }
      }
    }


    if (!_formData.first_name) {
      customFieldErrors.first_name = {message: 'First Name is Required'};
    }
    if (!_formData.last_name) {
      customFieldErrors.last_name = {message: 'First Name is Required'};
    }
    
    // if (!last_name) {
    //   customFieldErrors.last_name = {message: 'Last Nname is Required'};
    // }
    // console.log('Iam hereee', _formData)
    // console.log('Iam hereeerrRRR', customFieldErrors)
    return Promise.all([
      API.Model(Users).findOne({email: _formData.email})
      ]).spread(function(extEmail) {
        // console.log('BF extEmail---', extEmail);
        
        if(extEmail){
          // console.log('extEmail---', extEmail)
          customFieldErrors.email = {message: 'Email Address is already taken'};
        }

        if (Object.keys(customFieldErrors).length) {
          throw customFieldErrors;
        } else {
      //  =================Create Start====================
      return API.Model(Users).create(_formData).then(function (user) {
      context.id = user.username;
      context.type = 'Username';
      return Tokens.generateToken({
        user_id: user.id,
        // client_id: Tokens.generateTokenString() //If this line execute it will Create Again , When Login Because previous Cliend_id Not found at Client Table
        client_id: zeCommon.front_client_id
      });
    }).then(function (token) {
      return {
        status: 'success',
        id: context.id,
        type: context.type,
        // verifyURL: sails.config.security.server.url + "/users/verify/" + data.email + "?code=" + token.code,
        verifyURL: sails.config.security.server.url + "/customer/verify/" + data.email + "?code=" + token.code,
        email: data.email,
      };
    })
      //  =================Create End======================
        }
      }).catch(function(err){
        return {
          status: 'error',
          fieldErrors: err
        }
      });
    // ***************Custom error hendle End**************
    // ===============Custom End========================
  },

  verifyCustomer_old: function (data, context) {
    console.log('I am at Registartion verifyCustomer', data.code);
    return Tokens.authenticate({
      code: data.code,
      type: 'verification',
      email: data.email
    }).then(function (info) {
      // console.log('I am at Registartion info', info);
      console.log('I am at Registartion info');
      var date = new Date();
      if (!info) return Promise.reject('Unauthorized');

      API.Model(Users).update(
        {
          date_verified: date
        }
      );

      return {
        verified: true,
        email: info.identity.email,
      }
    });
  },

  registerCustomer_old2: function (data, context) {
    console.log('I am at REgitration registerCustomer');
    let date = new Date();
    // ===============Custom Start======================
    let _formData = {
      first_name: data.first_name ? data.first_name.trim() : '',
      last_name: data.last_name ? data.last_name.trim() : '',
      email: data.email ? data.email.trim() : '',
      password: data.password ? data.password.trim() : '',
      confirm_password: data.confirm_password ? data.confirm_password.trim() : '',
      password_reset_code: Users.generateTokenString(),
      user_type: 5,
      is_token_based_user: true,
      status: 1,
      date_registered: date,
      date_verified: date,

      createdBy: '',
      createdByObj: {email: ''},
      updatedBy: '',
      updatedByObj: {email: ''}
    };
    // ***************Custom error hendle Start************
    const customFieldErrors = {};
    
    if (!_formData.email) {
      customFieldErrors.email = {message: 'Email is Required'};
    } else {
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (reg.test(_formData.email) == false) 
        {
            customFieldErrors.email = {message: 'Provide valid email address'};
        }
    }
    if (!_formData.password) {
      customFieldErrors.password = {message: 'Password is Required'};
    } else {
      if(_formData.password.length < 6) {
        customFieldErrors.password = {message: 'Password Min length is 6'};
      } else{
        if(_formData.password != _formData.confirm_password) {
          customFieldErrors.confirm_password = {message: 'confirm Password is not match'};
        }
      }
    }
    
    
    return Promise.all([
      API.Model(Users).findOne({email: _formData.email})
      ]).spread(function(extEmail) {
        if(extEmail){
          customFieldErrors.email = {message: 'Email Address is already taken'};
        }

        if (Object.keys(customFieldErrors).length) {
          throw customFieldErrors;
        } else {
            
            return [API.Model(Users).create(_formData)]
        } //<==Else  End
      }).spread(function(creUser) {

        delete creUser.password;
        

        context.id = creUser.email;
        context.type = 'Username';
        return Tokens.generateToken({
          user_id: creUser.id,
          client_id: zeCommon.front_client_id
        });

      }).then(function (token) {
        // console.log('token', token);
        return {
          status: 'success',
          id: context.id,
          type: context.type,
          // verifyURL: sails.config.security.server.url + "/users/verify/" + data.email + "?code=" + token.code,
          verifyURL: sails.config.security.server.url + "/customer/verify/" + data.email + "?code=" + token.code,
          email: data.email,
        };
      }).catch(TypeError, function(e) {
        //If it is a TypeError, will end up here because
        //it is a type error to reference property of undefined
        console.log('TypeError', e);
    }).catch(ReferenceError, function(e) {
      console.log('ReferenceError', e);
        //Will end up here if a was never declared at all
    }).catch(function(err){
      // console.log(err);
        return {
          status: 'error3',
          fieldErrors: err
        }
      });
    // ***************Custom error hendle End**************
    // ===============Custom End========================
  },
  registerCustomer: function (data, context) {
    console.log('I am at REgitration registerCustomer');
    let date = new Date();
    // ===============Custom Start======================
    let _formData = {
      first_name: data.first_name ? data.first_name.trim() : '',
      last_name: data.last_name ? data.last_name.trim() : '',
      email: data.email ? data.email.trim() : '',
      password: data.password ? data.password.trim() : '',
      confirm_password: data.confirm_password ? data.confirm_password.trim() : '',
      password_reset_code: Users.generateTokenString(),
      user_type: 5,
      is_token_based_user: true,
      status: 1,
      date_registered: date,
      date_verified: date,

      createdBy: '',
      createdByObj: {email: ''},
      updatedBy: '',
      updatedByObj: {email: ''}
    };
    // ***************Custom error hendle Start************
    const customFieldErrors = {};
    
    if (!_formData.email) {
      customFieldErrors.email = {message: 'Email is Required'};
    } else {
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (reg.test(_formData.email) == false) 
        {
            customFieldErrors.email = {message: 'Provide valid email address'};
        }
    }
    if (!_formData.password) {
      customFieldErrors.password = {message: 'Password is Required'};
    } else {
      if(_formData.password.length < 6) {
        customFieldErrors.password = {message: 'Password Min length is 6'};
      } else{
        if(_formData.password != _formData.confirm_password) {
          customFieldErrors.confirm_password = {message: 'confirm Password is not match'};
        }
      }
    }
    
    
    return Promise.all([
      API.Model(Users).findOne({email: _formData.email})
      ]).spread(function(extEmail) {
        if(extEmail){
          customFieldErrors.email = {message: 'Email Address is already taken'};
        }

        if (Object.keys(customFieldErrors).length) {
          throw customFieldErrors;
        } else {
          let _profileData= {
            address: '',
          };
            return [API.Model(Users).create(_formData), CustomerProfile.create(_profileData)]
        } //<==Else  End
      }).spread(function(creUser, creCustomerProfile) {

        delete creUser.password;
        creUser.customerProfile = creCustomerProfile.id;
        creUser.save();

        creCustomerProfile.user = creUser.id;
        creCustomerProfile.save();

        context.id = creUser.email;
        context.type = 'Username';
        return Tokens.generateToken({
          user_id: creUser.id,
          client_id: zeCommon.front_client_id
        });

      }).then(function (token) {
        // console.log('token', token);
        return {
          status: 'success',
          id: context.id,
          type: context.type,
          // verifyURL: sails.config.security.server.url + "/users/verify/" + data.email + "?code=" + token.code,
          verifyURL: sails.config.security.server.url + "/customer/verify/" + data.email + "?code=" + token.code,
          email: data.email,
        };
      }).catch(TypeError, function(e) {
        //If it is a TypeError, will end up here because
        //it is a type error to reference property of undefined
        console.log('TypeError', e);
    }).catch(ReferenceError, function(e) {
      console.log('ReferenceError', e);
        //Will end up here if a was never declared at all
    }).catch(function(err){
      // console.log(err);
        return {
          status: 'error3',
          fieldErrors: err
        }
      });
    // ***************Custom error hendle End**************
    // ===============Custom End========================
  },

  verifyCustomer: function (data, context) {
    console.log('I am at Registartion verifyCustomer', data.code);
    return Tokens.authenticate({
      code: data.code,
      type: 'verification',
      email: data.email
    }).then(function (info) {
      console.log('I am at Registartion info', info);
      // console.log('I am at Registartion info');
      var date = new Date();
      if (!info) return Promise.reject('Unauthorized');

      API.Model(Users).update(
        {
          id: info.identity.id
        },
        {
          date_verified: date
        }
      );

      return {
        verified: true,
        email: info.identity.email,
        // username: info.identity.username
      }
    });
  },
  // **************Customer Block End********************


  // **************Business Block Start******************
  registerBusiness_ok: function (data, context) {
    console.log('I am at REgitration registerBusiness');
    let date = new Date();
    // ===============Custom Start======================
    let _formData = {
      email: data.email ? data.email.trim() : '',
      password: data.password ? data.password.trim() : '',
      confirm_password: data.confirm_password ? data.confirm_password.trim() : '',
      password_reset_code: Users.generateTokenString(),
      user_type: 4,
      business_name: data.business_name ? data.business_name.trim() : '',

      is_token_based_user: true,
      createdBy: '',
      createdByObj: {email: ''},
      updatedBy: '',
      updatedByObj: {email: ''}
    };
    // ***************Custom error hendle Start************
    // let first_name = data.first_name ? data.first_name.trim() : '';
    // let last_name= data.last_name ? data.last_name.trim() : '';
    // console.log('last_namelast_name', last_name);
    const customFieldErrors = {};
    
    if (!_formData.email) {
      customFieldErrors.email = {message: 'Email is Required'};
    } else {
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (reg.test(_formData.email) == false) 
        {
            customFieldErrors.email = {message: 'Provide valid email address'};
        }
    }
    if (!_formData.password) {
      customFieldErrors.password = {message: 'Password is Required'};
    } else {
      if(_formData.password.length < 6) {
        customFieldErrors.password = {message: 'Password Min length is 6'};
      } else{
        if(_formData.password != _formData.confirm_password) {
          customFieldErrors.confirm_password = {message: 'confirm Password is not match'};
        }
      }
    }
    if (!_formData.business_name) {
      customFieldErrors.business_name = {message: 'Business Name is Required'};
    }
    
    // if (!last_name) {
    //   customFieldErrors.last_name = {message: 'Last Nname is Required'};
    // }
    // console.log('Iam hereee', _formData)
    // console.log('Iam hereeerrRRR', customFieldErrors)
    return Promise.all([
      API.Model(Users).findOne({email: _formData.email})
      ]).spread(function(extEmail) {
        // console.log('BFextEmail---', extEmail);
        
        if(extEmail){
          // console.log('extEmail---', extEmail)
          customFieldErrors.email = {message: 'Email Address is already taken'};
        }

        if (Object.keys(customFieldErrors).length) {
          throw customFieldErrors;
        } else {
      //  =================Create Start====================
      return API.Model(Users).create(_formData).then(function (user) {
      // context.id = user.username;
      console.log('User created');
      context.id = user.email;
      context.type = 'Username';

      let _profileData= {
        business_name: data.business_name ? data.business_name.trim() : '',
        user: user.id
      };
      return [user, BusinessProfile.create(_profileData)]
      // return Tokens.generateToken({
      //   user_id: user.id,
      //   // client_id: Tokens.generateTokenString() //If this line execute it will Create Again , When Login Because previous Cliend_id Not found at Client Table
      //   client_id: zeCommon.front_client_id
      // });


    }).spread(function(user, bussProfile) {

      console.log('User user', user.id);
      console.log('User bussProfile created', bussProfile.id);
      let _editFormUser = {
        businessProfile: bussProfile.id
      }
      return [API.Model(Users).update({id: user.id}, _editFormUser), Tokens.generateToken({user_id: user.id, client_id: zeCommon.front_client_id})]
    }).spread(function (updBusiPro, token) {
      console.log('User updBusiPro updated', updBusiPro.id);
      console.log('User token ', token);
      return {
        status: 'success',
        id: context.id,
        type: context.type,
        // verifyURL: sails.config.security.server.url + "/users/verify/" + data.email + "?code=" + token.code,
        verifyURL: sails.config.security.server.url + "/business/verify/" + data.email + "?code=" + token.code,
        email: data.email,
      };
    }).catch(function(err){
      console.log('User err ', err);
    })
      //  =================Create End======================
        }
      }).catch(function(err){
        return {
          status: 'error',
          fieldErrors: err
        }
      });
    // ***************Custom error hendle End**************
    // ===============Custom End========================
  },

  registerBusiness_ok2: function (data, context) {
    console.log('I am at REgitration registerBusiness');
    let date = new Date();
    // ===============Custom Start======================
    let _formData = {
      email: data.email ? data.email.trim() : '',
      password: data.password ? data.password.trim() : '',
      confirm_password: data.confirm_password ? data.confirm_password.trim() : '',
      password_reset_code: Users.generateTokenString(),
      user_type: 4,
      business_name: data.business_name ? data.business_name.trim() : '',
      is_token_based_user: true,
      status: 1,
      date_registered: date,
      date_verified: date,

      createdBy: '',
      createdByObj: {email: ''},
      updatedBy: '',
      updatedByObj: {email: ''}
    };
    // ***************Custom error hendle Start************
    const customFieldErrors = {};
    
    if (!_formData.email) {
      customFieldErrors.email = {message: 'Email is Required'};
    } else {
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (reg.test(_formData.email) == false) 
        {
            customFieldErrors.email = {message: 'Provide valid email address'};
        }
    }
    if (!_formData.password) {
      customFieldErrors.password = {message: 'Password is Required'};
    } else {
      if(_formData.password.length < 6) {
        customFieldErrors.password = {message: 'Password Min length is 6'};
      } else{
        if(_formData.password != _formData.confirm_password) {
          customFieldErrors.confirm_password = {message: 'confirm Password is not match'};
        }
      }
    }
    if (!_formData.business_name) {
      customFieldErrors.business_name = {message: 'Business Name is Required'};
    }
    
    return Promise.all([
      API.Model(Users).findOne({email: _formData.email})
      ]).spread(function(extEmail) {
        if(extEmail){
          customFieldErrors.email = {message: 'Email Address is already taken'};
        }

        if (Object.keys(customFieldErrors).length) {
          throw customFieldErrors;
        } else {
            let _profileData= {
              business_name: data.business_name ? data.business_name.trim() : '',
            };
            return [API.Model(Users).create(_formData), BusinessProfile.create(_profileData)]
        } //<==Else  End
      }).spread(function(creUser, creBussProfile) {

        delete creUser.password;
        creUser.businessProfile = creBussProfile.id;
        creUser.save();

        creBussProfile.user = creUser.id;
        creBussProfile.save();

        context.id = creUser.email;
        context.type = 'Username';
        return Tokens.generateToken({
          user_id: creUser.id,
          client_id: zeCommon.front_client_id
        });

      }).then(function (token) {
        // console.log('token', token);
        return {
          status: 'success',
          id: context.id,
          type: context.type,
          // verifyURL: sails.config.security.server.url + "/users/verify/" + data.email + "?code=" + token.code,
          verifyURL: sails.config.security.server.url + "/business/verify/" + data.email + "?code=" + token.code,
          email: data.email,
        };
      }).catch(TypeError, function(e) {
        //If it is a TypeError, will end up here because
        //it is a type error to reference property of undefined
        console.log('TypeError', e);
    }).catch(ReferenceError, function(e) {
      console.log('ReferenceError', e);
        //Will end up here if a was never declared at all
    }).catch(function(err){
      // console.log(err);
        return {
          status: 'error3',
          fieldErrors: err
        }
      });
    // ***************Custom error hendle End**************
    // ===============Custom End========================
  },
  registerBusiness: function (data, context) {
    console.log('I am at REgitration registerBusiness');
    let date = new Date();
    // ===============Custom Start======================
    let _formData = {
      email: data.email ? data.email.trim() : '',
      password: data.password ? data.password.trim() : '',
      confirm_password: data.confirm_password ? data.confirm_password.trim() : '',
      password_reset_code: Users.generateTokenString(),
      user_type: 4,
      business_name: data.business_name ? data.business_name.trim() : '',
      is_token_based_user: true,
      status: 1,
      date_registered: date,
      date_verified: date,

      createdBy: '',
      createdByObj: {email: ''},
      updatedBy: '',
      updatedByObj: {email: ''}
    };
    // ***************Custom error hendle Start************
    const customFieldErrors = {};
    
    if (!_formData.email) {
      customFieldErrors.email = {message: 'Email is Required'};
    } else {
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (reg.test(_formData.email) == false) 
        {
            customFieldErrors.email = {message: 'Provide valid email address'};
        }
    }
    if (!_formData.password) {
      customFieldErrors.password = {message: 'Password is Required'};
    } else {
      if(_formData.password.length < 6) {
        customFieldErrors.password = {message: 'Password Min length is 6'};
      } else{
        if(_formData.password != _formData.confirm_password) {
          customFieldErrors.confirm_password = {message: 'confirm Password is not match'};
        }
      }
    }
    if (!_formData.business_name) {
      customFieldErrors.business_name = {message: 'Business Name is Required'};
    }

    let _creSlugData = {
      model: 'businessprofile',
      type: 'slug',
      from: _formData.business_name,
      defaultValue: 'slug'
    };
    // ***************Custom error hendle End**************
    
    return Promise.all([
      ZeslugService.slugForCreate(_creSlugData), //<--Generate slug
      API.Model(Users).findOne({email: _formData.email}),
      ]).spread(function(creSlug, extEmail) {
        if(extEmail){
          customFieldErrors.email = {message: 'Email Address is already taken'};
        }

        if (Object.keys(customFieldErrors).length) {
          throw customFieldErrors;
        } else {
            let _profileData= {
              business_name: data.business_name ? data.business_name.trim() : '',
              slug: creSlug,
            };
            return [API.Model(Users).create(_formData), BusinessProfile.create(_profileData)]
        } //<==Else  End
      }).spread(function(creUser, creBussProfile) {

        delete creUser.password;
        creUser.businessProfile = creBussProfile.id;
        creUser.save();

        creBussProfile.user = creUser.id;
        creBussProfile.save();

        context.id = creUser.email;
        context.type = 'Username';
        return Tokens.generateToken({
          user_id: creUser.id,
          client_id: zeCommon.front_client_id
        });

      }).then(function (token) {
        // console.log('token', token);
        return {
          status: 'success',
          id: context.id,
          type: context.type,
          // verifyURL: sails.config.security.server.url + "/users/verify/" + data.email + "?code=" + token.code,
          verifyURL: sails.config.security.server.url + "/business/verify/" + data.email + "?code=" + token.code,
          email: data.email,
        };
      }).catch(TypeError, function(e) {
        //If it is a TypeError, will end up here because
        //it is a type error to reference property of undefined
        console.log('TypeError', e);
    }).catch(ReferenceError, function(e) {
      console.log('ReferenceError', e);
        //Will end up here if a was never declared at all
    }).catch(function(err){
      // console.log(err);
        return {
          status: 'error3',
          fieldErrors: err
        }
      });
    // ***************Custom error hendle End**************
    // ===============Custom End========================
  },

  verifyBusiness: function (data, context) {
    console.log('I am at Registartion verifyBusiness', data.code);
    return Tokens.authenticate({
      code: data.code,
      type: 'verification',
      email: data.email
    }).then(function (info) {
      console.log('I am at Registartion info', info);
      // console.log('I am at Registartion info');
      var date = new Date();
      if (!info) return Promise.reject('Unauthorized');

      API.Model(Users).update(
        {
          id: info.identity.id
        },
        {
          date_verified: date
        }
      );

      return {
        verified: true,
        email: info.identity.email,
        // username: info.identity.username
      }
    });
  },
  // **************Business Block End********************
};
