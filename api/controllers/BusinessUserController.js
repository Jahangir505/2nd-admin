/**
 * BusinessUserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let moment = require('moment');
let Promise = require('bluebird');
let Q = require('q');
let _ = require('lodash');
let zeCommon = sails.config.zeCommon;
module.exports = {
    _config: {
        actions: false,
        shortcuts: false,
        // rest: true
      },
      index: function (req, res) {
        var qdata = {
          user_type: 4,
          is_token_based_user: true
        };
        var currentPage = req.param("page");
        if(!currentPage){
          currentPage = 1;
        }
    
        // var pageLimit = 5;
        // var pageLimit = 30;
        let pageLimit = req.param("page_limit") ? req.param("page_limit") : zeCommon.pageLimit; //how many items to show per page
        var paUsername = req.param("username") ? req.param("username").trim() : '';
    
        var paCountry = req.param("country") ? req.param("country").trim() : '';
        var paState = req.param("state") ? req.param("state").trim() : '';
    
        var paStatus = req.param("status") ? req.param("status").trim() : '';
        var paSortBy = req.param("sort_by") ? req.param("sort_by").trim() : 'ASC';
    
        
        if(paUsername){
            qdata.email = { 'like': '%'+paUsername+'%' };
        }

        if(paCountry){
            qdata.country = paCountry;
        }
        if(paState){
            qdata.state = paState;
        }
    
        if(paStatus){
          qdata.status = paStatus;
        }
    
        // =============Embaded Start===============
        return Promise.all([
          Users.count(qdata),
          Users.find(qdata).populate('businessProfile').paginate({page: currentPage, limit: pageLimit}).sort('id ' +paSortBy),
          Country.find({status: 1},{select: ['name']}).sort('sort ASC'),
          State.find({status: 1},{select: ['name']}).sort('sort ASC'),
        ])
          .spread(function(totalCount, allUsers, allCountry, allState){
            // **************************
            // console.log('allUsers ',allUsers);
            // console.log('Total cou ',totalCount);
    
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
    
            return res.view("admin/business-user/index", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              alldata: allUsers,
              allCountry: allCountry,
              allState: allState,
    
              moment: moment,
              module: 'Users ',
              submodule: 'Businessess',
              title: 'Business ',
              subtitle: 'Index',
              link1: '/admin/business-user/index/',
              // linkback1: '/admin/current-election/index/',
              linknew: '',
    
              paginateUrl: '/admin/business-user/index',
              pageLimit: pageLimit, // Per page how much i want to see,
              pageCount: pageCount, // How many page in this index e.x: if total record 20 and page size 4 it will be 20/4(totalrecord/pageSize) // This is last page
              currentPage: currentPage,
              adjacents: 2,
              lpm1: pageCount - 1,
    
              paUsername: paUsername,
              paCountry: paCountry,
              paState: paState,
              paStatus: paStatus,
              paSortBy: paSortBy,
              totalCount: totalCount,
              paginateVariable : '&username='+paUsername+'&country='+paCountry+'&state='+paState+'&status='+paStatus+'&sort_by='+paSortBy+'&page_limit='+pageLimit,
    
            });
    
            // **************************
          }).catch(function(err){
            req.flash('flashMsgError', 'Error In User Index');
            return res.redirect('/admin/business-user/index');
          });
        // =============Embaded End=================
    
      },

      view: function (req, res) {
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'User Id Not Found');
          return res.redirect('/admin/business-user/index');
        }
    
        Users.findOne({id:id}).then(function (singleData){
          if (!singleData) {
            req.flash('flashMsgError', 'User Not Found In Database');
            return res.redirect('/admin/business-user/index');
          }else{
            // console.log(singleData);

            Promise.all([
                BusinessProfile.findOne({id: singleData.businessProfile}),
                BusinessProfileAmenity.find({businessProfile: singleData.businessProfile}).populate('amenity'),
                BusinessAlbum.find({businessProfile: singleData.businessProfile, status: 1}).populate('businessAlbumPhoto'),
                BusinessAlbumPhoto.find({businessProfile: singleData.businessProfile, status: 1}),
                BusinessCareer.find({businessProfile: singleData.businessProfile, status: 1}),
                BusinessEmbeddedVideo.find({businessProfile: singleData.businessProfile, status: 1}),
                BusinessEvent.find({businessProfile: singleData.businessProfile, status: 1}),
                BusinessExtendedClosure.find({businessProfile: singleData.businessProfile}),
                BusinessFaq.find({businessProfile: singleData.businessProfile, status: 1}),
                BusinessOperationHour.findOne({businessProfile: singleData.businessProfile}),
                BusinessReview.find({businessProfile: singleData.businessProfile}),
              ])
                .spread(function(profile, allAminity, allAlbum, photo, career, allEmbeddedVideo, events, extendedClosure, allFaq, operationHour, review ){
                    // console.log('allAminity==',allAminity);
                    return res.view("admin/business-user/view", {
                        flashMsgError: req.flash('flashMsgError'),
                        flashMsgSuccess: req.flash('flashMsgSuccess'),
                        data: singleData,
                        profile: profile,
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

                        moment: moment,
                        module: 'Users ',
                        submodule: 'Businessess',
                        title: 'Business ',
                        subtitle: 'View',
                        link1: '/admin/business-user/index'
                      });
          
                })
            
          }
        })
          .catch(function (err) {
            req.flash('flashMsgError', 'Error In User View');
            return res.redirect('/admin/business-user/index');
          });
      },

};

