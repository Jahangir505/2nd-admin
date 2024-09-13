/**
 * BusinessReviewController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let moment = require('moment');
let _ = require('lodash');
let Promise = require('bluebird');
let zeCommon = sails.config.zeCommon;
module.exports = {
    _config: {
        actions: false,
        shortcuts: false,
        // rest: true
      },

      testimonialIndex: function (req, res) {

        let qdata = {
          isTestimonial: true
        };
    
        let currentPage = req.param("page");
        if(!currentPage){
          currentPage = 1;
        }
    
        // let pageLimit = 10;
        let pageLimit = req.param("page_limit") ? req.param("page_limit") : zeCommon.pageLimit; //how many items to show per page

        // let paName = req.param("name") ? req.param("name").trim() : '';
        // let paCategory = req.param("category") ? req.param("category") : '';
        var paStatus = req.param("status") ? req.param("status").trim() : '';
        var paSortBy = req.param("sort_by") ? req.param("sort_by").trim() : 'ASC';
    
        // if(paName){
        //   qdata.name = { 'like': '%'+paName+'%' };
        // }
    
        // if(paCategory){
        //   qdata.category = paCategory;
        // }
    
        if(paStatus){
            qdata.status = paStatus;
          }
    
    
        // =============Embaded Start===============
        return Promise.all([
            BusinessReview.count(qdata),
            BusinessReview.find(qdata).populate('customer').populate('businessProfile').paginate({page: currentPage, limit: pageLimit}).sort('id ' +paSortBy),
        ])
          .spread(function(totalCount, allRecord){
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

            // let dataCount = 0;
            // if(currentPage == 1){
            //   dataCount = 0;
            // } else {
            //   dataCount = (currentPage-1)*pageLimit;
            // }
    
            return res.view("admin/business-review/testimonial-index", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              alldata: allRecord,
              moment: moment,
              module: 'Customer testimonial',
              submodule: 'Testimonial',
              title: 'Testimonial',
              subtitle: 'Index',
              link1: '/admin/testimonial/index/',
              // linkback1: '/admin/BBACKK/index/',
              linknew: '',
    
              paginateUrl: '/admin/testimonial/index',
              pageLimit: pageLimit, // Per page how much i want to see,
              pageCount: pageCount, // How many page in this index e.x: if total record 20 and page size 4 it will be 20/4(totalrecord/pageSize) // This is last page
              currentPage: currentPage,
              adjacents: 2,
              lpm1: pageCount - 1,
              // dataCount: dataCount,
    
            //   paName: paName,
            //   paCategory: paCategory,
              paStatus: paStatus,
              paSortBy: paSortBy,
              totalCount: totalCount,
            //   paginateVariable : '&name='+paName+'&status='+paStatus+'&sort_by='+paSortBy+'&page_limit='+pageLimit,
              paginateVariable : '&status='+paStatus+'&sort_by='+paSortBy+'&page_limit='+pageLimit,

            });
    
            // **************************
          }).catch(function(err){
            req.flash('flashMsgError', 'Error In Index');
            return res.redirect('/admin/testimonial/index');
          });
        // =============Embaded End=================
    },

    testimonialView: function (req, res) {
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'Data Id Not Found');
          return res.redirect('/admin/testimonial/index');
        }
    
        BusinessReview.findOne({id:id}).populate('customer').populate('businessProfile').then(function (singleData){
          if (!singleData) {
            req.flash('flashMsgError', 'Data Not Found In Database');
            return res.redirect('/admin/testimonial/index');
          }else{
            return res.view("admin/business-review/view", {
                flashMsgError: req.flash('flashMsgError'),
                flashMsgSuccess: req.flash('flashMsgSuccess'),
                data: singleData,
                moment: moment,
                module: 'Customer testimonial',
              submodule: 'Testimonial',
              title: 'Testimonial',
                subtitle: 'View',
                link1: '/admin/testimonial/index'
            });
          }
        })
          .catch(function (err) {
            console.log('errr', err);
            req.flash('flashMsgError', 'Error In User View');
            return res.redirect('/admin/testimonial/index');
          });
      },
      testimonialDelete : function (req, res) {
        let id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/testimonial/index');
        };
    
        Promise.all([
            BusinessReview.findOne({id: id}),
        ]).spread(function(deleteData){
          if(!deleteData){
            req.flash('flashMsgError', 'Data Not found In Database');
            return res.redirect('/admin/testimonial/index');
          }
          
            deleteData.destroy().then(function (_deldata) {
              req.flash('flashMsgSuccess', 'Record Deleted Successfully.');
              return res.redirect('/admin/testimonial/index');
            });
         
        }).catch(function(err){
          req.flash('flashMsgError', 'Error in Delete');
          return res.redirect('/admin/testimonial/index');
        });
    
      },

};

