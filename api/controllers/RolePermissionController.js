/**
 * RolepermissionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let _ = require('lodash');
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
     console.log('i am in index');
        var qdata = {
        };
    
        var currentPage = req.param("page");
        if(!currentPage){
          currentPage = 1;
        }

        console.log('currentPage = '+ currentPage);
        
    
        // var pageLimit = 30;
        let pageLimit = req.param("page_limit") ? req.param("page_limit") : zeCommon.pageLimit; //how many items to show per page
    
        let paRoleName = req.param("role_name") ? req.param("role_name").trim() : '';
        var paSortBy = req.param("sort_by") ? req.param("sort_by").trim() : 'ASC';
    
        if(paRoleName){
          qdata.role_name = { 'like': '%'+paRoleName+'%' };
        }

        
    
        
    
        // =============Embaded Start===============
        return Promise.all([
            RolePermission.count(qdata),
            RolePermission.find(qdata).paginate({page: currentPage, limit: pageLimit}).sort('role_name ' +paSortBy),
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

            // console.log('pageCount = '+ pageCount);
    
            return res.view("admin/role-permission/index", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              alldata: allRecord,
              moment: moment,
              module: 'Users ',
              submodule: 'Role-permission ',
              title: 'Role-permission ',
              subtitle: 'Index',
              link1: '/admin/role-permission/index/',
              linknew: '/admin/role-permission/new/',
    
              paginateUrl: '/admin/role-permission/index',
              pageLimit: pageLimit, // Per page how much i want to see,
              pageCount: pageCount, // How many page in this index e.x: if total record 20 and page size 4 it will be 20/4(totalrecord/pageSize) // This is last page
              currentPage: currentPage,
              adjacents: 2,
              lpm1: pageCount - 1,
    
              paRoleName: paRoleName,
              paSortBy: paSortBy,
              totalCount: totalCount,
              paginateVariable : '&role_name='+paRoleName+'&sort_by='+paSortBy+'&page_limit='+pageLimit,
    
            });
    
            // **************************
          }).catch(function(err){
            req.flash('flashMsgError', 'Error In Index');
            return res.redirect('/admin/role-permission/index');
          });
        // =============Embaded End=================
    
      },

      new : function (req, res) {
        var _newData = {
            role_name: ""
        };
        return res.view("admin/role-permission/new", {
          flashMsgError: req.flash('flashMsgError'),
          flashMsgSuccess: req.flash('flashMsgSuccess'),
          data: _newData,
          formActionTarget : "/admin/role-permission/create",
          status: 'OK',
          fieldErrors: {},
          customFieldErrors: {},
          module: 'Users',
          submodule: 'Role-permission',
          title: 'Role-permission',
          subtitle: 'New',
          link1: '/admin/role-permission/index'
        });
      },

      create : function (req, res) {
     
        var _newData = {
          role_name: req.param("role_name") ? req.param("role_name").toLowerCase() : '',
          
          createdBy: req.user.id,
          createdByObj: {username: req.user.username, email: req.user.email},
          updatedBy: '',
          updatedByObj: {email: ''}
        };
        //console.log('asas_newData',_newData);
    
        // =============Custom Error Start==================
        const customFieldErrors = {};
        
        if (!_newData.role_name) {
          customFieldErrors.role_name = {message: 'Role Name is Required'};
        }

        let _creSlugData = {
            model: 'rolepermission',
            type: 'slug',
            from: _newData.role_name,
            defaultValue: 'slug'
          };
    
        Promise.all([
          RolePermission.findOne({role_name: _newData.role_name}),
          ZeslugService.slugForCreate(_creSlugData),
          ]).spread(function(extRoleName, creSlug) {
            console.log('creSlug===', creSlug);
            if(extRoleName){
              customFieldErrors.role_name = {message: 'Role is already taken'};
            }

            _newData.slug = creSlug;
    
            if (Object.keys(customFieldErrors).length) {
              console.log('eeee', customFieldErrors);
              req.flash('errorMessage', 'Error in Create');
                return res.view('admin/role-permission/new', {
                  flashMsgError: req.flash('flashMsgError'),
                  flashMsgSuccess: req.flash('flashMsgSuccess'),
                  data: _newData,
                  formActionTarget : "/admin/role-permission/create",
                  status: 'Error',
                  customFieldErrors: customFieldErrors,
                  fieldErrors: {},
                  module: 'Users',
                  submodule: 'Role-permission',
                  title: 'Role-permission',
                  subtitle: 'Create',
                  link1: '/admin/role-permission/index'
              });
    
            } else {
                      
              return RolePermission.create(_newData).then(function (createData) {
                  req.flash('flashMsgSuccess', 'User Create Success.');
                  return res.redirect('/admin/role-permission/index');
              }).catch(function (err) {
                console.log('error is==', err);
                req.flash('flashMsgError', 'Error in User Create');
                // ===============
                return res.view("admin/role-permission/new", {
                  flashMsgError: req.flash('flashMsgError'),
                  flashMsgSuccess: req.flash('flashMsgSuccess'),
                  data: _newData,
                  formActionTarget : "/admin/role-permission/create",
                  status: 'Error',
                  errorType: 'validation-error',
                  customFieldErrors: {},
                  fieldErrors: {},
                  module: 'Users',
                  submodule: 'Role-permission',
                  title: 'Role-permission',
                  subtitle: 'Create',
                  link1: '/admin/role-permission/index'
                });
          
              });// ------catch End----
            }
          });
        // if (!_newData.AAA) {
        //   customFieldErrors.AAA = {message: 'AAA is Required'};
        // }
        // =============Custom Error End====================
      },

      edit: function (req, res) {
        var id = req.param('id');
        if (!id){
          req.flash('flaBrandshMsgError', 'ID Not Found');
          return res.redirect('/admin/role-permission/index');
        }
    
        RolePermission.findOne({id:id}).then(function (singledata){
          if (!singledata) {
            req.flash('flashMsgError', 'Data Not Found In Database');
            return res.redirect('/admin/role-permission/index');
          }else{
            return res.view("admin/role-permission/edit", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: singledata,
              formActionTarget : "/admin/role-permission/update/" + id,
              status: 'OK',
              fieldErrors: {},
              customFieldErrors: {},
              module: 'Users',
              submodule: 'Role-permission',
              title: 'Role-permission',
              subtitle: 'Edit',
              link1: '/admin/role-permission/index'
            });
          }
        }).catch(function (err) {
            req.flash('flashMsgError', 'Error In Edit');
            return res.redirect('/admin/role-permission/index');
          });
      },

      update: function (req, res) {
        let id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/role-permission/index');
        }
    
        
        let _editData = {
          role_name: req.param("role_name") ? req.param("role_name").toLowerCase() : '',
          updatedBy: req.user.id,
          updatedByObj: {username: req.user.username, email: req.user.email}
        };
     // =============Custom Error Start==================
        const customFieldErrors = {};
        if (!_editData.role_name) {
          customFieldErrors.role_name = {message: 'Role Name is Required'};
        }

        let _creSlugData = {
          model: 'rolepermission',
          type: 'slug',
          from: _editData.role_name,
          defaultValue: 'slug'
        };
        
    
     // =============Custom Error End====================
    
     // ==================Save Start=====================
       
        Promise.all([
          RolePermission.findOne({id: id}),
          ZeslugService.slugForUpdate(_creSlugData),
          RolePermission.findOne({role_name: _editData.role_name}), //<--For validation Check
        ]).spread(function(sinExistdata, creSlug, extRoleName) {
            
            if(!sinExistdata){
            req.flash('flashMsgError', 'Exist data not found');
            return res.redirect('/admin/role-permission/index');
            }
            
            if(extRoleName){
              if(sinExistdata.id != extRoleName.id){
                  customFieldErrors.role_name = {message: 'Role is already taken'};
              }
            }

            _editData.slug = creSlug;
            
            
            if (Object.keys(customFieldErrors).length) {
              console.log('eeee', customFieldErrors);
            req.flash('errorMessage', 'Error in Update');
                return res.view('admin/role-permission/edit', {
                flashMsgError: req.flash('flashMsgError'),
                flashMsgSuccess: req.flash('flashMsgSuccess'),
                data: _editData,
                formActionTarget : "/admin/role-permission/update/" + id,
                status: 'Error',
                customFieldErrors: customFieldErrors,
                module: 'Users',
                submodule: 'Role-permission',
                title: 'Role-permission',
                subtitle: 'Update',
                link1: '/admin/role-permission/index'
            });
        
            } else {
                //  ==================Start=====================
                return RolePermission.update({id: id}, _editData).then(function (_updateSingle) {
                    req.flash('flashMsgSuccess', 'Data Update Success.');
                    return res.redirect('/admin/role-permission/index');
                }).catch(function (err) {
                  console.log('err2==', err);
                    req.flash('flashMsgError', 'Error in Data Update');
                    // ===============
                    return res.view("admin/role-permission/edit", {
                    flashMsgError: req.flash('flashMsgError'),
                    flashMsgSuccess: req.flash('flashMsgSuccess'),
                    data: sinExistdata,
                    formActionTarget : "/admin/role-permission/update/" + id,
                    status: 'Error',
                    errorType: 'validation-error',
                    customFieldErrors: {},
                    module: 'Users',
                    submodule: 'Role-permission',
                    title: 'Role-permission',
                    subtitle: 'Update',
                    link1: '/admin/role-permission/index'
                    });
            
                });// ------catch End----
                //  ==================End=======================
            }
        }).catch(function (err) {
          console.log('err 1==', err);
            req.flash('flashMsgError', 'Error In Data Update3');
            return res.redirect('/admin/role-permission/index');
        });
     // ==================Save End=======================
    
      },

      view: function (req, res) {
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'Data Id Not Found');
          return res.redirect('/admin/role-permission/index');
        }
    
        RolePermission.findOne({id:id}).then(function (singleData){
          if (!singleData) {
            req.flash('flashMsgError', 'Offer Not Found In Database');
            return res.redirect('/admin/role-permission/index');
          }else{
            return res.view("admin/role-permission/view", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: singleData,
              moment: moment,
              
              module: 'Users',
              submodule: 'Role-permission',
              title: 'Role-permission',
              subtitle: 'View',
              link1: '/admin/role-permission/index'
            });
          }
        })
          .catch(function (err) {
            req.flash('flashMsgError', 'Error In Data View');
            return res.redirect('/admin/role-permission/index');
          });
      },
      delete : function (req, res) {
        let id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/role-permission/index');
        };
        Promise.all([
          RolePermission.findOne({id: id}),
          Users.findOne({rolepermission:id},{select: ['id']}),
        ]).spread(function(deleteData, userHasData){
          if(!deleteData){
            req.flash('flashMsgError', 'Data Not found In Database');
            return res.redirect('/admin/role-permission/index');
          }
          if(userHasData ){
            req.flash('flashMsgError', 'It Has Related Data You Cannot Delete It');
            return res.redirect('/admin/role-permission/index');
          } else {
            console.log('item deleted---');
            deleteData.destroy().then(function (_deldata) {
              req.flash('flashMsgSuccess', 'Record Deleted Successfully.');
              return res.redirect('/admin/role-permission/index');
            });
          }
        }).catch(function(err){
          req.flash('flashMsgError', 'Error in Delete');
          return res.redirect('/admin/role-permission/index');
        });
    
      },

      assignTo: function (req, res) {
        var id = req.param('id');
        if (!id){
          req.flash('flaBrandshMsgError', 'ID Not Found');
          return res.redirect('/admin/role-permission/index');
        }
    
        RolePermission.findOne({id:id}).then(function (singledata){
          if (!singledata) {
            req.flash('flashMsgError', 'Data Not Found In Database');
            return res.redirect('/admin/role-permission/index');
          }else{
            return res.view("admin/role-permission/assign-to", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              data: singledata,
              formActionTarget : "/admin/role-permission/assign-to-save/" + id,
              status: 'OK',
              fieldErrors: {},
              customFieldErrors: {},
              module: 'Users',
              submodule: 'Role-permission',
              title: 'Role-permission',
              subtitle: 'Assign',
              link1: '/admin/role-permission/index'
            });
          }
        }).catch(function (err) {
            req.flash('flashMsgError', 'Error In Edit');
            return res.redirect('/admin/role-permission/index');
          });
      },

      assignToSave: function (req, res) {
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'Data ID not found');
          return res.redirect('/admin/role-permission/index');
        }
        
        var _formData = {
          prv_adminAdsData_category_index: req.param("prv_adminAdsData_category_index") ? true : false,
          prv_adminAdsData_category_create: req.param("prv_adminAdsData_category_create") ? true : false,
          prv_adminAdsData_category_update: req.param("prv_adminAdsData_category_update") ? true : false,
          prv_adminAdsData_category_view: req.param("prv_adminAdsData_category_view") ? true : false,
          prv_adminAdsData_category_delete: req.param("prv_adminAdsData_category_delete") ? true : false,
          prv_adminAdsData_category_download: req.param("prv_adminAdsData_category_download") ? true : false,
          
          prv_adminAdsData_subCategory_index: req.param("prv_adminAdsData_subCategory_index") ? true : false,
          prv_adminAdsData_subCategory_create: req.param("prv_adminAdsData_subCategory_create") ? true : false,
          prv_adminAdsData_subCategory_update: req.param("prv_adminAdsData_subCategory_update") ? true : false,
          prv_adminAdsData_subCategory_view: req.param("prv_adminAdsData_subCategory_view") ? true : false,
          prv_adminAdsData_subCategory_delete: req.param("prv_adminAdsData_subCategory_delete") ? true : false,
          prv_adminAdsData_subCategory_download: req.param("prv_adminAdsData_subCategory_download") ? true : false,

          prv_adminAdsData_amenity_index: req.param("prv_adminAdsData_amenity_index") ? true : false,
          prv_adminAdsData_amenity_create: req.param("prv_adminAdsData_amenity_create") ? true : false,
          prv_adminAdsData_amenity_update: req.param("prv_adminAdsData_amenity_update") ? true : false,
          prv_adminAdsData_amenity_view: req.param("prv_adminAdsData_amenity_view") ? true : false,
          prv_adminAdsData_amenity_delete: req.param("prv_adminAdsData_amenity_delete") ? true : false,
          prv_adminAdsData_amenity_download: req.param("prv_adminAdsData_amenity_download") ? true : false,

          prv_adminAdsData_country_index: req.param("prv_adminAdsData_country_index") ? true : false,
          prv_adminAdsData_country_create: req.param("prv_adminAdsData_country_create") ? true : false,
          prv_adminAdsData_country_update: req.param("prv_adminAdsData_country_update") ? true : false,
          prv_adminAdsData_country_view: req.param("prv_adminAdsData_country_view") ? true : false,
          prv_adminAdsData_country_delete: req.param("prv_adminAdsData_country_delete") ? true : false,
          prv_adminAdsData_country_download: req.param("prv_adminAdsData_country_download") ? true : false,

          prv_adminAdsData_state_index: req.param("prv_adminAdsData_state_index") ? true : false,
          prv_adminAdsData_state_create: req.param("prv_adminAdsData_state_create") ? true : false,
          prv_adminAdsData_state_update: req.param("prv_adminAdsData_state_update") ? true : false,
          prv_adminAdsData_state_view: req.param("prv_adminAdsData_state_view") ? true : false,
          prv_adminAdsData_state_delete: req.param("prv_adminAdsData_state_delete") ? true : false,
          prv_adminAdsData_state_download: req.param("prv_adminAdsData_state_download") ? true : false,

          // AAAA: req.param("AAAA") ? true : false,
          // AAAA: req.param("AAAA") ? true : false,
          // AAAA: req.param("AAAA") ? true : false,
          // AAAA: req.param("AAAA") ? true : false,
          // AAAA: req.param("AAAA") ? true : false,
          // AAAA: req.param("AAAA") ? true : false,
          // AAAA: req.param("AAAA") ? true : false,
          // AAAA: req.param("AAAA") ? true : false,
          // AAAA: req.param("AAAA") ? true : false,



          updatedBy: req.user.id,
          updatedByObj: {email: req.user.email}
        };

        // if(_formData.AAAA || _formData.BBBB || _formData.CCCC || _formData.DDDD || _formData.EEEE || _formData.FFFF){
        //   _formData.XXXX = true;   
        // } else {
        //   _formData.XXXX = false; 
        // }
    
        // ==========category Sub module start===========
        if(_formData.prv_adminAdsData_category_index || _formData.prv_adminAdsData_category_create || _formData.prv_adminAdsData_category_update || _formData.prv_adminAdsData_category_view || _formData.prv_adminAdsData_category_delete || _formData.prv_adminAdsData_category_download){
          _formData.prv_adminAdsData_category = true;   
        } else {
          _formData.prv_adminAdsData_category = false; 
        }
        // ==========category Sub module end=============

        // =========subCategory Sub module start===========
        if(_formData.prv_adminAdsData_subCategory_index || _formData.prv_adminAdsData_subCategory_create || _formData.prv_adminAdsData_subCategory_update || _formData.prv_adminAdsData_subCategory_view || _formData.prv_adminAdsData_subCategory_delete || _formData.prv_adminAdsData_subCategory_download){
          _formData.prv_adminAdsData_subCategory = true;   
        } else {
          _formData.prv_adminAdsData_subCategory = false; 
        }
        // =========subCategory Sub module end=============

        // =========amenity Sub module start===========
        if(_formData.prv_adminAdsData_amenity_index || _formData.prv_adminAdsData_amenity_create || _formData.prv_adminAdsData_amenity_update || _formData.prv_adminAdsData_amenity_view || _formData.prv_adminAdsData_amenity_delete || _formData.prv_adminAdsData_amenity_download){
          _formData.prv_adminAdsData_amenity = true;   
        } else {
          _formData.prv_adminAdsData_amenity = false; 
        }
        // =========amenity Sub module end=============

        // =========country Sub module start===========
        if(_formData.prv_adminAdsData_country_index || _formData.prv_adminAdsData_country_create || _formData.prv_adminAdsData_country_update || _formData.prv_adminAdsData_country_view || _formData.prv_adminAdsData_country_delete || _formData.prv_adminAdsData_country_download){
          _formData.prv_adminAdsData_country = true;   
        } else {
          _formData.prv_adminAdsData_country = false; 
        }
        // =========country Sub module end=============

        // =========state Sub module start===========
        if(_formData.prv_adminAdsData_state_index || _formData.prv_adminAdsData_state_create || _formData.prv_adminAdsData_state_update || _formData.prv_adminAdsData_state_view || _formData.prv_adminAdsData_state_delete || _formData.prv_adminAdsData_state_download){
          _formData.prv_adminAdsData_state = true;   
        } else {
          _formData.prv_adminAdsData_state = false; 
        }
        // =========state Sub module end=============

        // =========adminAdsData module start===========
        if(_formData.prv_adminAdsData_category_index || _formData.prv_adminAdsData_category_create || _formData.prv_adminAdsData_category_update || _formData.prv_adminAdsData_category_view || _formData.prv_adminAdsData_category_delete || _formData.prv_adminAdsData_category_download || _formData.prv_adminAdsData_subCategory_index || _formData.prv_adminAdsData_subCategory_create || _formData.prv_adminAdsData_subCategory_update || _formData.prv_adminAdsData_subCategory_view || _formData.prv_adminAdsData_subCategory_delete || _formData.prv_adminAdsData_subCategory_download || _formData.prv_adminAdsData_amenity_index || _formData.prv_adminAdsData_amenity_create || _formData.prv_adminAdsData_amenity_update || _formData.prv_adminAdsData_amenity_view || _formData.prv_adminAdsData_amenity_delete || _formData.prv_adminAdsData_amenity_download || _formData.prv_adminAdsData_country_index || _formData.prv_adminAdsData_country_create || _formData.prv_adminAdsData_country_update || _formData.prv_adminAdsData_country_view || _formData.prv_adminAdsData_country_delete || _formData.prv_adminAdsData_country_download || _formData.prv_adminAdsData_state_index || _formData.prv_adminAdsData_state_create || _formData.prv_adminAdsData_state_update || _formData.prv_adminAdsData_state_view || _formData.prv_adminAdsData_state_delete || _formData.prv_adminAdsData_state_download){
          _formData.prv_adminAdsData = true;   
        } else {
          _formData.prv_adminAdsData = false; 
        }
        // =========adminAdsData module end=============



        
     // ==================Save Start=====================
    
        //  ==================Start=====================
        
        return RolePermission.update({id: id}, _formData).then(function (_updateSingle) {
            req.flash('flashMsgSuccess', 'Permission Update Success.');
            return res.redirect('/admin/role-permission/index');
          
        }).catch(function (err) {
          req.flash('flashMsgError', 'Error in User Update');
          // ===============
          return res.view("admin/role-permission/assign-to", {
            flashMsgError: req.flash('flashMsgError'),
            flashMsgSuccess: req.flash('flashMsgSuccess'),
            data: sinExistdata,
            formActionTarget : "/admin/role-permission/assign-to-save/" + id,
            status: 'Error',
            errorType: 'validation-error',
            customFieldErrors: {},
            fieldErrors: {},
            module: 'Users',
            submodule: 'Role-permission',
            title: 'Role-permission',
            subtitle: 'Assign',
            link1: '/admin/role-permission/index'
          });
    
        });// ------catch End----
        //  ==================End=======================
    
     
     // ==================Save End=======================
    
      },



};

