/**
 * FrontCustomerProtectedController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let moment = require('moment');
let Promise = require('bluebird');
let _ = require('lodash');
let randToken = require('rand-token');
let mailer = require('nodemailer');
let fs = require('fs-extra');
module.exports = {
    _config: {
        actions: false,
        shortcuts: false,
        rest: true
    },
    //@@@@@@@@@@@@@ Account Settings Start@@@@@@@@@@@@
    accountInformationAll: function (req, res) {
      let tokenUser = req.identity || '';
      let customerProfileId = tokenUser.customerProfile;
      let userId = tokenUser.id;
      let _qryData = {
        id: customerProfileId,
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        State.find({status: 1},{select: ['name']}).sort('name ASC'), //<--All record For Show at form 
        // CustomerProfile.findOne({select: ['id','business_name','official_email','official_phone', 'Official_address_line1','city','state','zip','website_link','history','image']}).where(_qryData),
        CustomerProfile.findOne(_qryData),
        // Users.findOne({select: ['id','email','first_name','last_name,']}).where({id: userId}),
        Users.findOne({id: userId}),
      ]).spread(function(allState, extProfile, extUser) {
        if(extProfile && extUser){
            delete extProfile.id;
            delete extUser.id;
            delete extUser.password;

            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              allState: allState,
              customerProfile: extProfile,
              customer: extUser,
              message: 'Profile data found Success fully',
            });
        }else {
          return res.send({
            status: 'error',
            status_code: 33,
            actionStatus: 0,
            message: 'Profile Not found',
          });
        }

      }).catch(TypeError, function(err) {
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err

        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError',err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('errerrerr', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err

        });
      });
    },
    accountInformationSave: function (req, res) {
      let tokenUser = req.identity || '';
      let customerProfileId = tokenUser.customerProfile;
      let userId = tokenUser.id;
      let data = req.param("data");
      // console.log('====', data);

      let main_image = data.image ? data.image : '';
      let oldImage = data.old_image ? data.old_image : '';

      let _profileData = {
            gender: data.gender ? data.gender : 0,
            mobile_no: data.mobile_no ? data.mobile_no.trim() : '',
            address: data.address ? data.address.trim() : '',
            state: data.state ? data.state.trim() : '',
            city: data.city ? data.city.trim() : '',
            zip: data.zip ? data.zip.trim() : '',
          };
      let _userData = {
          first_name: data.first_name ? data.first_name.trim() : '',
          last_name: data.last_name ? data.last_name.trim() : '',
      }

      // ***************Custom error hendle Start************
      const customFieldErrors = {};
     
      
      if (!_profileData.gender) {
        customFieldErrors.gender = {message: 'Gender is Required'};
      }
      if (!_profileData.mobile_no) {
        customFieldErrors.mobile_no = {message: 'Phone is Required'};
      }
      if (!_profileData.address) {
        customFieldErrors.address = {message: 'Address is Required'};
      }

      
      if (!_profileData.city) {
        customFieldErrors.city = {message: 'City is Required'};
      }
      if (!_profileData.zip) {
        customFieldErrors.zip = {message: 'ZIP is Required'};
      }
      
      // User Data Start
      if (!_userData.first_name) {
        customFieldErrors.first_name = {message: 'First name is Required'};
      }
      if (!_userData.last_name) {
        customFieldErrors.last_name = {message: 'Last name is Required'};
      }



      // ***************Custom error hendle End**************
      // console.log('i am _qryData', _qryData);
      let fileSaveLocation = '.tmp/public/uploads/customer-image';
      let fileCopyLocation = 'assets/uploads/customer-image';

      return Promise.all([
        State.find({status: 1},{select: ['name']}).sort('name ASC'), //<--All record For Show at form
        ZeBase64ImageService.imageCreate(main_image, oldImage, 400, 300, fileSaveLocation, fileCopyLocation, 1), //<--For image Download From Url 
        State.findOne({id: _profileData.state},{select: ['name', 'country']}),
      ]).spread(function(allState, main_image_Ret, extState) {

        if (!_profileData.state) {
          customFieldErrors.state = {message: 'State is Required'};
        }else{
          if(!extState){
            customFieldErrors.state = {message: 'State is invalid'};
          } else {
            _profileData.country = extState.country;
          }
        }
        // ============================ Image Strat===============================
            // console.log('main_image_Ret update', main_image_Ret);
            if(!main_image_Ret.errorFound){
              _profileData.image = main_image_Ret.coreFileName;
              if(main_image_Ret.coreFileName == ''){
                customFieldErrors.image = {message: 'Image File is Requird'};
              }
              // console.log(' 1 is after Upload');
            }else{
              _profileData.image = main_image_Ret.coreFileName;
              // customFieldErrors.image = {message: main_image_Ret.errorMessage};
              customFieldErrors.image = {message: main_image_Ret.errorMessage};
              // console.log(' 2 is after Upload');
            }
            // ============================ Image End=================================
        if (Object.keys(customFieldErrors).length) {
          // throw customFieldErrors;
          return res.send({
            status: 'fieldError',
            status_code: 33,
            actionStatus: 5,//mean Field error
            fieldErrors: customFieldErrors,
            allState: allState,
            userData: _userData,
            fieldData: _profileData,
            message: 'Field error',
          });
        } else {
          // return [allState, Users.update({id: userId}, _userData), CustomerProfile.update({id: customerProfileId}, _profileData)]
          return Promise.all([
            allState,
             Users.update({id: userId},_userData),
             CustomerProfile.update({id: customerProfileId},_profileData),
          ]).spread(function(allState, updateUser, updateProfile) {
            // console.log('update', updateUser[0]);
            // console.log('updateProfile', updateProfile[0]);
            if(updateUser[0] && updateProfile[0]){
              let userData={
                first_name: updateUser[0].first_name,
                last_name: updateUser[0].last_name,
              }
    
              console.log('i am at pos = 1');
              return res.send({
                status: 'success',
                status_code: 11,
                actionStatus: 1,
                allState: allState,
                // customerProfile: updateProfile[0],
                businessOwner: userData,
                message: 'Profile data Update Success fully',
              });
    
            }else {
              console.log('i am at pos = 4');
              return res.send({
                status: 'error',
                status_code: 33,
                actionStatus: 0,
                allCategory: {},
                message: 'Profile data not Updated',
              });
            }
    
          })
        }
        
      }).catch(TypeError, function(err) {
        console.log('TypeError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          message: 'Type Error',
          err: err

        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('General', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err

        });
      });
    },

    


    sendMessageToBussiness_old: function (req, res) {
        let tokenUser = req.identity || '';
        let customerId = tokenUser.id;
        let data = req.param("data");

  
        let _formData = {
          category: data.category ? data.category.trim() : '',
          subCategory: data.sub_category ? data.sub_category.trim() : '',
          message: data.message ? data.message.trim() : '',
          customerProfile: data.business_profile ? data.business_profile.trim() : '',
          
        }
  
        // ***************Custom error hendle Start************
        const customFieldErrors = {};
        
        if (!_formData.message) {
            customFieldErrors.message = {message: 'Message is Required'};
        }
        
  
        // ***************Custom error hendle End**************
        return Promise.all([
          CustomerProfile.findOne({id: _formData.customerProfile}), //<--For validation Check
          Category.findOne({id: _formData.category}), //<--For validation Check
          SubCategory.findOne({id: _formData.subCategory}), //<--For validation Check
        ]).spread(function(extBussProfile, extCategory, extSubCategory) {
          if(!extBussProfile || !extCategory || !extSubCategory){
            customFieldErrors.commonError = {message: 'Parameter not found'};
            return res.send({
              status: 'dataExistError',
              status_code: 33,
              actionStatus: 6,//mean Exist Data error
              fieldErrors: customFieldErrors,
              fieldData: _formData,
              message: 'Exist data error',
            });
          }
          if (Object.keys(customFieldErrors).length) {
            // throw customFieldErrors;
            return res.send({
              status: 'fieldError',
              status_code: 33,
              actionStatus: 5,//mean Field error
              fieldErrors: customFieldErrors,
              fieldData: _formData,
              message: 'Field error',
            });
          } else {
            _formData.customer = customerId;
            _formData.createdBy = customerId;
            return Promise.all([
              BusinessMessage.create(_formData)
            ]).spread(function(creMessage) {
              console.log('i am at pos = 1');
                if(creMessage){
                  console.log('i am at pos = 2', creMessage);
                  return res.send({
                    status: 'success',
                    status_code: 11,
                    actionStatus: 1, // remove
                    createdMessage: creMessage,
                    message: 'Saved successfully',
                  });
                }else{
                  console.log('i am at pos = 3');
                  return res.send({
                    status: 'error',
                    status_code: 33,
                    actionStatus: 0,
                    actionStatus: 0, // error
                    message: 'Create error',
                  });
                }
          })
          }
          
        }).catch(TypeError, function(err) {
          console.log('TypeError', err);
          return res.send({
            status: 'error',
            status_code: 33,
            actionStatus: 0,
            message: 'Type Error',
            err: err
  
          });
        }).catch(ReferenceError, function(err) {
          console.log('ReferenceError', err);
          return res.send({
            status: 'error',
            status_code: 33,
            actionStatus: 0,
            message: 'Reference Error',
            err: err
  
          });
        }).catch(function(err){
          console.log('General', err);
          return res.send({
            status: 'error',
            status_code: 33,
            actionStatus: 0,
            message: 'Server Error',
            err: err
  
          });
        });
    },
    sendMessageToBussiness: function (req, res) {
      let tokenUser = req.identity || '';
      let customerId = tokenUser.id;
      let data = req.param("data");


      let _formData = {
        message: data.message ? data.message.trim() : '',
        customerProfile: data.business_profile ? data.business_profile.trim() : '',
        
      }

      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      
      if (!_formData.message) {
          customFieldErrors.message = {message: 'Message is Required'};
      }
      

      // ***************Custom error hendle End**************
      return Promise.all([
        CustomerProfile.findOne({id: _formData.customerProfile}), //<--For validation Check
      ]).spread(function(extBussProfile) {
        if(!extBussProfile){
          customFieldErrors.commonError = {message: 'Parameter not found'};
          return res.send({
            status: 'dataExistError',
            status_code: 33,
            actionStatus: 6,//mean Exist Data error
            fieldErrors: customFieldErrors,
            fieldData: _formData,
            message: 'Exist data error',
          });
        }
        if (Object.keys(customFieldErrors).length) {
          // throw customFieldErrors;
          return res.send({
            status: 'fieldError',
            status_code: 33,
            actionStatus: 5,//mean Field error
            fieldErrors: customFieldErrors,
            fieldData: _formData,
            message: 'Field error',
          });
        } else {
          _formData.customer = customerId;
          _formData.createdBy = customerId;
          return Promise.all([
            BusinessMessage.create(_formData)
          ]).spread(function(creMessage) {
            console.log('i am at pos = 1');
              if(creMessage){
                console.log('i am at pos = 2', creMessage);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // remove
                  createdMessage: creMessage,
                  message: 'Saved successfully',
                });
              }else{
                console.log('i am at pos = 3');
                return res.send({
                  status: 'error',
                  status_code: 33,
                  actionStatus: 0,
                  actionStatus: 0, // error
                  message: 'Create error',
                });
              }
        })
        }
        
      }).catch(TypeError, function(err) {
        console.log('TypeError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err

        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('General', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err

        });
      });
  },
    sendMessageToBussinessAll: function (req, res) {
      let tokenUser = req.identity || '';
      let customerId = tokenUser.id;
      // let data = req.param("data");
      // let actionId = data.id ? data.id : '';
      let _formData = {
      }

      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      // ***************Custom error hendle End**************
      return Promise.all([
        BusinessMessage.find({customer: customerId}).sort('id DESC'), //<--For validation Check
      ]).spread(function(allData) {
          return res.send({
            status: 'success',
            status_code: 11,
            actionStatus: 1, // remove
            allData: allData,
            message: 'Data successfully',
          });
        
      }).catch(TypeError, function(err) {
        console.log('TypeError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err

        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('General', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err
        });
      });
    },
    sendMessageToBussinessRecent: function (req, res) {
      let tokenUser = req.identity || '';
      let customerId = tokenUser.id;
      let data = req.param("data");
      let actionId = data.id ? data.id : '';
      let _formData = {
        id: data.id ? data.id.trim() : 1,
      }

      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      // ***************Custom error hendle End**************
      return Promise.all([
        BusinessMessage.find({id: _formData.id, customer: customerId}).sort('id DESC').limit(5), //<--For validation Check
      ]).spread(function(allData) {
        if(allData && allData.length > 0){
          return res.send({
            status: 'success',
            status_code: 11,
            actionStatus: 1, // remove
            allData: allData,
            message: 'Data successfully',
          });
          
        } else {
          customFieldErrors.commonError = {message: 'Parameter not found'};
          return res.send({
            status: 'success',
            status_code: 11,
            actionStatus: 1, // remove
            fieldErrors: customFieldErrors,
            allData: allData,
            message: 'Data successfully',
          });
        }
      }).catch(TypeError, function(err) {
        console.log('TypeError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err

        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('General', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err
        });
      });
    },
    sendMessageShow: function (req, res) {
      let tokenUser = req.identity || '';
      let customerId = tokenUser.id;
      let data = req.param("data");
      let actionId = data.id ? data.id : '';
      let _formData = {
        id: data.id ? data.id.trim() : 1,
      }

      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      // ***************Custom error hendle End**************
      return Promise.all([
        BusinessMessage.findOne({id: _formData.id, customer: customerId}), //<--For validation Check
      ]).spread(function(sinExistdata) {
        if(!sinExistdata){
          customFieldErrors.commonError = {message: 'Parameter not found'};
          return res.send({
            status: 'dataExistError',
            status_code: 33,
            actionStatus: 6,//mean Exist Data error
            fieldErrors: customFieldErrors,
            fieldData: _formData,
            message: 'Exist data error',
          });
        } else {
          return res.send({
            status: 'success',
            status_code: 11,
            actionStatus: 1, // remove
            bussMessage: sinExistdata,
            message: 'Saved successfully',
          });
        }
      }).catch(TypeError, function(err) {
        console.log('TypeError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err

        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('General', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err
        });
      });
    },
    postReviewToBussiness: function (req, res) {
      let tokenUser = req.identity || '';
      let customerId = tokenUser.id;
      let data = req.param("data");
      let _formData = {
        category: data.category ? data.category.trim() : '',
        rating: data.rating ? data.rating.trim() : 1,
        subCategory: data.sub_category ? data.sub_category.trim() : '',
        rating: (data.rating && data.rating > 0) ? data.rating : 0,
        comment: data.comment ? data.comment.trim() : '',
        businessEvent: data.business_event ? data.business_event.trim() : '',
        customerProfile: data.business_profile ? data.business_profile.trim() : '',
        
      }

      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      
      if (!_formData.rating) {
          customFieldErrors.rating = {message: 'Rating is Required'};
      }

      if (!_formData.comment) {
        customFieldErrors.comment = {message: 'Comment is Required'};
      }
      

      // ***************Custom error hendle End**************
      return Promise.all([
        CustomerProfile.findOne({id: _formData.customerProfile}), //<--For validation Check
        Category.findOne({id: _formData.category}), //<--For validation Check
        SubCategory.findOne({id: _formData.subCategory}), //<--For validation Check
      ]).spread(function(extBussProfile, extCategory, extSubCategory) {
        if(!extBussProfile || !extCategory || !extSubCategory){
          customFieldErrors.commonError = {message: 'Parameter not found'};
          return res.send({
            status: 'dataExistError',
            status_code: 33,
            actionStatus: 6,//mean Exist Data error
            fieldErrors: customFieldErrors,
            fieldData: _formData,
            message: 'Exist data error',
          });
        }
        if (Object.keys(customFieldErrors).length) {
          // throw customFieldErrors;
          return res.send({
            status: 'fieldError',
            status_code: 33,
            actionStatus: 5,//mean Field error
            fieldErrors: customFieldErrors,
            fieldData: _formData,
            message: 'Field error',
          });
        } else {
          // _formData.customer = tokenUser;
          _formData.customer = customerId;
          return Promise.all([
            BusinessReview.create(_formData)
          ]).spread(function(creReview) {
            console.log('i am at pos = 1');
              if(creReview){
                console.log('i am at pos = 2', creReview);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // remove
                  createdReview: creReview,
                  message: 'Saved successfully',
                });
              }else{
                console.log('i am at pos = 3');
                return res.send({
                  status: 'error',
                  status_code: 33,
                  actionStatus: 0,
                  actionStatus: 0, // error
                  message: 'Create error',
                });
              }
        })
        }
        
      }).catch(TypeError, function(err) {
        console.log('TypeError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err

        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('General', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err

        });
      });
    },
    postReviewShow: function (req, res) {
      let tokenUser = req.identity || '';
      let customerId = tokenUser.id;
      let data = req.param("data");
      let actionId = data.id ? data.id : '';
      let _formData = {
        id: data.id ? data.id.trim() : 1,
      }

      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      // ***************Custom error hendle End**************
      return Promise.all([
        BusinessReview.findOne({id: _formData.id, customer: customerId}), //<--For validation Check
      ]).spread(function(sinExistdata) {
        if(!sinExistdata){
          customFieldErrors.commonError = {message: 'Parameter not found'};
          return res.send({
            status: 'dataExistError',
            status_code: 33,
            actionStatus: 6,//mean Exist Data error
            fieldErrors: customFieldErrors,
            fieldData: _formData,
            message: 'Exist data error',
          });
        } else {
          return res.send({
            status: 'success',
            status_code: 11,
            actionStatus: 1, // remove
            review: sinExistdata,
            message: 'Saved successfully',
          });
        }
      }).catch(TypeError, function(err) {
        console.log('TypeError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err

        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('General', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err
        });
      });
    },

    postReviewAll: function (req, res) {
      let tokenUser = req.identity || '';
      let customerId = tokenUser.id;
      // let data = req.param("data");
      // let actionId = data.id ? data.id : '';
      let _formData = {
      }

      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      // ***************Custom error hendle End**************
      return Promise.all([
        BusinessReview.find({customer: customerId}).sort('id DESC'), //<--For validation Check
      ]).spread(function(allData) {
        
          return res.send({
            status: 'success',
            status_code: 11,
            actionStatus: 1, // remove
            allData: allData,
            message: 'Data successfully',
          });
          
        
      }).catch(TypeError, function(err) {
        console.log('TypeError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err

        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('General', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err
        });
      });
    },
    postReviewRecent: function (req, res) {
      let tokenUser = req.identity || '';
      let customerId = tokenUser.id;
      let data = req.param("data");
      let actionId = data.id ? data.id : '';
      let _formData = {
        id: data.id ? data.id.trim() : 1,
      }

      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      // ***************Custom error hendle End**************
      return Promise.all([
        BusinessReview.find({id: _formData.id, customer: customerId}).sort('id DESC').limit(5), //<--For validation Check
      ]).spread(function(allData) {
        if(allData && allData.length > 0){
          return res.send({
            status: 'success',
            status_code: 11,
            actionStatus: 1, // remove
            allData: allData,
            message: 'Data successfully',
          });
          
        } else {
          customFieldErrors.commonError = {message: 'Parameter not found'};
          return res.send({
            status: 'success',
            status_code: 11,
            actionStatus: 1, // remove
            fieldErrors: customFieldErrors,
            allData: allData,
            message: 'Data successfully',
          });
        }
      }).catch(TypeError, function(err) {
        console.log('TypeError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err

        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('General', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err
        });
      });
    },

    // ***Support Start
    supportAll: function (req, res) {
      let tokenUser = req.identity || '';
      let userId = tokenUser.id;
      
      let _qryData = {
        user_tyle:  2,
        createdBy:  userId,
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        SiteTicket.find(_qryData).populate('siteTicketType').populate('customerProfile').populate('businessProfile').populate('createdBy').sort('id DESC'), //<--All record For Show at form 
      ]).spread(function(allTicket) {
        if(allTicket && allTicket.length > 0){
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              allTicket: allTicket,
              message: 'All ticket data found Success fully',
            });
        }else {
          return res.send({
            status: 'success',
            status_code: 11,
            actionStatus: 1,
            allTicket: allTicket,
            message: 'All ticket data found Success fully',
          });
        }
      }).catch(TypeError, function(err) {
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err
        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError',err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err
        });
      }).catch(function(err){
        console.log('errerrerr', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err
        });
      });
    },
    supportNew: function (req, res) {
      let tokenUser = req.identity || '';
      
      let _qryData = {
        status: 1
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        SiteTicketType.find({select: ['id','name','status','slug']}).where(_qryData),
            ]).spread(function(allTicketType) {
        if(allTicketType && allTicketType.length > 0){
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              allTicketType: allTicketType,
              message: 'All message data found Success fully',
            });
        }else {
          return res.send({
            status: 'success',
            status_code: 11,
            actionStatus: 1,
            allTicketType: allTicketType,
            message: 'All message data found Success fully',
          });
        }
      }).catch(TypeError, function(err) {
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err
        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError',err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err
        });
      }).catch(function(err){
        console.log('errerrerr', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err
        });
      });
    },

    supportCreate_old: function (req, res) {
      let tokenUser = req.identity || '';
      let userId = tokenUser.id;
      let data = req.param("data");

      let main_image = data.attachment ? data.attachment : '';
      let oldImage = data.old_attachment ? data.old_attachment : '';

      let _formData = {
            ticket_id: randomize('A0', 8),
            title: data.title ? data.title.trim() : '',
            siteTicketType: data.category ? data.category.trim() : '',
            message: data.message ? data.message.trim() : '',
            user_type: 2
          };

 
      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      if (!_formData.title) {
        customFieldErrors.title = {message: 'Title is Required'};
      }
      // if (!_formData.siteTicketType) {
      //     customFieldErrors.category = {message: 'Category is Required'};
      // }
      if (!_formData.message) {
        customFieldErrors.message = {message: 'Message is Required'};
      }

      let _creSlugData = {
        model: 'siteticket',
        type: 'slug',
        from: _formData.title,
        defaultValue: 'slug'
      };
    


      // ***************Custom error hendle End**************
      // console.log('i am _qryData', _qryData);
      let fileSaveLocation = '.tmp/public/uploads/ticket-attachment';
      let fileCopyLocation = 'assets/uploads/ticket-attachment';

      return Promise.all([
        SiteTicketType.find({status: 1},{select: ['name']}).sort('name ASC'), //<--All record For Show at form
        ZeBase64ImageService.imageCreate(main_image, oldImage, 400, 300, fileSaveLocation, fileCopyLocation, 1), //<--For image Download From Url 
        ZeslugService.slugForUpdate(_creSlugData), //<--Generate slug
        SiteTicketType.findOne({id: _formData.siteTicketType, status: 1},{select: ['name']}),
      ]).spread(function(allTicketType, main_image_Ret, creSlug, extTicketType) {
        _formData.slug = creSlug;
        if (!_formData.siteTicketType) {
          customFieldErrors.category = {message: 'Category is Required'};
        }else{
          if(!extTicketType){
            customFieldErrors.state = {message: 'Category is invalid'};
          }
        }
        // ============================ Image Strat===============================
            // console.log('main_image_Ret update', main_image_Ret);
            if(!main_image_Ret.errorFound){
              _formData.attachment = main_image_Ret.coreFileName;
              // if(main_image_Ret.coreFileName == ''){
              //   customFieldErrors.image = {message: 'Image File is Requird'};
              // }
              // console.log(' 1 is after Upload');
            }else{
              _formData.attachment = main_image_Ret.coreFileName;
              // customFieldErrors.image = {message: main_image_Ret.errorMessage};
              // console.log(' 2 is after Upload');
            }
            // ============================ Image End=================================
        if (Object.keys(customFieldErrors).length) {
          // throw customFieldErrors;
          return res.send({
            status: 'fieldError',
            status_code: 33,
            actionStatus: 5,//mean Field error
            fieldErrors: customFieldErrors,
            allTicketType: allTicketType,
            fieldData: _formData,
            message: 'Field error',
          });
        } else {
          // _formData.customerProfile = customerProfileId;
          _formData.createdBy = userId;
          return Promise.all([

            SiteTicket.create(_formData)
          ]).spread(function(creTicket) {
            console.log('i am at pos = 1');
              if(creTicket){
                console.log('i am at pos = 2', creTicket);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // sucess
                  createdTicket: creTicket,
                  message: 'Saved successfully',
                });
              }else{
                console.log('i am at pos = 3');
                return res.send({
                  status: 'error',
                  status_code: 33,
                  actionStatus: 0,
                  message: 'Update error',
                });
              }
          })
        }
        
      }).catch(TypeError, function(err) {
        console.log('TypeError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          message: 'Type Error',
          err: err

        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('General', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err

        });
      });
    },
    supportCreate: function (req, res) {
      let tokenUser = req.identity || '';
      let customerProfileId = tokenUser.customerProfile;
      let userId = tokenUser.id;
      let data = req.param("data");

      let main_image = data.attachment ? data.attachment : '';
      let oldImage = data.old_attachment ? data.old_attachment : '';

      let _formData = {
            ticket_id: randomize('A0', 8),
            title: data.title ? data.title.trim() : '',
            siteTicketType: data.siteTicketType ? data.siteTicketType.trim() : '',
          };

      let _ticketMsgData = {
        ticket_id: randomize('A0', 8),
        message: data.message ? data.message.trim() : '',
      };



 
      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      if (!_formData.title) {
        customFieldErrors.title = {message: 'Title is Required'};
      }
      // if (!_formData.siteTicketType) {
      //     customFieldErrors.allTicketType = {message: 'Category is Required'};
      // }
      if (!_ticketMsgData.message) {
        customFieldErrors.message = {message: 'Message is Required'};
      }
      let _creSlugData = {
        model: 'siteticket',
        type: 'slug',
        from: _formData.title,
        defaultValue: 'slug'
      };
    


      // ***************Custom error hendle End**************
      // console.log('i am _qryData', _qryData);
      let fileSaveLocation = '.tmp/public/uploads/ticket-attachment';
      let fileCopyLocation = 'assets/uploads/ticket-attachment';

      return Promise.all([
        SiteTicketType.find({status: 1},{select: ['name']}).sort('name ASC'), //<--All record For Show at form
        ZeBase64ImageService.imageCreate(main_image, oldImage, 400, 300, fileSaveLocation, fileCopyLocation, 1), //<--For image Download From Url 
        ZeslugService.slugForUpdate(_creSlugData), //<--Generate slug
        SiteTicketType.findOne({id: _formData.siteTicketType, status: 1},{select: ['name']}),
      ]).spread(function(allTicketType, main_image_Ret, creSlug, extTicketType) {

        _formData.slug = creSlug;
        
        if (!_formData.siteTicketType) {
          customFieldErrors.siteTicketType = {message: 'Ticket Tyle is Required'};
        }else{
          if(!extTicketType){
            customFieldErrors.siteTicketType = {message: 'Ticket Tyle is invalid'};
          }
        }
        // ============================ Image Strat===============================
            // console.log('main_image_Ret update', main_image_Ret);
            if(!main_image_Ret.errorFound){
              _ticketMsgData.attachment = main_image_Ret.coreFileName;
              // if(main_image_Ret.coreFileName == ''){
              //   customFieldErrors.image = {message: 'Image File is Requird'};
              // }
              // console.log(' 1 is after Upload');
            }else{
              _ticketMsgData.attachment = main_image_Ret.coreFileName;
              // customFieldErrors.image = {message: main_image_Ret.errorMessage};
              // console.log(' 2 is after Upload');
            }
            // ============================ Image End=================================
        if (Object.keys(customFieldErrors).length) {
          // throw customFieldErrors;
          return res.send({
            status: 'fieldError',
            status_code: 33,
            actionStatus: 5,//mean Field error
            fieldErrors: customFieldErrors,
            allTicketType: allTicketType,
            fieldData: _formData,
            message: 'Field error',
          });
        } else {
          // _formData.businessProfile = businessProfileId;
          _formData.user_type = 2;
          _formData.createdBy = userId;
          _formData.customerProfile = customerProfileId;
          return Promise.all([
            SiteTicket.create(_formData)
          ]).spread(function(creTicket) {

            _ticketMsgData.siteTicket = creTicket.id;
            _ticketMsgData.user_type = 1;
            _ticketMsgData.createdBy = userId;
            _ticketMsgData.customerProfile = customerProfileId;

            return [creTicket, SiteTicketMessage.create(_ticketMsgData)]
          }).spread(function(creTicket, creTicketMsg) {

            console.log('i am at pos = 1');
              if(creTicket){
                console.log('i am at pos = 2', creTicket);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // sucess
                  createdTicket: creTicket,
                  creTicketMsg: creTicketMsg,
                  message: 'Saved successfully',
                });
              }else{
                console.log('i am at pos = 3');
                return res.send({
                  status: 'error',
                  status_code: 33,
                  actionStatus: 0,
                  message: 'Update error',
                });
              }
          })
        }
        
      }).catch(TypeError, function(err) {
        console.log('TypeError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          message: 'Type Error',
          err: err

        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('General', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err

        });
      });
    },
    supportEdit: function (req, res) {
      let tokenUser = req.identity || '';
      let userId = tokenUser.id;
      let data = req.param("data");
      let actionId = data.id ? data.id : '';
      let customerProfileId = tokenUser.customerProfile;
      
      let _qryData = {
        id: actionId,
        customerProfile: customerProfileId,
        user_type: 2
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        SiteTicket.find(_qryData),
        SiteTicketType.find({select: ['id','name','status','slug']}).where({status: 1}),
            ]).spread(function(sinExistdata, allTicketType) {
              if(!sinExistdata){
                customFieldErrors.commonError = {message: 'Exist data not found'};
                return res.send({
                  status: 'dataExistError',
                  status_code: 33,
                  actionStatus: 6,//mean Exist Data error
                  fieldErrors: customFieldErrors,
                  fieldData: _formData,
                  message: 'Exist data error',
                });
              }
        if(allTicketType && allTicketType.length > 0){
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              data: sinExistdata,
              allTicketType: allTicketType,
              message: 'All data  found Success fully',
            });
        }else {
          return res.send({
            status: 'error',
            status_code: 33,
            actionStatus: 0,
            message: 'All data Not found',
          });
        }
      }).catch(TypeError, function(err) {
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err
        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError',err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err
        });
      }).catch(function(err){
        console.log('errerrerr', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err
        });
      });
    },

    supportUpdate: function (req, res) {
      let tokenUser = req.identity || '';
      let userId = tokenUser.id;
      let data = req.param("data");
      let actionId = data.id ? data.id : '';

      let main_image = data.attachment ? data.attachment : '';
      let oldImage = data.old_attachment ? data.old_attachment : '';

      
      let _formData = {
          title: data.title ? data.title.trim() : '',
          siteTicketType: data.category ? data.category.trim() : '',
          message: data.message ? data.message.trim() : '',
      };

     

       // ***************Custom error hendle Start************
       const customFieldErrors = {};
       if (!_formData.title) {
        customFieldErrors.title = {message: 'Title is Required'};
      }
       
      if (!_formData.message) {
        customFieldErrors.message = {message: 'Message is Required'};
      }

      let _creSlugData = {
        model: 'siteticket',
        type: 'slug',
        from: _formData.title,
        defaultValue: 'slug'
      };
 
 
       // ***************Custom error hendle End**************
      
       let fileSaveLocation = '.tmp/public/uploads/ticket-attachment';
      let fileCopyLocation = 'assets/uploads/ticket-attachment';
      
      return Promise.all([
        SiteTicket.findOne({id: actionId, user_type: 2}),
        ZeBase64ImageService.imageCreate(main_image, oldImage, 400, 300, fileSaveLocation, fileCopyLocation, 1), //<--For image Download From Url 
        ZeslugService.slugForUpdate(_creSlugData), //<--Generate slug
        SiteTicketType.findOne({id: _formData.siteTicketType, status: 1},{select: ['name']}),
      ]).spread(function(sinExistdata, main_image_Ret, creSlug, extState) {

        if(sinExistdata.title != _formData.title){
          _formData.slug = creSlug;
        }

        if (!_formData.siteTicketType) {
          customFieldErrors.category = {message: 'Category is Required'};
        }else{
          if(!extTicketType){
            customFieldErrors.state = {message: 'Category is invalid'};
          }
        }
        // ============================ Image Strat===============================
            // console.log('main_image_Ret update', main_image_Ret);
            if(!main_image_Ret.errorFound){
              _formData.attachment = main_image_Ret.coreFileName;
              // if(main_image_Ret.coreFileName == ''){
              //   customFieldErrors.image = {message: 'Image File is Requird'};
              // }
              // console.log(' 1 is after Upload');
            }else{
              _formData.attachment = main_image_Ret.coreFileName;
              // customFieldErrors.image = {message: main_image_Ret.errorMessage};
              // console.log(' 2 is after Upload');
            }
            // ============================ Image End=================================
        
        if(!sinExistdata){
          customFieldErrors.commonError = {message: 'Exist data not found'};
          return res.send({
            status: 'dataExistError',
            status_code: 33,
            actionStatus: 6,//mean Exist Data error
            fieldErrors: customFieldErrors,
            allTicketType: allTicketType,
            fieldData: _formData,
            message: 'Exist data error',
          });
        }


        if (Object.keys(customFieldErrors).length) {
          // throw customFieldErrors;
          return res.send({
            status: 'fieldError',
            status_code: 33,
            actionStatus: 5,//mean Field error
            fieldErrors: customFieldErrors,
            allTicketType: allTicketType,
            fieldData: _formData,
            message: 'Field error',
          });
        } else {
          // _formData.updatedBy = tokenUser.id;
          return Promise.all([
            SiteTicket.update({id: actionId}, _formData)
          ]).spread(function(updateTicket) {
            console.log('i am at pos = 1');
              if(updateTicket[0]){
                console.log('i am at pos = 2', updateTicket[0]);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // remove
                  ticket: updateTicket[0],
                  message: 'Saved successfully',
                });
              }else{
                console.log('i am at pos = 3');
                return res.send({
                  status: 'error',
                  status_code: 33,
                  actionStatus: 0,
                  message: 'Update error',
                });
              }
        })
        }
        
      }).catch(TypeError, function(err) {
        console.log('TypeError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err
        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('General', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err

        });
      });
    },

    supportView: function (req, res) {
      let tokenUser = req.identity || '';
      let data = req.param("data");
      let actionId = data.id ? data.id : '';
      
      let _qryData = {
        id: actionId,
        user_type: 2
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
              SiteTicket.findOne(_qryData),
            ]).spread(function(sinExistdata) {
              if(!sinExistdata){
                customFieldErrors.commonError = {message: 'Exist data not found'};
                return res.send({
                  status: 'dataExistError',
                  status_code: 33,
                  actionStatus: 6,//mean Exist Data error
                  fieldErrors: customFieldErrors,
                  message: 'Exist data error',
                });
              } else {
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1,
                  data: sinExistdata,
                  message: 'All data  found Success fully',
                });
              }
      }).catch(TypeError, function(err) {
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err
        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError',err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err
        });
      }).catch(function(err){
        console.log('errerrerr', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err
        });
      });
    },
    supportView_slug: function (req, res) {
      let tokenUser = req.identity || '';
      let userId = tokenUser.id;

      let data = req.param("data");
      let slug = data.slug ? data.slug : '';
      if (!slug){
        return res.send({
            status: 'dataExistError',
            status_code: 33,
            actionStatus: 6,//mean Exist Data error
            message: 'slug is empty error',
        });
      };
      
      let _qryData = {
        slug: slug,
        user_type: 2
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
              SiteTicket.findOne(_qryData),
            ]).spread(function(sinExistdata) {
              if(!sinExistdata){
                return res.send({
                  status: 'dataExistError',
                  status_code: 33,
                  actionStatus: 6,//mean Exist Data error
                  fieldErrors: customFieldErrors,
                  message: 'Exist data error',
                });
              } else {
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1,
                  data: sinExistdata,
                  message: 'All data  found Success fully',
                });
              }
      }).catch(TypeError, function(err) {
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err
        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError',err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err
        });
      }).catch(function(err){
        console.log('errerrerr', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err
        });
      });
    },
    supportReMessage: function (req, res) {
      let tokenUser = req.identity || '';
      let customerProfileId = tokenUser.customerProfile;
      let userId = tokenUser.id;
      let data = req.param("data");

      let main_image = data.attachment ? data.attachment : '';
      let oldImage = data.old_attachment ? data.old_attachment : '';

      // let _formData = {
      //       ticket: randomize('A0', 8),
      //       siteTicket: data.siteTicket ? data.siteTicket : '',
      //       title: data.title ? data.title.trim() : '',
      //       siteTicketType: data.siteTicketType ? data.siteTicketType.trim() : '',
      //     };

      let _ticketMsgData = {
        ticket_id: randomize('A0', 8),
        siteTicket: data.siteTicket ? data.siteTicket : '',
        message: data.message ? data.message.trim() : '',
      };



 
      // ***************Custom error hendle Start************
      const customFieldErrors = {};
     
      if (!_ticketMsgData.message) {
        customFieldErrors.message = {message: 'Message is Required'};
      }
      // ***************Custom error hendle End**************
      // console.log('i am _qryData', _qryData);
      let fileSaveLocation = '.tmp/public/uploads/ticket-attachment';
      let fileCopyLocation = 'assets/uploads/ticket-attachment';

      return Promise.all([
        ZeBase64ImageService.imageCreate(main_image, oldImage, 400, 300, fileSaveLocation, fileCopyLocation, 1), //<--For image Download From Url 
      ]).spread(function(main_image_Ret) {

        // ============================ Image Strat===============================
            // console.log('main_image_Ret update', main_image_Ret);
            if(!main_image_Ret.errorFound){
              _ticketMsgData.attachment = main_image_Ret.coreFileName;
              // if(main_image_Ret.coreFileName == ''){
              //   customFieldErrors.image = {message: 'Image File is Requird'};
              // }
              // console.log(' 1 is after Upload');
            }else{
              _ticketMsgData.attachment = main_image_Ret.coreFileName;
              // customFieldErrors.image = {message: main_image_Ret.errorMessage};
              // console.log(' 2 is after Upload');
            }
            // ============================ Image End=================================
        if (Object.keys(customFieldErrors).length) {
          // throw customFieldErrors;
          return res.send({
            status: 'fieldError',
            status_code: 33,
            actionStatus: 5,//mean Field error
            fieldErrors: customFieldErrors,
            allTicketType: allTicketType,
            fieldData: _formData,
            message: 'Field error',
          });
        } else {
          
            _ticketMsgData.user_type = 2;
            _ticketMsgData.createdBy = userId;
            _ticketMsgData.customerProfile = customerProfileId;
          return Promise.all([
            SiteTicketMessage.create(_ticketMsgData)
          ]).spread(function(creTicketMsg) {

            console.log('i am at pos = 1');
              if(creTicket){
                console.log('i am at pos = 2', creTicket);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // sucess
                  creTicketMsg: creTicketMsg,
                  message: 'Saved successfully',
                });
              }else{
                console.log('i am at pos = 3');
                return res.send({
                  status: 'error',
                  status_code: 33,
                  actionStatus: 0,
                  message: 'Update error',
                });
              }
          })
        }
        
      }).catch(TypeError, function(err) {
        console.log('TypeError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          message: 'Type Error',
          err: err

        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('General', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err

        });
      });
    },

    // ***Carrer Start
    careerAll: function (req, res) {
      let tokenUser = req.identity || '';
      let customerProfileId = tokenUser.customerProfile;
      let userId = tokenUser.id;
      let _qryData = {
        status: 1
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessCareer.find({customer: userId}).populate('customer').sort('id DESC'), //<--All record For Show at form 
      ]).spread(function(allCareer) {
        if(allCareer && allCareer.length > 0){
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              allCareer: allCareer,
              message: 'All data found Success fully',
            });
        }else {
          return res.send({
            status: 'success',
            status_code: 11,
            actionStatus: 1,
            allCareer: allCareer,
            message: 'All data found Success fully',
          });
        }
      }).catch(TypeError, function(err) {
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err
        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError',err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err
        });
      }).catch(function(err){
        console.log('errerrerr', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err
        });
      });
    },
    careerView_byid: function (req, res) {
      let tokenUser = req.identity || '';
      let data = req.param("data");
      let actionId = data.id ? data.id : '';
      
      let _qryData = {
        id: actionId,
        status: 1
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessCareer.findOne(_qryData),
            ]).spread(function(sinExistdata) {
              if(!sinExistdata){
                customFieldErrors.commonError = {message: 'Exist data not found'};
                return res.send({
                  status: 'dataExistError',
                  status_code: 33,
                  actionStatus: 6,//mean Exist Data error
                  fieldErrors: customFieldErrors,
                  message: 'Exist data error',
                });
              } else {
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1,
                  data: sinExistdata,
                  message: 'All data  found Success fully',
                });
              }
      }).catch(TypeError, function(err) {
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err
        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError',err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err
        });
      }).catch(function(err){
        console.log('errerrerr', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err
        });
      });
    },

    careerView: function (req, res) {
      let tokenUser = req.identity || '';
      let userId = tokenUser.id;
      let data = req.param("data");
      let slug = data.slug ? data.slug : '';
      if (!slug){
        return res.send({
            status: 'dataExistError',
            status_code: 33,
            actionStatus: 6,//mean Exist Data error
            message: 'slug is empty error',
        });
      };
      
      let _qryData = {
        slug: slug,
        status: 1
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessCareer.findOne(_qryData),
            ]).spread(function(sinExistdata) {
              if(!sinExistdata){
                return res.send({
                  status: 'dataExistError',
                  status_code: 33,
                  actionStatus: 6,//mean Exist Data error
                  fieldErrors: customFieldErrors,
                  message: 'Exist data error',
                });
              } else {
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1,
                  data: sinExistdata,
                  message: 'All data  found Success fully',
                });
              }
      }).catch(TypeError, function(err) {
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err
        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError',err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err
        });
      }).catch(function(err){
        console.log('errerrerr', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err
        });
      });
    },
    // @@@@Security Setting Start
    changePassword: function (req, res) {
      let tokenUser = req.identity || '';
      let customerProfileId = tokenUser.customerProfile;
      let userId = tokenUser.id;
      let data = req.param("data");
      // let actionId = data.id ? data.id : '';

      
      let _formData = {
        old_password: data.old_password ? data.old_password.trim() : '',
        password: data.password ? data.password.trim() : '',
        confirm_password: data.confirm_password ? data.confirm_password.trim() : '',
      };

     

       // ***************Custom error hendle Start************
       const customFieldErrors = {};
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
 
       // ***************Custom error hendle End**************
      
      
      return Promise.all([
        Users.findOne({id: userId, customerProfile: customerProfileId, user_type: 5, is_token_based_user: true}),
      ]).spread(function(sinExistdata) {
        
        if(!sinExistdata){
          customFieldErrors.commonError = {message: 'Exist data not found'};
          return res.send({
            status: 'dataExistError',
            status_code: 33,
            actionStatus: 6,//mean Exist Data error
            fieldErrors: customFieldErrors,
            fieldData: {},
            message: 'Exist data error',
          });
        } else{
          if(!sinExistdata.comparePassword(_formData.old_password)){
            customFieldErrors.old_password = {message: 'Current Password is not correct'};
          }
        }


        if (Object.keys(customFieldErrors).length) {
          // throw customFieldErrors;
          return res.send({
            status: 'fieldError',
            status_code: 33,
            actionStatus: 5,//mean Field error
            fieldErrors: customFieldErrors,
            fieldData: _formData,
            message: 'Field error',
          });
        } else {
          // _formData.updatedBy = tokenUser.id;
          return Promise.all([
            Users.update({id: userId}, _formData)
          ]).spread(function(updatePassword) {
            console.log('i am at pos = 1');
              if(updatePassword[0]){
                // console.log('i am at pos = 2', updatePassword[0]);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // remove
                  // career: updatePassword[0],
                  message: 'Saved successfully',
                });
              }else{
                console.log('i am at pos = 3');
                return res.send({
                  status: 'error',
                  status_code: 33,
                  actionStatus: 0,
                  message: 'Update error',
                });
              }
        })
        }
        
      }).catch(TypeError, function(err) {
        console.log('TypeError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err
        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('General', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err

        });
      });
    
    },

    

    settingNotificationAll: function (req, res) {
      let tokenUser = req.identity || '';
      let customerProfileId = tokenUser.customerProfile;
      let userId = tokenUser.id;
      let _qryData = {
        id: customerProfileId,
        // status: 1
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        CustomerProfile.find({id: customerProfileId}), //<--All record For Show at form 
      ]).spread(function(sinExistdata) {
        if(sinExistdata){
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              sinExistdata: sinExistdata,
              message: 'Album data found Success fully',
            });
        }else {
          return res.send({
            status: 'error',
            status_code: 33,
            actionStatus: 0,
            message: 'Album Not found',
          });
        }

      }).catch(TypeError, function(err) {
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err

        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError',err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('errerrerr', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err

        });
      });
    },
    

    settingNotificationUpdate: function (req, res) {
      let tokenUser = req.identity || '';
      let customerProfileId = tokenUser.customerProfile;
      let data = req.param("data");
      // let actionId = data.id ? data.id : '';
      
      let _formData = {
        friendRequests: data.friendRequests ? true : false,
        newFollowers: data.newFollowers ? true : false,
        complimentsMessages: data.complimentsMessages ? true : false,
        contentFriendsShare: data.contentFriendsShare ? true : false,
        messagesFromBusiness: data.messagesFromBusiness ? true : false,
        businesseLike: data.businesseLike ? true : false,
        friendlyTipsAndTricks: data.friendlyTipsAndTricks ? true : false,
        discountAndPromotion: data.discountAndPromotion ? true : false,
        surveys: data.surveys ? true : false,
        friendYourCity: data.friendYourCity ? true : false,
        friendAllCity: data.friendAllCity ? true : false,
        reviewVotes: data.reviewVotes ? true : false,
        checkInComment: data.checkInComment ? true : false,
        checkInLikes: data.checkInLikes ? true : false,
        tipLikes: data.tipLikes ? true : false,
        dealsAndAnnouncements: data.dealsAndAnnouncements ? true : false,
      }
      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      
      
      // ***************Custom error hendle End**************
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        CustomerProfile.findOne({id: customerProfileId}),
      ]).spread(function(sinExistdata) {
        
        if(!sinExistdata){
          customFieldErrors.commonError = {message: 'Exist data not found'};
          return res.send({
            status: 'dataExistError',
            status_code: 33,
            actionStatus: 6,//mean Exist Data error
            fieldErrors: customFieldErrors,
            fieldData: _formData,
            message: 'Exist data error',
          });
        }


        if (Object.keys(customFieldErrors).length) {
          // throw customFieldErrors;
          return res.send({
            status: 'fieldError',
            status_code: 33,
            actionStatus: 5,//mean Field error
            fieldErrors: customFieldErrors,
            fieldData: _formData,
            message: 'Field error',
          });
        } else {
          return Promise.all([
            CustomerProfile.update({id: customerProfileId}, _formData)
          ]).spread(function(updateData) {
            console.log('i am at pos = 1');
              if(updateData[0]){
                console.log('i am at pos = 2', updateData[0]);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // remove
                  review: updateData[0],
                  message: 'Update successfully',
                });
              }else{
                console.log('i am at pos = 3');
                return res.send({
                  status: 'error',
                  status_code: 33,
                  actionStatus: 0,
                  message: 'Update error',
                });
              }
        })
        }
        
      }).catch(TypeError, function(err) {
        console.log('TypeError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err
        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('General', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err

        });
      });
    },

    accountNotificationAll: function (req, res) {
      let tokenUser = req.identity || '';
      let customerProfileId = tokenUser.customerProfile;
      let userId = tokenUser.id;
      let _qryData = {
        id: customerProfileId,
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        // CustomerProfile.findOne({select: ['id','business_name','official_email','official_phone', 'Official_address_line1','city','state','zip','website_link','history','image']}).where(_qryData),
        CustomerProfile.findOne(_qryData),
        Users.findOne({select: ['id','first_name','last_name']}).where({id: userId}),
      ]).spread(function(extProfile, extUser) {
        if(extProfile && extUser){
            delete extProfile.id;
            delete extUser.id;

            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              customerProfile: extProfile,
              customer: extUser,
              message: 'Profile data found Success fully',
            });
        }else {
          return res.send({
            status: 'error',
            status_code: 33,
            actionStatus: 0,
            message: 'Profile Not found',
          });
        }

      }).catch(TypeError, function(err) {
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err

        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError',err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('errerrerr', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err

        });
      });
    },

    accountNotificationSave: function (req, res) {
      let tokenUser = req.identity || '';
      let customerProfileId = tokenUser.customerProfile;
      let userId = tokenUser.id;
      let data = req.param("data");
      // console.log('====', data);


      let _profileData = {
            friendRequests: data.friendRequests ? true : false,
            newFollowers: data.newFollowers ? true : false,
            complimentsMessages: data.complimentsMessages ? true : false,
            contentFriendsShare: data.contentFriendsShare ? true : false,
            messagesFromBusiness: data.messagesFromBusiness ? true : false,
            businesseLike: data.businesseLike ? true : false,
            friendlyTipsAndTricks: data.friendlyTipsAndTricks ? true : false,
            discountAndPromotion: data.discountAndPromotion ? true : false,
            surveys: data.surveys ? true : false,
            friendYourCity: data.friendYourCity ? true : false,
            friendAllCity: data.friendAllCity ? true : false,
            reviewVotes: data.reviewVotes ? true : false,
            checkInComment: data.checkInComment ? true : false,
            checkInLikes: data.checkInLikes ? true : false,
            tipLikes: data.tipLikes ? true : false,
            dealsAndAnnouncements: data.dealsAndAnnouncements ? true : false,
          };
      

      // ***************Custom error hendle Start************
      const customFieldErrors = {};

      // ***************Custom error hendle End**************
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        CustomerProfile.update({id: customerProfileId},_profileData)
      ]).spread(function(updateProfile) {
            if(updateProfile[0]){
                 
              console.log('i am at pos = 1');
              return res.send({
                status: 'success',
                status_code: 11,
                actionStatus: 1,
                profile: updateProfile[0],
                message: 'Profile data Update Success fully',
              });
    
            }else {
              console.log('i am at pos = 4');
              return res.send({
                status: 'error',
                status_code: 33,
                actionStatus: 0,
                allCategory: {},
                message: 'Profile data not Updated',
              });
            }
      }).catch(TypeError, function(err) {
        console.log('TypeError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          message: 'Type Error',
          err: err

        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('General', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err

        });
      });
    },

    // ***Privvacy Setting Start
    privacySettingAll: function (req, res) {
      let tokenUser = req.identity || '';
      let customerProfileId = tokenUser.customerProfile;
      let userId = tokenUser.id;
      let _qryData = {
        id: customerProfileId,
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        CustomerProfile.findOne({select: ['id', 'find_friends', 'bookmarks','direct_messages_from_business','ads_display_off_2nd_friendly']}).where({id: customerProfileId}),
      ]).spread(function(extProfile) {
        if(extProfile){
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              customerProfile: extProfile,
              message: 'Profile data found Success fully',
            });
        }else {
          return res.send({
            status: 'error',
            status_code: 33,
            actionStatus: 0,
            message: 'Profile Not found',
          });
        }

      }).catch(TypeError, function(err) {
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err

        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError',err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('errerrerr', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err
        });
      });
    },
    privacySettingUpdate: function (req, res) {
      let tokenUser = req.identity || '';
      let customerProfileId = tokenUser.customerProfile;
      let userId = tokenUser.id;
      let data = req.param("data");
      // console.log('====', data);


      let _profileData = {
            find_friends: data.find_friends ? true : false,
            bookmarks: data.bookmarks ? true : false,
            direct_messages_from_business: data.direct_messages_from_business ? true : false,
            ads_display_off_2nd_friendly: data.ads_display_off_2nd_friendly ? true : false,
          };
      

      // ***************Custom error hendle Start************
      const customFieldErrors = {};

      // ***************Custom error hendle End**************
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        customerProfile.update({id: customerProfileId},_profileData)
      ]).spread(function(updateProfile) {
            if(updateProfile[0]){
                 
              console.log('i am at pos = 1');
              return res.send({
                status: 'success',
                status_code: 11,
                actionStatus: 1,
                profile: updateProfile[0],
                message: 'Profile data Update Success fully',
              });
    
            }else {
              console.log('i am at pos = 4');
              return res.send({
                status: 'error',
                status_code: 33,
                actionStatus: 0,
                allCategory: {},
                message: 'Profile data not Updated',
              });
            }
      }).catch(TypeError, function(err) {
        console.log('TypeError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          message: 'Type Error',
          err: err

        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('General', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err

        });
      });
    },

    dashboard: function (req, res) {
      let tokenUser = req.identity || '';
      let customerProfileId = tokenUser.customerProfile;
      let userId = tokenUser.id;
      let _qryData = {
        id: customerProfileId,
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        SiteTicket.find({createdBy: userId}).limit(5).sort('id ASC'), //<--All record For Show at form 
        BusinessMessage.find({customer: userId}).limit(5).sort('id ASC'), //<--All record For Show at form 
        BusinessCareer.find({customer: userId}).limit(5).sort('id ASC'), //<--All record For Show at form 
      ]).spread(function(allTicket, allMessage, allCareer) {
        
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              allTicket: allTicket,
              allMessage: allMessage,
              allCareer: allCareer,
              message: 'Dashboard Success fully',
            });
        

      }).catch(TypeError, function(err) {
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Type Error',
          err: err

        });
      }).catch(ReferenceError, function(err) {
        console.log('ReferenceError',err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Reference Error',
          err: err

        });
      }).catch(function(err){
        console.log('errerrerr', err);
        return res.send({
          status: 'error',
          status_code: 33,
          actionStatus: 0,
          message: 'Server Error',
          err: err

        });
      });
    },

};

