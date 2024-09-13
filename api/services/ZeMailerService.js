





var fs = require('fs');
var moment = require('moment');

var Promise = require('bluebird');
var request = require('request');

var _ = require('lodash');
var Q = require('q');
var uuidv4 = require('uuid/v4');


let zeEmail = sails.config.zeEmail;
let zeCommon = sails.config.zeCommon;
module.exports = {

    testEmail: function (obj) {
      sails.hooks.email.send(
        'test', 
        {
        Name: obj.name
        },
        {
        from: 'ctgrobin@combosoft.co.uk',
        to: obj.email,
        subject: 'Welcome Email'
        },
        function(err) {console.log(err || 'Mail Sent!');}
        )

    },
    orderEmail: function (obj) {
      // console.log('orderEmail Toemail', obj.order.customerObj.email); 
      sails.hooks.email.send(
        'order', 
        {
          order: obj.order,
          order_item: obj.order_item
        },
        {
        from: '"Top Brand Outlet Ltd" no-reply@topbrandoutlet.co.uk',
        to: obj.order.customerObj.email,
        // to: 'zqarif@gmail.com',
        subject: 'Order confirmation for '+obj.order.invoice
        },
        function(err) {console.log(err || 'Order Mail Sent!');}
        )
    
    },
    passwordResetEmail: function (obj) {
      sails.hooks.email.send(
        'password-reset', 
        {
          email: obj.email,
          display_name: obj.display_name,
          password_reset_code: obj.password_reset_code,
          front_url: zeCommon.front_url,
        },
        {
        from: 'no-reply@topbrandoutlet.co.uk',
        to: obj.email,
        // to: 'zqarif@gmail.com',
        subject: 'Top Brand Outlet Ltd Password Reset'
        },
        function(err) {console.log(err || 'Mail Sent!');}
        )
    
      },

      orderDispatchEmail: function (obj) {
        // console.log('order_item', obj.order_item);  
        // console.log('orderDispatchEmail Toemail', obj.order.customerObj.email);  
        sails.hooks.email.send(
            'order-dispatch', 
            {
              order: obj.order,
              order_item: obj.order_item,
              moment: obj.moment
            },
            {
            from: '"Top Brand Outlet Ltd" no-reply@topbrandoutlet.co.uk',
            to: obj.order.customerObj.email,
            // to: 'zqarif@gmail.com',
            subject: 'TBO Invoice# '+obj.order.invoice
            },
            function(err) {console.log(err || 'Dispatch Mail Sent!');}
            )
        
        },



};
