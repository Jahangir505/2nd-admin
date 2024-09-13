/**
 * BusinessProfileController
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
        // actions: false,
        shortcuts: false,
        // rest: true
      },

      index: function (req, res) {
        // console.log('Session ID =  '+req.session.cusId);
        // console.log('Cookies  == '+req.cookies.customerId);
        //
        // console.log('Session ID Before =  '+ JSON.stringify(req.session));
        // delete req.session.cusId;
        // console.log('Session ID After =  '+ JSON.stringify(req.session));
        // console.log('Session ID =  '+req.session.cusId);
        // console.log('LLOog User', req.user);
        
        var qdata = {
          // user_type: [1,3]
          // user_role: [1,2]
          // is_customer: false
        };
        var currentPage = req.param("page");
        if(!currentPage){
          currentPage = 1;
        }
    
        // var pageLimit = 5;
        // var pageLimit = 30;
        let pageLimit = req.param("page_limit") ? req.param("page_limit") : zeCommon.pageLimit; //how many items to show per page
    
        var paCompanyName = req.param("company_name") ? req.param("company_name").trim() : '';
    
        var paCategory = req.param("category") ? req.param("category").trim() : '';
        var paSubcategory = req.param("subcategory") ? req.param("subcategory").trim() : '';
        var paState = req.param("state") ? req.param("state").trim() : '';
    
        var paStatus = req.param("status") ? req.param("status").trim() : '';
        var paSortBy = req.param("sort_by") ? req.param("sort_by").trim() : 'ASC';
    
        if(paCompanyName){
          qdata.company_name = { 'like': '%'+paCompanyName+'%' };
        }
        
        // if(paCategory){
        //     qdata.category = paCategory;
        // }
        // if(paSubcategory){
        //     qdata.subcategory = paSubcategory;
        // }
        if(paState){
            qdata.state = paState;
        }
    
        if(paStatus){
          qdata.status = paStatus;
        }
    
        // =============Embaded Start===============
        return Promise.all([
          BusinessProfile.count(qdata),
          BusinessProfile.find(qdata).populate('state').paginate({page: currentPage, limit: pageLimit}).sort('id ' +paSortBy),
          Category.find({status: 1},{select: ['name']}).sort('sort ASC'),
          State.find({status: 1},{select: ['name']}).sort('sort ASC'),
        ])
          .spread(function(totalCount, allAds, allCategory, allState){
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
    
            return res.view("admin/ads/index", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              alldata: allAds,
              allCategory: allCategory,
              allState: allState,
    
              moment: moment,
              module: 'Advertisements ',
              submodule: 'Ads',
              title: 'Ads',
              subtitle: 'Index',
              link1: '/admin/ads/index/',
              // linkback1: '/admin/current-election/index/',
              linknew: '/admin/ads/new/',
    
              paginateUrl: '/admin/ads/index',
              pageLimit: pageLimit, // Per page how much i want to see,
              pageCount: pageCount, // How many page in this index e.x: if total record 20 and page size 4 it will be 20/4(totalrecord/pageSize) // This is last page
              currentPage: currentPage,
              adjacents: 2,
              lpm1: pageCount - 1,
    
              paCompanyName: paCompanyName,
              paCategory: paCategory,
              paSubcategory: paSubcategory,
              paState: paState,
              paStatus: paStatus,
              paSortBy: paSortBy,
              totalCount: totalCount,
              paginateVariable : '&companyName='+paCompanyName+'&category='+paCategory+'&subcategory='+paSubcategory+'&state='+paState+'&status='+paStatus+'&sort_by='+paSortBy+'&page_limit='+pageLimit,
    
            });
    
            // **************************
          }).catch(function(err){
            console.log('Error', err);
            req.flash('flashMsgError', 'Error In User Index');
            return res.redirect('/admin/ads/index');
          });
        // =============Embaded End=================
    
      },

      view: function (req, res) {
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'User Id Not Found');
          return res.redirect('/admin/ads/index');
        }
    
        Users.findOne({businessProfile:id}).then(function (singleData){
          if (!singleData) {
            req.flash('flashMsgError', 'User Not Found In Database');
            return res.redirect('/admin/ads/index');
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
                    console.log('allAlbum==',allAlbum);
                    // console.log('photo==',photo);
                    return res.view("admin/ads/view", {
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
                        link1: '/admin/ads/index'
                      });
          
                })
            
          }
        })
          .catch(function (err) {
            req.flash('flashMsgError', 'Error In User View');
            return res.redirect('/admin/ads/index');
          });
      },

};

