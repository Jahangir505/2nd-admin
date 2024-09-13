/**
 * SiteTicketController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let moment = require('moment');
let _ = require('lodash');
let Promise = require('bluebird');
const SiteTicket = require('../models/SiteTicket');
let zeCommon = sails.config.zeCommon;
module.exports = {
    _config: {
        actions: false,
        shortcuts: false,
        // rest: true
    },
    // ==============Customer Start================
    customerTicketIndex: function (req, res) {

        let qdata = {
            user_type: 2
        };
    
        let currentPage = req.param("page");
        if(!currentPage){
          currentPage = 1;
        }
    
        // let pageLimit = 10;
        let pageLimit = req.param("page_limit") ? req.param("page_limit") : zeCommon.pageLimit; //how many items to show per page

        let paTitle = req.param("title") ? req.param("title").trim() : '';
        let paTicketType = req.param("ticket_type") ? req.param("ticket_type") : '';
        var paStatus = req.param("status") ? req.param("status").trim() : '';
        var paSortBy = req.param("sort_by") ? req.param("sort_by").trim() : 'ASC';
    
        if(paTitle){
          qdata.title = { 'like': '%'+paTitle+'%' };
        }
    
        if(paTicketType){
          qdata.siteTicketType = paTicketType;
        }
    
        if(paStatus){
            qdata.status = paStatus;
          }
    
    
        // =============Embaded Start===============
        return Promise.all([
          SiteTicket.count(qdata),
          SiteTicket.find(qdata).populate('siteTicketType').populate('createdBy').paginate({page: currentPage, limit: pageLimit}).sort('id ' +paSortBy),
          SiteTicketType.find({status: 1},{select: ['name']}).sort('sort ASC'),
        ])
          .spread(function(totalCount, allRecord, allTicketType){
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
    
            return res.view("admin/site-customer-ticket/index", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              alldata: allRecord,
              allTicketType: allTicketType,
              moment: moment,
              module: 'Supports',
              submodule: 'Support',
              title: 'Site ticket type',
              subtitle: 'Index',
              link1: '/admin/site-customer-ticket/index/',
              // linkback1: '/admin/BBACKK/index/',
              linknew: '/admin/site-customer-ticket/new/',
    
              paginateUrl: '/admin/site-customer-ticket/index',
              pageLimit: pageLimit, // Per page how much i want to see,
              pageCount: pageCount, // How many page in this index e.x: if total record 20 and page size 4 it will be 20/4(totalrecord/pageSize) // This is last page
              currentPage: currentPage,
              adjacents: 2,
              lpm1: pageCount - 1,
    
              paTitle: paTitle,
              paTicketType: paTicketType,
              paStatus: paStatus,
              paSortBy: paSortBy,
              totalCount: totalCount,
              paginateVariable : '&name='+paTitle+'&status='+paStatus+'&sort_by='+paSortBy+'&page_limit='+pageLimit,

            });
    
            // **************************
          }).catch(function(err){
            req.flash('flashMsgError', 'Error In Index');
            return res.redirect('/admin/site-customer-ticket/index');
          });
        // =============Embaded End=================
    },

    customerTicketView: function (req, res) {
      var id = req.param('id');
      if (!id){
        req.flash('flashMsgError', 'Data Id Not Found');
        return res.redirect('/admin/site-customer-ticket/index');
      }
  
      SiteTicket.findOne({id:id, user_type: 2}).populate('siteTicketType').populate('createdBy').then(function (singleData){
        if (!singleData) {
          req.flash('flashMsgError', 'Data Not Found In Database');
          return res.redirect('/admin/site-customer-ticket/index');
        }else{
          return res.view("admin/site-customer-ticket/view", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: singleData,
              moment: moment,
              module: 'Support',
              submodule: 'Support',
              title: 'Site ticket type',
              subtitle: 'View',
              link1: '/admin/site-customer-ticket/index'
          });
        }
      })
        .catch(function (err) {
          console.log('errr', err);
          req.flash('flashMsgError', 'Error In User View');
          return res.redirect('/admin/site-customer-ticket/index');
        });
    },
    // ==============Customer End==================
    

    // ==============Business Start================
    businessTicketIndex: function (req, res) {

        let qdata = {
            user_type: 1
        };
    
        let currentPage = req.param("page");
        if(!currentPage){
          currentPage = 1;
        }
    
        // let pageLimit = 10;
        let pageLimit = req.param("page_limit") ? req.param("page_limit") : zeCommon.pageLimit; //how many items to show per page

        let paTitle = req.param("title") ? req.param("title").trim() : '';
        let paTicketType = req.param("ticket_type") ? req.param("ticket_type") : '';
        var paStatus = req.param("status") ? req.param("status").trim() : '';
        var paSortBy = req.param("sort_by") ? req.param("sort_by").trim() : 'ASC';
    
        if(paTitle){
          qdata.title = { 'like': '%'+paTitle+'%' };
        }
    
        if(paTicketType){
          qdata.siteTicketType = paTicketType;
        }
    
        if(paStatus){
            qdata.status = paStatus;
          }
    
    
        // =============Embaded Start===============
        return Promise.all([
          SiteTicket.count(qdata),
          SiteTicket.find(qdata).populate('siteTicketType').populate('createdBy').paginate({page: currentPage, limit: pageLimit}).sort('id ' +paSortBy),
          SiteTicketType.find({status: 1},{select: ['name']}).sort('sort ASC'),
        ])
          .spread(function(totalCount, allRecord, allTicketType){
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
    
            return res.view("admin/site-business-ticket/index", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              alldata: allRecord,
              allTicketType: allTicketType,
              moment: moment,
              module: 'Supports',
              submodule: 'Support',
              title: 'Site ticket',
              subtitle: 'Index',
              link1: '/admin/site-business-ticket/index/',
              // linkback1: '/admin/BBACKK/index/',
              linknew: '/admin/site-business-ticket/new/',
    
              paginateUrl: '/admin/site-business-ticket/index',
              pageLimit: pageLimit, // Per page how much i want to see,
              pageCount: pageCount, // How many page in this index e.x: if total record 20 and page size 4 it will be 20/4(totalrecord/pageSize) // This is last page
              currentPage: currentPage,
              adjacents: 2,
              lpm1: pageCount - 1,
    
              paTitle: paTitle,
              paTicketType: paTicketType,
              paStatus: paStatus,
              paSortBy: paSortBy,
              totalCount: totalCount,
              paginateVariable : '&name='+paTitle+'&status='+paStatus+'&sort_by='+paSortBy+'&page_limit='+pageLimit,

            });
    
            // **************************
          }).catch(function(err){
            req.flash('flashMsgError', 'Error In Index');
            return res.redirect('/admin/site-business-ticket/index');
          });
        // =============Embaded End=================
    },

    businessTicketView: function (req, res) {
      var id = req.param('id');
      if (!id){
        req.flash('flashMsgError', 'Data Id Not Found');
        return res.redirect('/admin/site-business-ticket/index');
      }
  
      SiteTicket.findOne({id:id, user_type: 1}).populate('siteTicketType').populate('createdBy').then(function (singleData){
        if (!singleData) {
          req.flash('flashMsgError', 'Data Not Found In Database');
          return res.redirect('/admin/site-business-ticket/index');
        }else{
          return res.view("admin/site-business-ticket/view", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: singleData,
              moment: moment,
              module: 'Support',
              submodule: 'Support',
              title: 'Site ticket',
              subtitle: 'View',
              link1: '/admin/site-business-ticket/index'
          });
        }
      })
        .catch(function (err) {
          console.log('errr', err);
          req.flash('flashMsgError', 'Error In User View');
          return res.redirect('/admin/site-business-ticket/index');
        });
    },
    // ==============Business End==================

    

};

