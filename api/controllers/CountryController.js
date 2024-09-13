/**
 * CountryController
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
        var paStatus = req.param("status") ? req.param("status").trim() : '';
        var paSortBy = req.param("sort_by") ? req.param("sort_by").trim() : 'ASC';
    
        if(paName){
          qdata.name = { 'like': '%'+paName+'%' };
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
          Country.count(qdata),
          Country.find(qdata).paginate({page: currentPage, limit: pageLimit}).sort('name ' +paSortBy),
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
    
            return res.view("admin/country/index", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              alldata: allRecord,
              moment: moment,
              module: 'Admin Ads Data ',
              submodule: 'Location-country ',
              title: 'Location-country ',
              subtitle: 'Index',
              link1: '/admin/country/index/',
              linknew: '/admin/country/new/',
    
              paginateUrl: '/admin/country/index',
              pageLimit: pageLimit, // Per page how much i want to see,
              pageCount: pageCount, // How many page in this index e.x: if total record 20 and page size 4 it will be 20/4(totalrecord/pageSize) // This is last page
              currentPage: currentPage,
              adjacents: 2,
              lpm1: pageCount - 1,
    
              paName: paName,
              paStatus: paStatus,
              paSortBy: paSortBy,
              totalCount: totalCount,
              paginateVariable : '&name='+paName+'&status='+paStatus +'&sort_by='+paSortBy+'&page_limit='+pageLimit,
            });
    
            // **************************
          }).catch(function(err){
            req.flash('flashMsgError', 'Error In Index');
            return res.redirect('/admin/country/index');
          });
        // =============Embaded End=================
    
      },

      new : function (req, res) {
        // console.log("Inside new..............");
    
        var _formData = {
            code: '',
            name: '',
            status: 0,
        };
        return res.view("admin/country/new", {
            flashMsgError: req.flash('flashMsgError'),
            flashMsgSuccess: req.flash('flashMsgSuccess'),
            data: _formData,
            formActionTarget : "/admin/country/create",
            status: 'OK',
            // fieldErrors: {},
            customFieldErrors: {},
            module: 'Admin Ads Data ',
            submodule: 'Location-country ',
            title: 'Location-country ',
            subtitle: 'New',
            link1: '/admin/country/index'
        });
      },

      create : function (req, res) {
        
        let _formData = {
          code: req.param("code")  ? req.param("code").trim() : '',
          name: req.param("name")  ? req.param("name").toLowerCase() : '',
          status: req.param("status")  ? req.param("status") : '',
          createdBy: req.user.id,
          createdByObj: {username: req.user.username, email: req.user.email},
          updatedBy: '',
          updatedByObj: {email: ''}
        };
    
        
    // =============Custom Error Start==================
    let customFieldErrors = {};
    if (!_formData.code) {
      customFieldErrors.code = {message: 'Code is required'};
    }

    if (!_formData.name) {
        customFieldErrors.name = {message: 'Name is required'};
    }
    
    if (!_formData.status) {
        customFieldErrors.status = {message: 'Status is required'};
    }
    // if (!_formData.description) {
    //   customFieldErrors.description = {message: 'Description is required'};
    // }
    let _creSlugData = {
      model: 'country',
      type: 'slug',
      from: _formData.name,
      defaultValue: 'slug'
    };
    // =============Custom Error End====================
    // =============Promisses Start=====================
    
  
    return Promise.all([
      ZeslugService.slugForCreate(_creSlugData), //<--Generate slug
      Country.findOne({code: _formData.code}), //<--For validation Check
      Country.findOne({name: _formData.name}), //<--For validation Check
    ])
      .spread(function(creSlug,  extCode, extName){
      //  console.log('Slug is', creSlug);
      console.log('extCode==', extCode);
        if(extCode){
          customFieldErrors.code = {message: 'Code is already taken'};
        }

        if(extName){
            customFieldErrors.name = {message: 'Name is already taken'};
          }
        _formData.slug = creSlug;
        // ******************** Image File Upload Start**********************
        
        // ******************** Image File Upload End************************
        if (Object.keys(customFieldErrors).length) {
          // console.log('customFieldErrors--', customFieldErrors);
          req.flash('errorMessage', 'Error in Create');
          return res.view("admin/country/new", {
            flashMsgError: req.flash('flashMsgError'),
            flashMsgSuccess: req.flash('flashMsgSuccess'),
            data: _formData,
            formActionTarget : "/admin/country/create",
            status: 'Error',
            errorType: 'validation-error',
            customFieldErrors: customFieldErrors,
            module: 'Admin Ads Data ',
            submodule: 'Location-country ',
            title: 'Location-country ',
            subtitle: 'Create',
            link1: '/admin/country/index'
          });

        } else {
          return Country.create(_formData).then(function (createData) {
              req.flash('flashMsgSuccess', 'Data Create Success.');
              return res.redirect('/admin/country/index');
            
          }).catch(function (err) {
            req.flash('flashMsgError', 'Error in Data Create'+err);
            // ===============
            return res.view("admin/country/new", {
                flashMsgError: req.flash('flashMsgError'),
                flashMsgSuccess: req.flash('flashMsgSuccess'),
                data: _formData,
                formActionTarget : "/admin/country/create",
                status: 'Error',
                errorType: 'validation-error',
                customFieldErrors: {},
                fieldErrors: {},
                module: 'Admin Ads Data ',
                submodule: 'Location-country ',
                title: 'Location-country ',
                subtitle: 'Create',
                link1: '/admin/country/index'
            });
          });//
        }
      }).catch(function(err){
        req.flash('flashMsgError', 'Error in create Record 4.'+err);
        return res.redirect('/admin/country/new');
      });
    // =============Promisses End=======================
      },

      edit: function (req, res) {
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID Not Found');
          return res.redirect('/admin/country/index');
        }
    
        Country.findOne({id:id}).then(function (singledata){
          if (!singledata) {
            req.flash('flashMsgError', 'Data Not Found In Database');
            return res.redirect('/admin/country/index');
          }else{
            return res.view("admin/country/edit", {
                flashMsgError: req.flash('flashMsgError'),
                flashMsgSuccess: req.flash('flashMsgSuccess'),
                data: singledata,
                formActionTarget : "/admin/country/update/" + id,
                status: 'OK',
                fieldErrors: {},
                customFieldErrors: {},
                module: 'Admin Ads Data ',
                submodule: 'Location-country ',
                title: 'Location-country ',
                subtitle: 'Edit',
                link1: '/admin/country/index'
            });
          }
        }).catch(function (err) {
            req.flash('flashMsgError', 'Error In Edit');
            return res.redirect('/admin/country/index');
          });
      },

      update: function (req, res) {
        console.log('i am here');
        let id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/country/index');
        }
    
        
        let _formData = {
            code: req.param("code")  ? req.param("code").trim() : '',
            name: req.param("name")  ? req.param("name").toLowerCase() : '',
            status: req.param("status")  ? req.param("status") : '',
            updatedBy: req.user.id,
            updatedByObj: {username: req.user.username, email: req.user.email}
        };
     // =============Custom Error Start==================
        const customFieldErrors = {};
        if (!_formData.code) {
        customFieldErrors.code = {message: 'Code is required'};
        }
    
        if (!_formData.name) {
            customFieldErrors.name = {message: 'Name is required'};
        }
        
        if (!_formData.status) {
            customFieldErrors.status = {message: 'Status is required'};
        }

        let _creSlugData = {
            model: 'country',
            type: 'slug',
            from: _formData.name,
            defaultValue: 'slug'
            };
    
     // =============Custom Error End====================
    
     // ==================Save Start=====================
        
        Promise.all([
        Country.findOne({id: id}),
        ZeslugService.slugForUpdate(_creSlugData),
        Country.findOne({code: _formData.code}), //<--For validation Check
        Country.findOne({name: _formData.name}), //<--For validation Check
        ]).spread(function(sinExistdata, creSlug, extCode, extName) {
            console.log('extCode==', extCode);
            console.log('extName==', extName);
            console.log('creSlug==', creSlug);

            if(!sinExistdata){
            req.flash('flashMsgError', 'Exist data not found');
            return res.redirect('/admin/country/index');
            } 
            
            if(extCode){
                if(sinExistdata.id != extCode.id){
                    customFieldErrors.code = {message: 'Code is already taken'};
                }
            }
    
            if(extName){
                if(sinExistdata.id != extName.id){
                    customFieldErrors.name = {message: 'Name is already taken'};
                }
            }

            if(sinExistdata.name != _formData.name){
                _formData.slug = creSlug;
            }

            

            
            if (Object.keys(customFieldErrors).length) {
            req.flash('errorMessage', 'Error in Update');
                return res.view('admin/country/edit', {
                flashMsgError: req.flash('flashMsgError'),
                flashMsgSuccess: req.flash('flashMsgSuccess'),
                data: _formData,
                formActionTarget : "/admin/country/update/" + id,
                status: 'Error',
                customFieldErrors: customFieldErrors,
                module: 'Admin Ads Data ',
                submodule: 'Location-country ',
                title: 'Location-country ',
                subtitle: 'Update',
                link1: '/admin/country/index'
            });
        
            } else {
                // return res.redirect('/admin/country/index');
                //  ==================Start=====================
                return Country.update({id: id}, _formData).then(function (_updateSingle) {
                                   
                    req.flash('flashMsgSuccess', 'Data Update Success.');
                    return res.redirect('/admin/country/index');
                }).catch(function (err) {
                    console.log('err 1 =', err);
                    req.flash('flashMsgError', 'Error in Data Update');
                    // ===============
                    return res.view("admin/country/edit", {
                    flashMsgError: req.flash('flashMsgError'),
                    flashMsgSuccess: req.flash('flashMsgSuccess'),
                    data: sinExistdata,
                    formActionTarget : "/admin/country/update/" + id,
                    status: 'Error',
                    errorType: 'validation-error',
                    customFieldErrors: {},
                    module: 'Admin Ads Data ',
                    submodule: 'Location-country ',
                    title: 'Location-country ',
                    subtitle: 'Update',
                    link1: '/admin/country/index'
                    });
            
                });// ------catch End----
                //  ==================End=======================
            }
        }).catch(function (err) {
            console.log('err 2 =', err);
            req.flash('flashMsgError', 'Error In Data Update');
            return res.redirect('/admin/country/index');
        });
     // ==================Save End=======================
    
      },
      view: function (req, res) {
        var id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'Data Id Not Found');
          return res.redirect('/admin/country/index');
        }
    
        Country.findOne({id:id}).then(function (singleData){
          if (!singleData) {
            req.flash('flashMsgError', 'Data Not Found In Database');
            return res.redirect('/admin/country/index');
          }else{
            return res.view("admin/country/view", {
                flashMsgError: req.flash('flashMsgError'),
                flashMsgSuccess: req.flash('flashMsgSuccess'),
                data: singleData,
                moment: moment,
                module: 'Admin Ads Data ',
                submodule: 'Location-country ',
                title: 'Location-country ',
                subtitle: 'View',
                link1: '/admin/country/index'
            });
          }
        })
          .catch(function (err) {
            req.flash('flashMsgError', 'Error In Data View');
            return res.redirect('/admin/country/index');
          });
      },

      delete : function (req, res) {
        let id = req.param('id');
        if (!id){
          req.flash('flashMsgError', 'ID not found');
          return res.redirect('/admin/country/index');
        };
    
        Promise.all([
          Country.findOne({id: id}),
          State.findOne({country:id},{select: ['id']}),
        ]).spread(function(deleteData, stateHasData){
          if(!deleteData){
            req.flash('flashMsgError', 'Data Not found In Database');
            return res.redirect('/admin/country/index');
          }
          if(stateHasData ){
            req.flash('flashMsgError', 'It Has Related Data You Cannot Delete It');
            return res.redirect('/admin/country/index');
          } else {
            deleteData.destroy().then(function (_deldata) {
              req.flash('flashMsgSuccess', 'Record Deleted Successfully.');
              return res.redirect('/admin/country/index');
            });
          }
        }).catch(function(err){
          req.flash('flashMsgError', 'Error in Delete');
          return res.redirect('/admin/country/index');
        });
    
      },

      // *********************Backend API Start**************************
   
   backendApiRelatedState: function (req, res) {
    let countryId = req.param("countryId") ? req.param("countryId").trim() : '';
    State.find({select: ['name']}).where({country: countryId}).sort('name ASC').then(function(states){
      console.log('states==', states);    
      return res.json({
            status: 'success',
            country: countryId,
            states: states
          });
      }).catch(function(err){
        return res.json({
          status: 'error',
          err: err
        });
    });
  },
  // *********************Backend API End****************************

  

};

