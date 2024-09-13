/**
 * SubCategoryController
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

        let qdata = {
        };
    
        let currentPage = req.param("page");
        if(!currentPage){
          currentPage = 1;
        }
    
        // let pageLimit = 10;
        let pageLimit = req.param("page_limit") ? req.param("page_limit") : zeCommon.pageLimit; //how many items to show per page

        let paName = req.param("name") ? req.param("name").trim() : '';
        let paCategory = req.param("category") ? req.param("category") : '';
        var paStatus = req.param("status") ? req.param("status").trim() : '';
        var paSortBy = req.param("sort_by") ? req.param("sort_by").trim() : 'ASC';
    
        if(paName){
          qdata.name = { 'like': '%'+paName+'%' };
        }
    
        if(paCategory){
          qdata.category = paCategory;
        }
    
        if(paStatus){
            qdata.status = paStatus;
          }
    
    
        // =============Embaded Start===============
        return Promise.all([
          SubCategory.count(qdata),
          SubCategory.find(qdata).populate('category').paginate({page: currentPage, limit: pageLimit}).sort('id ' +paSortBy),
          Category.find({status: 1},{select: ['name']}).sort('sort ASC'),
        ])
          .spread(function(totalCount, allRecord, allCategory){
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
    
            return res.view("admin/sub-category/index", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              alldata: allRecord,
              allCategory: allCategory,
              moment: moment,
              module: 'Admin Ads Data ',
              submodule: 'Sub Categories',
              title: 'Sub Category',
              subtitle: 'New',
              link1: '/admin/sub-category/index/',
              // linkback1: '/admin/BBACKK/index/',
              linknew: '/admin/sub-category/new/',
    
              paginateUrl: '/admin/sub-category/index',
              pageLimit: pageLimit, // Per page how much i want to see,
              pageCount: pageCount, // How many page in this index e.x: if total record 20 and page size 4 it will be 20/4(totalrecord/pageSize) // This is last page
              currentPage: currentPage,
              adjacents: 2,
              lpm1: pageCount - 1,
              // dataCount: dataCount,
    
              paName: paName,
              paCategory: paCategory,
              paStatus: paStatus,
              paSortBy: paSortBy,
              totalCount: totalCount,
              paginateVariable : '&name='+paName+'&status='+paStatus+'&sort_by='+paSortBy+'&page_limit='+pageLimit,

            });
    
            // **************************
          }).catch(function(err){
            req.flash('flashMsgError', 'Error In Index');
            return res.redirect('/admin/sub-category/index');
          });
        // =============Embaded End=================
    },

    new : function (req, res) {
      // console.log("Inside new..............");
      var _formData = {
          name: '',
          category: '',
          status: 0,
      };
  
      Promise.all([
        Category.find({status: 1},{select: ['name']}).sort('sort ASC')
      ])
        .spread(function(allCategory){
          return res.view("admin/sub-category/new", {
            flashMsgError: req.flash('flashMsgError'),
            flashMsgSuccess: req.flash('flashMsgSuccess'),
            data: _formData,
            allCategory: allCategory,
            formActionTarget : "/admin/sub-category/create",
            status: 'OK',
            customFieldErrors: {},
            module: 'Admin Ads Data ',
            submodule: 'Sub Categories',
            title: 'Sub Category',
            subtitle: 'New',
            link1: '/admin/sub-category/index'
          });
  
        }).catch(function(err){
        req.flash('flashMsgError', 'Error In New');
        return res.redirect('/admin/sub-category/index');
      });
  
    },


    create : function (req, res) {
      
      let _formData = {
        category: req.param("category") ? req.param("category").trim() : '',
        name: req.param("name")  ? req.param("name").toLowerCase() : '',
        status: req.param("status")  ? req.param("status") : '',
        createdBy: req.user.id,
        createdByObj: {email: req.user.email},
        updatedBy: '',
        updatedByObj: {email: ''}
      };
  
      
  // =============Custom Error Start==================
  let customFieldErrors = {};
  if (!_formData.category) {
      customFieldErrors.category = {message: 'Category is required'};
  }
  if (!_formData.name) {
    customFieldErrors.name = {message: 'Name is required'};
  }
  if (!_formData.status) {
    customFieldErrors.status = {message: 'Status is Required'};
  }
  let _creSlugData = {
    model: 'subcategory',
    type: 'slug',
    from: _formData.name,
    defaultValue: 'slug'
  };
  // =============Custom Error End====================
  // =============Promisses Start=====================
  
  
  return Promise.all([
    Category.find({status: 1},{select: ['name']}).sort('sort ASC'), //<--All category For Show at form 
    ZeslugService.slugForCreate(_creSlugData), //<--Generate slug
    Category.count({id: _formData.category}),//<--For valid check
    SubCategory.findOne({category: _formData.category, name: _formData.name}), //<--For validation Check
  ])
    .spread(function(allCategory, creSlug, extCategory, extName){
  //    console.log('extName is', extName);
      if(extName){
        customFieldErrors.name = {message: 'Name is already taken'};
      }
      if (!extCategory) {
        customFieldErrors.category = {message: 'Category is Invalid'};
      }
      _formData.slug = creSlug;
      // ******************** Image File Upload Start**********************
      
      // ******************** Image File Upload End************************
      if (Object.keys(customFieldErrors).length) {
          // console.log('_formData_formData', _formData);
        req.flash('errorMessage', 'Error in Create');
        return res.view("admin/sub-category/new", {
          flashMsgError: req.flash('flashMsgError'),
          flashMsgSuccess: req.flash('flashMsgSuccess'),
          data: _formData,
          allCategory: allCategory,
          formActionTarget : "/admin/sub-category/create",
          status: 'Error',
          errorType: 'validation-error',
          customFieldErrors: customFieldErrors,
          module: 'Admin Ads Data ',
          submodule: 'Sub Categories',
          title: 'Sub Category',
          subtitle: 'Create',
          link1: '/admin/sub-category/index'
        });

      } else {
        return SubCategory.create(_formData).then(function (createData) {
              req.flash('flashMsgSuccess', 'Sub-category Create Success.');
              return res.redirect('/admin/sub-category/index');
        
      }).catch(function (err) {
            req.flash('flashMsgError', 'Error in Sub-category Create');
                return res.view("admin/sub-category/new", {
                  flashMsgError: req.flash('flashMsgError'),
                  flashMsgSuccess: req.flash('flashMsgSuccess'),
                  data: _formData,
                  formActionTarget : "/admin/sub-category/create",
                  status: 'Error',
                  errorType: 'validation-error',
                  customFieldErrors: {},
                  module: 'Admin Ads Data ',
                  submodule: 'Sub Categories',
                  title: 'Sub Category',
                  subtitle: 'Create',
                  link1: '/admin/sub-category/index'
                });
          });// <--Create record Catch End

      } //<--Validation Check Else End
    }).catch(function(err){
      req.flash('flashMsgError', 'Error in create Record 4.'+err);
      return res.redirect('/admin/sub-category/new');
    });
  // =============Promisses End=======================
    },

    edit: function (req, res) {
      var id = req.param('id');
      if (!id){
        req.flash('flashMsgError', 'ID not found');
        return res.redirect('/admin/sub-category/index');
      }
      Promise.all([
        SubCategory.findOne({id:id}),
        Category.find({status: 1},{select: ['name']}).sort('sort ASC')
      ])
        .spread(function(existSingleData, allCategory){

          if(!existSingleData){
            req.flash('flashMsgError', 'Record Not Found In Database');
            return res.redirect('/admin/sub-category/index');
          } else {
              return res.view("admin/sub-category/edit", {
                flashMsgError: req.flash('flashMsgError'),
                flashMsgSuccess: req.flash('flashMsgSuccess'),
                data: existSingleData,
                allCategory: allCategory,
                formActionTarget : "/admin/sub-category/update/" + id,
                status: 'OK',
                customFieldErrors: {},
                module: 'Admin Ads Data ',
                submodule: 'Sub Categories',
                title: 'Sub Category',
                subtitle: 'Edit',
                link1: '/admin/sub-category/index'
              });
          }
        }).catch(function(err){
        req.flash('flashMsgError', 'Error in Edit');
        return res.redirect('/admin/sub-category/index');
      });
    },
   
    update: function (req, res) {

      // console.log('I m in Update');
      var id = req.param('id');
      if (!id){
        req.flash('flashMsgError', 'ID not found');
        return res.redirect('/admin/sub-category/index');
      };

      
  
      var _formData = {
          category: req.param("category") ? req.param("category").trim() : '',
          name: req.param("name")  ? req.param("name").toLowerCase() : '',
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
          model: 'subcategory',
          type: 'slug',
          from: _formData.name,
          defaultValue: 'slug'
        };
    
       // =============Custom Error End====================

      // =============Save Start=====================
          // #########################
          return SubCategory.findOne({id:id}).then(function (sinExistdata){
            if (!sinExistdata) {
              req.flash('flashMsgError', 'Record Not found 11');
              return res.redirect('/admin/sub-category/index');
            } else {
              
              Promise.all([
                Category.find({status: 1},{select: ['name']}).sort('sort ASC'), //<--All category For Show at form
                ZeslugService.slugForUpdate(_creSlugData),
                Category.findOne({id: _formData.category}), //<--For validate
                // SubCategory.findOne({category: _formData.category, name: _formData.name}), //<--For validation Check
                SubCategory.findOne({name: _formData.name}), //<--For validation Check
                
                ]).spread(function(allCategory, creSlug, extCategory, extName) {

                  

                  if(extName){
                    if(sinExistdata.id != extName.id){
                      customFieldErrors.name = {message: 'Sub-category Name is already taken'};
                    }
                  }
                  if (!extCategory) {
                    customFieldErrors.category = {message: 'Category is Invalid'};
                  }

                  if(sinExistdata.name != _formData.name){
                    _formData.slug = creSlug;
                  }
        
                  

                if (Object.keys(customFieldErrors).length) {
                  console.log('_formData', _formData);
                      req.flash('errorMessage', 'Error in Update');
                        return res.view('admin/sub-category/edit', {
                          flashMsgError: req.flash('flashMsgError'),
                          flashMsgSuccess: req.flash('flashMsgSuccess'),
                          data: _formData,
                          allCategory: allCategory,
                          formActionTarget : "/admin/sub-category/update/" + id,
                          status: 'Error',
                          customFieldErrors: customFieldErrors,
                          module: 'Admin Ads Data ',
                          submodule: 'Sub Categories',
                          title: 'Sub Category',
                          subtitle: 'Update',
                          link1: '/admin/sub-category/index'
                      });
            
                } else {
                                           
                  // =================================
                      return SubCategory.update(id, _formData).then(function (_updateSingle) {
                            req.flash('flashMsgSuccess', 'Sub-category Create Success.');
                            return res.redirect('/admin/sub-category/index');
              
                        }).catch(function (err) {
                              req.flash('flashMsgError', 'Error in Sub-category Update');
                              return res.view("admin/sub-category/new", {
                                flashMsgError: req.flash('flashMsgError'),
                                flashMsgSuccess: req.flash('flashMsgSuccess'),
                                data: sinExistdata,
                                allCategory: allCategory,
                                formActionTarget : "/admin/sub-category/update/" + id,
                                status: 'Error',
                                errorType: 'validation-error',
                                customFieldErrors: {},
                                module: 'Admin Ads Data ',
                                submodule: 'Sub Categories',
                                title: 'Sub Category',
                                subtitle: 'Update',
                                link1: '/admin/sub-category/index'
                              });
                            });// <--Create record Catch End
    
                       } //<--Validation Check Else End
                  // =================================
                });
            } //<--sinExistdata Else End
            
        }).catch(function(err){
          req.flash('flashMsgError', 'Error in Record update');
          return res.redirect('/admin/sub-category/index');
        });
      // =============Slug Create End=================
  
    },

    view: function (req, res) {
      var id = req.param('id');
      if (!id){
        req.flash('flashMsgError', 'Data Id Not Found');
        return res.redirect('/admin/sub-category/index');
      }
  
      SubCategory.findOne({id:id}).populate('category').then(function (singleData){
        if (!singleData) {
          req.flash('flashMsgError', 'Data Not Found In Database');
          return res.redirect('/admin/sub-category/index');
        }else{
          return res.view("admin/sub-category/view", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: singleData,
              moment: moment,
              module: 'Admin Ads Data ',
              submodule: 'Sub Categories',
              title: 'Sub Category',
              subtitle: 'View',
              link1: '/admin/sub-category/index'
          });
        }
      })
        .catch(function (err) {
          console.log('errr', err);
          req.flash('flashMsgError', 'Error In User View');
          return res.redirect('/admin/sub-category/index');
        });
    },

    delete : function (req, res) {
      let id = req.param('id');
      if (!id){
        req.flash('flashMsgError', 'ID not found');
        return res.redirect('/admin/sub-category/index');
      };
  
      Promise.all([
        SubCategory.findOne({id: id}),
      ]).spread(function(deleteData){
        if(!deleteData){
          req.flash('flashMsgError', 'Data Not found In Database');
          return res.redirect('/admin/sub-category/index');
        } else {
          deleteData.destroy().then(function (_deldata) {
            req.flash('flashMsgSuccess', 'Record Deleted Successfully.');
            return res.redirect('/admin/sub-category/index');
          });
        }
      }).catch(function(err){
        req.flash('flashMsgError', 'Error in Delete');
        return res.redirect('/admin/sub-category/index');
      });
  
    },


  

};

