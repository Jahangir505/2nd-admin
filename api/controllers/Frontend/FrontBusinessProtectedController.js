/**
 * FrontBusinessProtectedController
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
let randomize = require('randomatic');
let zeCommon = sails.config.zeCommon;
module.exports = {
    _config: {
        actions: false,
        shortcuts: false,
        rest: true
    },
    categorySubCategoryAllAndSelected: function (req, res) {
        let tokenUser = req.identity || '';
        let businessProfileId = tokenUser.businessProfile

        // if(!tokenUser){
        //     return res.send({
        //         status: 'error',
        //         status_code: 51,
        //         message: 'you are not valid user',
        //       });
        // }
        // if(tokenUser && tokenUser.user_type != 4){
        //     return res.send({
        //         status: 'error',
        //         status_code: 52,
        //         message: 'you are not valid user',
        //       });
        // } 
        let _qryData = {
          status: 1,
        }

        // console.log('i am _qryData', _qryData);
        return Promise.all([
          Category.find({select: ['id','name','status','slug']}).where(_qryData),
          SubCategory.find({select: ['id','name','status','slug', 'category']}).where(_qryData),
          BusinessProfileSubCategory.find({businessProfile: businessProfileId},{select: ['subCategory']}), //<--For Frequent Bought Togather Product Multi Box Auto Selected
        ]).spread(function(allCategory, allSubCategory, selectedSubCategory) {
          // console.log('selectedSubCategory===', selectedSubCategory);

          if(allCategory && allCategory.length > 0){
            // for(let i=0; i<allCategory.length; i++){
            //     // let subcatFilter = allSubCategory.filter((sinItem)=> sinItem.category == allCategory[i].id && allCategory[i].status == 1);
            //     let subcatFilter = allSubCategory.filter((sinItem)=> sinItem.category == allCategory[i].id);
            //     allCategory[i].subCategory = subcatFilter;

            //   }
              allCategory.forEach(function(sinCat, index){
                // let subcatFilter = allSubCategory.filter((sinItem)=> sinItem.category == sinCat.id && sinItem.status == 2);
                let subcatFilter = allSubCategory.filter((sinItem)=> sinItem.category == sinCat.id);
                sinCat.subCategory = subcatFilter;

              });
              let subCategoryIds = []; 
              if(selectedSubCategory && selectedSubCategory.length > 0){
                // subCategoryIds = selectedSubCategory.map((sinItem) => sinItem.id); 
                subCategoryIds = selectedSubCategory.map((sinItem) => sinItem.subCategory); 
              }

              return res.send({
                status: 'success',
                status_code: 11,
                actionStatus: 1,
                // businessProfile: tokenUser.businessProfile,
                allCategory: allCategory,
                selectedSubCategory: subCategoryIds,
                message: 'all category sub-category and selected sub-category',
              });
          }else {
            return res.send({
              status: 'success',
              status_code: 12,
              actionStatus: 1,
              allCategory: [],
              message: 'Empty all category sub-category and selected sub-category',
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

    singleSubCategoryAddRemove: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");
      console.log('data1===', data);
      // console.log('subCatId===', data.subCatId);
      // console.log('data2===', JSON.parse(data));
      let addRmvSubCatId = data.subCatId;
      let _qryData = {
        id: addRmvSubCatId,
        status: 1,
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        SubCategory.findOne({select: ['id','name','status','slug', 'category']}).where(_qryData),
        // BusinessProfileSubCategory.findOne({businessProfile: businessProfileId, subCategory: addRmvSubCatId},{select: ['subCategory']}), //<--For Frequent Bought Togather Product Multi Box Auto Selected
      ]).spread(function(targetSubCategory) {
        // console.log('targetSubCategory===', targetSubCategory);
        return [
          targetSubCategory,
          Category.findOne({select: ['id','status']}).where({id: targetSubCategory.category, status: 1}),
          BusinessProfileSubCategory.findOne({businessProfile: businessProfileId, subCategory: addRmvSubCatId },{select: ['subCategory']}), //<--For Frequent Bought Togather Product Multi Box Auto Selected
          BusinessProfile.findOne({select: ['id']}).where({id: businessProfileId}),
        ]
      }).spread(function(targetSubCategory, targetCategory, extProfileSubCat, extBussProfile) {
        if(targetCategory && targetSubCategory){
          console.log('i am at pos = 1');
            if(extProfileSubCat){
              console.log('i am at pos = 2 remove sub category', extProfileSubCat);
              // extBussProfile.subCategory.remove(addRmvSubCatId);
              targetSubCategory.businessProfile.remove(businessProfileId);
              targetSubCategory.save();
              return res.send({
                status: 'success Removeeeee',
                status_code: 11,
                actionStatus: 2, // remove
                targetSubCategory: targetSubCategory ? targetSubCategory : 'not-found',
                targetCategory: targetCategory ? targetCategory : 'not-found',
                allCategory: {},
                message: 'sub category remove successfully',
              });
              
            }else{
              console.log('i am at pos add sub category = 3');
              // extBussProfile.subCategory.add(addRmvSubCatId);
              targetSubCategory.businessProfile.add(businessProfileId);
              targetSubCategory.save();
              return res.send({
                status: 'success',
                status_code: 11,
                actionStatus: 1, // added
                targetSubCategory: targetSubCategory ? targetSubCategory : 'not-found',
                targetCategory: targetCategory ? targetCategory : 'not-found',
                allCategory: {},
                message: 'sub category added successfully',
              });
            }

        }else {
          console.log('i am at pos = 4');
          return res.send({
            status: 'error',
            status_code: 33,
            actionStatus: 0,
            // targetSubCategory: targetSubCategory ? targetSubCategory : 'not-found',
            // targetCategory: targetCategory ? targetCategory : 'not-found',
            allCategory: {},
            message: 'category or sub category not found',
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

    //@@@@@@@@@@@@@ Account Settings Start@@@@@@@@@@@@

    aboutTheBusinessAll: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      let userId = tokenUser.id;
      let _qryData = {
        id: businessProfileId,
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        State.find({status: 1},{select: ['name']}).sort('name ASC'), //<--All record For Show at form 
        BusinessProfile.findOne({select: ['id','business_name','official_email','official_phone', 'Official_address_line1','city','state','zip','website_link','history','business_logo']}).where(_qryData),
        // Users.findOne({select: ['id','first_name','last_name']}).where({id: userId}),
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
              businessProfile: extProfile,
              businessOwner: extUser,
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

    aboutTheBusinessSave_old: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      let userId = tokenUser.id;
      let data = req.param("data");
      // console.log('====', data);

      let main_image = data.image ? data.image : '';
      let oldImage = data.old_image ? data.old_image : '';

      let _profileData = {
            business_name: data.business_name ? data.business_name.trim() : '',
            official_email: data.official_email ? data.official_email.trim() : '',
            official_phone: data.official_phone ? data.official_phone.trim() : '',
            Official_address_line1: data.Official_address_line1 ? data.Official_address_line1.trim() : '',
            state: data.state ? data.state.trim() : '',
            city: data.city ? data.city.trim() : '',
            zip: data.zip ? data.zip.trim() : '',
            website_link: data.website_link ? data.website_link.trim() : '',
            history: data.history ? data.history.trim() : '',
            // business_logo: data.business_logo ? data.business_logo.trim() : '',
          };
      let _userData = {
          first_name: data.first_name ? data.first_name.trim() : '',
          last_name: data.last_name ? data.last_name.trim() : '',
      }

      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      if (!_profileData.business_name) {
        customFieldErrors.business_name = {message: 'Business Name is Required'};
      }
      if (!_profileData.official_email) {
        customFieldErrors.official_email = {message: 'Official email is Required'};
      } else {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(_profileData.official_email) == false) 
          {
              customFieldErrors.official_email = {message: 'Provide valid Official email address'};
          }
      }
      if (!_profileData.official_phone) {
        customFieldErrors.official_phone = {message: 'Official phone is Required'};
      }
      if (!_profileData.Official_address_line1) {
        customFieldErrors.Official_address_line1 = {message: 'Official address is Required'};
      }

      
      if (!_profileData.city) {
        customFieldErrors.city = {message: 'City is Required'};
      }
      if (!_profileData.zip) {
        customFieldErrors.zip = {message: 'ZIP is Required'};
      }
      if (!_profileData.website_link) {
        customFieldErrors.website_link = {message: 'Website link is Required'};
      }
      if (!_profileData.history) {
        customFieldErrors.history = {message: 'History is Required'};
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
      let fileSaveLocation = '.tmp/public/uploads/business-logo';
      let fileCopyLocation = 'assets/uploads/business-logo';

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
              _profileData.business_logo = main_image_Ret.coreFileName;
              if(main_image_Ret.coreFileName == ''){
                // customFieldErrors.business_logo = {message: 'Image File is Requird'};
                customFieldErrors.image = {message: 'Image File is Requird'};
              }
              // console.log(' 1 is after Upload');
            }else{
              _profileData.business_logo = main_image_Ret.coreFileName;
              // customFieldErrors.business_logo = {message: main_image_Ret.errorMessage};
              customFieldErrors.image = {message: main_image_Ret.errorMessage};
              // console.log(' 2 is after Upload');
            }
            // ============================ Image End=================================
        if (Object.keys(customFieldErrors).length) {
          throw customFieldErrors;
        } else {
          return [allState, Users.update({id: userId}, _userData), BusinessProfile.update({id: businessProfileId}, _profileData)]
        }
        
      }).spread(function(allState, updateUser, updateProfile) {
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
            // businessProfile: updateProfile[0],
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

    aboutTheBusinessSave: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      let userId = tokenUser.id;
      let data = req.param("data");
      // console.log('====', data);

      let main_image = data.image ? data.image : '';
      let oldImage = data.old_image ? data.old_image : '';

      let _profileData = {
            business_name: data.business_name ? data.business_name.trim() : '',
            official_email: data.official_email ? data.official_email.trim() : '',
            official_phone: data.official_phone ? data.official_phone.trim() : '',
            Official_address_line1: data.Official_address_line1 ? data.Official_address_line1.trim() : '',
            state: data.state ? data.state.trim() : '',
            city: data.city ? data.city.trim() : '',
            zip: data.zip ? data.zip.trim() : '',
            website_link: data.website_link ? data.website_link.trim() : '',
            history: data.history ? data.history.trim() : '',
            // business_logo: data.business_logo ? data.business_logo.trim() : '',
          };
      let _userData = {
          first_name: data.first_name ? data.first_name.trim() : '',
          last_name: data.last_name ? data.last_name.trim() : '',
      }

      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      if (!_profileData.business_name) {
        customFieldErrors.business_name = {message: 'Business Name is Required'};
      }
      if (!_profileData.official_email) {
        customFieldErrors.official_email = {message: 'Official email is Required'};
      } else {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(_profileData.official_email) == false) 
          {
              customFieldErrors.official_email = {message: 'Provide valid Official email address'};
          }
      }
      if (!_profileData.official_phone) {
        customFieldErrors.official_phone = {message: 'Official phone is Required'};
      }
      if (!_profileData.Official_address_line1) {
        customFieldErrors.Official_address_line1 = {message: 'Official address is Required'};
      }

      
      if (!_profileData.city) {
        customFieldErrors.city = {message: 'City is Required'};
      }
      if (!_profileData.zip) {
        customFieldErrors.zip = {message: 'ZIP is Required'};
      }
      // if (!_profileData.website_link) {
      //   customFieldErrors.website_link = {message: 'Website link is Required'};
      // }
      if (!_profileData.history) {
        customFieldErrors.history = {message: 'History is Required'};
      }
      // User Data Start
      if (!_userData.first_name) {
        customFieldErrors.first_name = {message: 'First name is Required'};
      }
      if (!_userData.last_name) {
        customFieldErrors.last_name = {message: 'Last name is Required'};
      }

      let _creSlugData = {
        model: 'businessprofile',
        type: 'slug',
        from: _profileData.business_name,
        defaultValue: 'slug'
      };

      // ***************Custom error hendle End**************
      // console.log('i am _qryData', _qryData);
      let fileSaveLocation = '.tmp/public/uploads/business-logo';
      let fileCopyLocation = 'assets/uploads/business-logo';

      return Promise.all([
        BusinessProfile.findOne({id: businessProfileId}),
        State.find({status: 1},{select: ['name']}).sort('name ASC'), //<--All record For Show at form
        ZeBase64ImageService.imageCreate(main_image, oldImage, 400, 300, fileSaveLocation, fileCopyLocation, 1), //<--For image Download From Url 
        ZeslugService.slugForCreate(_creSlugData), //<--Generate slug
        State.findOne({id: _profileData.state},{select: ['name', 'country']}),
      ]).spread(function(sinExistdata, allState, main_image_Ret, creSlug, extState) {

        if(sinExistdata.business_name != _profileData.business_name){
          _profileData.slug = creSlug;
        }

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
              _profileData.business_logo = main_image_Ret.coreFileName;
              if(main_image_Ret.coreFileName == ''){
                // customFieldErrors.business_logo = {message: 'Image File is Requird'};
                customFieldErrors.image = {message: 'Image File is Requird'};
              }
              // console.log(' 1 is after Upload');
            }else{
              _profileData.business_logo = main_image_Ret.coreFileName;
              // customFieldErrors.business_logo = {message: main_image_Ret.errorMessage};
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
            userData: _profileData,
            fieldData: _profileData,
            message: 'Field error',
          });
        } else {
          // return [allState, Users.update({id: userId}, _userData), BusinessProfile.update({id: businessProfileId}, _profileData)]
          return Promise.all([
            allState,
             Users.update({id: userId},_userData),
             BusinessProfile.update({id: businessProfileId},_profileData),
          ]).spread(function(allState, updateUser, updateProfile) {
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
                // businessProfile: updateProfile[0],
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
    

    amenityAllAndSelected: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile

      let _qryData = {
        status: 1,
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        Amenity.find({select: ['id','title','status','slug']}).where(_qryData),
        BusinessProfileAmenity.find({businessProfile: businessProfileId},{select: ['amenity']}), //<--For Frequent Bought Togather Product Multi Box Auto Selected
      ]).spread(function(allAmenity, selectedAmenity) {
        // console.log('selectedAmenity===', selectedAmenity);

        if(allAmenity && allAmenity.length > 0){

            let aminityIds = []; 
            if(selectedAmenity && selectedAmenity.length > 0){
              // aminityIds = selectedAmenity.map((sinItem) => sinItem.id); 
              aminityIds = selectedAmenity.map((sinItem) => sinItem.amenity); 
            }


            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              // businessProfile: tokenUser.businessProfile,
              allAmenity: allAmenity,
              selectedAmenity: aminityIds,
              message: 'all aminity and selected amenity',
            });
        }else {
          return res.send({
            status: 'success',
            status_code: 12,
            actionStatus: 1,
            allAmenity: [],
            message: 'Empty all aminity and selected aminity',
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

    singleAmenityAddRemove: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");
      // console.log('data1===', data);
      // console.log('aminityId===', data.aminityId);
      // console.log('data2===', JSON.parse(data));
      let addRmvItemId = data.aminityId;
      let _qryData = {
        id: addRmvItemId,
        status: 1,
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        Amenity.findOne({select: ['id','title','status','slug']}).where(_qryData),
      ]).spread(function(targetAminity) {
        // console.log('targetAminit'y===', targetAminity);
        return [
          targetAminity,
          BusinessProfileAmenity.findOne({businessProfile: businessProfileId, amenity: addRmvItemId },{select: ['amenity']}), //<--For Frequent Bought Togather Product Multi Box Auto Selected
        ]
      }).spread(function(targetAminity, extProfileAminity) {
        if(targetAminity){
          console.log('i am at pos = 1');
            if(extProfileAminity){
              console.log('i am at pos = 2', extProfileAminity);
              targetAminity.businessProfile.remove(businessProfileId);
              targetAminity.save();
              return res.send({
                status: 'success',
                status_code: 11,
                actionStatus: 2, // remove
                targetAminity: targetAminity ? targetAminity : 'not-found',
                message: 'aminity remove successfully',
              });
              
            }else{
              console.log('i am at pos = 3');
              targetAminity.businessProfile.add(businessProfileId);
              targetAminity.save();
              return res.send({
                status: 'success',
                status_code: 11,
                actionStatus: 1, // added
                targetAminity: targetAminity ? targetAminity : 'not-found',
                message: 'aminity added successfully',
              });
            }

        }else {
          console.log('i am at pos = 4');
          return res.send({
            status: 'error',
            status_code: 33,
            actionStatus: 0,
            allCategory: {},
            message: 'aminity not found',
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

    hoursOfOperationAndExtendedClosure: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile

      let _qryData = {
        businessProfile: businessProfileId
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessOperationHour.findOne(_qryData),
        BusinessExtendedClosure.findOne(_qryData),
      ]).spread(function(extOperationHour, extExtendedClosure) {
        console.log('extOperationHour===', extOperationHour);
        console.log('extExtendedClosure===', extExtendedClosure);

        if(extOperationHour || extExtendedClosure){
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              businessOperation: extOperationHour,
              extendedClosure: extExtendedClosure ? extExtendedClosure : {},
              message: 'Business Operation',
            });
        }else {
          return res.send({
            status: 'success',
            status_code: 12,
            actionStatus: 1,
            businessOperation: {},
            extendedClosure: {},
            message: 'Empty Business Operation',
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

    hoursOfOperationSave: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");

      let _formData = {
        is_saturday_close: data.is_saturday_close ? true : false,
        is_saturday_24open: data.is_saturday_24open ? true : false,
        saturday_start_time: data.saturday_start_time ? data.saturday_start_time.trim() : '',
        saturday_end_time: data.saturday_end_time ? data.saturday_end_time.trim() : '',

        is_sunday_close: data.is_sunday_close ? true : false,
        is_sunday_24open: data.is_sunday_24open ? true : false,
        sunday_start_time: data.sunday_start_time ? data.sunday_start_time.trim() : '',
        sunday_end_time: data.sunday_end_time ? data.sunday_end_time.trim() : '',

        is_monday_close: data.is_monday_close ? true : false,
        is_monday_24open: data.is_monday_24open ? true : false,
        monday_start_time: data.monday_start_time ? data.monday_start_time.trim() : '',
        monday_end_time: data.monday_end_time ? data.monday_end_time.trim() : '',

        is_tuesday_close: data.is_tuesday_close ? true : false,
        is_tuesday_24open: data.is_tuesday_24open ? true : false,
        tuesday_start_time: data.tuesday_start_time ? data.tuesday_start_time.trim() : '',
        tuesday_end_time: data.tuesday_end_time ? data.tuesday_end_time.trim() : '',

        is_wednesday_close: data.is_wednesday_close ? true : false,
        is_wednesday_24open: data.is_wednesday_24open ? true : false,
        wednesday_start_time: data.wednesday_start_time ? data.wednesday_start_time.trim() : '',
        wednesday_end_time: data.wednesday_end_time ? data.wednesday_end_time.trim() : '',

        is_thursday_close: data.is_thursday_close ? true : false,
        is_thursday_24open: data.is_thursday_24open ? true : false,
        thursday_start_time: data.thursday_start_time ? data.thursday_start_time.trim() : '',
        thursday_end_time: data.thursday_end_time ? data.thursday_end_time.trim() : '',

        is_friday_close: data.is_friday_close ? true : false,
        is_friday_24open: data.is_friday_24open ? true : false,
        friday_start_time: data.friday_start_time ? data.friday_start_time.trim() : '',
        friday_end_time: data.friday_end_time ? data.friday_end_time.trim() : '',

        businessProfile: businessProfileId
      }

      if(_formData.is_saturday_close || _formData.is_saturday_24open){
        _formData.saturday_start_time = '';
        _formData.saturday_end_time = '';

        if(_formData.is_saturday_close){
          _formData.is_saturday_24open = false;
        }

        if(_formData.is_saturday_24open){
          _formData.is_saturday_close = false;
        }
      }

      if(_formData.is_sunday_close || _formData.is_sunday_24open){
        _formData.sunday_start_time = '';
        _formData.sunday_end_time = '';

        if(_formData.is_sunday_close){
          _formData.is_sunday_24open = false;
        }

        if(_formData.is_sunday_24open){
          _formData.is_sunday_close = false;
        }
      }

      if(_formData.is_monday_close || _formData.is_monday_24open){
        _formData.monday_start_time = '';
        _formData.monday_end_time = '';

        if(_formData.is_monday_close){
          _formData.is_monday_24open = false;
        }

        if(_formData.is_monday_24open){
          _formData.is_monday_close = false;
        }
      }

      if(_formData.is_tuesday_close || _formData.is_tuesday_24open){
        _formData.tuesday_start_time = '';
        _formData.tuesday_end_time = '';

        if(_formData.is_tuesday_close){
          _formData.is_tuesday_24open = false;
        }

        if(_formData.is_tuesday_24open){
          _formData.is_tuesday_close = false;
        }
      }

      if(_formData.is_wednesday_close || _formData.is_wednesday_24open){
        _formData.wednesday_start_time = '';
        _formData.wednesday_end_time = '';

        if(_formData.is_wednesday_close){
          _formData.is_wednesday_24open = false;
        }

        if(_formData.is_wednesday_24open){
          _formData.is_wednesday_close = false;
        }
      }

      if(_formData.is_thursday_close || _formData.is_thursday_24open){
        _formData.thursday_start_time = '';
        _formData.thursday_end_time = '';

        if(_formData.is_thursday_close){
          _formData.is_thursday_24open = false;
        }

        if(_formData.is_thursday_24open){
          _formData.is_thursday_close = false;
        }
      }

      if(_formData.is_friday_close || _formData.is_friday_24open){
        _formData.friday_start_time = '';
        _formData.friday_end_time = '';

        if(_formData.is_friday_close){
          _formData.is_friday_24open = false;
        }

        if(_formData.is_friday_24open){
          _formData.is_friday_close = false;
        }
      }

      console.log('data1===', data);
      // console.log('data2===', JSON.parse(data));
      let _qryData = {
        businessProfile: businessProfileId,
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessOperationHour.findOne(_qryData),
      ]).spread(function(targetOptHour) {
        console.log('targetOptHour===', targetOptHour);

        if(targetOptHour){
          return [targetOptHour,BusinessOperationHour.update(targetOptHour.id, _formData)]
        } else {
          return [targetOptHour,BusinessOperationHour.create(_formData)]
        }
        
      }).spread(function(targetOptHour, creUpdOptHour) {
        
          console.log('i am at pos = 1');
            if(targetOptHour){
              console.log('i am at pos = 2', targetOptHour);
              return res.send({
                status: 'success',
                status_code: 11,
                actionStatus: 2, // remove
                optHous: creUpdOptHour[0],
                message: 'Update successfully',
              });
            }else{
              console.log('i am at pos = 3');
              return res.send({
                status: 'success',
                status_code: 11,
                actionStatus: 1, // added
                optHous: creUpdOptHour,
                message: 'added successfully',
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

    hoursOfOperationExtendedClosureSave: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");

      let _formData = {
        is_temporarily_closed: data.is_temporarily_closed ? true : false,
        is_permanently_closed: data.is_permanently_closed ? true : false,
        expiration_date: data.reopen_date ? (data.reopen_date.split("-").reverse().join("-")) : '',
        additional_detail: data.additional_detail ? data.additional_detail.trim() : '',
        businessProfile: businessProfileId
      }
      
        if(_formData.is_temporarily_closed){
          _formData.is_permanently_closed = false;
          _formData.additional_detail = data.temporarily_detail ? data.temporarily_detail.trim() : '';
        }

        if(_formData.is_permanently_closed){
          _formData.is_temporarily_closed = false;
          _formData.additional_detail = data.permanently_detail ? data.permanently_detail.trim() : '';
        }
     


      console.log('data1===', data);
      // console.log('data2===', JSON.parse(data));
      let _qryData = {
        businessProfile: businessProfileId,
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessOperationHour.findOne(_qryData),
      ]).spread(function(targetOptHour) {
        console.log('targetOptHour===', targetOptHour);

        if(targetOptHour){
          return [targetOptHour,BusinessOperationHour.create(_formData)] 
        } else {
          return [targetOptHour,BusinessOperationHour.update(targetOptHour.id, _formData)]
        }
        
      }).spread(function(targetOptHour, creUpdOptHour) {
        
          console.log('i am at pos = 1');
            if(targetOptHour){
              console.log('i am at pos = 2', targetOptHour);
              return res.send({
                status: 'success',
                status_code: 11,
                actionStatus: 2, // remove
                optHous: creUpdOptHour[0],
                message: 'Update successfully',
              });
            }else{
              console.log('i am at pos = 3');
              return res.send({
                status: 'success',
                status_code: 11,
                actionStatus: 1, // added
                optHous: creUpdOptHour,
                message: 'added successfully',
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


    photoAlbumAll: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      let userId = tokenUser.id;
      let _qryData = {
        id: businessProfileId,
        status: 1
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessAlbum.find({businessProfile: businessProfileId, status: 1},{select: ['name', 'image', 'status']}).sort('name ASC'), //<--All record For Show at form 
      ]).spread(function(allAlbum) {
        if(allAlbum && allAlbum.length > 0){
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              allAlbum: allAlbum,
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

    photoAlbumSave_111: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");

      console.log('data1===', data);

      let main_image = data.image ? data.image : '';
      let oldImage = data.old_image ? data.old_image : '';

      let _formData = {
        name: data.name ? data.name.trim() : '',
        status: data.status ? data.status.trim() : 1,
        businessProfile: businessProfileId
      }

      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      if (!_formData.name) {
        customFieldErrors.name = {message: 'Album Name is Required'};
      }
      let _creSlugData = {
        model: 'businessalbum',
        type: 'slug',
        from: _formData.name,
        defaultValue: 'slug'
      };

      // ***************Custom error hendle End**************

      
      // console.log('i am _qryData', _qryData);
      let fileSaveLocation = '.tmp/public/uploads/business-album';
      let fileCopyLocation = 'assets/uploads/business-album';
      return Promise.all([
        ZeslugService.slugForCreate(_creSlugData), //<--Generate slug
        ZeBase64ImageService.imageCreate(main_image, oldImage, 400, 300, fileSaveLocation, fileCopyLocation, 1), //<--For image Download From Url 
        BusinessAlbum.findOne({name: _formData.name, businessProfile: businessProfileId}), //<--For validation Check
      ]).spread(function(creSlug, main_image_Ret, extName) {
        if(extName){
          customFieldErrors.name = {message: 'Name is already taken'};
        }
        _formData.slug = creSlug;

        // ============================ Image Strat===============================
        if(!main_image_Ret.errorFound){
          _formData.image = main_image_Ret.coreFileName;
          if(main_image_Ret.coreFileName == ''){
            customFieldErrors.image = {message: 'Image File is Requird'};
          }
          // console.log(' 1 is after Upload');
        }else{
          _formData.image = main_image_Ret.coreFileName;
          customFieldErrors.image = {message: main_image_Ret.errorMessage};
          // console.log(' 2 is after Upload');
        }
        // ============================ Image End=================================

        if (Object.keys(customFieldErrors).length) {
          // throw customFieldErrors;
          // return Promise.reject();
          // return res.err({
          //   status: 'fieldError',
          //   status_code: 33,
          //   actionStatus: 5,//mean Field error
          //   fieldErrors: customFieldErrors,
          //   fieldData: _formData,
          //   message: 'Field error',
          // });
          return [customFieldErrors, BusinessAlbum.create(_formData)]
        } else {
          return [null, BusinessAlbum.create(_formData)]
        }
        
      }).spread(function(createedAlbum) {
          console.log('i am at pos = 1');
            if(createedAlbum){
              console.log('i am at pos = 2', createedAlbum);
              return res.send({
                status: 'success',
                status_code: 11,
                actionStatus: 1, // remove
                allbum: createedAlbum,
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
    photoAlbumSave: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");

      console.log('data1===', data);

      let main_image = data.image ? data.image : '';
      let oldImage = data.old_image ? data.old_image : '';

      let _formData = {
        name: data.name ? data.name.trim() : '',
        status: data.status ? data.status.trim() : 1,
        businessProfile: businessProfileId
      }

      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      if (!_formData.name) {
        customFieldErrors.name = {message: 'Album Name is Required'};
      }
      let _creSlugData = {
        model: 'businessalbum',
        type: 'slug',
        from: _formData.name,
        defaultValue: 'slug'
      };

      // ***************Custom error hendle End**************

      
      // console.log('i am _qryData', _qryData);
      let fileSaveLocation = '.tmp/public/uploads/business-album';
      let fileCopyLocation = 'assets/uploads/business-album';
      return Promise.all([
        ZeslugService.slugForCreate(_creSlugData), //<--Generate slug
        ZeBase64ImageService.imageCreate(main_image, oldImage, 400, 300, fileSaveLocation, fileCopyLocation, 1), //<--For image Download From Url 
        BusinessAlbum.findOne({name: _formData.name, businessProfile: businessProfileId}), //<--For validation Check
      ]).spread(function(creSlug, main_image_Ret, extName) {
        if(extName){
          customFieldErrors.name = {message: 'Name is already taken'};
        }
        _formData.slug = creSlug;

        // ============================ Image Strat===============================
        if(!main_image_Ret.errorFound){
          _formData.image = main_image_Ret.coreFileName;
          // if(main_image_Ret.coreFileName == ''){
          //   customFieldErrors.image = {message: 'Image File is Requird'};
          // }
          // console.log(' 1 is after Upload');
        }else{
          _formData.image = main_image_Ret.coreFileName;
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
            fieldData: _formData,
            message: 'Field error',
          });
        } else {
          return Promise.all([
            BusinessAlbum.create(_formData)
          ]).spread(function(createedAlbum) {
            console.log('i am at pos = 1');
              if(createedAlbum){
                console.log('i am at pos = 2', createedAlbum);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // remove
                  allbum: createedAlbum,
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

    photoAlbumUpdate____: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");

      let actionId = data.id ? data.id : ''

      console.log('data1===', data);

      let main_image = data.image ? data.image : '';
      let oldImage = data.old_image ? data.old_image : '';

      let _formData = {
        name: data.name ? data.name.trim() : '',
        status: data.status ? data.status.trim() : 1,
      }

      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      if (!_formData.name) {
        customFieldErrors.name = {message: 'Album Name is Required'};
      }
      let _creSlugData = {
        model: 'businessalbum',
        type: 'slug',
        from: _formData.name,
        defaultValue: 'slug'
      };

      // ***************Custom error hendle End**************

      
      // console.log('i am _qryData', _qryData);
      let fileSaveLocation = '.tmp/public/uploads/business-album';
      let fileCopyLocation = 'assets/uploads/business-album';
      return Promise.all([
        BusinessAlbum.findOne({id: actionId, businessProfile: businessProfileId}),
        ZeslugService.slugForUpdate(_creSlugData), //<--Generate slug
        ZeBase64ImageService.imageCreate(main_image, oldImage, 400, 300, fileSaveLocation, fileCopyLocation, 1), //<--For image Download From Url 
        BusinessAlbum.findOne({name: _formData.name, businessProfile: businessProfileId}), //<--For validation Check
      ]).spread(function(sinExistdata, creSlug, main_image_Ret, extName) {

        if(!sinExistdata){
          customFieldErrors.commonError = {message: 'Exist data not found'};
          return res.send({
            status: 'error',
            fieldErrors: customFieldErrors,
            remoteData: fromData
          });
        }
        if(extName){
          customFieldErrors.name = {message: 'Name is already taken'};
        }
        _formData.slug = creSlug;

        // ============================ Image Strat===============================
        if(!main_image_Ret.errorFound){
          _formData.image = main_image_Ret.coreFileName;
          if(main_image_Ret.coreFileName == ''){
            customFieldErrors.image = {message: 'Image File is Requird'};
          }
          // console.log(' 1 is after Upload');
        }else{
          _formData.image = main_image_Ret.coreFileName;
          customFieldErrors.image = {message: main_image_Ret.errorMessage};
          // console.log(' 2 is after Upload');
        }
        // ============================ Image End=================================

        if (Object.keys(customFieldErrors).length) {
          throw customFieldErrors;
        } else {
          return [BusinessAlbum.create(_formData)]
        }
        
      }).spread(function(createedAlbum) {
          console.log('i am at pos = 1');
            if(createedAlbum){
              console.log('i am at pos = 2', createedAlbum);
              return res.send({
                status: 'success',
                status_code: 11,
                actionStatus: 1, // remove
                allbum: createedAlbum,
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

    photoAlbumUpdate: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");
      let actionId = data.id ? data.id : '';

      let main_image = data.image ? data.image : '';
      let oldImage = data.old_image ? data.old_image : '';

      let _formData = {
        name: data.name ? data.name.trim() : '',
        status: data.status ? data.status : 1,
      }

      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      if (!_formData.name) {
        customFieldErrors.name = {message: 'Album Name is Required'};
      }
      let _creSlugData = {
        model: 'businessalbum',
        type: 'slug',
        from: _formData.name,
        defaultValue: 'slug'
      };

      // ***************Custom error hendle End**************

      
      // console.log('i am _qryData', _qryData);
      let fileSaveLocation = '.tmp/public/uploads/business-album';
      let fileCopyLocation = 'assets/uploads/business-album';
      return Promise.all([
        BusinessAlbum.findOne({id: actionId, businessProfile: businessProfileId}),
        ZeslugService.slugForUpdate(_creSlugData), //<--Generate slug
        ZeBase64ImageService.imageCreate(main_image, oldImage, 400, 300, fileSaveLocation, fileCopyLocation, 1), //<--For image Download From Url 
        BusinessAlbum.findOne({name: _formData.name, businessProfile: businessProfileId}), //<--For validation Check
      ]).spread(function(sinExistdata, creSlug, main_image_Ret, extName) {
        
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

        if(extName){
          if(sinExistdata.id != extName.id){
              customFieldErrors.name = {message: 'Name is already taken'};
          }
        }

        if(sinExistdata.name != _formData.name){
          _formData.slug = creSlug;
        }
        
        

        // ============================ Image Strat===============================
        if(!main_image_Ret.errorFound){
          _formData.image = main_image_Ret.coreFileName;
          // if(main_image_Ret.coreFileName == ''){
          //   customFieldErrors.image = {message: 'Image File is Requird'};
          // }
          // console.log(' 1 is after Upload');
        }else{
          _formData.image = main_image_Ret.coreFileName;
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
            fieldData: _formData,
            message: 'Field error',
          });
        } else {
          return Promise.all([
            BusinessAlbum.update({id: actionId}, _formData)
          ]).spread(function(createedAlbum) {
            console.log('i am at pos = 1');
              if(createedAlbum[0]){
                console.log('i am at pos = 2', createedAlbum);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // remove
                  allbum: createedAlbum,
                  message: 'Saved successfully',
                });
              }else{
                console.log('i am at pos = 3');
                return res.send({
                  status: 'error',
                  status_code: 33,
                  actionStatus: 0,
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
    photoAlbumDelet: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");
      // let actionId = data.id ? data.id : '';

      let _formData = {
        id: data.id ? data.id.trim() : '',
        businessProfile: businessProfileId
      }
      
      // console.log('i am _qryData', _qryData);
      
      return Promise.all([
        BusinessAlbum.findOne(_formData),
        BusinessAlbumPhoto.findOne({businessAlbum: _formData.id, businessProfile: businessProfileId}), //<--For validation Check
      ]).spread(function(deleteData, photoHasData) {

        if(!deleteData){
          return res.send({
            status: 'dataExistError',
            status_code: 33,
            actionStatus: 6,//mean Exist Data error
            message: 'Data Not found In Database',
          });
        }
        if(photoHasData ){
          return res.send({
            status: 'deleteError',
            status_code: 33,
            actionStatus: 7,//mean Delete Data error
            message: 'It Has Related Data You Cannot Delete It',
          });
        } else {
          deleteData.destroy().then(function (_deldata) {
              let fileSaveLocation = '.tmp/public/uploads/business-album';
              let fileCopyLocation = 'assets/uploads/business-album';

              if(_deldata[0].image){
                if(fs.existsSync(sails.config.appPath +'/'+fileSaveLocation+'/'+ _deldata[0].image)){
                  fs.unlinkSync(sails.config.appPath +'/'+fileSaveLocation+'/'+ _deldata[0].image);
                }
                if(fs.existsSync(sails.config.appPath +'/'+fileCopyLocation+'/'+ _deldata[0].image)){
                  fs.unlinkSync(sails.config.appPath +'/'+fileCopyLocation+'/'+ _deldata[0].image);
                }

              }
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1, // remove
              message: 'Delete successfully',
          });
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

    albumPhotoAll: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      let data = req.param("data");
      let albumId = data.albumId ? data.albumId : '';
      // let actionId = data.id ? data.id : '';
      
      let _qryData = {
        id: businessProfileId,
        status: 1
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessAlbumPhoto.find({businessAlbum: albumId, businessProfile: businessProfileId, status: 1},{select: ['title', 'image', 'status']}).sort('name ASC'), //<--All record For Show at form 
      ]).spread(function(allPhoto) {
        if(allPhoto && allPhoto.length > 0){
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              allPhoto: allPhoto,
              message: 'Album photo data found Success fully',
            });
        }else {
          return res.send({
            status: 'error',
            status_code: 33,
            actionStatus: 0,
            message: 'Album photo Not found',
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

    albumPhotoSave: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");

      let main_image = data.image ? data.image : '';
      let oldImage = data.old_image ? data.old_image : '';

      let _formData = {
        title: data.title ? data.title.trim() : '',
        status: data.status ? data.status.trim() : 1,
        businessAlbum: data.album_id ? data.album_id.trim() : '',
        businessProfile: businessProfileId,
      }

      // console.log('_formData==', _formData);

      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      if (!_formData.title) {
        customFieldErrors.title = {message: 'Title is Required'};
      }
      let _creSlugData = {
        model: 'businessalbumphoto',
        type: 'slug',
        from: _formData.title,
        defaultValue: 'slug'
      };

      // ***************Custom error hendle End**************

      
      // console.log('i am _qryData', _qryData);
      let fileSaveLocation = '.tmp/public/uploads/business-photo';
      let fileCopyLocation = 'assets/uploads/business-photo';
      return Promise.all([
        ZeslugService.slugForCreate(_creSlugData), //<--Generate slug
        ZeBase64ImageService.imageCreate(main_image, oldImage, 400, 300, fileSaveLocation, fileCopyLocation, 1), //<--For image Download From Url 
        BusinessAlbum.findOne({id: _formData.businessAlbum, businessProfile: businessProfileId}), //<--For validation Check
      ]).spread(function(creSlug, main_image_Ret, extAlbum) {
        if(!extAlbum){
          customFieldErrors.commonError = {message: 'Album not found'};
          return res.send({
            status: 'dataExistError',
            status_code: 33,
            actionStatus: 6,//mean Exist Data error
            fieldErrors: customFieldErrors,
            fieldData: _formData,
            message: 'Exist data error',
          });
        }
        
        _formData.slug = creSlug;

        // ============================ Image Strat===============================
        if(!main_image_Ret.errorFound){
          _formData.image = main_image_Ret.coreFileName;
          if(main_image_Ret.coreFileName == ''){
            customFieldErrors.image = {message: 'Image File is Requird'};
          }
          // console.log(' 1 is after Upload');
        }else{
          _formData.image = main_image_Ret.coreFileName;
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
            fieldData: _formData,
            message: 'Field error',
          });
        } else {
          return Promise.all([
            BusinessAlbumPhoto.create(_formData)
          ]).spread(function(createedPhoto) {
            console.log('i am at pos = 1');
              if(createedPhoto){
                console.log('i am at pos = 2', createedPhoto);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // remove
                  photo: createedPhoto,
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
    albumPhotoUpdate: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");
      let actionId = data.id ? data.id : '';

      let main_image = data.image ? data.image : '';
      let oldImage = data.old_image ? data.old_image : '';

      let _formData = {
        title: data.title ? data.title.trim() : '',
        status: data.status ? data.status.trim() : 1,
        businessAlbum: data.album_id ? data.album_id.trim() : '',
      }

      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      if (!_formData.title) {
        customFieldErrors.title = {message: 'Title is Required'};
      }
      let _creSlugData = {
        model: 'businessalbumphoto',
        type: 'slug',
        from: _formData.title,
        defaultValue: 'slug'
      };

      // ***************Custom error hendle End**************

      
      // console.log('i am _qryData', _qryData);
      let fileSaveLocation = '.tmp/public/uploads/business-photo';
      let fileCopyLocation = 'assets/uploads/business-photo';
      return Promise.all([
        BusinessAlbumPhoto.findOne({id: actionId, businessProfile: businessProfileId}),
        ZeslugService.slugForUpdate(_creSlugData), //<--Generate slug
        ZeBase64ImageService.imageCreate(main_image, oldImage, 400, 300, fileSaveLocation, fileCopyLocation, 1), //<--For image Download From Url 
      ]).spread(function(sinExistdata, creSlug, main_image_Ret) {
        
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

        

        if(sinExistdata.title != _formData.title){
          _formData.slug = creSlug;
        }
        
        

        // ============================ Image Strat===============================
        if(!main_image_Ret.errorFound){
          _formData.image = main_image_Ret.coreFileName;
          // if(main_image_Ret.coreFileName == ''){
          //   customFieldErrors.image = {message: 'Image File is Requird'};
          // }
          // console.log(' 1 is after Upload');
        }else{
          _formData.image = main_image_Ret.coreFileName;
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
            fieldData: _formData,
            message: 'Field error',
          });
        } else {
          return Promise.all([
            BusinessAlbumPhoto.update({id: actionId}, _formData)
          ]).spread(function(updatePhoto) {
            console.log('i am at pos = 1');
              if(updatePhoto[0]){
                console.log('i am at pos = 2', updatePhoto[0]);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // remove
                  photo: updatePhoto[0],
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
    albumPhotoDelet: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");
      // let actionId = data.id ? data.id : '';

      let _formData = {
        id: data.id ? data.id.trim() : '',
        businessProfile: businessProfileId
      }
      
      // console.log('i am _qryData', _qryData);
      
      return Promise.all([
        BusinessAlbumPhoto.findOne(_formData),
      ]).spread(function(deleteData) {

        if(!deleteData){
          return res.send({
            status: 'dataExistError',
            status_code: 33,
            actionStatus: 6,//mean Exist Data error
            message: 'Data Not found In Database',
          });
        }
        
          deleteData.destroy().then(function (_deldata) {
              let fileSaveLocation = '.tmp/public/uploads/business-photo';
              let fileCopyLocation = 'assets/uploads/business-photo';

              if(_deldata[0].image){
                if(fs.existsSync(sails.config.appPath +'/'+fileSaveLocation+'/'+ _deldata[0].image)){
                  fs.unlinkSync(sails.config.appPath +'/'+fileSaveLocation+'/'+ _deldata[0].image);
                }
                if(fs.existsSync(sails.config.appPath +'/'+fileCopyLocation+'/'+ _deldata[0].image)){
                  fs.unlinkSync(sails.config.appPath +'/'+fileCopyLocation+'/'+ _deldata[0].image);
                }

              }
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1, // remove
              message: 'Delete successfully',
          });
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

    embeddedVideoAll: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      // let data = req.param("data");
      
      // let _qryData = {
      //   businessProfile: businessProfileId,
      //   status: 1
      // }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessEmbeddedVideo.find({businessProfile: businessProfileId, status: 1},{select: ['title', 'link', 'status']}).sort('title ASC'), //<--All record For Show at form 
      ]).spread(function(allVideo) {
        if(allVideo && allVideo.length > 0){
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              allVideo: allVideo,
              message: 'All Video data found Success fully',
            });
        }else {
          return res.send({
            status: 'error',
            status_code: 33,
            actionStatus: 0,
            message: 'All Video Not found',
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
    embeddedVideoSave: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");

      let _formData = {
        title: data.title ? data.title.trim() : '',
        link: data.link ? data.link.trim() : '',
        status: data.status ? data.status.trim() : 1,
        businessProfile: businessProfileId,
      }

      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      if (!_formData.link) {
        customFieldErrors.link = {message: 'Link is Required'};
      }
      
      let _creSlugData = {
        model: 'businessembeddedvideo',
        type: 'slug',
        from: _formData.title,
        defaultValue: 'slug'
      };

      // ***************Custom error hendle End**************

      
      // console.log('i am _qryData', _qryData);
     
      return Promise.all([
        BusinessEmbeddedVideo.findOne({link: _formData.link, businessProfile: businessProfileId}), //<--For validation Check
        ZeslugService.slugForCreate(_creSlugData), //<--Generate slug
      ]).spread(function(extVideo, creSlug) {
        _formData.slug = creSlug;

        if(extVideo){
          customFieldErrors.commonError = {message: 'Video Already exist'};
          // return res.send({
          //   status: 'dataExistError',
          //   status_code: 33,
          //   actionStatus: 6,//mean Exist Data error
          //   fieldErrors: customFieldErrors,
          //   fieldData: _formData,
          //   message: 'Video Already exist',
          // });
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
            BusinessEmbeddedVideo.create(_formData)
          ]).spread(function(createedVideo) {
            console.log('i am at pos = 1');
              if(createedVideo){
                console.log('i am at pos = 2', createedVideo);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // remove
                  video: createedVideo,
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
    embeddedVideoUpdate: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");
      let actionId = data.id ? data.id : '';

      
      let _formData = {
        title: data.title ? data.title.trim() : '',
        link: data.link ? data.link.trim() : 1,
      }

      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      if (!_formData.link) {
        customFieldErrors.link = {message: 'Link is Required'};
      }

      let _creSlugData = {
        model: 'businessembeddedvideo',
        type: 'slug',
        from: _formData.title,
        defaultValue: 'slug'
      };

      // ***************Custom error hendle End**************

      
      // console.log('i am _qryData', _qryData);
      
      return Promise.all([
        BusinessEmbeddedVideo.findOne({id: actionId, businessProfile: businessProfileId}),
        ZeslugService.slugForCreate(_creSlugData), //<--Generate slug
      ]).spread(function(sinExistdata, creSlug) {

        if(sinExistdata.title != _formData.title){
          _formData.slug = creSlug;
        }
        
        if(!sinExistdata){
          customFieldErrors.commonError = {message: 'Exist data not found'};
          // return res.send({
          //   status: 'dataExistError',
          //   status_code: 33,
          //   actionStatus: 6,//mean Exist Data error
          //   fieldErrors: customFieldErrors,
          //   fieldData: _formData,
          //   message: 'Exist data error',
          // });
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
            BusinessEmbeddedVideo.update({id: actionId}, _formData)
          ]).spread(function(updateVideo) {
            console.log('i am at pos = 1');
              if(updateVideo[0]){
                console.log('i am at pos = 2', updateVideo[0]);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // remove
                  photo: updateVideo[0],
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
    embeddedVideoDelete: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");
      // let actionId = data.id ? data.id : '';

      let _formData = {
        id: data.id ? data.id.trim() : '',
        businessProfile: businessProfileId
      }
      
      // console.log('i am _qryData', _qryData);
      
      return Promise.all([
        BusinessEmbeddedVideo.findOne(_formData),
      ]).spread(function(deleteData) {

        if(!deleteData){
          return res.send({
            status: 'dataExistError',
            status_code: 33,
            actionStatus: 6,//mean Exist Data error
            message: 'Data Not found In Database',
          });
        }
        
          deleteData.destroy().then(function (_deldata) {
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1, // remove
              message: 'Delete successfully',
          });
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
    reviewAll: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      let data = req.param("data");
      // let actionId = data.id ? data.id : '';
      
      let _qryData = {
        id: businessProfileId,
        status: 1
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessReview.find({businessProfile: businessProfileId},{select: ['rating', 'comment', 'createdByObj']}).sort('rating ASC'), //<--All record For Show at form 
      ]).spread(function(allReview) {
        if(allReview && allReview.length > 0){
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              allReview: allReview,
              message: 'Album photo data found Success fully',
            });
        }else {
          return res.send({
            status: 'error',
            status_code: 33,
            actionStatus: 0,
            message: 'Album photo Not found',
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
    reviewUpdate: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");
      let actionId = data.id ? data.id : '';

      
      let _formData = {
        rating: (data.rating && data.rating > 0) ? data.rating : 0,
        comment: data.comment ? data.comment.trim() : '',
        // updatedBy: tokenUser.id
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

      
      // console.log('i am _qryData', _qryData);
      
      return Promise.all([
        BusinessReview.findOne({id: actionId, businessProfile: businessProfileId}),
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
          _formData.updatedBy = tokenUser.id;
          return Promise.all([
            BusinessReview.update({id: actionId}, _formData)
          ]).spread(function(updateReview) {
            console.log('i am at pos = 1');
              if(updateReview[0]){
                console.log('i am at pos = 2', updateReview[0]);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // remove
                  review: updateReview[0],
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

    messageAll: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      
      let _qryData = {
        id: businessProfileId,
        status: 1
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        // BusinessMessage.find({businessProfile: businessProfileId},{select: ['first_name', 'last_name', 'email', 'massage', 'status', 'customerObj']}).sort('id ASC'), //<--All record For Show at form 
        BusinessMessage.find({businessProfile: businessProfileId},{select: ['massage', 'status']}).populate('businessUser').sort('id ASC'), //<--All record For Show at form 
      ]).spread(function(allMessage) {
        if(allMessage && allMessage.length > 0){
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              allMessage: allMessage,
              message: 'All message data found Success fully',
            });
        }else {
          return res.send({
            status: 'error',
            status_code: 33,
            actionStatus: 0,
            message: 'All message Not found',
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

    messageUpdate: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let userId = tokenUser.id;
      let data = req.param("data");
      let actionId = data.id ? data.id : '';
      
      let _formData = {
        status: 2,
        message: data.message ? data.message.trim() : 1,
        replyFor: actionId
        // updatedBy: tokenUser.id
      }
      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      
      if (!_formData.message) {
        customFieldErrors.message = {message: 'Message is Required'};
      }
      // ***************Custom error hendle End**************
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessMessage.findOne({id: actionId, businessProfile: businessProfileId}),
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
          _formData.businessProfile = businessProfileId;
          _formData.businessUser = userId;
          // _formData.businessUser = tokenUser.id;
          // _formData.first_name = tokenUser.first_name ? tokenUser.first_name : '';
          // _formData.last_name = tokenUser.last_name ? tokenUser.last_name : '';
          // _formData.image = tokenUser.image ? tokenUser.image : '';
          // _formData.email = tokenUser.email;
          // _formData.mobile_no = tokenUser.mobile_no ? tokenUser.mobile_no : '';

          return Promise.all([
            BusinessMessage.update({id: actionId}, _formData)
          ]).spread(function(updateMessage) {
            console.log('i am at pos = 1');
              if(updateMessage[0]){
                console.log('i am at pos = 2', updateMessage[0]);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // remove
                  review: updateMessage[0],
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

    messageEdit: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");
      let actionId = data.id ? data.id : '';
      
      let _formData = {
        
      }
      
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessMessage.findOne({id: actionId, businessProfile: businessProfileId}),
        BusinessMessage.find({id: { '!': actionId}, businessProfile: businessProfileId}),
      ]).spread(function(sinExistdata, otherMessage) {
        
        if(!sinExistdata){
          customFieldErrors.commonError = {message: 'Exist data not found'};
          return res.send({
            status: 'dataExistError',
            status_code: 33,
            actionStatus: 6,//mean Exist Data error
            message: 'Exist data error',
          });
        } else{
          return res.send({
            status: 'success',
            status_code: 11,
            actionStatus: 1, // remove
            targetMessage: sinExistdata,
            otherMessage: otherMessage,
            message: 'Target and Other message',
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
          _formData.businessProfile = businessProfileId;
          _formData.businessUser = tokenUser.id;
          _formData.first_name = tokenUser.first_name ? tokenUser.first_name : '';
          _formData.last_name = tokenUser.last_name ? tokenUser.last_name : '';
          _formData.image = tokenUser.image ? tokenUser.image : '';
          _formData.email = tokenUser.email;
          _formData.mobile_no = tokenUser.mobile_no ? tokenUser.mobile_no : '';

          return Promise.all([
            BusinessMessage.update({id: actionId}, _formData)
          ]).spread(function(updateMessage) {
            console.log('i am at pos = 1');
              if(updateMessage[0]){
                console.log('i am at pos = 2', updateMessage[0]);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // remove
                  review: updateMessage[0],
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

    // @@@@Event Start
    eventAll: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      
      let _qryData = {
        id: businessProfileId,
        status: 1
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessEvent.find({businessProfile: businessProfileId, status: 1},{select: ['title', 'image', 'address', 'start_date_time', 'venue_name', 'status']}).sort('id ASC'), //<--All record For Show at form 
      ]).spread(function(allEvent) {
        if(allEvent && allEvent.length > 0){
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              allEvent: allEvent,
              message: 'All message data found Success fully',
            });
        }else {
          return res.send({
            status: 'error',
            status_code: 33,
            actionStatus: 0,
            message: 'All message Not found',
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

    eventNew: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      
      let _qryData = {
        status: 1
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        Category.find({select: ['id','name','status','slug']}).where(_qryData),
        State.find({status: 1},{select: ['name']}).sort('name ASC'), //<--All record For Show at form
            ]).spread(function(allCategory, allState) {
        if((allCategory && allCategory.length > 0) && (allState && allState.length > 0)){
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              allCategory: allCategory,
              allState: allState,
              message: 'All message data found Success fully',
            });
        }else {
          return res.send({
            status: 'error',
            status_code: 33,
            actionStatus: 0,
            message: 'All message Not found',
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

    eventCreate: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      let userId = tokenUser.id;
      let data = req.param("data");

      let main_image = data.image ? data.image : '';
      let oldImage = data.old_image ? data.old_image : '';

      let _formData = {
            title: data.title ? data.title.trim() : '',
            category: data.category ? data.category.trim() : '',
            venue_name: data.venue_name ? data.venue_name.trim() : '',
            ticket_price: (data.ticket_price && data.ticket_price >= 0) ? data.ticket_price : 0,
            address: data.address ? data.address.trim() : '',
            phone_no: data.phone_no ? data.phone_no.trim() : '',
            state: data.state ? data.state.trim() : '',
            city: data.city ? data.city.trim() : '',
            zip: data.zip ? data.zip.trim() : '',
            website: data.website ? data.website.trim() : '',
            details: data.details ? data.details.trim() : '',
            // business_logo: data.business_logo ? data.business_logo.trim() : '',
          };

          let _othFormData = {
            start_date: data.start_date ? ((data.start_date).split("-").reverse().join("-")) : '',
            start_time: data.start_time ? data.start_time.trim() : '',
 
            end_date: data.end_date ? ((data.end_date).split("-").reverse().join("-")) : '',
            end_time: data.end_time ? data.end_time.trim() : ''
         }

         let customStDate = _othFormData.start_date+' '+_othFormData.start_time;
         let customStDateMake = moment(customStDate, "YYYY-MM-DD hh:mm A");
         let customStDateIsoMake = customStDateMake.toISOString();
         let customStDateIsoResult = moment(customStDateIsoMake).format("DD-MMM-YYYY hh:mm A");  
 
         let customEndDate = _othFormData.end_date+' '+_othFormData.end_time;
         let customEndDateMake = moment(customEndDate, "YYYY-MM-DD hh:mm A");
         let customEndDateIsoMake = customEndDateMake.toISOString();
         let customEndDateIsoResult = moment(customEndDateIsoMake).format("DD-MMM-YYYY hh:mm A");  
 
         _formData.start_date_time = customStDateIsoResult;
         _formData.end_date_time = customEndDateIsoResult;
 
 
          var hoursDiff = customEndDateMake.diff(customStDateMake, 'hours');
          var minutesDiff = customEndDateMake.diff(customStDateMake, 'minutes');
          console.log('Minutes:' + minutesDiff);
          console.log(moment.utc(moment(customEndDateMake,"DD/MM/YYYY HH:mm:ss").diff(moment(customStDateMake,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss"));
     
      

      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      if (!_formData.title) {
        customFieldErrors.title = {message: 'Title is Required'};
      }
      if (!_formData.category) {
          customFieldErrors.category = {message: 'Category is Required'};
      }
      if (!_othFormData.start_date) {
        customFieldErrors.start_date = {message: 'From Date & Time is Required'};
      } else {
      if(customStDateMake  > customEndDateMake){
        customFieldErrors.start_date = {message: 'From Date & Time is less then End Date Time'};
        customFieldErrors.end_date = {message: 'End Date & Time is Greter than From Date Time'};
      }
      }
      if (!_othFormData.end_date) {
        customFieldErrors.end_date = {message: 'End Date & Time is Required'};
      }
      
      if (!_formData.venue_name) {
        customFieldErrors.venue_name = {message: 'Venue Name is Required'};
    }
    if (!_formData.ticket_price) {
        customFieldErrors.ticket_price = {message: 'Ticket  Price is Required'};
    }
    if (!_formData.address) {
        customFieldErrors.address = {message: 'Address is Required'};
    }
    if (!_formData.phone_no) {
        customFieldErrors.phone_no = {message: 'Phone No is Required'};
    }
    // if (!_formData.country) {
    //     customFieldErrors.country = {message: 'Country is Required'};
    // }
    // if (!_formData.state) {
    //     customFieldErrors.state = {message: 'State is Required'};
    // }
    if (!_formData.city) {
        customFieldErrors.city = {message: 'City is Required'};
    }
    // if (!_formData.zip_code) {
    //     customFieldErrors.zip_code = {message: 'Zip Code is Required'};
    // }
    if (!_formData.website) {
        customFieldErrors.website = {message: 'Website is Required'};
    }
    if (!_formData.details) {
        customFieldErrors.details = {message: 'Details is Required'};
    }

    let _creSlugData = {
      model: 'businessevent',
      type: 'slug',
      from: _formData.title,
      defaultValue: 'slug'
    };

      // ***************Custom error hendle End**************
      // console.log('i am _qryData', _qryData);
      let fileSaveLocation = '.tmp/public/uploads/business-event';
      let fileCopyLocation = 'assets/uploads/business-event';

      return Promise.all([
        State.find({status: 1},{select: ['name']}).sort('name ASC'), //<--All record For Show at form
        ZeslugService.slugForCreate(_creSlugData), //<--Generate slug
        ZeBase64ImageService.imageCreate(main_image, oldImage, 400, 300, fileSaveLocation, fileCopyLocation, 1), //<--For image Download From Url 
        State.findOne({id: _formData.state},{select: ['name', 'country']}),
      ]).spread(function(allState, creSlug, main_image_Ret, extState) {

        if (!_formData.state) {
          customFieldErrors.state = {message: 'State is Required'};
        }else{
          if(!extState){
            customFieldErrors.state = {message: 'State is invalid'};
          } else {
            _formData.country = extState.country;
          }
        }
        _formData.slug = creSlug;
        // ============================ Image Strat===============================
            // console.log('main_image_Ret update', main_image_Ret);
            if(!main_image_Ret.errorFound){
              _formData.image = main_image_Ret.coreFileName;
              if(main_image_Ret.coreFileName == ''){
                customFieldErrors.image = {message: 'Image File is Requird'};
              }
              // console.log(' 1 is after Upload');
            }else{
              _formData.image = main_image_Ret.coreFileName;
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
            fieldData: _formData,
            message: 'Field error',
          });
        } else {
          _formData.businessProfile = businessProfileId;
          return Promise.all([
            BusinessEvent.create(_formData)
          ]).spread(function(creEvent) {
            console.log('i am at pos = 1');
              if(creEvent){
                console.log('i am at pos = 2', creEvent);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // sucess
                  createdEvent: creEvent,
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

    eventEdit: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      let data = req.param("data");
      let actionId = data.id ? data.id : '';
      
      let _qryData = {
        id: actionId,
        businessProfile: businessProfileId,
        status: 1
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessEvent.find(_qryData),
        Category.find({select: ['id','name','status','slug']}).where(_qryData),
        State.find({status: 1},{select: ['name']}).sort('name ASC'), //<--All record For Show at form
            ]).spread(function(sinExistdata, allCategory, allState) {
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
        if((allCategory && allCategory.length > 0) && (allState && allState.length > 0)){
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              data: sinExistdata,
              allCategory: allCategory,
              allState: allState,
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

    eventUpdate: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");
      let actionId = data.id ? data.id : '';

      let main_image = data.image ? data.image : '';
      let oldImage = data.old_image ? data.old_image : '';

      
      let _formData = {
        title: data.title ? data.title.trim() : '',
        category: data.category ? data.category.trim() : '',
        venue_name: data.venue_name ? data.venue_name.trim() : '',
        ticket_price: (data.ticket_price && data.ticket_price >= 0) ? data.ticket_price : 0,
        address: data.address ? data.address.trim() : '',
        phone_no: data.phone_no ? data.phone_no.trim() : '',
        state: data.state ? data.state.trim() : '',
        city: data.city ? data.city.trim() : '',
        zip: data.zip ? data.zip.trim() : '',
        website: data.website ? data.website.trim() : '',
        details: data.details ? data.details.trim() : '',
        // business_logo: data.business_logo ? data.business_logo.trim() : '',
      };

      let _othFormData = {
        start_date: data.start_date ? ((data.start_date).split("-").reverse().join("-")) : '',
        start_time: data.start_time ? data.start_time.trim() : '',

        end_date: data.end_date ? ((data.end_date).split("-").reverse().join("-")) : '',
        end_time: data.end_time ? data.end_time.trim() : ''
     }

     let customStDate = _othFormData.start_date+' '+_othFormData.start_time;
     let customStDateMake = moment(customStDate, "YYYY-MM-DD hh:mm A");
     let customStDateIsoMake = customStDateMake.toISOString();
     let customStDateIsoResult = moment(customStDateIsoMake).format("DD-MMM-YYYY hh:mm A");  

     let customEndDate = _othFormData.end_date+' '+_othFormData.end_time;
     let customEndDateMake = moment(customEndDate, "YYYY-MM-DD hh:mm A");
     let customEndDateIsoMake = customEndDateMake.toISOString();
     let customEndDateIsoResult = moment(customEndDateIsoMake).format("DD-MMM-YYYY hh:mm A");  

     _formData.start_date_time = customStDateIsoResult;
     _formData.end_date_time = customEndDateIsoResult;


      var hoursDiff = customEndDateMake.diff(customStDateMake, 'hours');
      var minutesDiff = customEndDateMake.diff(customStDateMake, 'minutes');
      console.log('Minutes:' + minutesDiff);
      console.log(moment.utc(moment(customEndDateMake,"DD/MM/YYYY HH:mm:ss").diff(moment(customStDateMake,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss"));
 

       // ***************Custom error hendle Start************
       const customFieldErrors = {};
       if (!_formData.title) {
         customFieldErrors.title = {message: 'Title is Required'};
       }
       if (!_formData.category) {
           customFieldErrors.category = {message: 'Category is Required'};
       }
       if (!_othFormData.start_date) {
         customFieldErrors.start_date = {message: 'From Date & Time is Required'};
       } else {
       if(customStDateMake  > customEndDateMake){
         customFieldErrors.start_date = {message: 'From Date & Time is less then End Date Time'};
         customFieldErrors.end_date = {message: 'End Date & Time is Greter than From Date Time'};
       }
       }
       if (!_othFormData.end_date) {
         customFieldErrors.end_date = {message: 'End Date & Time is Required'};
       }
       
       if (!_formData.venue_name) {
         customFieldErrors.venue_name = {message: 'Venue Name is Required'};
     }
     if (!_formData.ticket_price) {
         customFieldErrors.ticket_price = {message: 'Ticket  Price is Required'};
     }
     if (!_formData.address) {
         customFieldErrors.address = {message: 'Address is Required'};
     }
     if (!_formData.phone_no) {
         customFieldErrors.phone_no = {message: 'Phone No is Required'};
     }
     // if (!_formData.country) {
     //     customFieldErrors.country = {message: 'Country is Required'};
     // }
     // if (!_formData.state) {
     //     customFieldErrors.state = {message: 'State is Required'};
     // }
     if (!_formData.city) {
         customFieldErrors.city = {message: 'City is Required'};
     }
     // if (!_formData.zip_code) {
     //     customFieldErrors.zip_code = {message: 'Zip Code is Required'};
     // }
     if (!_formData.website) {
         customFieldErrors.website = {message: 'Website is Required'};
     }
     if (!_formData.details) {
         customFieldErrors.details = {message: 'Details is Required'};
     }
 
     let _creSlugData = {
       model: 'businessevent',
       type: 'slug',
       from: _formData.title,
       defaultValue: 'slug'
     };
 
       // ***************Custom error hendle End**************
      
       let fileSaveLocation = '.tmp/public/uploads/business-event';
      let fileCopyLocation = 'assets/uploads/business-event';
      
      return Promise.all([
        BusinessEvent.findOne({id: actionId, businessProfile: businessProfileId}),
        ZeslugService.slugForUpdate(_creSlugData),
        ZeBase64ImageService.imageCreate(main_image, oldImage, 400, 300, fileSaveLocation, fileCopyLocation, 1), //<--For image Download From Url 
        State.findOne({id: _formData.state},{select: ['name', 'country']}),
      ]).spread(function(sinExistdata, creSlug, main_image_Ret, extState) {

        if (!_formData.state) {
          customFieldErrors.state = {message: 'State is Required'};
        }else{
          if(!extState){
            customFieldErrors.state = {message: 'State is invalid'};
          } else {
            _formData.country = extState.country;
          }
        }
        if(sinExistdata.title != _formData.title){
          _formData.slug = creSlug;
        }

        // ============================ Image Strat===============================
            // console.log('main_image_Ret update', main_image_Ret);
            if(!main_image_Ret.errorFound){
              _formData.image = main_image_Ret.coreFileName;
              if(main_image_Ret.coreFileName == ''){
                customFieldErrors.image = {message: 'Image File is Requird'};
              }
              // console.log(' 1 is after Upload');
            }else{
              _formData.image = main_image_Ret.coreFileName;
              customFieldErrors.image = {message: main_image_Ret.errorMessage};
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
          // _formData.updatedBy = tokenUser.id;
          return Promise.all([
            BusinessEvent.update({id: actionId}, _formData)
          ]).spread(function(updateReview) {
            console.log('i am at pos = 1');
              if(updateReview[0]){
                console.log('i am at pos = 2', updateReview[0]);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // remove
                  review: updateReview[0],
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

    eventView: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      let data = req.param("data");
      let actionId = data.id ? data.id : '';
      
      let _qryData = {
        id: actionId,
        businessProfile: businessProfileId,
        status: 1
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
              BusinessEvent.findOne(_qryData),
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
    eventView_slug: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
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
        businessProfile: businessProfileId,
        status: 1
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
              BusinessEvent.findOne(_qryData),
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

    eventDelet: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");
      // let actionId = data.id ? data.id : '';

      let _formData = {
        id: data.id ? data.id.trim() : '',
        businessProfile: businessProfileId
      }
      
      // console.log('i am _qryData', _qryData);
      
      return Promise.all([
        BusinessEvent.findOne(_formData),
      ]).spread(function(deleteData) {

        if(!deleteData){
          return res.send({
            status: 'dataExistError',
            status_code: 33,
            actionStatus: 6,//mean Exist Data error
            message: 'Data Not found In Database',
          });
        }
        
          deleteData.destroy().then(function (_deldata) {
              let fileSaveLocation = '.tmp/public/uploads/business-event';
              let fileCopyLocation = 'assets/uploads/business-event';

              if(_deldata[0].image){
                if(fs.existsSync(sails.config.appPath +'/'+fileSaveLocation+'/'+ _deldata[0].image)){
                  fs.unlinkSync(sails.config.appPath +'/'+fileSaveLocation+'/'+ _deldata[0].image);
                }
                if(fs.existsSync(sails.config.appPath +'/'+fileCopyLocation+'/'+ _deldata[0].image)){
                  fs.unlinkSync(sails.config.appPath +'/'+fileCopyLocation+'/'+ _deldata[0].image);
                }

              }
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1, // remove
              message: 'Delete successfully',
          });
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

    // @@@@Support Start
    supportAll: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      let userId = tokenUser.id;
      
      let _qryData = {
        user_tyle:  1,
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
    supportNew_old: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      
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
      let businessProfileId = tokenUser.businessProfile;
      let userId = tokenUser.id;
      let data = req.param("data");

      let main_image = data.attachment ? data.attachment : '';
      let oldImage = data.old_attachment ? data.old_attachment : '';

      let _formData = {
            ticket_id: randomize('A0', 8),
            title: data.title ? data.title.trim() : '',
            siteTicketType: data.siteTicketType ? data.siteTicketType.trim() : '',
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
          customFieldErrors.siteTicketType = {message: 'Category is Required'};
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
          // _formData.businessProfile = businessProfileId;
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
      let businessProfileId = tokenUser.businessProfile;
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
          _formData.user_type = 1;
          _formData.createdBy = userId;
          _formData.businessProfile = businessProfileId;
          return Promise.all([
            SiteTicket.create(_formData)
          ]).spread(function(creTicket) {

            _ticketMsgData.siteTicket = creTicket.id;
            _ticketMsgData.user_type = 1;
            _ticketMsgData.createdBy = userId;
            _ticketMsgData.businessProfile = businessProfileId;

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
      let businessProfileId = tokenUser.businessProfile;
      let data = req.param("data");
      let actionId = data.id ? data.id : '';
      
      let _qryData = {
        id: actionId,
        businessProfile: businessProfileId,
        user_type: 1
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
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");
      let actionId = data.id ? data.id : '';

      let main_image = data.attachment ? data.attachment : '';
      let oldImage = data.old_attachment ? data.old_attachment : '';

      
      let _formData = {
          title: data.title ? data.title.trim() : '',
          siteTicketType: data.siteTicketType ? data.siteTicketType.trim() : '',
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
        SiteTicket.findOne({id: actionId}),
        ZeBase64ImageService.imageCreate(main_image, oldImage, 400, 300, fileSaveLocation, fileCopyLocation, 1), //<--For image Download From Url 
        ZeslugService.slugForUpdate(_creSlugData), //<--Generate slug
        SiteTicketType.findOne({id: _formData.siteTicketType, status: 1},{select: ['name']}),
      ]).spread(function(sinExistdata, main_image_Ret, creSlug, extState) {

        if(sinExistdata.title != _formData.title){
          _formData.slug = creSlug;
        }

        if (!_formData.siteTicketType) {
          customFieldErrors.siteTicketType = {message: 'Category is Required'};
        }else{
          if(!extTicketType){
            customFieldErrors.siteTicketType = {message: 'Category is invalid'};
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

    supportView_old: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      let data = req.param("data");
      let actionId = data.id ? data.id : '';
      
      let _qryData = {
        id: actionId,
        user_type: 1
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
    supportView: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
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
        user_type: 1
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
    supportReMessage: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
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
          // _formData.businessProfile = businessProfileId;
            _ticketMsgData.user_type = 1;
            _ticketMsgData.createdBy = userId;
            _ticketMsgData.businessProfile = businessProfileId;
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
    // @@@@Carrer Start
    careerAll: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      
      let _qryData = {
        businessProfile: businessProfileId
        // businessProfile: '668176fbdd57167818559dc7'
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessCareer.find(_qryData).populate('businessProfile').sort('id DESC'), //<--All record For Show at form 
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
    careerCreate_: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      let userId = tokenUser.id;
      let data = req.param("data");


      let _formData = {
            title: data.title ? data.title.trim() : '',
            job_type: (data.job_type && (data.job_type > 0 && data.job_type <= 4 )) ? data.job_type : 0,
            job_level: (data.job_level && (data.job_level > 0 && data.job_level <= 3 )) ? data.job_level : 0,
            department: data.department ? data.department.trim() : '',
            details: data.details ? data.details.trim() : '',
            expiration_date: data.expiration_date ? ((data.expiration_date).split("-").reverse().join("-")) : '',
            // expiration_date: data.expiration_date ? data.expiration_date : '',
            status: (data.status && (data.status > 0 && data.status <= 2  )) ? data.status : 0,
          };
          // console.log('_formData===', _formData);

 
      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      if (!_formData.title) {
        customFieldErrors.title = {message: 'Title is Required'};
      }
      
      if (!_formData.job_type) {
        customFieldErrors.job_type = {message: 'Job Type is Required'};
      }

      if (!_formData.job_level) {
        customFieldErrors.job_level = {message: 'Job Level is Required'};
      }
      if (!_formData.department) {
        customFieldErrors.department = {message: 'Department is Required'};
      }
      if (!_formData.details) {
        customFieldErrors.details = {message: 'Details is Required'};
      }
      if (!_formData.expiration_date) {
        customFieldErrors.expiration_date = {message: 'Expiration Date is Required'};
      }

      let _creSlugData = {
        model: 'businesscareer',
        type: 'slug',
        from: _formData.title,
        defaultValue: 'slug'
      };

      // ***************Custom error hendle End**************
      // console.log('i am _qryData', _qryData);
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
          _formData.businessProfile = businessProfileId;
          return Promise.all([
            BusinessCareer.create(_formData)
          ]).spread(function(creCareer) {
            console.log('i am at pos = 1');
              if(creCareer){
                console.log('i am at pos = 2', creCareer);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // sucess
                  createdCareer: creCareer,
                  message: 'Saved successfully',
                });
              }else{
                console.log('i am at pos = 3');
                return res.send({
                  status: 'error',
                  status_code: 33,
                  actionStatus: 0,
                  message: 'Create error',
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
        }
        
   
    },
    careerCreate: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      let userId = tokenUser.id;
      let data = req.param("data");
      // console.log('data1===', data);
      let _formData = {
        title: data.title ? data.title.trim() : '',
        job_type: (data.job_type && (data.job_type > 0 && data.job_type <= 4 )) ? data.job_type : 0,
        job_level: (data.job_level && (data.job_level > 0 && data.job_level <= 3 )) ? data.job_level : 0,
        department: data.department ? data.department.trim() : '',
        details: data.details ? data.details.trim() : '',
        expiration_date: data.expiration_date ? ((data.expiration_date).split("-").reverse().join("-")) : '',
        // expiration_date: data.expiration_date ? data.expiration_date : '',
        status: (data.status && (data.status > 0 && data.status <= 2  )) ? data.status : 0,
      };

      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      if (!_formData.title) {
        customFieldErrors.title = {message: 'Title is Required'};
      }
      
      if (!_formData.job_type) {
        customFieldErrors.job_type = {message: 'Job Type is Required'};
      }

      if (!_formData.job_level) {
        customFieldErrors.job_level = {message: 'Job Level is Required'};
      }
      if (!_formData.department) {
        customFieldErrors.department = {message: 'Department is Required'};
      }
      if (!_formData.details) {
        customFieldErrors.details = {message: 'Details is Required'};
      }
      if (!_formData.expiration_date) {
        customFieldErrors.expiration_date = {message: 'Expiration Date is Required'};
      }

      let _creSlugData = {
        model: 'businesscareer',
        type: 'slug',
        from: _formData.title,
        defaultValue: 'slug'
      };


      // ***************Custom error hendle End**************

      return Promise.all([
        ZeslugService.slugForCreate(_creSlugData), //<--Generate slug
      ]).spread(function(creSlug) {
        
        _formData.slug = creSlug;

        
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
          _formData.businessProfile = businessProfileId;
          return Promise.all([
            BusinessCareer.create(_formData)
          ]).spread(function(creCareer) {
            console.log('i am at pos = 1');
              if(creCareer){
                console.log('i am at pos = 2', creCareer);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // remove
                  createdCareer: creCareer,
                  message: 'Saved successfully',
                });
              }else{
                console.log('i am at pos = 3');
                return res.send({
                  status: 'error',
                  status_code: 33,
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
    careerEdit: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      let data = req.param("data");
      let actionId = data.id ? data.id : '';
      
      let _qryData = {
        id: actionId,
        businessProfile: businessProfileId,
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessCareer.find(_qryData),
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
              } else {
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1,
                  data: sinExistdata,
                  allTicketType: allTicketType,
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
    careerUpdate: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");
      let actionId = data.id ? data.id : '';

      
      let _formData = {
        title: data.title ? data.title.trim() : '',
        job_type: (data.job_type && (data.job_type > 0 && data.job_type <= 4 )) ? data.job_type : 0,
        job_level: (data.job_level && (data.job_level > 0 && data.job_level <= 3 )) ? data.job_level : 0,
        department: data.department ? data.department.trim() : '',
        details: data.details ? data.details.trim() : '',
        expiration_date: data.expiration_date ? ((data.expiration_date).split("-").reverse().join("-")) : '',
        status: (data.status && (data.status > 0 && data.status <= 2  )) ? data.status : 0,
      };

     

       // ***************Custom error hendle Start************
       const customFieldErrors = {};
       if (!_formData.title) {
        customFieldErrors.title = {message: 'Title is Required'};
      }
      
      if (!_formData.job_type) {
        customFieldErrors.job_type = {message: 'Job Type is Required'};
      }

      if (!_formData.job_level) {
        customFieldErrors.job_level = {message: 'Job Level is Required'};
      }
      if (!_formData.department) {
        customFieldErrors.department = {message: 'Department is Required'};
      }
      if (!_formData.details) {
        customFieldErrors.details = {message: 'Details is Required'};
      }
      if (!_formData.expiration_date) {
        customFieldErrors.expiration_date = {message: 'Expiration Date is Required'};
      }

      let _creSlugData = {
        model: 'businesscareer',
        type: 'slug',
        from: _formData.title,
        defaultValue: 'slug'
      };
       // ***************Custom error hendle End**************
      
      
      return Promise.all([
        BusinessCareer.findOne({id: actionId, businessProfile: businessProfileId}),
        ZeslugService.slugForCreate(_creSlugData), //<--Generate slug
      ]).spread(function(sinExistdata, creSlug) {
        if(sinExistdata.title != _formData.title){
          _formData.slug = creSlug;
        }
        if(!sinExistdata){
          customFieldErrors.commonError = {message: 'Exist data not found'};
          // return res.send({
          //   status: 'dataExistError',
          //   status_code: 33,
          //   actionStatus: 6,//mean Exist Data error
          //   fieldErrors: customFieldErrors,
          //   fieldData: _formData,
          //   message: 'Exist data error',
          // });
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
            BusinessCareer.update({id: actionId}, _formData)
          ]).spread(function(updateCareer) {
            console.log('i am at pos = 1');
              if(updateCareer[0]){
                console.log('i am at pos = 2', updateCareer[0]);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // remove
                  career: updateCareer[0],
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
    careerView_byid: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      let data = req.param("data");
      let actionId = data.id ? data.id : '';
      
      let _qryData = {
        id: actionId,
        businessProfile: businessProfileId
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
      let businessProfileId = tokenUser.businessProfile;
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
        businessProfile: businessProfileId
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
    // @@@@Security Setting Start
    changePassword: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
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
        Users.findOne({id: userId, businessProfile: businessProfileId, user_type: 4, is_token_based_user: true}),
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

    changePhoneNo: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let userId = tokenUser.id;
      let data = req.param("data");
      // let actionId = data.id ? data.id : '';

      
      let _formData = {
        mobile_no: data.mobile_no ? data.mobile_no.trim() : '',
      };

     

       // ***************Custom error hendle Start************
       const customFieldErrors = {};
       if (!_formData.mobile_no) {
        customFieldErrors.mobile_no = {message: 'Mobile No is Required'};
      } 
 
       // ***************Custom error hendle End**************
      
      
      return Promise.all([
        Users.findOne({id: userId, businessProfile: businessProfileId, user_type: 4, is_token_based_user: true}),
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

    
    settingNotificationAll_old: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      let userId = tokenUser.id;
      let _qryData = {
        id: businessProfileId,
        // status: 1
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessProfile.find({id: businessProfileId}), //<--All record For Show at form 
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
    settingNotificationUpdate__: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");


      
      let _formData = {
        sendEmailReviews: data.sendEmailReviews ? true : false,
        sendEmailPost: data.sendEmailPost ? true : false,
        sendEmailDisplayInformation: data.sendEmailDisplayInformation ? true : false,
        sendEmailReceiveMessage: data.sendEmailReceiveMessage ? true : false,
        receiveLeadsFromNearByJobs: data.receiveLeadsFromNearByJobs ? true : false,
        statusOfBusinessInfoEdit: data.statusOfBusinessInfoEdit ? true : false,
        contributions: data.contributions ? true : false,
      };

      

     
       // ***************Custom error hendle End**************
      
      return Promise.all([
        BusinessEvent.findOne({id: actionId, businessProfile: businessProfileId}),
        ZeslugService.slugForUpdate(_creSlugData),
        ZeBase64ImageService.imageCreate(main_image, oldImage, 400, 300, fileSaveLocation, fileCopyLocation, 1), //<--For image Download From Url 
        State.findOne({id: _formData.state},{select: ['name', 'country']}),
      ]).spread(function(sinExistdata, creSlug, main_image_Ret, extState) {

        if (!_formData.state) {
          customFieldErrors.state = {message: 'State is Required'};
        }else{
          if(!extState){
            customFieldErrors.state = {message: 'State is invalid'};
          } else {
            _formData.country = extState.country;
          }
        }
        if(sinExistdata.title != _formData.title){
          _formData.slug = creSlug;
        }

        // ============================ Image Strat===============================
            // console.log('main_image_Ret update', main_image_Ret);
            if(!main_image_Ret.errorFound){
              _formData.image = main_image_Ret.coreFileName;
              if(main_image_Ret.coreFileName == ''){
                customFieldErrors.image = {message: 'Image File is Requird'};
              }
              // console.log(' 1 is after Upload');
            }else{
              _formData.image = main_image_Ret.coreFileName;
              customFieldErrors.image = {message: main_image_Ret.errorMessage};
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
          // _formData.updatedBy = tokenUser.id;
          return Promise.all([
            BusinessEvent.update({id: actionId}, _formData)
          ]).spread(function(updateReview) {
            console.log('i am at pos = 1');
              if(updateReview[0]){
                console.log('i am at pos = 2', updateReview[0]);
                return res.send({
                  status: 'success',
                  status_code: 11,
                  actionStatus: 1, // remove
                  review: updateReview[0],
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

    settingNotificationUpdate_old: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile
      let data = req.param("data");
      // let actionId = data.id ? data.id : '';
      
      let _formData = {
        sendEmailReviews: data.sendEmailReviews ? true : false,
        sendEmailPost: data.sendEmailPost ? true : false,
        sendEmailDisplayInformation: data.sendEmailDisplayInformation ? true : false,
        sendEmailReceiveMessage: data.sendEmailReceiveMessage ? true : false,
        receiveLeadsFromNearByJobs: data.receiveLeadsFromNearByJobs ? true : false,
        statusOfBusinessInfoEdit: data.statusOfBusinessInfoEdit ? true : false,
        contributions: data.contributions ? true : false
      }
      // ***************Custom error hendle Start************
      const customFieldErrors = {};
      
      
      // ***************Custom error hendle End**************
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessProfile.findOne({id: businessProfileId}),
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
            BusinessProfile.update({id: businessProfileId}, _formData)
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

    settingNotificationAll: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      let userId = tokenUser.id;
      let _qryData = {
        id: businessProfileId,
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        // BusinessProfile.findOne({select: ['id','business_name','official_email','official_phone', 'Official_address_line1','city','state','zip','website_link','history','business_logo']}).where(_qryData),
        BusinessProfile.findOne(_qryData),
        Users.findOne({select: ['id','first_name','last_name']}).where({id: userId}),
      ]).spread(function(extProfile, extUser) {
        if(extProfile && extUser){
            delete extProfile.id;
            delete extUser.id;

            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              businessProfile: extProfile,
              businessOwner: extUser,
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
    settingNotificationUpdate: function (req, res) {
      let tokenUser = req.identity || '';
      let businessProfileId = tokenUser.businessProfile;
      let userId = tokenUser.id;
      let data = req.param("data");
      // console.log('====', data);


      let _profileData = {
            sendEmailReviews: data.sendEmailReviews ? true : false,
            sendEmailPost: data.sendEmailPost ? true : false,
            sendEmailDisplayInformation: data.sendEmailDisplayInformation ? true : false,
            sendEmailReceiveMessage: data.sendEmailReceiveMessage ? true : false,
            receiveLeadsFromNearByJobs: data.receiveLeadsFromNearByJobs ? true : false,
            statusOfBusinessInfoEdit: data.statusOfBusinessInfoEdit ? true : false,
            contributions: data.contributions ? true : false,
          };
      

      // ***************Custom error hendle Start************
      const customFieldErrors = {};

      // ***************Custom error hendle End**************
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessProfile.update({id: businessProfileId},_profileData)
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
      let businessProfileId = tokenUser.businessProfile;
      let userId = tokenUser.id;
      let _qryData = {
        id: businessProfileId,
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        // BusinessProfile.findOne({select: ['id','business_name','official_email','official_phone', 'Official_address_line1','city','state','zip','website_link','history','business_logo']}).where(_qryData),
        // BusinessProfile.findOne(_qryData),
        BusinessProfile.findOne({select: ['id','bookmarks','direct_messages_from_user','ads_display_off_2nd_friendly']}).where({id: businessProfileId}),
      ]).spread(function(extProfile) {
        if(extProfile){
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              businessProfile: extProfile,
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
      let businessProfileId = tokenUser.businessProfile;
      let userId = tokenUser.id;
      let data = req.param("data");
      // console.log('====', data);


      let _profileData = {
            bookmarks: data.bookmarks ? true : false,
            direct_messages_from_user: data.direct_messages_from_user ? true : false,
            ads_display_off_2nd_friendly: data.ads_display_off_2nd_friendly ? true : false,
          };
      

      // ***************Custom error hendle Start************
      const customFieldErrors = {};

      // ***************Custom error hendle End**************
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessProfile.update({id: businessProfileId},_profileData)
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
      let businessProfileId = tokenUser.businessProfile;
      let userId = tokenUser.id;
      let _qryData = {
        id: businessProfileId,
      }
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        SiteTicket.find({createdBy: userId}).limit(5).sort('id ASC'), //<--All record For Show at form 
        BusinessMessage.find({businessProfile: businessProfileId}).limit(5).sort('id ASC'), //<--All record For Show at form 
        BusinessCareer.find({businessProfile: businessProfileId}).limit(5).sort('id ASC'), //<--All record For Show at form 
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

    // ****************Support End***************


};

