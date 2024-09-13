/**
 * FrontUserController
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

    accountDetails: function (req, res) {
      let tokenUser = req.identity || '';
      // =====================================
      Users.findOne({id: tokenUser.id}).then(function (singleData){
        if (!singleData) {
            return res.send({
              status: 'error',
              message: 'customer not found',
            });
        }else{
          let toData = {
            first_name : singleData.first_name,
            last_name : singleData.last_name,
            email : singleData.email,
            street_address : singleData.street_address,
            street_address2 : singleData.street_address2,
            street_address3 : singleData.street_address3,
            post_code : singleData.post_code,
            phone : singleData.phone,
            country : singleData.country,
            city : singleData.city,
            county : singleData.county,

            billing_email : singleData.billing_email,
            billing_street_address : singleData.billing_street_address,
            billing_street_address2 : singleData.billing_street_address2,
            billing_street_address3 : singleData.billing_street_address3,
            billing_post_code : singleData.billing_post_code,
            billing_phone : singleData.billing_phone,
            billing_country : singleData.billing_country,
            billing_city : singleData.billing_city,
            billing_county : singleData.billing_county,

            shipping_email : singleData.shipping_email,
            shipping_street_address : singleData.shipping_street_address,
            shipping_street_address2 : singleData.shipping_street_address2,
            shipping_street_address3 : singleData.shipping_street_address3,
            shipping_post_code : singleData.shipping_post_code,
            shipping_phone : singleData.shipping_phone,
            shipping_country : singleData.shipping_country,
            shipping_city : singleData.shipping_city,
            shipping_county : singleData.shipping_county,
          }
          return res.send({
            status: 'success',
            message: 'update success',
            fieldErrors: {},
            data: toData
         });
        }
      })
        .catch(function (err) {
          return res.send({
            status: 'error',
            message: 'server error',
          });
        });
      // =====================================
    },
    

    accountDetailsUpdate: function (req, res) {
      let tokenUser = req.identity || '';
      const customFieldErrors = {};

      let _editData = {
          first_name: req.param("first_name")  ? req.param("first_name").trim() : '',
          last_name: req.param("last_name")  ? req.param("last_name").trim() : '',
          street_address: req.param("street_address")  ? req.param("street_address").trim() : '',
          street_address2: req.param("street_address2")  ? req.param("street_address2").trim() : '',
          street_address3: req.param("street_address3")  ? req.param("street_address3").trim() : '',
          post_code: req.param("post_code")  ? req.param("post_code").trim() : '',
          phone: req.param("phone")  ? req.param("phone").trim() : '',
          country: req.param("country")  ? req.param("country").trim() : '',
          city: req.param("city")  ? req.param("city").trim() : '',
          county: req.param("county")  ? req.param("county").trim() : '',

          billing_email: tokenUser.email,
          billing_street_address: req.param("street_address")  ? req.param("street_address").trim() : '',
          billing_street_address2: req.param("street_address2")  ? req.param("street_address2").trim() : '',
          billing_street_address3: req.param("street_address3")  ? req.param("street_address3").trim() : '',
          billing_post_code: req.param("post_code")  ? req.param("post_code").trim() : '',
          billing_phone: req.param("phone")  ? req.param("phone").trim() : '',
          billing_country: req.param("country")  ? req.param("country").trim() : '',
          billing_city: req.param("city")  ? req.param("city").trim() : '',
          billing_county: req.param("county")  ? req.param("county").trim() : '',

          shipping_email: tokenUser.email,
          shipping_street_address: req.param("street_address")  ? req.param("street_address").trim() : '',
          shipping_street_address2: req.param("street_address2")  ? req.param("street_address2").trim() : '',
          shipping_street_address3: req.param("street_address3")  ? req.param("street_address3").trim() : '',
          shipping_post_code: req.param("post_code")  ? req.param("post_code").trim() : '',
          shipping_phone: req.param("phone")  ? req.param("phone").trim() : '',
          shipping_country: req.param("country")  ? req.param("country").trim() : '',
          shipping_city: req.param("city")  ? req.param("city").trim() : '',
          shipping_county: req.param("county")  ? req.param("county").trim() : '',
          
          updatedBy: tokenUser.id,
          updatedByObj: {username: tokenUser.username, email: tokenUser.email, display_name: tokenUser.display_name},
        };

        if (!_editData.first_name) {
          customFieldErrors.first_name = {message: 'First Name is Required'};
        }

        if (!_editData.street_address) {
          customFieldErrors.street_address = {message: 'Street Address is Required'};
        }

        if (!_editData.post_code) {
          customFieldErrors.post_code = {message: 'Post Code is Required'};
        }

        if (!_editData.phone) {
          customFieldErrors.phone = {message: 'Phone is Required'};
        }

        if (!_editData.country) {
          customFieldErrors.country = {message: 'Country is Required'};
        }

        if (!_editData.city) {
          customFieldErrors.city = {message: 'City is Required'};
        }

        if (Object.keys(customFieldErrors).length) {
          return res.send({
            status: 'error',
            message: 'field error',
            fieldErrors: customFieldErrors,
            remoteData: _editData
        });

        } else {
          return Users.update({id: tokenUser.id}, _editData).then(function (_updateSingle) {
              let toData =_editData;
              console.log('toDatatoDatatoData', toData);
              return res.send({
                status: 'success',
                message: 'update success',
                fieldErrors: {},
                data: toData
             });
            }).catch(function(err){
                return res.send({
                  status: 'error',
                  message: 'server error',
                });
            });

        }
  },

    accountBillingDetailsUpdate: function (req, res) {
        let tokenUser = req.identity || '';
        const customFieldErrors = {};

        let _editData = {
            billing_email: req.param("billing_email")  ? req.param("billing_email").trim() : '',
            billing_street_address: req.param("billing_street_address")  ? req.param("billing_street_address").trim() : '',
            billing_street_address2: req.param("billing_street_address2")  ? req.param("billing_street_address2").trim() : '',
            billing_street_address3: req.param("billing_street_address3")  ? req.param("billing_street_address3").trim() : '',
            billing_post_code: req.param("billing_post_code")  ? req.param("billing_post_code").trim() : '',
            billing_phone: req.param("billing_phone")  ? req.param("billing_phone").trim() : '',
            billing_country: req.param("billing_country")  ? req.param("billing_country").trim() : '',
            billing_city: req.param("billing_city")  ? req.param("billing_city").trim() : '',
            billing_county: req.param("billing_county")  ? req.param("billing_county").trim() : '',

            updatedBy: tokenUser.id,
            updatedByObj: {username: tokenUser.username, email: tokenUser.email, display_name: tokenUser.display_name},
          };


          if (!_editData.billing_email) {
            customFieldErrors.billing_email = {message: 'Email is Required'};
          } else {
            let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (reg.test(_editData.billing_email) == false) 
              {
                  customFieldErrors.billing_email = {message: 'Provide valid email address'};
              }
          }

          if (!_editData.billing_street_address) {
            customFieldErrors.billing_street_address = {message: 'Street Address is Required'};
          }

          if (!_editData.billing_post_code) {
            customFieldErrors.billing_post_code = {message: 'Post Code is Required'};
          }

          if (!_editData.billing_country) {
            customFieldErrors.billing_country = {message: 'Country is Required'};
          }

          if (!_editData.billing_city) {
            customFieldErrors.billing_city = {message: 'City is Required'};
          }

          if (Object.keys(customFieldErrors).length) {
            return res.send({
              status: 'error',
              message: 'field error',
              fieldErrors: customFieldErrors,
              data: _editData
          });
  
          } else {
            return Users.update({id: tokenUser.id}, _editData).then(function (_updateSingle) {
                let toData =_editData;
                console.log('toDatatoDatatoData', toData);
                return res.send({
                  status: 'success',
                  message: 'update success',
                  fieldErrors: {},
                  data: toData
               });
              }).catch(function(err){
                return res.send({
                  status: 'error',
                  message: 'update fail',
                });
            });

          }

        

    },

    accountShippingDetailsUpdate: function (req, res) {
      let tokenUser = req.identity || '';
      const customFieldErrors = {};

      let _editData = {
          shipping_email: req.param("shipping_email")  ? req.param("shipping_email").trim() : '',
          shipping_street_address: req.param("shipping_street_address")  ? req.param("shipping_street_address").trim() : '',
          shipping_street_address2: req.param("shipping_street_address2")  ? req.param("shipping_street_address2").trim() : '',
          shipping_street_address3: req.param("shipping_street_address3")  ? req.param("shipping_street_address3").trim() : '',
          shipping_post_code: req.param("shipping_post_code")  ? req.param("shipping_post_code").trim() : '',
          shipping_phone: req.param("shipping_phone")  ? req.param("shipping_phone").trim() : '',
          shipping_country: req.param("shipping_country")  ? req.param("shipping_country").trim() : '',
          shipping_city: req.param("shipping_city")  ? req.param("shipping_city").trim() : '',
          shipping_county: req.param("shipping_county")  ? req.param("shipping_county").trim() : '',
          
          updatedBy: tokenUser.id,
          updatedByObj: {username: tokenUser.username, email: tokenUser.email, display_name: tokenUser.display_name},
        };

        if (!_editData.shipping_email) {
          customFieldErrors.shipping_email = {message: 'Email is Required'};
        } else {
          let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
          if (reg.test(_editData.shipping_email) == false) 
            {
                customFieldErrors.shipping_email = {message: 'Provide valid email address'};
            }
        }

        if (!_editData.shipping_street_address) {
          customFieldErrors.shipping_street_address = {message: 'Street Address is Required'};
        }

        if (!_editData.shipping_post_code) {
          customFieldErrors.shipping_post_code = {message: 'Post Code is Required'};
        }

        if (!_editData.shipping_country) {
          customFieldErrors.shipping_country = {message: 'Country is Required'};
        }

        if (!_editData.shipping_city) {
          customFieldErrors.shipping_city = {message: 'City is Required'};
        }

        if (Object.keys(customFieldErrors).length) {
          return res.send({
            status: 'error',
            message: 'field error',
            fieldErrors: customFieldErrors,
            data: _editData
        });

        } else {
          return Users.update({id: tokenUser.id}, _editData).then(function (_updateSingle) {
              let toData =_editData;
              // console.log('toDatatoDatatoData', toData);
              return res.send({
                status: 'success',
                message: 'update success',
                fieldErrors: {},
                data: toData
             });
            }).catch(function(err){
              return res.send({
                status: 'error',
                message: 'update fail',
              });
          });

        }
  },
    
    

};

