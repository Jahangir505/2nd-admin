/**
 * StateController
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
        console.log('i am at index');
             var qdata = {
             };
         
             var currentPage = req.param("page");
             if(!currentPage){
               currentPage = 1;
             }
         
             // var pageLimit = 30;
             // var pageLimit = 50;
             let pageLimit = req.param("page_limit") ? req.param("page_limit") : zeCommon.pageLimit; //how many items to show per page
         
             var paName = req.param("name") ? req.param("name").trim() : '';
             var paCountry = req.param("country") ? req.param("country").trim() : '';
             var paStatus = req.param("status") ? req.param("status").trim() : '';
             var paSortBy = req.param("sort_by") ? req.param("sort_by").trim() : 'ASC';
         
             if(paName){
               qdata.name = { 'like': '%'+paName+'%' };
             }

             if(paCountry){
                qdata.country = paCountry;
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
               State.count(qdata),
               State.find(qdata).populate('country').paginate({page: currentPage, limit: pageLimit}).sort('name ' +paSortBy),
               Country.find({status: 1},{select: ['name']}).sort('name ASC'),
             ])
               .spread(function(totalCount, allRecord, allCountry){
                console.log('allCountry==', allCountry);
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
         
                 return res.view("admin/state/index", {
                    flashMsgError: req.flash('flashMsgError'),
                    flashMsgSuccess: req.flash('flashMsgSuccess'),
                    alldata: allRecord,
                    allCountry: allCountry,
                    moment: moment,
                    module: 'Admin Ads Data ',
                    submodule: 'Location-state ',
                    title: 'Location-state ',
                    subtitle: 'Index',
                    link1: '/admin/state/index/',
                    linknew: '/admin/state/new/',
            
                    paginateUrl: '/admin/state/index',
                    pageLimit: pageLimit, // Per page how much i want to see,
                    pageCount: pageCount, // How many page in this index e.x: if total record 20 and page size 4 it will be 20/4(totalrecord/pageSize) // This is last page
                    currentPage: currentPage,
                    adjacents: 2,
                    lpm1: pageCount - 1,
          
                    paName: paName,
                    paCountry: paCountry,
                    paStatus: paStatus,
                    paSortBy: paSortBy,
                    totalCount: totalCount,
                    paginateVariable : '&name='+paName+'&status='+paStatus +'&country='+paCountry +'&sort_by='+paSortBy+'&page_limit='+pageLimit,
                 });
         
                 // **************************
               }).catch(function(err){
                 req.flash('flashMsgError', 'Error In Index');
                 return res.redirect('/admin/state/index');
               });
             // =============Embaded End=================
         
           },

           new : function (req, res) {
            // console.log("Inside new..............");
            var _formData = {
                name: '',
                country: '',
                status: 0,
            };
        
            Promise.all([
              Country.find({status: 1},{select: ['name']}).sort('sort ASC')
            ])
              .spread(function(allCountry){
                console.log('allCountry', allCountry);
                return res.view("admin/state/new", {
                    flashMsgError: req.flash('flashMsgError'),
                    flashMsgSuccess: req.flash('flashMsgSuccess'),
                    data: _formData,
                    allCountry: allCountry,
                    formActionTarget : "/admin/state/create",
                    status: 'OK',
                    customFieldErrors: {},
                    module: 'Admin Ads Data ',
                    submodule: 'Location-state ',
                    title: 'Location-state ',
                    subtitle: 'New',
                    link1: '/admin/state/index'
                });
        
              }).catch(function(err){
              req.flash('flashMsgError', 'Error In New');
              return res.redirect('/admin/state/index');
            });
        
          },

          create : function (req, res) {
            
            var _formData = {
              country: req.param("country") ? req.param("country").trim() : '',
              name: req.param("name") ? req.param("name").toLowerCase() : '',
              status: req.param("status")  ? req.param("status") : '',
              
              createdBy: req.user.id,
              createdByObj: {email: req.user.email},
              updatedBy: '',
              updatedByObj: {email: ''}
            };
            //console.log('asas_formData',_formData);
        
            
        // =============Custom Error Start==================
        const customFieldErrors = {};
        
        
        if (!_formData.country) {
          customFieldErrors.country = {message: 'Country is Required'};
        }
                
        if (!_formData.name) {
          customFieldErrors.name = {message: 'Name is Required'};
        }
        
        if (!_formData.status) {
          customFieldErrors.status = {message: 'Status is Required'};
        }

        let _creSlugData = {
            model: 'state',
            type: 'slug',
            from: _formData.name,
            defaultValue: 'slug'
          };
        
        // =============Custom Error End====================
        
        return Promise.all([
          Country.find({status: 1},{select: ['name']}).sort('sort ASC'), //<--All Record For Show at form 
          ZeslugService.slugForCreate(_creSlugData), //<--Generate slug
          State.findOne({country: _formData.country, name: _formData.name}), //<--For validation Check
        ])
          .spread(function(allCountry, creSlug, extName){
        //    console.log('extName is', extName);
            if(extName){
                customFieldErrors.name = {message: 'Name is already taken'};
            }
            _formData.slug = creSlug;
          
            if (Object.keys(customFieldErrors).length) {
              console.log('eeee1', customFieldErrors);
              req.flash('errorMessage', 'Error in Create');
                return res.view('admin/state/new', {
                    flashMsgError: req.flash('flashMsgError'),
                    flashMsgSuccess: req.flash('flashMsgSuccess'),
                    data: _formData,
                    allCountry: allCountry,
                    formActionTarget : "/admin/state/create",
                    status: 'Error',
                    customFieldErrors: customFieldErrors,
                    fieldErrors: {},
                    module: 'Admin Ads Data ',
                    submodule: 'Location-state ',
                    title: 'Location-state ',
                    subtitle: 'Create',
                    link1: '/admin/state/index'
              });
        
            } else {
                      
              return State.create(_formData).then(function (createData) {
                  req.flash('flashMsgSuccess', 'State Create Success.');
                  return res.redirect('/admin/state/index');
              }).catch(function (err) {
                console.log('err2', err);
                req.flash('flashMsgError', 'Error in User Create');
                // ===============
                return res.view("admin/state/new", {
                    flashMsgError: req.flash('flashMsgError'),
                    flashMsgSuccess: req.flash('flashMsgSuccess'),
                    data: _formData,
                    allRolepermission: allRolepermission,
                    formActionTarget : "/admin/state/create",
                    status: 'Error',
                    errorType: 'validation-error',
                    customFieldErrors: {},
                    fieldErrors: {},
                    module: 'Admin Ads Data ',
                    submodule: 'Location-state ',
                    title: 'Location-state ',
                    subtitle: 'Create',
                    link1: '/admin/state/index'
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
              return res.redirect('/admin/state/index');
            }
            Promise.all([
              State.findOne({id:id}),
              Country.find({status: 1},{select: ['name']}).sort('sort ASC')
            ])
              .spread(function(existSingleData, allCountry){
        
                if(!existSingleData){
                  req.flash('flashMsgError', 'Record Not Found In Database');
                  return res.redirect('/admin/state/index');
                } else {
                    return res.view("admin/state/edit", {
                        flashMsgError: req.flash('flashMsgError'),
                        flashMsgSuccess: req.flash('flashMsgSuccess'),
                        data: existSingleData,
                        allCountry: allCountry,
                        formActionTarget : "/admin/state/update/" + id,
                        status: 'OK',
                        customFieldErrors: {},
                        module: 'Admin Ads Data ',
                        submodule: 'Location-state ',
                        title: 'Location-state ',
                        subtitle: 'Edit',
                        link1: '/admin/state/index'
                    });
                }
              }).catch(function(err){
              req.flash('flashMsgError', 'Error in Edit');
              return res.redirect('/admin/state/index');
            });
          },

          update: function (req, res) {
            // console.log('I m in Update');
            var id = req.param('id');
            if (!id){
              req.flash('flashMsgError', 'ID not found');
              return res.redirect('/admin/state/index');
            };
           
        
            var _formData = {
                country: req.param("country") ? req.param("country").trim() : '',
                name: req.param("name") ? req.param("name").toLowerCase() : '',
                status: req.param("status")  ? req.param("status") : '',
            
                updatedBy: req.user.id,
                updatedByObj: {username: req.user.username, email: req.user.email}
              };
        
              // =============Custom Error Start==================
              const customFieldErrors = {};
              
              if (!_formData.country) {
                customFieldErrors.country = {message: 'Country is Required'};
              }
                      
              if (!_formData.name) {
                customFieldErrors.name = {message: 'Name is Required'};
              }
              
              if (!_formData.status) {
                customFieldErrors.status = {message: 'Status is Required'};
              }
      
              let _creSlugData = {
                  model: 'state',
                  type: 'slug',
                  from: _formData.name,
                  defaultValue: 'slug'
                };
             
             // =============Custom Error End====================
        
            // =============Save Start=====================
                // #########################
                return State.findOne({id:id}).then(function (sinExistdata){
                  if (!sinExistdata) {
                    req.flash('flashMsgError', 'Record Not found 11');
                    return res.redirect('/admin/state/index');
                  } else {
                    
                    Promise.all([
                      Country.find({status: 1},{select: ['name']}).sort('sort ASC'), //<--All Record For Show at form
                      ZeslugService.slugForUpdate(_creSlugData),
                      State.findOne({country: _formData.country, name: _formData.name}), //<--For validation Check
                           
                      ]).spread(function(allCountry, creSlug, extName) {
        
                        if(extName){
                            if(sinExistdata.id != extName.id){
                                customFieldErrors.name = {message: 'Name is already taken'};
                            }
                        }

                        if(sinExistdata.name != _formData.name){
                            _formData.slug = creSlug;
                        }
                       
        
                      if (Object.keys(customFieldErrors).length) {
                        console.log('_formData', _formData);
                            req.flash('errorMessage', 'Error in Update');
                              return res.view('admin/state/edit', {
                                flashMsgError: req.flash('flashMsgError'),
                                flashMsgSuccess: req.flash('flashMsgSuccess'),
                                data: _formData,
                                allCountry: allCountry,
                                formActionTarget : "/admin/state/update/" + id,
                                status: 'Error',
                                customFieldErrors: customFieldErrors,
                                module: 'Admin Ads Data ',
                                submodule: 'Location-state ',
                                title: 'Location-state ',
                                subtitle: 'Update',
                                link1: '/admin/state/index'
                            });
                  
                      } else {
                        // =================================
                            return State.update(id, _formData).then(function (_updateSingle) {
                                  req.flash('flashMsgSuccess', 'Record Update Success.');
                                  return res.redirect('/admin/state/index');
                    
                              }).catch(function (err) {
                                    console.log('err 1', err);
                                    req.flash('flashMsgError', 'Error in Data Update');
                                    return res.view("admin/state/new", {
                                      flashMsgError: req.flash('flashMsgError'),
                                      flashMsgSuccess: req.flash('flashMsgSuccess'),
                                      data: sinExistdata,
                                      allCountry: allCountry,
                                      formActionTarget : "/admin/state/update/" + id,
                                      status: 'Error',
                                      errorType: 'validation-error',
                                      allRolepermission: allRolepermission,
                                      customFieldErrors: {},
                                      module: 'Admin Ads Data ',
                                      submodule: 'Location-state ',
                                      title: 'Location-state ',
                                      subtitle: 'Update',
                                      link1: '/admin/state/index'
                                    });
                                  });// <--Create record Catch End
          
                             } //<--Validation Check Else End
                        // =================================
                      });
                  } //<--sinExistdata Else End
                  
              }).catch(function(err){
                console.log('err 2', err);
                req.flash('flashMsgError', 'Error in Record update');
                return res.redirect('/admin/state/index');
              });
            // =============Slug Create End=================
        
          },

          view: function (req, res) {
            var id = req.param('id');
            if (!id){
              req.flash('flashMsgError', 'Data Id Not Found');
              return res.redirect('/admin/state/index');
            }
        
            State.findOne({id:id}).populate('country').then(function (singleData){
              if (!singleData) {
                req.flash('flashMsgError', 'Data Not Found In Database');
                return res.redirect('/admin/state/index');
              }else{
                return res.view("admin/state/view", {
                    flashMsgError: req.flash('flashMsgError'),
                    flashMsgSuccess: req.flash('flashMsgSuccess'),
                    data: singleData,
                    moment: moment,
                    module: 'Admin Ads Data ',
                    submodule: 'Location-state ',
                    title: 'Location-state ',
                    subtitle: 'View',
                    link1: '/admin/state/index'
                });
              }
            })
              .catch(function (err) {
                req.flash('flashMsgError', 'Error In User View');
                return res.redirect('/admin/state/index');
              });
          },

          delete : function (req, res) {
            let id = req.param('id');
            if (!id){
              req.flash('flashMsgError', 'ID not found');
              return res.redirect('/admin/state/index');
            };
        
            Promise.all([
              State.findOne({id: id}),
              Users.findOne({state:id},{select: ['id']}),
            ]).spread(function(deleteData, userHasData){
              if(!deleteData){
                req.flash('flashMsgError', 'Data Not found In Database');
                return res.redirect('/admin/state/index');
              }
              if(userHasData ){
                req.flash('flashMsgError', 'It Has Related Data You Cannot Delete It');
                return res.redirect('/admin/state/index');
              } else {
                deleteData.destroy().then(function (_deldata) {
                  req.flash('flashMsgSuccess', 'Record Deleted Successfully.');
                  return res.redirect('/admin/state/index');
                });
              }
            }).catch(function(err){
              req.flash('flashMsgError', 'Error in Delete');
              return res.redirect('/admin/state/index');
            });
        
          },
    

};

