/**
 * BusinessEventController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let Promise = require('bluebird');
let moment = require('moment');
let zeCommon = sails.config.zeCommon;
module.exports = {
    _config: {
        actions: false,
        shortcuts: false,
        // rest: true
      },

      index: function (req, res) {
                
        let qdata = {};
        let currentPage = req.param("page");
        if(!currentPage){
          currentPage = 1;
        }
    
        // var pageLimit = 5;
        // var pageLimit = 30;
        let pageLimit = req.param("page_limit") ? req.param("page_limit") : zeCommon.pageLimit; //how many items to show per page
        let paTitle = req.param("title") ? req.param("title").trim() : '';
        let paCategory = req.param("category") ? req.param("category").trim() : '';
        let paStatus = req.param("status") ? req.param("status").trim() : '';
        let paSortBy = req.param("sort_by") ? req.param("sort_by").trim() : 'ASC';
    
        if(paTitle){
          qdata.title = { 'like': '%'+paTitle+'%' };
        }
        
                    
        if(paCategory){
          qdata.category = paCategory;
        }
        if(paStatus){
          qdata.status = paStatus;
        }
    
        // =============Embaded Start===============
        return Promise.all([
          BusinessEvent.count(qdata),
          BusinessEvent.find(qdata).populate('category').populate('state').populate('businessProfile').paginate({page: currentPage, limit: pageLimit}).sort('title ' +paSortBy),
          Category.find({status: 1},{select: ['name']}).sort('sort ASC'),
        ])
          .spread(function(totalCount, alldata, allCategory){
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
    
            return res.view("admin/business-event/index", {
                flashMsgError: req.flash('flashMsgError'),
                flashMsgSuccess: req.flash('flashMsgSuccess'),
                alldata: alldata,
                allCategory: allCategory,
        
                moment: moment,
                module: 'Events',
                submodule: 'Business Events',
                title: 'Business Event',
                subtitle: 'All Events',
                link1: '/admin/business-event/index/',
                // linkback1: '/admin/current-election/index/',
                linknew: '/admin/business-event/new/',
        
                paginateUrl: '/admin/business-event/index',
                pageLimit: pageLimit, // Per page how much i want to see,
                pageCount: pageCount, // How many page in this index e.x: if total record 20 and page size 4 it will be 20/4(totalrecord/pageSize) // This is last page
                currentPage: currentPage,
                adjacents: 2,
                lpm1: pageCount - 1,
        
                paTitle: paTitle,
                paCategory: paCategory,
                paStatus: paStatus,
                paSortBy: paSortBy,
                totalCount: totalCount,
                paginateVariable : '&title='+paTitle+'&category='+paCategory+'&status='+paStatus+'&sort_by='+paSortBy+'&page_limit='+pageLimit,
    
            });
    
            // **************************
          }).catch(function(err){
            console.log(err);
            req.flash('flashMsgError', 'Error In User Index');
            return res.redirect('/admin/business-event/index');
          });
        // =============Embaded End=================
    
      },

      view: function (req, res) {
        let id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'User Id Not Found');
          return res.redirect('/admin/site-event/index');
        }
    
        BusinessEvent.findOne({id:id}).populate('businessProfile').populate('state').populate('category').then(function (singleData){
          if (!singleData) {
            req.flash('flashMsgError', 'Record Not Found In Database');
            return res.redirect('/admin/site-event/index');
          }else{
            // console.log('singleData==', singleData);
            return res.view("admin/site-event/view", {
                flashMsgError: req.flash('flashMsgError'),
                flashMsgSuccess: req.flash('flashMsgSuccess'),
                data: singleData,
                moment: moment,
                module: 'Events',
                submodule: 'Business Events',
                title: 'Business Event',
                subtitle: 'All Events',
                subtitle: 'View',
                link1: '/admin/site-event/index'
            });
          }
        })
          .catch(function (err) {
            req.flash('flashMsgError', 'Error In User View');
            return res.redirect('/admin/site-event/index');
          });
      },

};

