/**
 * BusinessCareerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let Promise = require('bluebird');
let fs = require('fs-extra');
let moment = require('moment');
let zeCommon = sails.config.zeCommon;
module.exports = {
    _config: {
        actions: false,
        shortcuts: false,
        // rest: true
    },
    index: function (req, res) {
                console.log('aaaaa');
        var qdata = {};
        var currentPage = req.param("page");
        if(!currentPage){
          currentPage = 1;
        }
    
        // var pageLimit = 5;
        // var pageLimit = 30;
        let pageLimit = req.param("page_limit") ? req.param("page_limit") : zeCommon.pageLimit; //how many items to show per page
        var paTitle = req.param("title") ? req.param("title").trim() : '';
        // let paCategory = req.param("category") ? req.param("category").trim() : '';
        var paStatus = req.param("status") ? req.param("status").trim() : '';
        var paSortBy = req.param("sort_by") ? req.param("sort_by").trim() : 'ASC';
    
        if(paTitle){
          qdata.title = { 'like': '%'+paTitle+'%' };
        }
        // if(paCategory){
        //     qdata.sitePressCategory = paCategory;
        //   }
                    
        if(paStatus){
          qdata.status = paStatus;
        }
    
        // =============Embaded Start===============
        return Promise.all([
          BusinessCareer.count(qdata),
          BusinessCareer.find(qdata).populate('businessProfile').paginate({page: currentPage, limit: pageLimit}).sort('id ' +paSortBy),
        ])
          .spread(function(totalCount, alldata){
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
    
            return res.view("admin/business-career/index", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              alldata: alldata,
    
              moment: moment,
              module: 'Careers ',
              submodule: 'All Jobs',
              title: 'All Jobs ',
              subtitle: 'Index',
              link1: '/admin/business-career/index/',
              // linkback1: '/admin/current-election/index/',
              linknew: '',
    
              paginateUrl: '/admin/business-career/index',
              pageLimit: pageLimit, // Per page how much i want to see,
              pageCount: pageCount, // How many page in this index e.x: if total record 20 and page size 4 it will be 20/4(totalrecord/pageSize) // This is last page
              currentPage: currentPage,
              adjacents: 2,
              lpm1: pageCount - 1,
    
              paTitle: paTitle,
              paStatus: paStatus,
              paSortBy: paSortBy,
              totalCount: totalCount,
              paginateVariable : '&title='+paTitle+'&status='+paStatus+'&sort_by='+paSortBy+'&page_limit='+pageLimit,
    
            });
    
            // **************************
          }).catch(function(err){
            req.flash('flashMsgError', 'Error In Index');
            return res.redirect('/admin/business-career/index');
          });
        // =============Embaded End=================
    
      },
    
      view: function (req, res) {
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'User Id Not Found');
          return res.redirect('/admin/business-career/index');
        }
    
        BusinessCareer.findOne({id:id}).then(function (singleData){
          if (!singleData) {
            req.flash('flashMsgError', 'User Not Found In Database');
            return res.redirect('/admin/business-career/index');
          }else{

            return Promise.all([
              BusinessProfile.findOne({id:singleData.businessProfile}).populate('state')
            ])
              .spread(function(bProfile){
                return res.view("admin/business-career/view", {
                  flashMsgError: req.flash('flashMsgError'),
                  flashMsgSuccess: req.flash('flashMsgSuccess'),
                  data: singleData,
                  bProfile: bProfile,
                  moment: moment,
                  module: 'Careers ',
                  submodule: 'All Jobs',
                  title: 'All Jobs ',
                  subtitle: 'View',
                  link1: '/admin/business-career/index'
                });

              })
            
          }
        })
          .catch(function (err) {
            req.flash('flashMsgError', 'Error In User View');
            return res.redirect('/admin/business-career/index');
          });
      },

      delete : function (req, res) {
        let id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/business-career/index');
        };
    
        Promise.all([
          BusinessCareer.findOne({id: id}),
        ]).spread(function(deleteData){
          if(!deleteData){
            req.flash('flashMsgError', 'Data Not found In Database');
            return res.redirect('/admin/business-career/index');
          } else {
                deleteData.destroy().then(function (_deldata) {
              req.flash('flashMsgSuccess', 'Record Deleted Successfully.');
              return res.redirect('/admin/business-career/index');
            });
          }
        
        }).catch(function(err){
          req.flash('flashMsgError', 'Error in Delete');
          return res.redirect('/admin/business-career/index');
        });
    
      },

};

