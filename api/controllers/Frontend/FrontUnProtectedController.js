/**
 *          
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let moment = require('moment');
let Promise = require('bluebird');
let _ = require('lodash');
let randToken = require('rand-token');
let mailer = require('nodemailer');
let zeCommon = sails.config.zeCommon;
module.exports = {
    _config: {
        actions: false,
        shortcuts: false,
        rest: true
    },

    // **************************** Menu Start ************************************
    topMenu: function (req, res) {
      let _qryData = {
        status: 1,
      }
      return Promise.all([
        Category.find({select: ['id','name','status','slug']}).where(_qryData),
        SubCategory.find({select: ['id','name','status','slug', 'category']}).where(_qryData),
      ]).spread(function(allCategory, allSubCategory) {

        let fiveCategory = [];
        let moreCategory = [];

        if(allCategory && allCategory.length > 0){
            allCategory.forEach(function(sinCat, index){
              // console.log('index===', index);
              let subcatFilter = allSubCategory.filter((sinItem)=> sinItem.category == sinCat.id);
              sinCat.subCategory = subcatFilter;
              if(index < 5){
                fiveCategory.push(sinCat);
              } else {
                moreCategory.push(sinCat);
              }

            });
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              // allCategory: allCategory,
              fiveCategory: fiveCategory,
              moreCategory: moreCategory,
              message: 'all category sub-category.',
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
    // **************************** Menu End **************************************

    
    homePage: function (req, res) {
      let _qryData = {
        status: 1,
      }
      return Promise.all([
        Category.find({select: ['id','name','status','slug']}).where(_qryData),
        SubCategory.find({select: ['id','name','status','slug', 'category']}).where(_qryData),
        // BusinessProfile.find({},{select: ['business_name', 'business_description', 'Official_address_line1', 'business_logo', 'business_highlights', 'location', 'slug']}).populate('businessReview').limit(6).sort('id DESC'), //<--All record For Show at form 
        Users.find({status: 1, user_type: 4},{select: ['first_name', 'last_name']}).populate('businessProfile').limit(6).sort('id DESC'), //<--All record For Show at form 
        BusinessEvent.find({status: 1},{select: ['title', 'image', 'address', 'start_date_time', 'venue_name', 'details', 'slug']}).limit(12).sort('id DESC'), //<--All record For Show at form 
        Blog.find({status: 1},{select: ['title', 'details', 'image', 'slug']}).populate('blogCategory').limit(4).sort('id DESC'), //<--All record For Show at form 
      ]).spread(function(allCategory, allSubCategory, recentAdvertisement, upcomingEvents, recentBlog ) {


        if(allCategory && allCategory.length > 0){
            allCategory.forEach(function(sinCat, index){
              // console.log('index===', index);
              let subcatFilter = allSubCategory.filter((sinItem)=> sinItem.category == sinCat.id);
              sinCat.subCategory = subcatFilter.length;
              

            });
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              allCategory: allCategory,
              recentAdvertisement: recentAdvertisement,
              upcomingEvents: upcomingEvents,
              recentBlog: recentBlog,
              message: 'all category sub-category.',
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

    viewMoreUpcomingEvents: function (req, res) {
      let _qryData = {
        status: 1,
      }
      return Promise.all([
        BusinessEvent.find({status: 1},{select: ['title', 'image', 'address', 'start_date_time', 'venue_name', 'details', 'slug']}).sort('id DESC'), //<--All record For Show at form 
        BusinessEvent.find({status: 1},{select: ['title', 'image', 'address', 'start_date_time', 'venue_name', 'details', 'slug']}).sort('id DESC'), //<--All record For Show at form 
        BusinessEvent.find({status: 1},{select: ['title', 'image', 'address', 'start_date_time', 'venue_name', 'details', 'slug']}).populate('businessReview').limit(3).sort('id DESC'), //<--All record For Show at form 
      ]).spread(function(allEvents, upcomingEvents, recentlyEvents) {
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              allEvents: allEvents,
              upcomingEvents: upcomingEvents,
              recentlyEvents: recentlyEvents,
              message: 'all data.',
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

    

    // ****New
    advertisementDetails: function (req, res) {

      // console.log('I m in Update');
      let data = req.param("data");
      // let actionId = data.id ? data.id : '';
      let slug = data.slug ? data.slug : '';
      
      let _formData = {
        slug: slug
      }
      // let slug = req.param('slug');
      console.log('slug');
      if (!slug){
        return res.send({
            status: 'dataExistError',
            status_code: 33,
            actionStatus: 6,//mean Exist Data error
            message: 'slug is empty error',
        });
      };

      // =============Save Start=====================
          // #########################
          // return BusinessProfile.findOne({slug: slug}).populate('BusinessAlbum').populate('BusinessAlbumPhoto').populate('BusinessEmbeddedVideo').populate('BusinessEvent').populate('BusinessFaq').populate('BusinessOperationHour').populate('BusinessReview').populate('BusinessReview').then(function (sinExistdata){
          return BusinessProfile.findOne({slug: slug}).then(function (sinExistdata){
              if (!sinExistdata) {
                return res.send({
                  status: 'dataExistError',
                  status_code: 33,
                  actionStatus: 6,//mean Exist Data error
                  message: 'Exist data error',
                });
            } else {
              
              return Promise.all([
                  Users.findOne({select: ['id','first_name','last_name','email', 'mobile_no']}).where({businessProfile: sinExistdata.id, status: 1}),
                  BusinessProfileAmenity.find({businessProfile: sinExistdata.id}).populate('amenity'),
                  BusinessAlbum.find({businessProfile: sinExistdata.id, status: 1}).populate('businessAlbumPhoto'),
                  BusinessAlbumPhoto.find({businessProfile: sinExistdata.id, status: 1}),
                  BusinessCareer.find({businessProfile: sinExistdata.id, status: 1}),
                  BusinessEmbeddedVideo.find({businessProfile: sinExistdata.id, status: 1}),
                  BusinessEvent.find({businessProfile: sinExistdata.id, status: 1}),
                  BusinessExtendedClosure.find({businessProfile: sinExistdata.id}),
                  BusinessFaq.find({businessProfile: sinExistdata.id, status: 1}),
                  BusinessOperationHour.findOne({businessProfile: sinExistdata.id}),
                  BusinessReview.find({businessProfile: sinExistdata.id}),
                ]).spread(function(userInfo, allAminity, allAlbum, photo, career, allEmbeddedVideo, events, extendedClosure, allFaq, operationHour, review ) {
                  
                  return res.send({
                    status: 'success',
                    status_code: 11,
                    actionStatus: 1, // remove
                    sinData: sinExistdata,
                    userInfo: userInfo,
                    allAminity: allAminity,
                    allAlbum: allAlbum,
                    photo: photo,
                    career: career,
                    allEmbeddedVideo: allEmbeddedVideo,
                    events: events,
                    extendedClosure: extendedClosure,
                    allFaq: allFaq,
                    operationHour: operationHour,
                    review: review,
                    message: 'Target and Other message',
                  });
              
                        })
            } //<--sinExistdata Else End
            
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
      // =============Slug Create End=================
  
    },

    subCategoryDetails: function (req, res) {

      // console.log('I m in Update');
      let data = req.param("data");
      // let actionId = data.id ? data.id : '';
      let slug = data.slug ? data.slug : '';
      
      let _formData = {
        slug: slug
      }
      // let slug = req.param('slug');
      console.log('slug');
      if (!slug){
        return res.send({
            status: 'dataExistError',
            status_code: 33,
            actionStatus: 6,//mean Exist Data error
            message: 'slug is empty error',
        });
      };

      // =============Save Start=====================
          // #########################
          return SubCategory.findOne({slug: slug}).then(function (sinExistdata){
              if (!sinExistdata) {
                return res.send({
                  status: 'dataExistError',
                  status_code: 33,
                  actionStatus: 6,//mean Exist Data error
                  message: 'Exist data error',
                });
            } else {
              
              return Promise.all([
                BusinessProfileSubCategory.find({subCategory: sinExistdata.id}).populate('businessProfile'),
                ]).spread(function(allData) {
                  
                  return res.send({
                    status: 'success',
                    status_code: 11,
                    actionStatus: 1, // remove
                    allData: allData,
                    message: 'Target and Other message',
                  });
              
                        })
            } //<--sinExistdata Else End
            
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
      // =============Slug Create End=================
  
    },

    advertisementDetails__: function (req, res) {
      
      let data = req.param("data");
      // let actionId = data.id ? data.id : '';
      let actionSlug = data.slug ? data.slug : '';
      
      let _formData = {
        slug: actionSlug
      }
      
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        // BusinessProfile.findOne({id: actionId}).populate('BusinessAlbum').populate('BusinessAlbumPhoto').populate('BusinessEmbeddedVideo').populate('BusinessEvent').populate('BusinessFaq').populate('BusinessOperationHour').populate('BusinessReview').populate('BusinessReview'),
        BusinessProfile.findOne({slug: actionSlug}).populate('BusinessAlbum').populate('BusinessAlbumPhoto').populate('BusinessEmbeddedVideo').populate('BusinessEvent').populate('BusinessFaq').populate('BusinessOperationHour').populate('BusinessReview').populate('BusinessReview'),
        BusinessProfileAmenity.find({businessProfile: actionId}).populate('amenity'),
      ]).spread(function(sinExistdata, allAmineties) {
        
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
            sinData: sinExistdata,
            allAmineties: allAmineties,
            message: 'Target and Other message',
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
    eventDetails: function (req, res) {
      
      let data = req.param("data");
      // let actionId = data.id ? data.id : '';
      let slug = data.slug ? data.slug : '';
      
      let _formData = {
        slug: slug
      }
      // let slug = req.param('slug');
      console.log('slug');
      if (!slug){
        return res.send({
            status: 'dataExistError',
            status_code: 33,
            actionStatus: 6,//mean Exist Data error
            message: 'slug is empty error',
        });
      };
      
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        // BusinessEvent.findOne({id: actionId}).populate('businessProfile').populate('businessReview'),
        BusinessEvent.findOne({slug: slug}).populate('businessProfile').populate('businessReview'),
      ]).spread(function(sinExistdata) {
        
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
            sinData: sinExistdata,
            message: 'Target and Other message',
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
    blogDetails: function (req, res) {
      
      let data = req.param("data");
      // let actionId = data.id ? data.id : '';
      let slug = data.slug ? data.slug : '';
      
      let _formData = {
        slug: slug
      }
      // let slug = req.param('slug');
      console.log('slug');
      if (!slug){
        return res.send({
            status: 'dataExistError',
            status_code: 33,
            actionStatus: 6,//mean Exist Data error
            message: 'slug is empty error',
        });
      };
      
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        // Blog.findOne({id: actionId}).populate('blogCategory'),
        Blog.findOne({slug: slug}).populate('blogCategory'),
      ]).spread(function(sinExistdata) {
        
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
            sinData: sinExistdata,
            message: 'Target and Other message',
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
    subCategoryDetails__: function (req, res) {
      
      let data = req.param("data");
      let actionId = data.id ? data.id : '';
      
      let _formData = {
        id: actionId
      }
      
      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessProfileSubCategory.find({subCategory: actionId}).populate('businessProfile'),
      ]).spread(function(sinExistdata) {
        
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
            allData: sinExistdata,
            message: 'Target and Other message',
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

    siteFaq: function (req, res) {
      let _qryData = {
        status: 1,
      }
      return Promise.all([
        SiteFaqCategory.find({select: ['id','name','status','slug']}).where(_qryData),
        SiteFaq.find({select: ['id','title','details','slug', 'siteFaqCategory']}).where(_qryData),
      ]).spread(function(allFaqCategory, allFaq) {

      

        if(allFaqCategory && allFaqCategory.length > 0){
            allFaqCategory.forEach(function(sinCat, index){
              // console.log('index===', index);
              let faqFilter = allFaq.filter((sinItem)=> sinItem.siteFaqCategory == sinCat.id);
              sinCat.faq = faqFilter;
            });
            return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              allFaqCategory: allFaqCategory,
              message: 'all category faq.',
            });
        }else {
          return res.send({
            status: 'success',
            status_code: 12,
            actionStatus: 1,
            allFaqCategory: [],
            message: 'Empty all category Faq ',
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

    siteEvents: function (req, res) {
      let _qryData = {
        status: 1,
      }
      return Promise.all([
        SiteEventCategory.find({select: ['id','name','slug']}).where({status: 1 }).sort('id ASC'),
        SiteEvent.find({select: ['id','title','image', 'venue_name', 'address', 'details', 'slug']}).where({status: 1 }).sort('id DESC').populate('siteEventCategory'),
      ]).spread(function(allCategory, allEvent) {

        return res.send({
          status: 'success',
          status_code: 11,
          actionStatus: 1,
          allCategory: allCategory,
          allEvent: allEvent,
          message: 'all event.',
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

    careerAll: function (req, res) {
     
      let _qryData = {
        status: 1 
      }
      var currentPage = req.param("page");
      if(!currentPage){
        currentPage = 1;
      }

      let pageLimit = req.param("page_limit") ? req.param("page_limit") : zeCommon.frontPageLimit; //how many items to show per page

      // console.log('i am _qryData', _qryData);
      return Promise.all([
        BusinessCareer.count(_qryData), //<--All record For Show at form 
        BusinessCareer.find({select: ['id','title', 'job_type', 'job_level', 'department', 'details', 'expiration_date', 'slug']}).where(_qryData).populate('businessProfile').sort('id DESC'), //<--All record For Show at form 
      ]).spread(function(totalCount, allRecord) {
        var pageCount = 0;
        if (totalCount <= pageLimit) {
          pageCount = 1;
        }
        else if ((totalCount % pageLimit) == 0) {
          pageCount = (totalCount / pageLimit) ;
        }
        else  {
          pageCount = Math.floor(totalCount / pageLimit) + 1;
        }
        
        return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              allRecord: allRecord,

              pageLimit: pageLimit, // Per page how much i want to see,
              pageCount: pageCount, // How many page in this index e.x: if total record 20 and page size 4 it will be 20/4(totalrecord/pageSize) // This is last page
              currentPage: currentPage,
              adjacents: 2,
              lpm1: pageCount - 1,
              message: 'All data found Success fully',
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

    blogAll: function (req, res) {
     
      let _qryData = {
        status: 1 
      }
      var currentPage = req.param("page");
      if(!currentPage){
        currentPage = 1;
      }

      let pageLimit = req.param("page_limit") ? req.param("page_limit") : zeCommon.frontPageLimit; //how many items to show per page

      // console.log('i am _qryData', _qryData);
      return Promise.all([
        Blog.count(_qryData), //<--All record For Show at form 
        Blog.find({select: ['id','title', 'details', 'image', 'blog_type', 'details', 'createdAt', 'slug']}).where(_qryData).populate('blogCategory').sort('id DESC'), //<--All record For Show at form 
        
        Blog.findOne({select: ['id','title', 'details', 'image', 'blog_type', 'details', 'createdAt', 'slug']}).where({status: 1, blog_type: 1 }).populate('blogCategory'), //<--All record For Show at form 
        Blog.find({select: ['id','title', 'details', 'image', 'blog_type', 'details', 'createdAt', 'slug']}).where({status: 1, blog_type: 2 }).populate('blogCategory').sort('id DESC'), //<--All record For Show at form 
        Blog.find({select: ['id','title', 'details', 'image', 'blog_type', 'details', 'createdAt', 'slug']}).where({status: 1, blog_type: 3 }).populate('blogCategory').sort('id DESC'), //<--All record For Show at form 
      ]).spread(function(totalCount, allRecord, sinStickyPost, allFeaturedPost, allRecommendedPost) {
        var pageCount = 0;
        if (totalCount <= pageLimit) {
          pageCount = 1;
        }
        else if ((totalCount % pageLimit) == 0) {
          pageCount = (totalCount / pageLimit) ;
        }
        else  {
          pageCount = Math.floor(totalCount / pageLimit) + 1;
        }
        
        return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              allRecord: allRecord,
              sinStickyPost: sinStickyPost,
              allFeaturedPost: allFeaturedPost,
              allRecommendedPost: allRecommendedPost,

              pageLimit: pageLimit, // Per page how much i want to see,
              pageCount: pageCount, // How many page in this index e.x: if total record 20 and page size 4 it will be 20/4(totalrecord/pageSize) // This is last page
              currentPage: currentPage,
              adjacents: 2,
              lpm1: pageCount - 1,
              message: 'All data found Success fully',
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

    pressAll: function (req, res) {
     
      let _qryData = {
        status: 1 
      }
      var currentPage = req.param("page");
      if(!currentPage){
        currentPage = 1;
      }

      let pageLimit = req.param("page_limit") ? req.param("page_limit") : zeCommon.frontPageLimit; //how many items to show per page

      // console.log('i am _qryData', _qryData);
      return Promise.all([
        SitePress.count(_qryData), //<--All record For Show at form 
        SitePress.find({select: ['id','title', 'details', 'createdAt', 'sitePressCategory', 'slug']}).where(_qryData).populate('sitePressCategory').sort('id DESC'), //<--All record For Show at form 
      ]).spread(function(totalCount, allRecord) {
        var pageCount = 0;
        if (totalCount <= pageLimit) {
          pageCount = 1;
        }
        else if ((totalCount % pageLimit) == 0) {
          pageCount = (totalCount / pageLimit) ;
        }
        else  {
          pageCount = Math.floor(totalCount / pageLimit) + 1;
        }
        
        return res.send({
              status: 'success',
              status_code: 11,
              actionStatus: 1,
              allRecord: allRecord,

              pageLimit: pageLimit, // Per page how much i want to see,
              pageCount: pageCount, // How many page in this index e.x: if total record 20 and page size 4 it will be 20/4(totalrecord/pageSize) // This is last page
              currentPage: currentPage,
              adjacents: 2,
              lpm1: pageCount - 1,
              message: 'All data found Success fully',
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

    blogPostComment: function (req, res) {

      // console.log('I m in Update');
      let data = req.param("data");
      // let actionId = data.id ? data.id : '';
      let slug = data.slug ? data.slug : '';
      
      let _formData = {
        slug: slug,
        name: data.name ? data.name.trim() : '',
        email: data.email ? data.email.trim() : '',
        comment: data.comment ? data.comment.trim() : '',
      }
      // let slug = req.param('slug');
      console.log('slug');
      if (!slug){
        return res.send({
            status: 'dataExistError',
            status_code: 33,
            actionStatus: 6,//mean Exist Data error
            message: 'slug is empty error',
        });
      };

       // ***************Custom error hendle Start************
       const customFieldErrors = {};
       if (!_formData.name) {
         customFieldErrors.name = {message: 'Name is Required'};
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
       
 
       // ***************Custom error hendle End**************

      // =============Save Start=====================
          // #########################
          return blog.findOne({slug: slug}).then(function (sinExistdata){
              if (!sinExistdata) {
                return res.send({
                  status: 'dataExistError',
                  status_code: 33,
                  actionStatus: 6,//mean Exist Data error
                  message: 'Exist data error',
                });
            } else {
              
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
                  BlogComment.create(_formData)
                ]).spread(function(createdItem) {
                  console.log('i am at pos = 1');
                    if(createdItem){
                      console.log('i am at pos = 2', createdItem);
                      return res.send({
                        status: 'success',
                        status_code: 11,
                        actionStatus: 1, // remove
                        photo: createdItem,
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
            } //<--sinExistdata Else End
            
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
      // =============Slug Create End=================
  
    },

    pageDetails: function (req, res) {

      // console.log('I m in Update');
      let data = req.param("data");
      // let actionId = data.id ? data.id : '';
      let slug = data.slug ? data.slug : '';
      
      let _qryData = {
        slug: slug
      }
      // let slug = req.param('slug');
      console.log('slug');
      if (!slug){
        return res.send({
            status: 'dataExistError',
            status_code: 33,
            actionStatus: 6,//mean Exist Data error
            message: 'slug is empty error',
        });
      };

      // =============Save Start=====================
          // #########################
          // return BusinessProfile.findOne({slug: slug}).populate('BusinessAlbum').populate('BusinessAlbumPhoto').populate('BusinessEmbeddedVideo').populate('BusinessEvent').populate('BusinessFaq').populate('BusinessOperationHour').populate('BusinessReview').populate('BusinessReview').then(function (sinExistdata){
          // return SitePage.findOne({slug: slug}).then(function (sinExistdata){
          return SitePage.findOne({select: ['id','title','description', 'image', 'slug']}).where(_qryData).then(function (sinExistdata){
              if (!sinExistdata) {
                return res.send({
                  status: 'dataExistError',
                  status_code: 33,
                  actionStatus: 6,//mean Exist Data error
                  message: 'Exist data error',
                });
            } else {
                  return res.send({
                    status: 'success',
                    status_code: 11,
                    actionStatus: 1, // remove
                    sinData: sinExistdata,
                    message: 'Page and Other message',
                  });
              
            } //<--sinExistdata Else End
            
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
      // =============Slug Create End=================
  
    },
    

    // ************************* Reset Password Start******************************
    
    
    resetPasswordEmail: function (req, res) {
      // let proFilter = tempFilter;
      // let searchEmail = 'jahangir147441@gmail.com';
      let searchEmail = req.param("data") ? req.param("data").trim() : '';
      let commonQry = {
        email: searchEmail,
        user_role: 4,
        is_active: true
        
      };
      let _newData = {email: searchEmail};
      const customFieldErrors = {};

      if (!_newData.email) {
        customFieldErrors.email = {message: 'Email is Required'};
      } else {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(_newData.email) == false) 
          {
              customFieldErrors.email = {message: 'Provide valid email address'};
          }
      }
      if (Object.keys(customFieldErrors).length) {
        return res.send({
          status: 'error',
          status_code: 33,
          message: customFieldErrors.email.message,
        });

      }
      // ================================================
      return Promise.all([
        Users.findOne(commonQry),
      ]).spread(function(findCustomer){
        // console.log(findCustomer);
        if(findCustomer){
          let cusData={
            password_reset_code: randToken.generate(32)
          }
          return [findCustomer, Users.update({id: findCustomer.id}, cusData)]
        } else {
          return [null, null]
            // return res.send({
            //   status: 'error',
            //   status_code: 22,
            //   message: 'Email Not Exist or Not Active',
            // });
          
        }
      }).spread(function(findCustomer, udtCustomer){

        if(findCustomer){
          let mailData = {
            email: findCustomer.email,
            display_name: findCustomer.display_name,
            password_reset_code: udtCustomer[0].password_reset_code
          }
          ZeMailerService.passwordResetEmail(mailData); 
          return res.send({
            status: 'success',
            status_code: 11,
            message: 'Please check mail',
          });
        } else {
          
          return res.send({
            status: 'error',
            status_code: 22,
            message: 'Email Not Exist or Not Active',
          });
        
      }


      }).catch(function(err){
        return res.send({
          status: 'error',
          status_code: 33,
          message: 'server error'+err,
        });
      });
  
      // ================================================
  
    },
    resetPasswordCodeCheck: function (req, res) {
      // let proFilter = tempFilter;
      // let searchCode = 'aunLHzWOMQQtm8FYaJVI29H4NoVA2BKb';
      let searchCode = req.param("data") ? req.param("data").trim() : '';
      let commonQry = {
        password_reset_code: searchCode,
        user_role: 4,
        is_active: true
        
      };
      let _newData = {password_reset_code: searchCode};
      const customFieldErrors = {};

      if (!_newData.password_reset_code) {
        customFieldErrors.emapassword_reset_code = {message: 'Code is Required'};
      }
      if (Object.keys(customFieldErrors).length) {
        return res.send({
          status: 'error',
          status_code: 33,
          message: customFieldErrors.emapassword_reset_code.message,
        });

      }
      // ================================================
      return Promise.all([
        Users.findOne(commonQry),
      ]).spread(function(findCustomer){

        if(findCustomer){
          return res.send({
            status: 'success',
            status_code: 11,
            message: 'Code ok',
          });
        } else {
          
          return res.send({
            status: 'error',
            status_code: 22,
            message: 'Your code is invalid',
          });
      }

      }).catch(function(err){
        return res.send({
          status: 'error',
          status_code: 33,
          message: 'server error'+err,
        });
      });
  
      // ================================================
  
    },
    resetPasswordSave: function (req, res) {
      // let proFilter = tempFilter;
      // let searchCode = 'aunLHzWOMQQtm8FYaJVI29H4NoVA2BKb';
      let resetData = req.param("data");
      let commonQry = {
        password_reset_code: resetData.code,
        user_role: 4,
        is_active: true
        
      };
      let _newData = {
        password_reset_code: resetData.code,
        password: resetData.password
      };
      const customFieldErrors = {};

      if (!_newData.password_reset_code) {
        customFieldErrors.emapassword_reset_code = {message: 'Code is Required'};
      }

      if (!_newData.password) {
        customFieldErrors.password = {message: 'Password is Required'};
      } else {
        if(_newData.password.length < 6) {
          customFieldErrors.password = {message: 'Password Min length is 6'};
        }
      }
      if (Object.keys(customFieldErrors).length) {
        return res.send({
          status: 'error',
          status_code: 33,
          message: customFieldErrors.emapassword_reset_code.message,
        });

      }
      // ================================================
      return Promise.all([
        Users.findOne(commonQry),
      ]).spread(function(findCustomer){

        if(findCustomer){

          let cusData={
            password_reset_code: randToken.generate(32),
            password: resetData.password
          }
          return [findCustomer, Users.update({id: findCustomer.id}, cusData)]
        } else {
          return [null, null]
      }

      }).spread(function(findCustomer, udtCustomer){

        if(findCustomer){
          return res.send({
            status: 'success',
            status_code: 11,
            message: 'Password Update',
          });
        } else {
          
          return res.send({
            status: 'error',
            status_code: 22,
            message: 'Your code is invalid',
          });
        
      }

      }).catch(function(err){
        return res.send({
          status: 'error',
          status_code: 33,
          message: 'server error'+err,
        });
      });
  
      // ================================================
  
    },
    // ************************* Reset Password End********************************

    


    // ************************* Username available check Start******************************
    usernameAvailabilityCheck: function (req, res) {
      // let proFilter = tempFilter;
      let searchName = req.param("data") ? req.param("data").trim() : '';
      // console.log(searchName);
      // let commonQry = {name: { 'like': '%'+searchName+'%' }};
      let commonQry = {username: searchName};
      // ================================================
      return Promise.all([
        Users.find({select: ['id','username']}).where(commonQry),
      ]).spread(function(findUsername){

        console.log(findUsername);

        if(findUsername && findUsername.length > 0){
          return res.send({
            status: 'error',
            message: 'This username already exist',
          });
        } else {
          return res.send({
            status: 'success',
            message: 'This username available',
          });
        }
     
      }).catch(function(err){
        return res.send({
          status: 'error',
          message: 'server error'+err,
        });
      });
  
      // ================================================
  
    },
    // ************************* Username available check End********************************

    // ************************* Subscribtion Start******************************
    emailSubscrib_ver1: function (req, res) {
      // let proFilter = tempFilter;
      let searchName = req.param("data") ? req.param("data").trim() : '';
      let commonQry = {email: searchName};
      let _newData = {email: searchName};
      // ================================================
      return Promise.all([
        Subscriber.findOne(commonQry),
      ]).spread(function(findSubscriber){
        // console.log(findSubscriber);
        if(findSubscriber){
          return res.send({
            status: 'success',
            status_code: 11,
            message: 'You are already sebscribe',
          });
        } else {
          return Subscriber.create(_newData).then(function (createData) {
            return res.send({
              status: 'success',
              status_code: 22,
              message: 'subscription successfuly',
            });
          });
        }
      }).catch(function(err){
        return res.send({
          status: 'error',
          status_code: 33,
          message: 'server error'+err,
        });
      });
  
      // ================================================
  
    },
    emailSubscrib: function (req, res) {
      // let proFilter = tempFilter;
      let searchName = req.param("data") ? req.param("data").trim() : '';
      let commonQry = {email: searchName};
      let _newData = {email: searchName};
      const customFieldErrors = {};

      if (!_newData.email) {
        customFieldErrors.email = {message: 'Email is Required'};
      } else {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(_newData.email) == false) 
          {
              customFieldErrors.email = {message: 'Provide valid email address'};
          }
      }
      if (Object.keys(customFieldErrors).length) {
        return res.send({
          status: 'error',
          status_code: 33,
          message: customFieldErrors.email.message,
        });

      }
      // ================================================
      return Promise.all([
        Subscriber.findOne(commonQry),
      ]).spread(function(findSubscriber){
        // console.log(findSubscriber);
        if(findSubscriber){
          return res.send({
            status: 'success',
            status_code: 11,
            message: 'You are already sebscribe',
          });
        } else {
          return Subscriber.create(_newData).then(function (createData) {
            return res.send({
              status: 'success',
              status_code: 22,
              message: 'Subscription successfuly',
            });
          });
        }
      }).catch(function(err){
        return res.send({
          status: 'error',
          status_code: 33,
          message: 'server error'+err,
        });
      });
  
      // ================================================
  
    },

    // ************************* Subscribtion End********************************


    // ************************* Customer Verification Start******************************  
    customerVerificationCodeCheck: function (req, res) {
      // let proFilter = tempFilter;
      // let searchCode = 'aunLHzWOMQQtm8FYaJVI29H4NoVA2BKb';
      console.log('ghghghgh', req.param("data"));
      let searchCode = req.param("data") ? req.param("data").trim() : '';
      let commonQry = {
        verification_code: searchCode,
        user_role: 4,
        is_active: false
        
      };
      let _newData = {password_reset_code: searchCode};
      const customFieldErrors = {};

      if (!_newData.password_reset_code) {
        customFieldErrors.emapassword_reset_code = {message: 'Code is Required'};
      }
      if (Object.keys(customFieldErrors).length) {
        return res.send({
          status: 'error',
          status_code: 33,
          message: customFieldErrors.emapassword_reset_code.message,
        });

      }
      // ================================================
      return Promise.all([
        Users.findOne(commonQry),
      ]).spread(function(findCustomer){

        if(findCustomer){
          findCustomer.date_verified = new Date();
          findCustomer.verification_code = randToken.generate(32);
          findCustomer.is_active = true;
          findCustomer.save();

          return res.send({
            status: 'success',
            status_code: 11,
            message: 'Code ok',
          });
        } else {
          
          return res.send({
            status: 'error',
            status_code: 22,
            message: 'Your code is invalid',
          });
      }

      }).catch(function(err){
        return res.send({
          status: 'error',
          status_code: 33,
          message: 'server error'+err,
        });
      });
  
      // ================================================
  
    },
    // ************************* Customer Verification End********************************  


    

    

    

};

