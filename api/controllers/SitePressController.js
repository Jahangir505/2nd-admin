/**
 * SitePressController
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
                
        var qdata = {};
        var currentPage = req.param("page");
        if(!currentPage){
          currentPage = 1;
        }
    
        // var pageLimit = 5;
        // var pageLimit = 30;
        let pageLimit = req.param("page_limit") ? req.param("page_limit") : zeCommon.pageLimit; //how many items to show per page
        var paTitle = req.param("title") ? req.param("title").trim() : '';
        let paCategory = req.param("category") ? req.param("category").trim() : '';
        var paStatus = req.param("status") ? req.param("status").trim() : '';
        var paSortBy = req.param("sort_by") ? req.param("sort_by").trim() : 'ASC';
    
        if(paTitle){
          qdata.title = { 'like': '%'+paTitle+'%' };
        }
        if(paCategory){
            qdata.sitePressCategory = paCategory;
          }
                    
        if(paStatus){
          qdata.status = paStatus;
        }
    
        // =============Embaded Start===============
        return Promise.all([
          SitePress.count(qdata),
          SitePress.find(qdata).populate('sitePressCategory').populate('createdBy').paginate({page: currentPage, limit: pageLimit}).sort('id ' +paSortBy),
          SitePressCategory.find({status: 1},{select: ['name']}).sort('sort ASC'),
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
    
            return res.view("admin/site-press/index", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              alldata: alldata,
              allCategory: allCategory,
    
              moment: moment,
              module: 'Press ',
              submodule: 'Press',
              title: 'Press ',
              subtitle: 'All press',
              link1: '/admin/site-press/index/',
              // linkback1: '/admin/current-election/index/',
              linknew: '/admin/site-press/new/',
    
              paginateUrl: '/admin/site-press/index',
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
            req.flash('flashMsgError', 'Error In User Index');
            return res.redirect('/admin/site-press/index');
          });
        // =============Embaded End=================
    
      },
    
          
      new_old : function (req, res) {
        // console.log("Inside new..............");
        var _formData = {
          title: "",
          details: "",
          category: "",
          image: "",
          status: 0,
        };
      
        return res.view("admin/site-press/new", {
            flashMsgError: req.flash('flashMsgError'),
            flashMsgSuccess: req.flash('flashMsgSuccess'),
            data: _formData,
            formActionTarget : "/admin/site-press/create",
            status: 'OK',
            customFieldErrors: {},
            module: 'Press ',
            submodule: 'Press',
            title: 'Press ',
            subtitle: 'New',
            link1: '/admin/site-press/index'
        });
    
          
    
      },

      new : function (req, res) {
        // console.log("Inside new..............");
        var _formData = {
          title: "",
          details: "",
          category: "",
          image: "",
          status: 0,
        };
    
        Promise.all([
          SitePressCategory.find({status: 1},{select: ['name']}).sort('name ASC'),
        ])
          .spread(function(allCategory){
            return res.view("admin/site-press/new", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: _formData,
              allCategory: allCategory,
              formActionTarget : "/admin/site-press/create",
              status: 'OK',
              customFieldErrors: {},
              module: 'Press ',
              submodule: 'Press',
              title: 'Press ',
              subtitle: 'New',
              link1: '/admin/site-press/index'
            });
    
          }).catch(function(err){
          req.flash('flashMsgError', 'Error In New');
          return res.redirect('/admin/site-press/index');
        });
    
      },
    
      
      create : function (req, res) {
    
        let main_image = req.file('image');
        let oldImage = req.param("oldImage")  ? req.param("oldImage").trim() : '';
        var _formData = {
          
          title: req.param("title") ? req.param("title").trim() : '',
          sitePressCategory: req.param("category") ? req.param("category").trim() : '',
          details: req.param("details") ? req.param("details").trim() : '',
          status: (req.param("status") && req.param("status") > 0) ? req.param("status") : 0,
          createdBy: req.user.id,
          createdByObj: {email: req.user.email},
          updatedBy: '',
          updatedByObj: {email: ''}
        };
        //console.log('asas_formData',_formData);
    
        
    // =============Custom Error Start==================
    const customFieldErrors = {};
    
    
    if (!_formData.title) {
      customFieldErrors.title = {message: 'Title is Required'};
    }
    if (!_formData.sitePressCategory) {
        customFieldErrors.category = {message: 'Category is Required'};
    }
    if (!_formData.details) {
        customFieldErrors.details = {message: 'Details is Required'};
    }
    if (!_formData.status) {
      customFieldErrors.status = {message: 'Status is Required'};
    }

    let _creSlugData = {
        model: 'sitepress',
        type: 'slug',
        from: _formData.title,
        defaultValue: 'slug'
      };
      // =============Custom Error End====================
    
    
    let uploadSaveLocation = '.tmp/public/uploads/site-press';
    let uploadCopyLocation = 'assets/uploads/site-press';
    return Promise.all([
      SitePressCategory.find({status: 1},{select: ['name']}).sort('name ASC'),
      ZeFileUploadService.imageUploadForCreate(main_image, oldImage, 300, 400, uploadSaveLocation, uploadCopyLocation, false, 1), //<--For image upload
      ZeslugService.slugForCreate(_creSlugData), //<--Generate slug
      SitePress.findOne({category: _formData.category, title: _formData.title}), //<--For validation Check
    ])
      .spread(function(allCategory, main_image_Ret, creSlug, extTitle){
    //    console.log('extName is', extName);
          if(extTitle){
            customFieldErrors.title = {message: 'Title is already taken'};
          }
    
          _formData.slug = creSlug;
        // ******************** Image File Upload Start**********************
        // ============================ Image Strat===============================
        if(!main_image_Ret.errorFound){
          _formData.image = main_image_Ret.coreUploadFile;
          if(main_image_Ret.coreUploadFile == ''){
            customFieldErrors.image = {message: 'Image File is Requird'};
          }
        }else{
          _formData.image = main_image_Ret.coreUploadFile;
          customFieldErrors.image = {message: main_image_Ret.errorMessage};
        }
        // ============================ Image End=================================
        // ******************** Image File Upload End************************
        if (Object.keys(customFieldErrors).length) {
          console.log('eeee1', customFieldErrors);
          req.flash('errorMessage', 'Error in Create');
            return res.view('admin/site-press/new', {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: _formData,
              allCategory: allCategory,
              formActionTarget : "/admin/site-press/create",
              status: 'Error',
              customFieldErrors: customFieldErrors,
              fieldErrors: {},
              module: 'Press ',
              submodule: 'Press',
              title: 'Press ',
              subtitle: 'Create',
              link1: '/admin/site-press/index'
          });
    
        } else {
                  
          return SitePress.create(_formData).then(function (createData) {
              req.flash('flashMsgSuccess', 'User Create Success.');
              return res.redirect('/admin/site-press/index');
          }).catch(function (err) {
            console.log('err2', err);
            req.flash('flashMsgError', 'Error in User Create');
            // ===============
            return res.view("admin/site-press/new", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: _formData,
              allCategory: allCategory,
              formActionTarget : "/admin/site-press/create",
              status: 'Error',
              errorType: 'validation-error',
              customFieldErrors: {},
              fieldErrors: {},
              module: 'Press ',
              submodule: 'Press',
              title: 'Press ',
              subtitle: 'Create',
              link1: '/admin/site-press/index'
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
          return res.redirect('/admin/site-press/index');
        }
        Promise.all([
          SitePress.findOne({id:id}),
          SitePressCategory.find({status: 1},{select: ['name']}).sort('name ASC'),
        ])
          .spread(function(existSingleData, allCategory){
    
            if(!existSingleData){
              req.flash('flashMsgError', 'Record Not Found In Database');
              return res.redirect('/admin/site-press/index');
            } else {
                return res.view("admin/site-press/edit", {
                    flashMsgError: req.flash('flashMsgError'),
                    flashMsgSuccess: req.flash('flashMsgSuccess'),
                    data: existSingleData,
                    allCategory: allCategory,
                    formActionTarget : "/admin/site-press/update/" + id,
                    status: 'OK',
                    customFieldErrors: {},
                    module: 'Press ',
                    submodule: 'Press',
                    title: 'Press ',
                    subtitle: 'Edit',
                    link1: '/admin/site-press/index'
                });
            }
          }).catch(function(err){
          req.flash('flashMsgError', 'Error in Edit');
          return res.redirect('/admin/site-press/index');
        });
      },
     
    
      update: function (req, res) {
        // console.log('I m in Update');
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/site-press/index');
        };
    
        let main_image = req.file('image');
        let oldImage = req.param("oldImage")  ? req.param("oldImage").trim() : '';
    
        var _formData = {
            title: req.param("title") ? req.param("title").trim() : '',
            sitePressCategory: req.param("category") ? req.param("category").trim() : '',
            details: req.param("details") ? req.param("details").trim() : '',
            status: (req.param("status") && req.param("status") > 0) ? req.param("status") : 0,
    
            updatedBy: req.user.id,
            updatedByObj: {email: req.user.email}
          };
    
          // =============Custom Error Start==================
          const customFieldErrors = {};
          
          if (!_formData.title) {
            customFieldErrors.title = {message: 'Title is Required'};
          }

          if (!_formData.sitePressCategory) {
            customFieldErrors.category = {message: 'Category is Required'};
          }
          if (!_formData.details) {
            customFieldErrors.details = {message: 'Details is Required'};
          }
          
          if (!_formData.status) {
            customFieldErrors.status = {message: 'Status is Required'};
          }

          let _creSlugData = {
            model: 'sitepress',
            type: 'slug',
            from: _formData.title,
            defaultValue: 'slug'
          };
          
          console.log('_formData==', !_formData);
          
          
      
         // =============Custom Error End====================
    
        // =============Save Start=====================
            // #########################
            return SitePress.findOne({id:id}).then(function (sinExistdata){
              if (!sinExistdata) {
                req.flash('flashMsgError', 'Record Not found 11');
                return res.redirect('/admin/site-press/index');
              } else {
                let uploadSaveLocation = '.tmp/public/uploads/site-press';
                let uploadCopyLocation = 'assets/uploads/site-press';
                Promise.all([
                  SitePressCategory.find({status: 1},{select: ['name']}).sort('name ASC'),
                  ZeFileUploadService.imageUploadForCreate(main_image, oldImage, 200, 200, uploadSaveLocation, uploadCopyLocation, false, 1), //<--For image upload 
                  ZeslugService.slugForUpdate(_creSlugData),
                  SitePress.findOne({sitePressCategory: _formData.sitePressCategory, title: _formData.title}), //<--For validation Check     
                  ]).spread(function(allCategory, main_image_Ret, creSlug, extTitle) {
    
                    if(extTitle){
                        if(sinExistdata.id != extTitle.id){
                            customFieldErrors.title = {message: 'Title is already taken'};
                        }
                    }

                    if(sinExistdata.title != _formData.title){
                        _formData.slug = creSlug;
                    }
          
                    
                    // ******************** Image File Upload Start**********************
                  // ============================ Image Strat===============================
                  if(!main_image_Ret.errorFound){
                    _formData.image = main_image_Ret.coreUploadFile;
                    if(main_image_Ret.coreUploadFile == ''){
                      customFieldErrors.image = {message: 'Image File is Requird'};
                    }
                  }else{
                    _formData.image = main_image_Ret.coreUploadFile;
                    customFieldErrors.image = {message: main_image_Ret.errorMessage};
                  }
                  // ============================ Image End=================================
                  // ******************** Image File Upload End************************
    
                  if (Object.keys(customFieldErrors).length) {
                    console.log('_formData', _formData);
                        req.flash('errorMessage', 'Error in Update');
                          return res.view('admin/site-press/edit', {
                            flashMsgError: req.flash('flashMsgError'),
                            flashMsgSuccess: req.flash('flashMsgSuccess'),
                            data: _formData,
                            allCategory: allCategory,
                            formActionTarget : "/admin/site-press/update/" + id,
                            status: 'Error',
                            customFieldErrors: customFieldErrors,
                            module: 'Press ',
                            submodule: 'Press',
                            title: 'Press ',
                            subtitle: 'Update',
                            link1: '/admin/site-press/index'
                        });
              
                  } else {
                    // =================================
                        return SitePress.update(id, _formData).then(function (_updateSingle) {
                              req.flash('flashMsgSuccess', 'Record Create Success.');
                              return res.redirect('/admin/site-press/index');
                
                          }).catch(function (err) {
                                console.log('err 1', err);
                                req.flash('flashMsgError', 'Error in Sub-category Update');
                                return res.view("admin/site-press/new", {
                                    flashMsgError: req.flash('flashMsgError'),
                                    flashMsgSuccess: req.flash('flashMsgSuccess'),
                                    data: sinExistdata,
                                    allCategory: allCategory,
                                    formActionTarget : "/admin/site-press/update/" + id,
                                    status: 'Error',
                                    errorType: 'validation-error',
                                    customFieldErrors: {},
                                    module: 'Press ',
                                    submodule: 'Press',
                                    title: 'Press ',
                                    subtitle: 'Update',
                                    link1: '/admin/site-press/index'
                                });
                              });// <--Create record Catch End
      
                         } //<--Validation Check Else End
                    // =================================
                  });
              } //<--sinExistdata Else End
              
          }).catch(function(err){
            console.log('err 2', err);
            req.flash('flashMsgError', 'Error in Record update');
            return res.redirect('/admin/site-press/index');
          });
        // =============Slug Create End=================
    
      },
    
    
      view: function (req, res) {
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'User Id Not Found');
          return res.redirect('/admin/site-press/index');
        }
    
        SitePress.findOne({id:id}).populate('sitePressCategory').populate('createdBy').then(function (singleData){
          if (!singleData) {
            req.flash('flashMsgError', 'User Not Found In Database');
            return res.redirect('/admin/site-press/index');
          }else{
            return res.view("admin/site-press/view", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: singleData,
              moment: moment,
              module: 'Press ',
              submodule: 'Press',
              title: 'Press ',
              subtitle: 'View',
              link1: '/admin/site-press/index'
            });
          }
        })
          .catch(function (err) {
            req.flash('flashMsgError', 'Error In User View');
            return res.redirect('/admin/site-press/index');
          });
      },

      delete : function (req, res) {
        let id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/site-press/index');
        };
    
        Promise.all([
          SitePress.findOne({id: id}),
        ]).spread(function(deleteData){
          if(!deleteData){
            req.flash('flashMsgError', 'Data Not found In Database');
            return res.redirect('/admin/site-press/index');
          } else {
                deleteData.destroy().then(function (_deldata) {

                    let uploadSaveLocation = '.tmp/public/uploads/site-press';
                    let uploadCopyLocation = 'assets/uploads/site-press';

                    if(_deldata[0].image){
                        if(fs.existsSync(sails.config.appPath +'/'+uploadSaveLocation+'/'+ _deldata[0].image)){
                        fs.unlinkSync(sails.config.appPath +'/'+uploadSaveLocation+'/'+ _deldata[0].image);
                        }
                        if(fs.existsSync(sails.config.appPath +'/'+uploadCopyLocation+'/'+ _deldata[0].image)){
                        fs.unlinkSync(sails.config.appPath +'/'+uploadCopyLocation+'/'+ _deldata[0].image);
                        }

                    }
              req.flash('flashMsgSuccess', 'Record Deleted Successfully.');
              return res.redirect('/admin/site-press/index');
            });
          }
        //   if(stateHasData ){
        //     req.flash('flashMsgError', 'It Has Related Data You Cannot Delete It');
        //     return res.redirect('/admin/site-press/index');
        //   } else {
        //     deleteData.destroy().then(function (_deldata) {
        //       req.flash('flashMsgSuccess', 'Record Deleted Successfully.');
        //       return res.redirect('/admin/site-press/index');
        //     });
        //   }
        
        }).catch(function(err){
          req.flash('flashMsgError', 'Error in Delete');
          return res.redirect('/admin/site-press/index');
        });
    
      },

};

