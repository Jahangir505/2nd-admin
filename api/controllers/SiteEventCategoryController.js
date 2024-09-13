/**
 * SiteEventCategoryController
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

      index: function (req, res) {
        

        var qdata = {
        };
    
        var currentPage = req.param("page");
        if(!currentPage){
          currentPage = 1;
        }
    
        // var pageLimit = 10;
        // var pageLimit = 50;
        let pageLimit = req.param("page_limit") ? req.param("page_limit") : zeCommon.pageLimit; //how many items to show per page

    
        var paName = req.param("name") ? req.param("name").trim() : '';
        var paStatus = req.param("status") ? req.param("status").trim() : '';
        var paSortBy = req.param("sort_by") ? req.param("sort_by").trim() : 'ASC';
    
        if(paName){
          qdata.name = { 'like': '%'+paName+'%' };
        }
    
        if(paStatus){
            qdata.status = paStatus;
          }
      
          console.log('i am in index');
        // =============Embaded Start===============
        return Promise.all([
          SiteEventCategory.count(qdata),
          SiteEventCategory.find(qdata).paginate({page: currentPage, limit: pageLimit}).sort('id ' +paSortBy),
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
            
            return res.view("admin/site-event-category/index", {
                flashMsgError: req.flash('flashMsgError'),
                flashMsgSuccess: req.flash('flashMsgSuccess'),
                alldata: allRecord,
                moment: moment,
                module: 'Site Events',
                submodule: 'Categories',
                title: 'Category',
                subtitle: 'Index',
                link1: '/admin/site-event-category/index/',
                // linkback1: '/admin/BBACKK/index/',
                linknew: '/admin/site-event-category/new/',
        
                paginateUrl: '/admin/site-event-category/index',
                pageLimit: pageLimit, // Per page how much i want to see,
                pageCount: pageCount, // How many page in this index e.x: if total record 20 and page size 4 it will be 20/4(totalrecord/pageSize) // This is last page
                currentPage: currentPage,
                adjacents: 2,
                lpm1: pageCount - 1,
    
                paName: paName,
                paStatus: paStatus,
                paSortBy: paSortBy,
                totalCount: totalCount,
                paginateVariable : '&name='+paName+'&status='+paStatus+'&sort_by='+paSortBy+'&page_limit='+pageLimit,
    
    
            });
    
            // **************************
          }).catch(function(err){
            console.log('Error In Index', err);
            req.flash('flashMsgError', 'Error In Index');
            return res.redirect('/admin/site-event-category/index');
          });
        // =============Embaded End=================
    
      },

      new : function (req, res) {
        // console.log("Inside new..............");
    
        var _formData = {
          name: '',
          status: 0,
        };
        return res.view("admin/site-event-category/new", {
            flashMsgError: req.flash('flashMsgError'),
            flashMsgSuccess: req.flash('flashMsgSuccess'),
            data: _formData,
            formActionTarget : "/admin/site-event-category/create",
            status: 'OK',
            // fieldErrors: {},
            customFieldErrors: {},
            module: 'Site Events ',
            submodule: 'Categories',
            title: 'Category',
            subtitle: 'New',
            link1: '/admin/site-event-category/index'
        });
    
    
    
      },
   
      create : function (req, res) {
        
        let _formData = {
          name: req.param("name")  ? req.param("name").trim() : '',
          status: req.param("status")  ? req.param("status") : '',
          createdBy: req.user.id,
              createdByObj: {email: req.user.email},
              updatedBy: '',
              updatedByObj: {email: ''}
        };
    
        
    // =============Custom Error Start==================
    let customFieldErrors = {};
    if (!_formData.name) {
      customFieldErrors.name = {message: 'Name is required'};
    }

    if (!_formData.status) {
        customFieldErrors.status = {message: 'Status is Required'};
    }
    
    let _creSlugData = {
      model: 'siteeventcategory',
      type: 'slug',
      from:  _formData.name,
      defaultValue: 'slug'
    };
    // =============Custom Error End====================
    // =============Promisses Start=====================
    
    
    return Promise.all([
        SiteEventCategory.findOne({name: _formData.name}),
        ZeslugService.slugForCreate(_creSlugData),
    ])
      .spread(function(extName, creSlug){
      //  console.log('main_image_Ret is', main_image_Ret);
        if(extName){
          customFieldErrors.name = {message: 'Name is already taken'};
        }
        _formData.slug = creSlug;
        // ******************** Image File Upload Start**********************
        
        // ******************** Image File Upload End************************
        if (Object.keys(customFieldErrors).length) {
          req.flash('errorMessage', 'Error in Create');
          return res.view("admin/site-event-category/new", {
            flashMsgError: req.flash('flashMsgError'),
            flashMsgSuccess: req.flash('flashMsgSuccess'),
            data: _formData,
            formActionTarget : "/admin/site-event-category/create",
            status: 'Error',
            errorType: 'validation-error',
            customFieldErrors: customFieldErrors,
            module: 'Site Events ',
            submodule: 'Categories',
            title: 'Category',
            subtitle: 'Create',
            link1: '/admin/site-event-category/index'
          });

        } else {
          return SiteEventCategory.create(_formData).then(function (createData) {
              req.flash('flashMsgSuccess', 'Category Create Success.');
              return res.redirect('/admin/site-event-category/index');
            
          }).catch(function (err) {
            req.flash('flashMsgError', 'Error in category Create');
            // ===============
            return res.view("admin/site-event-category/new", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: _formData,
              formActionTarget : "/admin/site-event-category/create",
              status: 'Error',
              errorType: 'validation-error',
              customFieldErrors: {},
              fieldErrors: {},
              module: 'Site Events ',
              submodule: 'Categories',
              title: 'Category',
              subtitle: 'Create',
              link1: '/admin/site-event-category/index'
            });
          });//
        }
      }).catch(function(err){
        req.flash('flashMsgError', 'Error in create Record 4.'+err);
        return res.redirect('/admin/site-event-category/new');
      });
    // =============Promisses End=======================
      },

      edit: function (req, res) {
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID Not Found');
          return res.redirect('/admin/site-event-category/index');
        }
    
        SiteEventCategory.findOne({id:id}).then(function (singledata){
          if (!singledata) {
            req.flash('flashMsgError', 'Data Not Found In Database');
            return res.redirect('/admin/site-event-category/index');
          }else{
            return res.view("admin/site-event-category/edit", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: singledata,
              formActionTarget : "/admin/site-event-category/update/" + id,
              status: 'OK',
              fieldErrors: {},
              customFieldErrors: {},
              module: 'Site Events ',
              submodule: 'Categories',
              title: 'Category',
              subtitle: 'Edit',
              link1: '/admin/site-event-category/index'
            });
          }
        }).catch(function (err) {
            req.flash('flashMsgError', 'Error In Edit');
            return res.redirect('/admin/site-event-category/index');
          });
      },

      update: function (req, res) {
        let id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/site-event-category/index');
        }
    
        let _formData = {
          name: req.param("name")  ? req.param("name").trim() : '',
          status: req.param("status")  ? req.param("status") : '',
          updatedBy: req.user.id,
          updatedByObj: {email: req.user.email}
        };
     // =============Custom Error Start==================
        const customFieldErrors = {};
        if (!_formData.name) {
          customFieldErrors.name = {message: 'Name is required'};
        }
        if (!_formData.status) {
          customFieldErrors.status = {message: 'Status is Required'};
        }

        let _creSlugData = {
          model: 'siteeventcategory',
          type: 'slug',
          from: _formData.name,
          defaultValue: 'slug'
        };
    
     // =============Custom Error End====================
    
     // ==================Save Start=====================
      
     Promise.all([
        SiteEventCategory.findOne({id: id}),
        ZeslugService.slugForUpdate(_creSlugData),
        SiteEventCategory.findOne({name: _formData.name}),
      ]).spread(function(sinExistdata, creSlug, extName) {
        
        if(!sinExistdata){
          req.flash('flashMsgError', 'Exist data not found');
          return res.redirect('/admin/site-event-category/index');
        }
        
        if(extName){
          if(sinExistdata.id != extName.id){
            customFieldErrors.name = {message: 'Category Name is already taken'};
          }
        }

        if(sinExistdata.name != _formData.name){
          _formData.slug = creSlug;
        }

        if (Object.keys(customFieldErrors).length) {
          req.flash('errorMessage', 'Error in Update');
            return res.view('admin/site-event-category/edit', {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: _formData,
              formActionTarget : "/admin/site-event-category/update/" + id,
              status: 'Error',
              customFieldErrors: customFieldErrors,
              fieldErrors: {},
              module: 'Site Events ',
              submodule: 'Categories',
              title: 'Category',
              subtitle: 'Update',
              link1: '/admin/site-event-category/index'
          });
    
        } else {
            //  ==================Start=====================
              return SiteEventCategory.update({id: id}, _formData).then(function (_updateSingle) {
                req.flash('flashMsgSuccess', 'Category Update Success.');
                  return res.redirect('/admin/site-event-category/index');
              }).catch(function (err) {
                req.flash('flashMsgError', 'Error in Category Update');
                // ===============
                return res.view("admin/site-event-category/edit", {
                  flashMsgError: req.flash('flashMsgError'),
                  flashMsgSuccess: req.flash('flashMsgSuccess'),
                  data: sinExistdata,
                  formActionTarget : "/admin/site-event-category/update/" + id,
                  status: 'Error',
                  errorType: 'validation-error',
                  customFieldErrors: {},
                  fieldErrors: {},
                  module: 'Site Events ',
                  submodule: 'Category',
                  title: 'Category',
                  subtitle: 'Update',
                  link1: '/admin/site-event-category/index'
                });
          
              });// ------catch End----
            //  ==================End=======================
        }
      }).catch(function (err) {
        req.flash('flashMsgError', 'Error In Category Update');
        return res.redirect('/admin/site-event-category/index');
      });
     // ==================Save End=======================
    
      },
      view: function (req, res) {
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'Data Id Not Found');
          return res.redirect('/admin/site-event-category/index');
        }
    
        SiteEventCategory.findOne({id:id}).then(function (singleData){
          if (!singleData) {
            req.flash('flashMsgError', 'Data Not Found In Database');
            return res.redirect('/admin/site-event-category/index');
          }else{
            return res.view("admin/site-event-category/view", {
                flashMsgError: req.flash('flashMsgError'),
                flashMsgSuccess: req.flash('flashMsgSuccess'),
                data: singleData,
                moment: moment,
                module: 'Site Events ',
                submodule: 'Categories',
                title: 'Category',
                subtitle: 'View',
                link1: '/admin/site-event-category/index'
            });
          }
        })
          .catch(function (err) {
            console.log('errr', err);
            req.flash('flashMsgError', 'Error In User View');
            return res.redirect('/admin/site-event-category/index');
          });
      },
      delete : function (req, res) {
        let id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/site-event-category/index');
        };
    
        Promise.all([
            SiteEventCategory.findOne({id: id}),
          Subcategory.findOne({category:id},{select: ['id']}),
        ]).spread(function(deleteData, subCathasData){
          if(!deleteData){
            req.flash('flashMsgError', 'Data Not found In Database');
            return res.redirect('/admin/site-event-category/index');
          }
          if(subCathasData){
            req.flash('flashMsgError', 'It Has Related Data You Cannot Delete It');
            return res.redirect('/admin/site-event-category/index');
          } else {
            deleteData.destroy().then(function (_deldata) {
              req.flash('flashMsgSuccess', 'Record Deleted Successfully.');
              return res.redirect('/admin/site-event-category/index');
            });
          }
        }).catch(function(err){
          req.flash('flashMsgError', 'Error in Delete');
          return res.redirect('/admin/site-event-category/index');
        });
    
      },
  

};
