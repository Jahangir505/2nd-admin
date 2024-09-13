/**
 * AmenityController
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
  //  console.log('i am at index');
        var qdata = {
        };
    
        var currentPage = req.param("page");
        if(!currentPage){
          currentPage = 1;
        }
    
        // var pageLimit = 30;
        // var pageLimit = 50;
        let pageLimit = req.param("page_limit") ? req.param("page_limit") : zeCommon.pageLimit; //how many items to show per page

    
        var paTitle = req.param("title") ? req.param("title").trim() : '';
        var paStatus = req.param("status") ? req.param("status").trim() : '';
        var paSortBy = req.param("sort_by") ? req.param("sort_by").trim() : 'ASC';
    
        if(paTitle){
          qdata.name = { 'like': '%'+paTitle+'%' };
        }
    
        if(paStatus){
          if(paStatus == '1'){
            qdata.status = 1;
          }
    
          if(paStatus == '2'){
            qdata.status = 2;
          }
        }
    
        // =============Embaded Start===============
        return Promise.all([
          Amenity.count(qdata),
          Amenity.find(qdata).paginate({page: currentPage, limit: pageLimit}).sort('title ' +paSortBy),
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
    
            return res.view("admin/amenity/index", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              alldata: allRecord,
              moment: moment,
              module: 'Admin Ads Data ',
              submodule: 'Amenities',
              title: 'Amenity',
              subtitle: 'Index',
              link1: '/admin/amenity/index/',
              linknew: '/admin/amenity/new/',
    
              paginateUrl: '/admin/amenity/index',
              pageLimit: pageLimit, // Per page how much i want to see,
              pageCount: pageCount, // How many page in this index e.x: if total record 20 and page size 4 it will be 20/4(totalrecord/pageSize) // This is last page
              currentPage: currentPage,
              adjacents: 2,
              lpm1: pageCount - 1,
    
              paTitle: paTitle,
              paStatus: paStatus,
              paSortBy: paSortBy,
              totalCount: totalCount,
              paginateVariable : '&name='+paTitle+'&status='+paStatus +'&sort_by='+paSortBy+'&page_limit='+pageLimit,
            });
    
            // **************************
          }).catch(function(err){
            console.log(err);
            req.flash('flashMsgError', 'Error In Index');
            return res.redirect('/admin/amenity/index');
          });
        // =============Embaded End=================
    
      },

      new : function (req, res) {
        // console.log("Inside new..............");
    
        var _formData = {
            title: '',
            status: 0,
        };
        return res.view("admin/amenity/new", {
            flashMsgError: req.flash('flashMsgError'),
            flashMsgSuccess: req.flash('flashMsgSuccess'),
            data: _formData,
            formActionTarget : "/admin/amenity/create",
            status: 'OK',
            // fieldErrors: {},
            customFieldErrors: {},
            module: 'Admin Ads Data ',
              submodule: 'Amenities',
              title: 'Amenity',
            subtitle: 'New',
            link1: '/admin/amenity/index'
        });
      },

      create : function (req, res) {
        
        let _formData = {
          title: req.param("title")  ? req.param("title").trim() : '',
          status: req.param("status")  ? req.param("status") : '',
          createdBy: req.user.id,
          createdByObj: {email: req.user.email},
          updatedBy: '',
          updatedByObj: {email: ''}
        };
    
        
    // =============Custom Error Start==================
    let customFieldErrors = {};
    
    if (!_formData.title) {
        customFieldErrors.title = {message: 'Title is required'};
    }
    
    if (!_formData.status) {
        customFieldErrors.status = {message: 'Status is required'};
    }
    
    let _creSlugData = {
      model: 'amenity',
      type: 'slug',
      from: _formData.title,
      defaultValue: 'slug'
    };
    // =============Custom Error End====================
    // =============Promisses Start=====================
    
  
    return Promise.all([
      ZeslugService.slugForCreate(_creSlugData), //<--Generate slug
      Amenity.findOne({title: _formData.title}), //<--For validation Check
    ])
      .spread(function(creSlug, extTitle){
      //  console.log('Slug is', creSlug);

        if(extTitle){
            customFieldErrors.name = {message: 'Title is already taken'};
          }
        _formData.slug = creSlug;
        // ******************** Image File Upload Start**********************
        
        // ******************** Image File Upload End************************
        if (Object.keys(customFieldErrors).length) {
          // console.log('customFieldErrors--', customFieldErrors);
          req.flash('errorMessage', 'Error in Create');
          return res.view("admin/amenity/new", {
            flashMsgError: req.flash('flashMsgError'),
            flashMsgSuccess: req.flash('flashMsgSuccess'),
            data: _formData,
            formActionTarget : "/admin/amenity/create",
            status: 'Error',
            errorType: 'validation-error',
            customFieldErrors: customFieldErrors,
            module: 'Admin Ads Data ',
              submodule: 'Amenities',
              title: 'Amenity',
            subtitle: 'Create',
            link1: '/admin/amenity/index'
          });

        } else {
          return Amenity.create(_formData).then(function (createData) {
              req.flash('flashMsgSuccess', 'Data Create Success.');
              return res.redirect('/admin/amenity/index');
            
          }).catch(function (err) {
            req.flash('flashMsgError', 'Error in Data Create'+err);
            // ===============
            return res.view("admin/amenity/new", {
                flashMsgError: req.flash('flashMsgError'),
                flashMsgSuccess: req.flash('flashMsgSuccess'),
                data: _formData,
                formActionTarget : "/admin/amenity/create",
                status: 'Error',
                errorType: 'validation-error',
                customFieldErrors: {},
                fieldErrors: {},
                module: 'Admin Ads Data ',
                submodule: 'Amenities',
                title: 'Amenity',
                subtitle: 'Create',
                link1: '/admin/amenity/index'
            });
          });//
        }
      }).catch(function(err){
        req.flash('flashMsgError', 'Error in create Record 4.'+err);
        return res.redirect('/admin/amenity/new');
      });
    // =============Promisses End=======================
      },

      edit: function (req, res) {
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID Not Found');
          return res.redirect('/admin/amenity/index');
        }
    
        Amenity.findOne({id:id}).then(function (singledata){
          if (!singledata) {
            req.flash('flashMsgError', 'Data Not Found In Database');
            return res.redirect('/admin/amenity/index');
          }else{
            return res.view("admin/amenity/edit", {
                flashMsgError: req.flash('flashMsgError'),
                flashMsgSuccess: req.flash('flashMsgSuccess'),
                data: singledata,
                formActionTarget : "/admin/amenity/update/" + id,
                status: 'OK',
                fieldErrors: {},
                customFieldErrors: {},
                module: 'Admin Ads Data ',
                submodule: 'Amenities',
                title: 'Amenity',
                subtitle: 'Edit',
                link1: '/admin/amenity/index'
            });
          }
        }).catch(function (err) {
            req.flash('flashMsgError', 'Error In Edit');
            return res.redirect('/admin/amenity/index');
          });
      },

      update: function (req, res) {
        console.log('i am here');
        let id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/amenity/index');
        }
    
        
        let _formData = {
            title: req.param("title")  ? req.param("title").trim() : '',
            status: req.param("status")  ? req.param("status") : '',
            updatedBy: req.user.id,
            updatedByObj: {email: req.user.email}
        };
     // =============Custom Error Start==================
        const customFieldErrors = {};
    
        if (!_formData.title) {
            customFieldErrors.title = {message: 'Title is required'};
        }
        
        if (!_formData.status) {
            customFieldErrors.status = {message: 'Status is required'};
        }

        let _creSlugData = {
            model: 'amenity',
            type: 'slug',
            from: _formData.title,
            defaultValue: 'slug'
            };
    
     // =============Custom Error End====================
    
     // ==================Save Start=====================
        
        Promise.all([
        Amenity.findOne({id: id}),
        ZeslugService.slugForUpdate(_creSlugData),
        Amenity.findOne({title: _formData.title}), //<--For validation Check
        ]).spread(function(sinExistdata, creSlug, extTitle) {
            console.log('extTitle==', extTitle);
            console.log('creSlug==', creSlug);

            if(!sinExistdata){
            req.flash('flashMsgError', 'Exist data not found');
            return res.redirect('/admin/amenity/index');
            } 
    
            if(extTitle){
                if(sinExistdata.id != extTitle.id){
                    customFieldErrors.title = {message: 'Title is already taken'};
                }
            }

            if(sinExistdata.title != _formData.title){
                _formData.slug = creSlug;
            }
            
            if (Object.keys(customFieldErrors).length) {
            req.flash('errorMessage', 'Error in Update');
                return res.view('admin/amenity/edit', {
                flashMsgError: req.flash('flashMsgError'),
                flashMsgSuccess: req.flash('flashMsgSuccess'),
                data: _formData,
                formActionTarget : "/admin/amenity/update/" + id,
                status: 'Error',
                customFieldErrors: customFieldErrors,
                module: 'Admin Ads Data ',
                submodule: 'Amenities',
                title: 'Amenity',
                subtitle: 'Update',
                link1: '/admin/amenity/index'
            });
        
            } else {
                // return res.redirect('/admin/amenity/index');
                //  ==================Start=====================
                return Amenity.update({id: id}, _formData).then(function (_updateSingle) {
                                   
                    req.flash('flashMsgSuccess', 'Data Update Success.');
                    return res.redirect('/admin/amenity/index');
                }).catch(function (err) {
                    console.log('err 1 =', err);
                    req.flash('flashMsgError', 'Error in Data Update');
                    // ===============
                    return res.view("admin/amenity/edit", {
                    flashMsgError: req.flash('flashMsgError'),
                    flashMsgSuccess: req.flash('flashMsgSuccess'),
                    data: sinExistdata,
                    formActionTarget : "/admin/amenity/update/" + id,
                    status: 'Error',
                    errorType: 'validation-error',
                    customFieldErrors: {},
                    module: 'Admin Ads Data ',
                    submodule: 'Amenities',
                    title: 'Amenity',
                    subtitle: 'Update',
                    link1: '/admin/amenity/index'
                    });
            
                });// ------catch End----
                //  ==================End=======================
            }
        }).catch(function (err) {
            console.log('err 2 =', err);
            req.flash('flashMsgError', 'Error In Data Update');
            return res.redirect('/admin/amenity/index');
        });
     // ==================Save End=======================
    
      },
      view: function (req, res) {
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'Data Id Not Found');
          return res.redirect('/admin/amenity/index');
        }
    
        Amenity.findOne({id:id}).then(function (singleData){
          if (!singleData) {
            req.flash('flashMsgError', 'Data Not Found In Database');
            return res.redirect('/admin/amenity/index');
          }else{
            return res.view("admin/amenity/view", {
                flashMsgError: req.flash('flashMsgError'),
                flashMsgSuccess: req.flash('flashMsgSuccess'),
                data: singleData,
                moment: moment,
                module: 'Admin Ads Data ',
                submodule: 'Amenities',
                title: 'Amenity',
                subtitle: 'View',
                link1: '/admin/amenity/index'
            });
          }
        })
          .catch(function (err) {
            req.flash('flashMsgError', 'Error In Data View');
            return res.redirect('/admin/amenity/index');
          });
      },

      delete : function (req, res) {
        let id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/amenity/index');
        };
    
        Promise.all([
          Amenity.findOne({id: id}),
        ]).spread(function(deleteData){
          if(!deleteData){
            req.flash('flashMsgError', 'Data Not found In Database');
            return res.redirect('/admin/amenity/index');
          } else {
                deleteData.destroy().then(function (_deldata) {
              req.flash('flashMsgSuccess', 'Record Deleted Successfully.');
              return res.redirect('/admin/amenity/index');
            });
          }
        //   if(stateHasData ){
        //     req.flash('flashMsgError', 'It Has Related Data You Cannot Delete It');
        //     return res.redirect('/admin/amenity/index');
        //   } else {
        //     deleteData.destroy().then(function (_deldata) {
        //       req.flash('flashMsgSuccess', 'Record Deleted Successfully.');
        //       return res.redirect('/admin/amenity/index');
        //     });
        //   }
        
        }).catch(function(err){
          req.flash('flashMsgError', 'Error in Delete');
          return res.redirect('/admin/amenity/index');
        });
    
      },

};

