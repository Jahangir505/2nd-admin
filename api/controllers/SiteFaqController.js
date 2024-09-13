/**
 * SiteFaqController
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
                
        var qdata = {};
        var currentPage = req.param("page");
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
          qdata.siteFaqCategory = paCategory;
        }
        if(paStatus){
          qdata.status = paStatus;
        }
    
        // =============Embaded Start===============
        return Promise.all([
          SiteFaq.count(qdata),
          SiteFaq.find(qdata).populate('siteFaqCategory').paginate({page: currentPage, limit: pageLimit}).sort('id ' +paSortBy),
          SiteFaqCategory.find({status: 1},{select: ['name']}).sort('sort ASC'),
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
    
            return res.view("admin/site-faq/index", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              alldata: alldata,
              allCategory: allCategory,
    
              moment: moment,
              module: 'FAQs ',
              submodule: 'FAQs',
              title: 'FAQ ',
              subtitle: 'All FAQs',
              link1: '/admin/site-faq/index/',
              // linkback1: '/admin/current-election/index/',
              linknew: '/admin/site-faq/new/',
    
              paginateUrl: '/admin/site-faq/index',
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
            return res.redirect('/admin/site-faq/index');
          });
        // =============Embaded End=================
    
      },
      new_old : function (req, res) {
        // console.log("Inside new..............");
        var _formData = {
          title: "",
          category: "",
          details: "",
          status: 0,
        };
      
        return res.view("admin/site-faq/new", {
            flashMsgError: req.flash('flashMsgError'),
            flashMsgSuccess: req.flash('flashMsgSuccess'),
            data: _formData,
            formActionTarget : "/admin/site-faq/create",
            status: 'OK',
            customFieldErrors: {},
            module: 'FAQs ',
            submodule: 'FAQs',
            title: 'FAQ ',
            subtitle: 'New',
            link1: '/admin/site-faq/index'
        });
    
      },
      new : function (req, res) {
        // console.log("Inside new..............");
        var _formData = {
          title: "",
          category: "",
          details: "",
          status: 0,
        };
    
        Promise.all([
          SiteFaqCategory.find({status: 1},{select: ['name']}).sort('name ASC'),
        ])
          .spread(function(allCategory){
            return res.view("admin/site-faq/new", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: _formData,
              allCategory: allCategory,
              formActionTarget : "/admin/site-faq/create",
              status: 'OK',
              customFieldErrors: {},
              module: 'FAQs ',
              submodule: 'FAQs',
              title: 'FAQ ',
              subtitle: 'New',
              link1: '/admin/site-faq/index'
            });
    
          }).catch(function(err){
          req.flash('flashMsgError', 'Error In New');
          return res.redirect('/admin/site-faq/index');
        });
    
      },
      create : function (req, res) {
    
        var _formData = {
          
          title: req.param("title") ? req.param("title").trim() : '',
          siteFaqCategory: req.param("category") ? req.param("category").trim() : 0,
          details: req.param("details") ? req.param("details").trim() : '',
          status: (req.param("status") && req.param("status") > 0) ? req.param("status") : 0,
          createdBy: req.user.id,
          createdByObj: {email: req.user.email},
          updatedBy: '',
          updatedByObj: {email: ''}
        };
        // console.log('asas_formData',_formData);
    
        
    // =============Custom Error Start==================
    const customFieldErrors = {};
    
    
    if (!_formData.title) {
      customFieldErrors.title = {message: 'Title is Required'};
    }
    if (!_formData.siteFaqCategory) {
        customFieldErrors.category = {message: 'Category is Required'};
    }
    if (!_formData.details) {
        customFieldErrors.details = {message: 'Details is Required'};
    }
    if (!_formData.status) {
      customFieldErrors.status = {message: 'Status is Required'};
    }

    let _creSlugData = {
        model: 'sitefaq',
        type: 'slug',
        from: _formData.title,
        defaultValue: 'slug'
      };
      // =============Custom Error End====================
    
    
    
    return Promise.all([
      SiteFaqCategory.find({status: 1},{select: ['name']}).sort('name ASC'),
      ZeslugService.slugForCreate(_creSlugData), //<--Generate slug
      SiteFaq.findOne({siteFaqCategory: _formData.siteFaqCategory, title: _formData.title}), //<--For validation Check
    ])
      .spread(function(allCategory, creSlug, extTitle){
    //    console.log('extName is', extName);
          if(extTitle){
            customFieldErrors.title = {message: 'Title is already taken'};
          }
    
          _formData.slug = creSlug;
        if (Object.keys(customFieldErrors).length) {
          console.log('eeee1', customFieldErrors);
          req.flash('errorMessage', 'Error in Create');
            return res.view('admin/site-faq/new', {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: _formData,
              allCategory: allCategory,
              formActionTarget : "/admin/site-faq/create",
              status: 'Error',
              customFieldErrors: customFieldErrors,
              fieldErrors: {},
              module: 'FAQs ',
              submodule: 'FAQs',
              title: 'FAQ ',
              subtitle: 'Create',
              link1: '/admin/site-faq/index'
          });
    
        } else {
                  
          return SiteFaq.create(_formData).then(function (createData) {
              req.flash('flashMsgSuccess', 'User Create Success.');
              return res.redirect('/admin/site-faq/index');
          }).catch(function (err) {
            console.log('err2', err);
            req.flash('flashMsgError', 'Error in User Create');
            // ===============
            return res.view("admin/site-faq/new", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: _formData,
              allCategory: allCategory,
              formActionTarget : "/admin/site-faq/create",
              status: 'Error',
              errorType: 'validation-error',
              customFieldErrors: {},
              fieldErrors: {},
              module: 'FAQs ',
              submodule: 'FAQs',
              title: 'FAQ ',
              subtitle: 'Create',
              link1: '/admin/site-faq/index'
            });
      
          });// ------catch End----
        }
      });
    // =============Promisses End=======================
      },
      edit: function (req, res) {
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/site-faq/index');
        }
        Promise.all([
          SiteFaq.findOne({id:id}),
          SiteFaqCategory.find({status: 1},{select: ['name']}).sort('name ASC'),
        ])
          .spread(function(existSingleData, allCategory){
            // console.log('existSingleData', existSingleData);
            // console.log('allCategory', allCategory);
            if(!existSingleData){
              req.flash('flashMsgError', 'Record Not Found In Database');
              return res.redirect('/admin/site-faq/index');
            } else {
                return res.view("admin/site-faq/edit", {
                    flashMsgError: req.flash('flashMsgError'),
                    flashMsgSuccess: req.flash('flashMsgSuccess'),
                    data: existSingleData,
                    allCategory: allCategory,
                    formActionTarget : "/admin/site-faq/update/" + id,
                    status: 'OK',
                    customFieldErrors: {},
                    module: 'FAQs ',
                    submodule: 'FAQs',
                    title: 'FAQ ',
                    subtitle: 'Edit',
                    link1: '/admin/site-faq/index'
                });
            }
          }).catch(function(err){
          req.flash('flashMsgError', 'Error in Edit');
          return res.redirect('/admin/site-faq/index');
        });
      },
      update: function (req, res) {
        // console.log('I m in Update');
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/site-faq/index');
        };
    
       
        let _formData = {
            title: req.param("title") ? req.param("title").trim() : '',
            siteFaqCategory: req.param("category") ? req.param("category").trim() : '',
            details: req.param("details") ? req.param("details").trim() : '',
            status: (req.param("status") && req.param("status") > 0) ? req.param("status") : 0,
    
            updatedBy: req.user.id,
            updatedByObj: {email: req.user.email}
          };
          console.log('aaaaaa',_formData);
    
          // =============Custom Error Start==================
          const customFieldErrors = {};
          
          if (!_formData.title) {
            customFieldErrors.title = {message: 'Title is Required'};
          }

          if (!_formData.siteFaqCategory) {
            customFieldErrors.category = {message: 'Category is Required'};
          }
          if (!_formData.details) {
            customFieldErrors.details = {message: 'Details is Required'};
          }
          
          if (!_formData.status) {
            customFieldErrors.status = {message: 'Status is Required'};
          }

          let _creSlugData = {
            model: 'sitefaq',
            type: 'slug',
            from: _formData.title,
            defaultValue: 'slug'
          };
          
          console.log('_formData==', _formData);
          
          
      
         // =============Custom Error End====================
    
        // =============Save Start=====================
            // #########################
            return SiteFaq.findOne({id:id}).then(function (sinExistdata){
              if (!sinExistdata) {
                req.flash('flashMsgError', 'Record Not found 11');
                return res.redirect('/admin/site-faq/index');
              } else {
                
                Promise.all([
                  SiteFaqCategory.find({status: 1},{select: ['name']}).sort('name ASC'),
                  ZeslugService.slugForUpdate(_creSlugData),
                  SiteFaq.findOne({siteFaqCategory: _formData.siteFaqCategory, title: _formData.title}), //<--For validation Check     
                  ]).spread(function(allCategory, creSlug, extTitle) {
    
                    if(extTitle){
                        if(sinExistdata.id != extTitle.id){
                            customFieldErrors.title = {message: 'Title is already taken'};
                        }
                    }

                    if(sinExistdata.title != _formData.title){
                        _formData.slug = creSlug;
                    }
          
                    
                    
                  if (Object.keys(customFieldErrors).length) {
                    console.log('_formData', _formData);
                        req.flash('errorMessage', 'Error in Update');
                          return res.view('admin/site-faq/edit', {
                            flashMsgError: req.flash('flashMsgError'),
                            flashMsgSuccess: req.flash('flashMsgSuccess'),
                            data: _formData,
                            allCategory: allCategory,
                            formActionTarget : "/admin/site-faq/update/" + id,
                            status: 'Error',
                            customFieldErrors: customFieldErrors,
                            module: 'FAQs ',
                            submodule: 'FAQs',
                            title: 'FAQ ',
                            subtitle: 'Update',
                            link1: '/admin/site-faq/index'
                        });
              
                  } else {
                    // =================================
                        return SiteFaq.update(id, _formData).then(function (_updateSingle) {
                              req.flash('flashMsgSuccess', 'Record Create Success.');
                              return res.redirect('/admin/site-faq/index');
                
                          }).catch(function (err) {
                                console.log('err 1', err);
                                req.flash('flashMsgError', 'Error in Sub-category Update');
                                return res.view("admin/site-faq/new", {
                                    flashMsgError: req.flash('flashMsgError'),
                                    flashMsgSuccess: req.flash('flashMsgSuccess'),
                                    data: sinExistdata,
                                    allCategory:allCategory,
                                    formActionTarget : "/admin/site-faq/update/" + id,
                                    status: 'Error',
                                    errorType: 'validation-error',
                                    customFieldErrors: {},
                                    module: 'FAQs ',
                                    submodule: 'FAQs',
                                    title: 'FAQ ',
                                    subtitle: 'Update',
                                    link1: '/admin/site-faq/index'
                                });
                              });// <--Create record Catch End
      
                         } //<--Validation Check Else End
                    // =================================
                  });
              } //<--sinExistdata Else End
              
          }).catch(function(err){
            console.log('err 2', err);
            req.flash('flashMsgError', 'Error in Record update');
            return res.redirect('/admin/site-faq/index');
          });
        // =============Slug Create End=================
    
      },
      view: function (req, res) {
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'User Id Not Found');
          return res.redirect('/admin/site-faq/index');
        }
    
        SiteFaq.findOne({id:id}).then(function (singleData){
          if (!singleData) {
            req.flash('flashMsgError', 'User Not Found In Database');
            return res.redirect('/admin/site-faq/index');
          }else{
            return res.view("admin/site-faq/view", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: singleData,
              moment: moment,
              module: 'FAQs ',
              submodule: 'FAQs',
              title: 'FAQ ',
              subtitle: 'View',
              link1: '/admin/site-faq/index'
            });
          }
        })
          .catch(function (err) {
            req.flash('flashMsgError', 'Error In User View');
            return res.redirect('/admin/site-faq/index');
          });
      },
      delete : function (req, res) {
        let id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/site-faq/index');
        };
    
        Promise.all([
          SiteFaq.findOne({id: id}),
        ]).spread(function(deleteData){
          if(!deleteData){
            req.flash('flashMsgError', 'Data Not found In Database');
            return res.redirect('/admin/site-faq/index');
          } else {
                deleteData.destroy().then(function (_deldata) {

              req.flash('flashMsgSuccess', 'Record Deleted Successfully.');
              return res.redirect('/admin/site-faq/index');
            });
          }
        //   if(stateHasData ){
        //     req.flash('flashMsgError', 'It Has Related Data You Cannot Delete It');
        //     return res.redirect('/admin/site-faq/index');
        //   } else {
        //     deleteData.destroy().then(function (_deldata) {
        //       req.flash('flashMsgSuccess', 'Record Deleted Successfully.');
        //       return res.redirect('/admin/site-faq/index');
        //     });
        //   }
        
        }).catch(function(err){
          req.flash('flashMsgError', 'Error in Delete');
          return res.redirect('/admin/site-faq/index');
        });
    
      },

};

