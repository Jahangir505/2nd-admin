/**
 * HelpCenterController
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
        let paTopicName = req.param("topic_name") ? req.param("topic_name").trim() : '';
        let paCategory = req.param("category") ? req.param("category").trim() : '';
        let paStatus = req.param("status") ? req.param("status").trim() : '';
        let paSortBy = req.param("sort_by") ? req.param("sort_by").trim() : 'ASC';
    
        if(paTopicName){
          qdata.topic_name = { 'like': '%'+paTopicName+'%' };
        }
        
                    
        if(paCategory){
          qdata.helpCenterCategory = paCategory;
        }
        if(paStatus){
          qdata.status = paStatus;
        }
    
        // =============Embaded Start===============
        return Promise.all([
            HelpCenter.count(qdata),
            HelpCenter.find(qdata).populate('helpCenterCategory').paginate({page: currentPage, limit: pageLimit}).sort('id ' +paSortBy),
            HelpCenterCategory.find({status: 1},{select: ['name']}).sort('sort ASC'),
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
    
            return res.view("admin/help-center/index", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              alldata: alldata,
              allCategory: allCategory,
    
              moment: moment,
              module: 'Help Center',
                submodule: 'All Topic',
                title: 'All Topic',
                subtitle: 'Index',
              link1: '/admin/help-center/index/',
              // linkback1: '/admin/current-election/index/',
              linknew: '/admin/help-center/new/',
    
              paginateUrl: '/admin/help-center/index',
              pageLimit: pageLimit, // Per page how much i want to see,
              pageCount: pageCount, // How many page in this index e.x: if total record 20 and page size 4 it will be 20/4(totalrecord/pageSize) // This is last page
              currentPage: currentPage,
              adjacents: 2,
              lpm1: pageCount - 1,
    
              paTopicName: paTopicName,
              paCategory: paCategory,
              paStatus: paStatus,
              paSortBy: paSortBy,
              totalCount: totalCount,
              paginateVariable : '&topic_name='+paTopicName+'&category='+paCategory+'&status='+paStatus+'&sort_by='+paSortBy+'&page_limit='+pageLimit,
    
            });
    
            // **************************
          }).catch(function(err){
            console.log(err);
            req.flash('flashMsgError', 'Error In User Index');
            return res.redirect('/admin/help-center/index');
          });
        // =============Embaded End=================
    
      },
      
      new : function (req, res) {
        // console.log("Inside new..............");
        var _formData = {
            topic_name: "",
          category: "",
          description: "",
          status: 0,
        };
    
        Promise.all([
          HelpCenterCategory.find({status: 1},{select: ['name']}).sort('name ASC'),
        ])
          .spread(function(allCategory){
            return res.view("admin/help-center/new", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: _formData,
              allCategory: allCategory,
              formActionTarget : "/admin/help-center/create",
              status: 'OK',
              customFieldErrors: {},
              module: 'FAQs ',
              submodule: 'FAQs',
              title: 'FAQ ',
              subtitle: 'New',
              link1: '/admin/help-center/index'
            });
    
          }).catch(function(err){
          req.flash('flashMsgError', 'Error In New');
          return res.redirect('/admin/help-center/index');
        });
    
      },
      create : function (req, res) {
    
        var _formData = {
          
            topic_name: req.param("topic_name") ? req.param("topic_name").trim() : '',
          helpCenterCategory: req.param("category") ? req.param("category").trim() : 0,
          description: req.param("description") ? req.param("description").trim() : '',
          status: (req.param("status") && req.param("status") > 0) ? req.param("status") : 0,
          createdBy: req.user.id,
          createdByObj: {email: req.user.email},
          updatedBy: '',
          updatedByObj: {email: ''}
        };
        // console.log('asas_formData',_formData);
    
        
    // =============Custom Error Start==================
    const customFieldErrors = {};
    
    
    if (!_formData.topic_name) {
      customFieldErrors.topic_name = {message: 'Topic Name is Required'};
    }
    if (!_formData.helpCenterCategory) {
        customFieldErrors.category = {message: 'Category is Required'};
    }
    if (!_formData.description) {
        customFieldErrors.description = {message: 'Description is Required'};
    }
    if (!_formData.status) {
      customFieldErrors.status = {message: 'Status is Required'};
    }

    let _creSlugData = {
        model: 'helpcenter',
        type: 'slug',
        from: _formData.topic_name,
        defaultValue: 'slug'
      };
      // =============Custom Error End====================
    
    
    
    return Promise.all([
      HelpCenterCategory.find({status: 1},{select: ['name']}).sort('name ASC'),
      ZeslugService.slugForCreate(_creSlugData), //<--Generate slug
      HelpCenter.findOne({helpCenterCategory: _formData.helpCenterCategory, title: _formData.topic_name}), //<--For validation Check
    ])
      .spread(function(allCategory, creSlug, extTopicName){
    //    console.log('extName is', extName);
          if(extTopicName){
            customFieldErrors.topic_name = {message: 'Topic Name is already taken'};
          }
    
          _formData.slug = creSlug;
        if (Object.keys(customFieldErrors).length) {
        //   console.log('eeee1', customFieldErrors);
          req.flash('errorMessage', 'Error in Create');
            return res.view('admin/help-center/new', {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: _formData,
              allCategory: allCategory,
              formActionTarget : "/admin/help-center/create",
              status: 'Error',
              customFieldErrors: customFieldErrors,
              fieldErrors: {},
              module: 'Help Center',
                submodule: 'All Topic',
                title: 'All Topic',
              subtitle: 'Create',
              link1: '/admin/help-center/index'
          });
    
        } else {
                  
          return HelpCenter.create(_formData).then(function (createData) {
              req.flash('flashMsgSuccess', 'User Create Success.');
              return res.redirect('/admin/help-center/index');
          }).catch(function (err) {
            console.log('err2', err);
            req.flash('flashMsgError', 'Error in User Create');
            // ===============
            return res.view("admin/help-center/new", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: _formData,
              allCategory: allCategory,
              formActionTarget : "/admin/help-center/create",
              status: 'Error',
              errorType: 'validation-error',
              customFieldErrors: {},
              fieldErrors: {},
              module: 'Help Center',
                submodule: 'All Topic',
                title: 'All Topic',
              subtitle: 'Create',
              link1: '/admin/help-center/index'
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
          return res.redirect('/admin/help-center/index');
        }
        Promise.all([
          HelpCenter.findOne({id:id}),
          HelpCenterCategory.find({status: 1},{select: ['name']}).sort('name ASC'),
        ])
          .spread(function(existSingleData, allCategory){
            // console.log('existSingleData', existSingleData);
            // console.log('allCategory', allCategory);
            if(!existSingleData){
              req.flash('flashMsgError', 'Record Not Found In Database');
              return res.redirect('/admin/help-center/index');
            } else {
                return res.view("admin/help-center/edit", {
                    flashMsgError: req.flash('flashMsgError'),
                    flashMsgSuccess: req.flash('flashMsgSuccess'),
                    data: existSingleData,
                    allCategory: allCategory,
                    formActionTarget : "/admin/help-center/update/" + id,
                    status: 'OK',
                    customFieldErrors: {},
                    module: 'Help Center',
                    submodule: 'All Topic',
                    title: 'All Topic',
                    subtitle: 'Edit',
                    link1: '/admin/help-center/index'
                });
            }
          }).catch(function(err){
          req.flash('flashMsgError', 'Error in Edit');
          return res.redirect('/admin/help-center/index');
        });
      },
      update: function (req, res) {
        // console.log('I m in Update');
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/help-center/index');
        };
    
       
        let _formData = {
            topic_name: req.param("topic_name") ? req.param("topic_name").trim() : '',
            helpCenterCategory: req.param("category") ? req.param("category").trim() : '',
            description: req.param("description") ? req.param("description").trim() : '',
            status: (req.param("status") && req.param("status") > 0) ? req.param("status") : 0,
    
            updatedBy: req.user.id,
            updatedByObj: {email: req.user.email}
          };
        //   console.log('aaaaaa',_formData);
    
          // =============Custom Error Start==================
          const customFieldErrors = {};
          
          if (!_formData.topic_name) {
            customFieldErrors.topic_name = {message: 'Topic Name is Required'};
          }

          if (!_formData.helpCenterCategory) {
            customFieldErrors.category = {message: 'Category is Required'};
          }
          if (!_formData.description) {
            customFieldErrors.description = {message: 'Description is Required'};
          }
          
          if (!_formData.status) {
            customFieldErrors.status = {message: 'Status is Required'};
          }

          let _creSlugData = {
            model: 'helpcenter',
            type: 'slug',
            from: _formData.topic_name,
            defaultValue: 'slug'
          };
          
        //   console.log('_formData==', _formData);
          
          
      
         // =============Custom Error End====================
    
        // =============Save Start=====================
            // #########################
            return HelpCenter.findOne({id:id}).then(function (sinExistdata){
              if (!sinExistdata) {
                req.flash('flashMsgError', 'Record Not found 11');
                return res.redirect('/admin/help-center/index');
              } else {
                
                Promise.all([
                    HelpCenterCategory.find({status: 1},{select: ['name']}).sort('name ASC'),
                  ZeslugService.slugForUpdate(_creSlugData),
                  HelpCenter.findOne({helpCenterCategory: _formData.helpCenterCategory, title: _formData.topic_name}), //<--For validation Check     
                  ]).spread(function(allCategory, creSlug, extTopicName) {
    
                    if(extTopicName){
                        if(sinExistdata.id != extTopicName.id){
                            customFieldErrors.topic_name = {message: 'Topic Name is already taken'};
                        }
                    }

                    if(sinExistdata.topic_name != _formData.topic_name){
                        _formData.slug = creSlug;
                    }
          
                    
                    
                  if (Object.keys(customFieldErrors).length) {
                    console.log('_formData', _formData);
                        req.flash('errorMessage', 'Error in Update');
                          return res.view('admin/help-center/edit', {
                            flashMsgError: req.flash('flashMsgError'),
                            flashMsgSuccess: req.flash('flashMsgSuccess'),
                            data: _formData,
                            allCategory: allCategory,
                            formActionTarget : "/admin/help-center/update/" + id,
                            status: 'Error',
                            customFieldErrors: customFieldErrors,
                            module: 'Help Center',
                            submodule: 'All Topic',
                            title: 'All Topic',
                            subtitle: 'Update',
                            link1: '/admin/help-center/index'
                        });
              
                  } else {
                    // =================================
                        return HelpCenter.update(id, _formData).then(function (_updateSingle) {
                              req.flash('flashMsgSuccess', 'Record Create Success.');
                              return res.redirect('/admin/help-center/index');
                
                          }).catch(function (err) {
                                console.log('err 1', err);
                                req.flash('flashMsgError', 'Error in Sub-category Update');
                                return res.view("admin/help-center/new", {
                                    flashMsgError: req.flash('flashMsgError'),
                                    flashMsgSuccess: req.flash('flashMsgSuccess'),
                                    data: sinExistdata,
                                    allCategory:allCategory,
                                    formActionTarget : "/admin/help-center/update/" + id,
                                    status: 'Error',
                                    errorType: 'validation-error',
                                    customFieldErrors: {},
                                    module: 'Help Center',
                                    submodule: 'All Topic',
                                    title: 'All Topic',
                                    subtitle: 'Update',
                                    link1: '/admin/help-center/index'
                                });
                              });// <--Create record Catch End
      
                         } //<--Validation Check Else End
                    // =================================
                  });
              } //<--sinExistdata Else End
              
          }).catch(function(err){
            console.log('err 2', err);
            req.flash('flashMsgError', 'Error in Record update');
            return res.redirect('/admin/help-center/index');
          });
        // =============Slug Create End=================
    
      },
      view: function (req, res) {
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'User Id Not Found');
          return res.redirect('/admin/help-center/index');
        }
    
        HelpCenter.findOne({id:id}).then(function (singleData){
          if (!singleData) {
            req.flash('flashMsgError', 'User Not Found In Database');
            return res.redirect('/admin/help-center/index');
          }else{
            return res.view("admin/help-center/view", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: singleData,
              moment: moment,
              module: 'Help Center',
                submodule: 'All Topic',
                title: 'All Topic',
              subtitle: 'View',
              link1: '/admin/help-center/index'
            });
          }
        })
          .catch(function (err) {
            req.flash('flashMsgError', 'Error In User View');
            return res.redirect('/admin/help-center/index');
          });
      },
      delete : function (req, res) {
        let id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/help-center/index');
        };
    
        Promise.all([
          HelpCenter.findOne({id: id}),
        ]).spread(function(deleteData){
          if(!deleteData){
            req.flash('flashMsgError', 'Data Not found In Database');
            return res.redirect('/admin/help-center/index');
          } else {
                deleteData.destroy().then(function (_deldata) {

              req.flash('flashMsgSuccess', 'Record Deleted Successfully.');
              return res.redirect('/admin/help-center/index');
            });
          }
        //   if(stateHasData ){
        //     req.flash('flashMsgError', 'It Has Related Data You Cannot Delete It');
        //     return res.redirect('/admin/help-center/index');
        //   } else {
        //     deleteData.destroy().then(function (_deldata) {
        //       req.flash('flashMsgSuccess', 'Record Deleted Successfully.');
        //       return res.redirect('/admin/help-center/index');
        //     });
        //   }
        
        }).catch(function(err){
          req.flash('flashMsgError', 'Error in Delete');
          return res.redirect('/admin/help-center/index');
        });
    
      },

};

