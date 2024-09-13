/**
 * BlogController
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
          Blog.count(qdata),
          Blog.find(qdata).populate('blogCategory').populate('createdBy').paginate({page: currentPage, limit: pageLimit}).sort('id ' +paSortBy),
          BlogCategory.find({status: 1},{select: ['name']}).sort('sort ASC'),
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
    
            return res.view("admin/blog/index", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              alldata: alldata,
              allCategory: allCategory,
    
              moment: moment,
              module: 'Blogs',
              submodule: 'Blog',
              title: 'Blog',
              subtitle: 'All Blog',
              link1: '/admin/blog/index/',
              // linkback1: '/admin/current-election/index/',
              linknew: '/admin/blog/new/',
    
              paginateUrl: '/admin/blog/index',
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
            return res.redirect('/admin/blog/index');
          });
        // =============Embaded End=================
    
      },
    
          
      

      new : function (req, res) {
        // console.log("Inside new..............");
        var _formData = {
          title: "",
          details: "",
          category: "",
          blog_type: "",
          image: "",
          status: 0,
        };
    
        Promise.all([
          BlogCategory.find({status: 1},{select: ['name']}).sort('name ASC'),
        ])
          .spread(function(allCategory){
            return res.view("admin/blog/new", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: _formData,
              allCategory: allCategory,
              formActionTarget : "/admin/blog/create",
              status: 'OK',
              customFieldErrors: {},
              module: 'Blogs',
              submodule: 'Blog',
              title: 'Blog',
              subtitle: 'New',
              link1: '/admin/blog/index'
            });
    
          }).catch(function(err){
          req.flash('flashMsgError', 'Error In New');
          return res.redirect('/admin/blog/index');
        });
    
      },
    
      
      create : function (req, res) {
    
        let main_image = req.file('image');
        let oldImage = req.param("oldImage")  ? req.param("oldImage").trim() : '';
        var _formData = {
          
        //   title: req.param("title") ? req.param("title").toLowerCase() : '',
          title: req.param("title") ? req.param("title").trim() : '',
          blogCategory: req.param("category") ? req.param("category").trim() : '',
          blog_type: (req.param("blog_type") && req.param("blog_type") > 0) ? req.param("blog_type") : 0,
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
    if (!_formData.blogCategory) {
        customFieldErrors.category = {message: 'Category is Required'};
    }
    // if (!_formData.blog_type) {
    //     customFieldErrors.blog_type = {message: 'Blog Type is Required'};
    // }
    if (!_formData.details) {
        customFieldErrors.details = {message: 'Details is Required'};
    }
    if (!_formData.status) {
      customFieldErrors.status = {message: 'Status is Required'};
    }

    let _creSlugData = {
        model: 'blog',
        type: 'slug',
        from: _formData.title,
        defaultValue: 'slug'
      };
      // =============Custom Error End====================
    
    
    let uploadSaveLocation = '.tmp/public/uploads/blog-image';
    let uploadCopyLocation = 'assets/uploads/blog-image';
    return Promise.all([
      BlogCategory.find({status: 1},{select: ['name']}).sort('name ASC'),
      ZeFileUploadService.imageUploadForCreate(main_image, oldImage, 300, 400, uploadSaveLocation, uploadCopyLocation, false, 1), //<--For image upload
      ZeslugService.slugForCreate(_creSlugData), //<--Generate slug
      Blog.findOne({category: _formData.category, title: _formData.title}), //<--For validation Check
    ])
      .spread(function(allCategory, main_image_Ret, creSlug, extTitle){
    //    console.log('extName is', extName);
        //   if(extTitle){
        //     customFieldErrors.title = {message: 'Title is already taken'};
        //   }
    
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
            return res.view('admin/blog/new', {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: _formData,
              allCategory: allCategory,
              formActionTarget : "/admin/blog/create",
              status: 'Error',
              customFieldErrors: customFieldErrors,
              fieldErrors: {},
              module: 'Blogs',
              submodule: 'Blog',
              title: 'Blog',
              subtitle: 'Create',
              link1: '/admin/blog/index'
          });
    
        } else {
                  
          return Blog.create(_formData).then(function (createData) {
              req.flash('flashMsgSuccess', 'User Create Success.');
              return res.redirect('/admin/blog/index');
          }).catch(function (err) {
            console.log('err2', err);
            req.flash('flashMsgError', 'Error in User Create');
            // ===============
            return res.view("admin/blog/new", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: _formData,
              allCategory: allCategory,
              formActionTarget : "/admin/blog/create",
              status: 'Error',
              errorType: 'validation-error',
              customFieldErrors: {},
              fieldErrors: {},
              module: 'Blogs',
              submodule: 'Blog',
              title: 'Blog',
              subtitle: 'Create',
              link1: '/admin/blog/index'
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
          return res.redirect('/admin/blog/index');
        }
        Promise.all([
          Blog.findOne({id:id}),
          BlogCategory.find({status: 1},{select: ['name']}).sort('name ASC'),
        ])
          .spread(function(existSingleData, allCategory){
    
            if(!existSingleData){
              req.flash('flashMsgError', 'Record Not Found In Database');
              return res.redirect('/admin/blog/index');
            } else {
                return res.view("admin/blog/edit", {
                    flashMsgError: req.flash('flashMsgError'),
                    flashMsgSuccess: req.flash('flashMsgSuccess'),
                    data: existSingleData,
                    allCategory: allCategory,
                    formActionTarget : "/admin/blog/update/" + id,
                    status: 'OK',
                    customFieldErrors: {},
                    module: 'Blogs',
                    submodule: 'Blog',
                    title: 'Blog',
                    subtitle: 'Edit',
                    link1: '/admin/blog/index'
                });
            }
          }).catch(function(err){
          req.flash('flashMsgError', 'Error in Edit');
          return res.redirect('/admin/blog/index');
        });
      },
     
    
      update: function (req, res) {
        // console.log('I m in Update');
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/blog/index');
        };
    
        let main_image = req.file('image');
        let oldImage = req.param("oldImage")  ? req.param("oldImage").trim() : '';
    
        var _formData = {
            // title: req.param("title") ? req.param("title").toLowerCase() : '',
            title: req.param("title") ? req.param("title").trim() : '',
            blogCategory: req.param("category") ? req.param("category").trim() : '',
            blog_type: (req.param("blog_type") && req.param("blog_type") > 0) ? req.param("blog_type") : 0,
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

          if (!_formData.blogCategory) {
            customFieldErrors.category = {message: 'Category is Required'};
          }
          // if (!_formData.blog_type) {
          //   customFieldErrors.blog_type = {message: 'Blog Type is Required'};
          // }
          if (!_formData.details) {
            customFieldErrors.details = {message: 'Details is Required'};
          }
          
          if (!_formData.status) {
            customFieldErrors.status = {message: 'Status is Required'};
          }

          let _creSlugData = {
            model: 'blog',
            type: 'slug',
            from: _formData.title,
            defaultValue: 'slug'
          };
          
          console.log('_formData==', !_formData);
          
          
      
         // =============Custom Error End====================
    
        // =============Save Start=====================
            // #########################
            return Blog.findOne({id:id}).then(function (sinExistdata){
              if (!sinExistdata) {
                req.flash('flashMsgError', 'Record Not found 11');
                return res.redirect('/admin/blog/index');
              } else {
                let uploadSaveLocation = '.tmp/public/uploads/blog-image';
                let uploadCopyLocation = 'assets/uploads/blog-image';
                Promise.all([
                  BlogCategory.find({status: 1},{select: ['name']}).sort('name ASC'),
                  ZeFileUploadService.imageUploadForCreate(main_image, oldImage, 200, 200, uploadSaveLocation, uploadCopyLocation, false, 1), //<--For image upload 
                  ZeslugService.slugForUpdate(_creSlugData),
                  Blog.findOne({sitePressCategory: _formData.sitePressCategory, title: _formData.title}), //<--For validation Check     
                  ]).spread(function(allCategory, main_image_Ret, creSlug, extTitle) {
    
                    // if(extTitle){
                    //     if(sinExistdata.id != extTitle.id){
                    //         customFieldErrors.title = {message: 'Title is already taken'};
                    //     }
                    // }

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
                          return res.view('admin/blog/edit', {
                            flashMsgError: req.flash('flashMsgError'),
                            flashMsgSuccess: req.flash('flashMsgSuccess'),
                            data: _formData,
                            allCategory: allCategory,
                            formActionTarget : "/admin/blog/update/" + id,
                            status: 'Error',
                            customFieldErrors: customFieldErrors,
                            module: 'Blogs',
                            submodule: 'Blog',
                            title: 'Blog',
                            subtitle: 'Update',
                            link1: '/admin/blog/index'
                        });
              
                  } else {
                    // =================================
                        return Blog.update(id, _formData).then(function (_updateSingle) {
                              req.flash('flashMsgSuccess', 'Record Create Success.');
                              return res.redirect('/admin/blog/index');
                
                          }).catch(function (err) {
                                console.log('err 1', err);
                                req.flash('flashMsgError', 'Error in Sub-category Update');
                                return res.view("admin/blog/new", {
                                    flashMsgError: req.flash('flashMsgError'),
                                    flashMsgSuccess: req.flash('flashMsgSuccess'),
                                    data: sinExistdata,
                                    allCategory: allCategory,
                                    formActionTarget : "/admin/blog/update/" + id,
                                    status: 'Error',
                                    errorType: 'validation-error',
                                    customFieldErrors: {},
                                    module: 'Blogs',
                                    submodule: 'Blog',
                                    title: 'Blog',
                                    subtitle: 'Update',
                                    link1: '/admin/blog/index'
                                });
                              });// <--Create record Catch End
      
                         } //<--Validation Check Else End
                    // =================================
                  });
              } //<--sinExistdata Else End
              
          }).catch(function(err){
            console.log('err 2', err);
            req.flash('flashMsgError', 'Error in Record update');
            return res.redirect('/admin/blog/index');
          });
        // =============Slug Create End=================
    
      },
    
    
      view: function (req, res) {
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'User Id Not Found');
          return res.redirect('/admin/blog/index');
        }
    
        Blog.findOne({id:id}).populate('blogCategory').populate('blogComment').populate('createdBy').then(function (singleData){
          if (!singleData) {
            req.flash('flashMsgError', 'User Not Found In Database');
            return res.redirect('/admin/blog/index');
          }else{
            return res.view("admin/blog/view", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: singleData,
              moment: moment,
              module: 'Blogs',
                    submodule: 'Blog',
                    title: 'Blog',
              subtitle: 'View',
              link1: '/admin/blog/index'
            });
          }
        })
          .catch(function (err) {
            req.flash('flashMsgError', 'Error In User View');
            return res.redirect('/admin/blog/index');
          });
      },

      delete : function (req, res) {
        let id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/blog/index');
        };
    
        Promise.all([
          Blog.findOne({id: id}),
        ]).spread(function(deleteData){
          if(!deleteData){
            req.flash('flashMsgError', 'Data Not found In Database');
            return res.redirect('/admin/blog/index');
          } else {
                deleteData.destroy().then(function (_deldata) {

                    let uploadSaveLocation = '.tmp/public/uploads/blog-image';
                    let uploadCopyLocation = 'assets/uploads/blog-image';

                    if(_deldata[0].image){
                        if(fs.existsSync(sails.config.appPath +'/'+uploadSaveLocation+'/'+ _deldata[0].image)){
                        fs.unlinkSync(sails.config.appPath +'/'+uploadSaveLocation+'/'+ _deldata[0].image);
                        }
                        if(fs.existsSync(sails.config.appPath +'/'+uploadCopyLocation+'/'+ _deldata[0].image)){
                        fs.unlinkSync(sails.config.appPath +'/'+uploadCopyLocation+'/'+ _deldata[0].image);
                        }

                    }
              req.flash('flashMsgSuccess', 'Record Deleted Successfully.');
              return res.redirect('/admin/blog/index');
            });
          }
        //   if(stateHasData ){
        //     req.flash('flashMsgError', 'It Has Related Data You Cannot Delete It');
        //     return res.redirect('/admin/blog/index');
        //   } else {
        //     deleteData.destroy().then(function (_deldata) {
        //       req.flash('flashMsgSuccess', 'Record Deleted Successfully.');
        //       return res.redirect('/admin/blog/index');
        //     });
        //   }
        
        }).catch(function(err){
          req.flash('flashMsgError', 'Error in Delete');
          return res.redirect('/admin/blog/index');
        });
    
      },


};

