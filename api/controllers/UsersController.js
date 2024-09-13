/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
// var validator = require('sails-validator-tool');

let moment = require('moment');
let Promise = require('bluebird');
let Q = require('q');
let _ = require('lodash');
let zeCommon = sails.config.zeCommon;

module.exports = {

  _config: {
    // actions: false,
    shortcuts: false,
    // rest: true
  },

  // It is used for Api Register
  register: function(req,res){
    API(Registration.registerUser,req,res);
  },
  // It is used for Manualy From backend Register
  localregister: function(req,res){
    API(Registration.registerLocalUser,req,res);
  },
  'verify/:email': function(req,res){
    API(Registration.verifyUser,req,res);
  },
  current: function(req,res){
   var result =  API(Registration.currentUser,req,res);
  },

  whousetoken: function(req,res){
    // res.json({ result: req.identity });
    let tokUser = req.identity || ''; 
    // let tokUser = 'aa' || {}; 
    res.json({ result: tokUser });
  },

  // -----User Define Action Start-----

  


  index: function (req, res) {
    // console.log('Session ID =  '+req.session.cusId);
    // console.log('Cookies  == '+req.cookies.customerId);
    //
    // console.log('Session ID Before =  '+ JSON.stringify(req.session));
    // delete req.session.cusId;
    // console.log('Session ID After =  '+ JSON.stringify(req.session));
    // console.log('Session ID =  '+req.session.cusId);
    // console.log('LLOog User', req.user);
    
    var qdata = {
      user_type: [1,3]
      // user_role: [1,2]
      // is_customer: false
    };
    var currentPage = req.param("page");
    if(!currentPage){
      currentPage = 1;
    }

    // var pageLimit = 5;
    // var pageLimit = 30;
    let pageLimit = req.param("page_limit") ? req.param("page_limit") : zeCommon.pageLimit; //how many items to show per page

    var paUsername = req.param("username") ? req.param("username").trim() : '';

    var paCountry = req.param("country") ? req.param("country").trim() : '';
    var paState = req.param("state") ? req.param("state").trim() : '';

    var paStatus = req.param("status") ? req.param("status").trim() : '';
    var paSortBy = req.param("sort_by") ? req.param("sort_by").trim() : 'ASC';

    if(paUsername){
      qdata.username = { 'like': '%'+paUsername+'%' };
    }
    
    if(paCountry){
        qdata.country = paCountry;
    }
    if(paState){
        qdata.state = paState;
    }

    if(paStatus){
      qdata.status = paStatus;
    }

    // =============Embaded Start===============
    return Q.all([
      Users.count(qdata),
      Users.find(qdata).populate('rolePermission').paginate({page: currentPage, limit: pageLimit}).sort('id ' +paSortBy),
      RolePermission.find({select: ['role_name']}).sort('sort ASC'),
      Country.find({status: 1},{select: ['name']}).sort('sort ASC'),
      State.find({status: 1},{select: ['name']}).sort('sort ASC'),
    ])
      .spread(function(totalCount, allUsers, allRolePermission, allCountry, allState){
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

        return res.view("admin/user/index", {
          flashMsgError: req.flash('flashMsgError'),
          flashMsgSuccess: req.flash('flashMsgSuccess'),
          alldata: allUsers,
          allRolePermission: allRolePermission,
          allCountry: allCountry,
          allState: allState,

          moment: moment,
          module: 'Users ',
          submodule: 'Backend-user',
          title: 'Backend-user ',
          subtitle: 'Index',
          link1: '/admin/user/index/',
          // linkback1: '/admin/current-election/index/',
          linknew: '/admin/user/new/',

          paginateUrl: '/admin/user/index',
          pageLimit: pageLimit, // Per page how much i want to see,
          pageCount: pageCount, // How many page in this index e.x: if total record 20 and page size 4 it will be 20/4(totalrecord/pageSize) // This is last page
          currentPage: currentPage,
          adjacents: 2,
          lpm1: pageCount - 1,

          paUsername: paUsername,
          paCountry: paCountry,
          paState: paState,
          paStatus: paStatus,
          paSortBy: paSortBy,
          totalCount: totalCount,
          paginateVariable : '&username='+paUsername+'&country='+paCountry+'&state='+paState+'&status='+paStatus+'&sort_by='+paSortBy+'&page_limit='+pageLimit,

        });

        // **************************
      }).catch(function(err){
        req.flash('flashMsgError', 'Error In User Index');
        return res.redirect('/admin/user/index');
      });
    // =============Embaded End=================

  },

  new_old : function (req, res) {
    var _formData = {
      email: "",
      // username: "",
      password: "",
      confirm_password: "",
      // password_reset_code: Users.generateTokenString(),
      user_type: 0,
      first_name: "",
      last_name: "",
      image: "",
      // gender: 0,
      // mobile_no: "",
      // street_address: "",
      // city: "",
      // state: "",
      // zip: "",
      status: 0,
    };
    return res.view("admin/user/new", {
      flashMsgError: req.flash('flashMsgError'),
      flashMsgSuccess: req.flash('flashMsgSuccess'),
      data: _formData,
      formActionTarget : "/admin/user/create",
      status: 'OK',
      fieldErrors: {},
      customFieldErrors: {},
      title: 'User',
      subtitle: 'New',
      link1: '/admin/user/index'
    });
  },

  new : function (req, res) {
    // console.log("Inside new..............");
    var _formData = {
      email: "",
      // username: "",
      password: "",
      confirm_password: "",
      // password_reset_code: Users.generateTokenString(),
      // user_type: 0,
      first_name: "",
      last_name: "",
      rolePermission: "",
      // image: "",
      // gender: 0,
      // mobile_no: "",
      // street_address: "",
      // city: "",
      // country: "",
      // state: "",
      // zip: "",
      status: 0,
    };

    Promise.all([
      // RolePermission.find({},{select: ['role_name']}).sort('sort ASC')
      RolePermission.find({select: ['role_name']}).sort('sort ASC'),
      // State.find({status: 1},{select: ['name']}).sort('sort ASC'),
    ])
      .spread(function(allRolePermission){
        console.log('allRolePermission', allRolePermission);
        return res.view("admin/user/new", {
          flashMsgError: req.flash('flashMsgError'),
          flashMsgSuccess: req.flash('flashMsgSuccess'),
          data: _formData,
          allRolePermission: allRolePermission,
          // allState: allState,
          formActionTarget : "/admin/user/create",
          status: 'OK',
          customFieldErrors: {},
          module: 'Users ',
          submodule: 'Backend-user',
          title: 'Backend-user ',
          subtitle: 'New',
          link1: '/admin/user/index'
        });

      }).catch(function(err){
      req.flash('flashMsgError', 'Error In New');
      return res.redirect('/admin/user/index');
    });

  },

  
  create : function (req, res) {
    var date = new Date();

    // let main_image = req.file('image');
    // let oldImage = req.param("oldImage")  ? req.param("oldImage").trim() : '';
    var _formData = {
      email: req.param("email") ? req.param("email").trim() : '',
      // username: req.param("username") ? req.param("username").trim() : '',
      password: req.param("password") ? req.param("password").trim() : '',
      confirm_password: req.param("confirm_password") ? req.param("confirm_password").trim() : '',
      password_reset_code: Users.generateTokenString(),

      // user_type: (req.param("user_type") && req.param("user_type") > 0) ? req.param("user_type") : 0,
      user_type: 3,
      rolePermission: req.param("rolePermission") ? req.param("rolePermission").trim() : '',

      first_name: req.param("first_name") ? req.param("first_name").trim() : '',
      last_name: req.param("last_name") ? req.param("last_name").trim() : '',
      // mobile_no: req.param("mobile_no") ? req.param("mobile_no").trim() : '',
      // street_address: req.param("street_address") ? req.param("street_address").trim() : '',
      // country: req.param("country") ? req.param("country").trim() : '',
      // state: req.param("state") ? req.param("state").trim() : '',
      // city: req.param("city") ? req.param("city").trim() : '',
      // zip: req.param("zip") ? req.param("zip").trim() : '',
      date_registered: date,
      date_verified: date,
      status: (req.param("status") && req.param("status") > 0) ? req.param("status") : 0,
      is_token_based_user: false,
      
      createdBy: req.user.id,
      createdByObj: {email: req.user.email},
      updatedBy: '',
      updatedByObj: {email: ''}
    };
    //console.log('asas_formData',_formData);

    
// =============Custom Error Start==================
const customFieldErrors = {};
if (!_formData.email) {
  customFieldErrors.email = {message: 'Email is Required'};
} else {
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (reg.test(_formData.email) == false) 
    {
        customFieldErrors.email = {message: 'Provide valid email address'};
    }
}

// if (!_formData.username) {
//   customFieldErrors.username = {message: 'Username is Required'};
// }

if (!_formData.password) {
  customFieldErrors.password = {message: 'Password is Required'};
} else {
  if(_formData.password.length < 6) {
    customFieldErrors.password = {message: 'Password Min length is 6'};
  } else{
    if(_formData.password != _formData.confirm_password) {
      customFieldErrors.confirm_password = {message: 'confirm Password not match'};
    }
  }
}

if (!_formData.rolePermission) {
  customFieldErrors.rolePermission = {message: 'User Role is Required'};
}


if (!_formData.first_name) {
  customFieldErrors.first_name = {message: 'First Name is Required'};
}

if (!_formData.last_name) {
  customFieldErrors.last_name = {message: 'Last Name is Required'};
}

// if (!_formData.mobile_no) {
//   customFieldErrors.mobile_no = {message: 'Mobile no is Required'};
// }
// if (!_formData.street_address) {
//   customFieldErrors.street_address = {message: 'Street address is Required'};
// }
// if (!_formData.city) {
//   customFieldErrors.city = {message: 'City is Required'};
// }
// if (!_formData.country) {
//   customFieldErrors.country = {message: 'Country is Required'};
// }
// if (!_formData.state) {
//   customFieldErrors.state = {message: 'State is Required'};
// }
// if (!_formData.zip) {
//   customFieldErrors.zip = {message: 'zip is Required'};
// }

if (!_formData.status) {
  customFieldErrors.status = {message: 'User Status is Required'};
}


// let uploadSaveLocation = '.tmp/public/uploads/backend-user';
// let uploadCopyLocation = 'assets/uploads/backend-user';
return Promise.all([
  RolePermission.find({},{select: ['role_name']}).sort('sort ASC'), //<--All record For Show at form 
  // State.find({status: 1},{select: ['name']}).sort('sort ASC'), //<--All record For Show at form 
  // ZeFileUploadService.imageUploadForCreate(main_image, oldImage, 800, 800, uploadSaveLocation, uploadCopyLocation, false, 1), //<--For image upload
  Users.findOne({email: _formData.email}), //<--For validation Check
  // Users.findOne({username: _formData.username}), //<--For validation Check
  // State.findOne({id: _formData.state}), //<--For validation Check
])
  // .spread(function(allRolePermission, allState, main_image_Ret, extEmail, extUsername, extState){
  .spread(function(allRolePermission, extEmail){
//    console.log('extName is', extName);
      // if(!extState){
      //   customFieldErrors.state = {message: 'State is invalid'};
      // } else {
      //   _formData.country = extState.country;
      // }

      if(extEmail){
        customFieldErrors.email = {message: 'Email Address is already taken'};
      }

      // if(extUsername){
      //   customFieldErrors.username = {message: 'Username is already taken'};
      // }
    // ******************** Image File Upload Start**********************
    // ============================ Image Strat===============================
    // if(!main_image_Ret.errorFound){
    //   _formData.image = main_image_Ret.coreUploadFile;
    //   if(main_image_Ret.coreUploadFile == ''){
    //     customFieldErrors.image = {message: 'Image File is Requird'};
    //   }
    // }else{
    //   _formData.image = main_image_Ret.coreUploadFile;
    //   customFieldErrors.image = {message: main_image_Ret.errorMessage};
    // }
    // ============================ Image End=================================
    // ******************** Image File Upload End************************
    if (Object.keys(customFieldErrors).length) {
      console.log('eeee1', customFieldErrors);
      req.flash('errorMessage', 'Error in Create');
        return res.view('admin/user/new', {
          flashMsgError: req.flash('flashMsgError'),
          flashMsgSuccess: req.flash('flashMsgSuccess'),
          data: _formData,
          allRolePermission: allRolePermission,
          // allState: allState,
          formActionTarget : "/admin/user/create",
          status: 'Error',
          customFieldErrors: customFieldErrors,
          fieldErrors: {},
          module: 'Users ',
          submodule: 'Backend-user',
          title: 'Backend-user ',
          subtitle: 'Create',
          link1: '/admin/user/index'
      });

    } else {
              
      return Users.create(_formData).then(function (createData) {
          req.flash('flashMsgSuccess', 'User Create Success.');
          return res.redirect('/admin/user/index');
      }).catch(function (err) {
        console.log('err2', err);
        req.flash('flashMsgError', 'Error in User Create');
        // ===============
        return res.view("admin/user/new", {
          flashMsgError: req.flash('flashMsgError'),
          flashMsgSuccess: req.flash('flashMsgSuccess'),
          data: _formData,
          allRolePermission: allRolePermission,
          // allState: allState,
          formActionTarget : "/admin/user/create",
          status: 'Error',
          errorType: 'validation-error',
          customFieldErrors: {},
          fieldErrors: {},
          module: 'Users ',
          submodule: 'Backend-user',
          title: 'Backend-user ',
          subtitle: 'Create',
          link1: '/admin/user/index'
        });
  
      });// ------catch End----
    }
  }).catch(function(err){
    console.log(err);
    req.flash('flashMsgError', 'Error In New');
    return res.redirect('/admin/user/index');
  });;
// =============Promisses End=======================
  },
  
    
  edit_old: function (req, res) {
    var id = req.param('id');
    console.log('hghghghghg');
    if (!id){
      req.flash('flashMsgError', 'User Id Not Found');
      return res.redirect('/admin/user/index');
    }

    Users.findOne({id:id}).then(function (singleData){
      if (!singleData) {
        req.flash('flashMsgError', 'User Not Found In Database');
        return res.redirect('/admin/user/index');
      }else{
        return res.view("admin/user/edit", {
          flashMsgError: req.flash('flashMsgError'),
          flashMsgSuccess: req.flash('flashMsgSuccess'),
          data: singleData,
          formActionTarget : "/admin/user/update/" + id,
          status: 'OK',
          customFieldErrors: {},
          fieldErrors: {},
          title: 'User',
          subtitle: 'Edit',
          link1: '/admin/user/index'
        });
      }
    })
      .catch(function (err) {
        req.flash('flashMsgError', 'Error In User Edit');
        return res.redirect('/admin/user/index');
      });
  },
  edit: function (req, res) {
    var id = req.param('id');
    if (!id){
      req.flash('flashMsgError', 'ID not found');
      return res.redirect('/admin/user/index');
    }
    Promise.all([
      Users.findOne({id:id}),
      RolePermission.find({},{select: ['role_name']}).sort('sort ASC'), //<--All record For Show at form 
      // State.find({status: 1},{select: ['name']}).sort('sort ASC'), //<--All record For Show at form 
    ])
      // .spread(function(existSingleData, allRolePermission, allState){
      .spread(function(existSingleData, allRolePermission){

        if(!existSingleData){
          req.flash('flashMsgError', 'Record Not Found In Database');
          return res.redirect('/admin/user/index');
        } else {
          console.log('existSingleData===', existSingleData);
            return res.view("admin/user/edit", {
              flashMsgError: req.flash('flashMsgError'),
              flashMsgSuccess: req.flash('flashMsgSuccess'),
              sinExistdata: existSingleData,
              data: existSingleData,
              allRolePermission: allRolePermission,
              // allState: allState,
              formActionTarget : "/admin/user/update/" + id,
              status: 'OK',
              customFieldErrors: {},
              module: 'Users ',
              submodule: 'Backend-user',
              title: 'Backend-user ',
              subtitle: 'Edit',
              link1: '/admin/user/index'
            });
        }
      }).catch(function(err){
      req.flash('flashMsgError', 'Error in Edit');
      return res.redirect('/admin/user/index');
    });
  },
  update_old: function (req, res) {
    var id = req.param('id');
    if (!id){
      req.flash('flashMsgError', 'User ID not found');
      return res.redirect('/admin/user/index');
    }

    let main_image = req.file('image');
    let oldImage = req.param("oldImage")  ? req.param("oldImage").trim() : '';

    var _formData = {
      email: req.param("email")  ? req.param("email").trim() : '',
      user_role: (req.param("user_role") && req.param("user_role") > 0) ? req.param("user_role") : 0,
      nickname: req.param("nickname") ? req.param("nickname").trim() : '',
      first_name: req.param("first_name") ? req.param("first_name").trim() : '',
      last_name: req.param("last_name") ? req.param("last_name").trim() : '',
      mobile_no: req.param("mobile_no") ? req.param("mobile_no").trim() : '',
      status: (req.param("status") && req.param("status") > 0) ? req.param("status") : 0,
      updatedBy: req.user.id,
      updatedByObj: {email: req.user.email}
    };
 // =============Custom Error Start==================
    // const user_role = req.param("user_role")  ? req.param("user_role").trim() : '';
    const customFieldErrors = {};
    
    if (!_formData.email) {
      customFieldErrors.email = {message: 'Email is Required'};
    } else {
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (reg.test(_formData.email) == false) 
        {
            customFieldErrors.email = {message: 'Provide valid email address'};
        }
    }
    if (!_formData.nickname) {
      customFieldErrors.nickname = {message: 'Nickname is Required'};
    }
    if (!_formData.first_name) {
      customFieldErrors.first_name = {message: 'First Name is Required'};
    }

    if (!_formData.mobile_no) {
      customFieldErrors.mobile_no = {message: 'Mobile_no is Required'};
    }
    if (!_formData.user_role) {
      customFieldErrors.user_role = {message: 'User Role is Required'};
    }

    if (!_formData.status) {
      customFieldErrors.status = {message: 'User Status is Required'};
    }

 // =============Custom Error End====================

 let uploadSaveLocation = '.tmp/public/uploads/user-image';
 let uploadCopyLocation = 'assets/uploads/user-image';

 // ==================Save Start=====================
 Promise.all([
  Users.findOne({id: id}),
  ZeFileUploadService.imageUploadForCreate(main_image, oldImage, 500, 500, uploadSaveLocation, uploadCopyLocation, false, 1), //<--For image upload
  Users.findOne({email: _formData.email})
  ]).spread(function(sinExistdata, main_image_Ret, extEmail) {
    
    if(extEmail){
      if(sinExistdata.id != extEmail.id){
        customFieldErrors.email = {message: 'Email Address is already taken'};
      }
    }

    // ============================ Image Strat===============================
    if(!main_image_Ret.errorFound){
      _formData.image = main_image_Ret.coreUploadFile;
      if(main_image_Ret.coreUploadFile == ''){
        customFieldErrors.image = {message: 'Image File is Requird'};
      }
      // console.log(' 1 is after Upload');
    }else{
      _formData.image = main_image_Ret.coreUploadFile;
      customFieldErrors.image = {message: main_image_Ret.errorMessage};
      // console.log(' 2 is after Upload');
    }
    // ============================ Image End=================================

    if (Object.keys(customFieldErrors).length) {
      req.flash('errorMessage', 'Error in Update');
        return res.view('admin/user/edit', {
          flashMsgError: req.flash('flashMsgError'),
          flashMsgSuccess: req.flash('flashMsgSuccess'),
          data: _formData,
          formActionTarget : "/admin/user/update/" + id,
          status: 'Error',
          customFieldErrors: customFieldErrors,
          fieldErrors: {},
          title: 'User',
          subtitle: 'Update',
          link1: '/admin/user/index'
      });

    } else {
    //  ==================Start=====================
    
    return Users.update({id: id}, _formData).then(function (_updateSingle) {
        req.flash('flashMsgSuccess', 'User Update Success.');
        return res.redirect('/admin/user/index');
      
    }).catch(function (err) {
      req.flash('flashMsgError', 'Error in User Update');
      // ===============
      return res.view("admin/user/edit", {
        flashMsgError: req.flash('flashMsgError'),
        flashMsgSuccess: req.flash('flashMsgSuccess'),
        data: sinExistdata,
        formActionTarget : "/admin/user/update/" + id,
        status: 'Error',
        errorType: 'validation-error',
        customFieldErrors: {},
        fieldErrors: {},
        title: 'User',
        subtitle: 'Update',
        link1: '/admin/user/index'
      });

    });// ------catch End----
    //  ==================End=======================
    }
  }).catch(function (err) {
    req.flash('flashMsgError', 'Error In User Update');
    return res.redirect('/admin/user/index');
  });
 // ==================Save End=======================

  },

  update: function (req, res) {
    console.log('I m in Update 1');
    var id = req.param('id');
    if (!id){
      req.flash('flashMsgError', 'ID not found');
      return res.redirect('/admin/user/index');
    };

    // let main_image = req.file('image');
    // let oldImage = req.param("oldImage")  ? req.param("oldImage").trim() : '';

    var _formData = {
        // email: req.param("email") ? req.param("email").trim() : '',
        // username: req.param("username") ? req.param("username").trim() : '',
        
        rolePermission: req.param("rolePermission") ? req.param("rolePermission").trim() : '',
        first_name: req.param("first_name") ? req.param("first_name").trim() : '',
        last_name: req.param("last_name") ? req.param("last_name").trim() : '',
        // mobile_no: req.param("mobile_no") ? req.param("mobile_no").trim() : '',
        // street_address: req.param("street_address") ? req.param("street_address").trim() : '',
        // country: req.param("country") ? req.param("country").trim() : '',
        // state: req.param("state") ? req.param("state").trim() : '',
        // city: req.param("city") ? req.param("city").trim() : '',
        // state: req.param("state") ? req.param("state").trim() : '',
        // zip: req.param("zip") ? req.param("zip").trim() : '',
        status: (req.param("status") && req.param("status") > 0) ? req.param("status") : 0,

        updatedBy: req.user.id,
        updatedByObj: {email: req.user.email}
      };

      // =============Custom Error Start==================
      const customFieldErrors = {};
      
      if (!_formData.rolePermission) {
        customFieldErrors.rolePermission = {message: 'User Role is Required'};
      }
            
      if (!_formData.first_name) {
        customFieldErrors.first_name = {message: 'First Name is Required'};
      }
      
      if (!_formData.last_name) {
        customFieldErrors.last_name = {message: 'Last Name is Required'};
      }
      
      // if (!_formData.mobile_no) {
      //   customFieldErrors.mobile_no = {message: 'Mobile no is Required'};
      // }
      // if (!_formData.street_address) {
      //   customFieldErrors.street_address = {message: 'Street address is Required'};
      // }
      // if (!_formData.city) {
      //   customFieldErrors.city = {message: 'City is Required'};
      // }
      // if (!_formData.country) {
      //   customFieldErrors.country = {message: 'Country is Required'};
      // }
      // if (!_formData.state) {
      //   customFieldErrors.state = {message: 'State is Required'};
      // }
      // if (!_formData.zip) {
      //   customFieldErrors.zip = {message: 'zip is Required'};
      // }
      
      if (!_formData.status) {
        customFieldErrors.status = {message: 'User Status is Required'};
      }
      
      
      
  
     // =============Custom Error End====================

    // =============Save Start=====================
        // #########################
        return Users.findOne({id:id}).then(function (sinExistdata){
          if (!sinExistdata) {
            req.flash('flashMsgError', 'Record Not found 11');
            return res.redirect('/admin/user/index');
          } else {
            // let uploadSaveLocation = '.tmp/public/uploads/backend-user';
            // let uploadCopyLocation = 'assets/uploads/backend-user';
            Promise.all([
              RolePermission.find({},{select: ['role_name']}).sort('sort ASC'), //<--All Role For Show at form
              // State.find({status: 1},{select: ['name']}).sort('sort ASC'), //<--All record For Show at form 
              // ZeFileUploadService.imageUploadForCreate(main_image, oldImage, 200, 200, uploadSaveLocation, uploadCopyLocation, false, 1), //<--For image upload 
              // State.findOne({id: _formData.state}), //<--For validation Check
              // ]).spread(function(allRolePermission, allState, main_image_Ret, extState) {
              ]).spread(function(allRolePermission) {
                console.log('I m in Update 2');
                // if(extSusSubCategory || extProduct){
                //   req.flash('flashMsgError', 'Cannot Update this Sub category it has Sub-sub-category Or Product , Please Contact With Admin');
                //   return res.redirect('/admin/user/index');
                // }

                // if(!extState){
                //   customFieldErrors.state = {message: 'State is invalid'};
                // } else {
                //   _formData.country = extState.country;
                // }

                // if(extEmail){
                //   customFieldErrors.email = {message: 'Email Address is already taken'};
                // }
          
                // if(extUsername){
                //   customFieldErrors.username = {message: 'Username is already taken'};
                // }
      
                
                // ******************** Image File Upload Start**********************
              // ============================ Image Strat===============================
              // if(!main_image_Ret.errorFound){
              //   _formData.image = main_image_Ret.coreUploadFile;
              //   if(main_image_Ret.coreUploadFile == ''){
              //     customFieldErrors.image = {message: 'Image File is Requird'};
              //   }
              // }else{
              //   _formData.image = main_image_Ret.coreUploadFile;
              //   customFieldErrors.image = {message: main_image_Ret.errorMessage};
              // }
              // ============================ Image End=================================
              // ******************** Image File Upload End************************

              if (Object.keys(customFieldErrors).length) {
                console.log('customFieldErrors', customFieldErrors);
                    req.flash('errorMessage', 'Error in Update');
                      return res.view('admin/user/edit', {
                        flashMsgError: req.flash('flashMsgError'),
                        flashMsgSuccess: req.flash('flashMsgSuccess'),
                        sinExistdata: sinExistdata,
                        data: _formData,
                        allRolePermission: allRolePermission,
                        // allState: allState,
                        formActionTarget : "/admin/user/update/" + id,
                        status: 'Error',
                        customFieldErrors: customFieldErrors,
                        module: 'Users ',
                        submodule: 'Backend-user',
                        title: 'Backend-user ',
                        subtitle: 'Update',
                        link1: '/admin/user/index'
                    });
          
              } else {
                // =================================
                    return Users.update(id, _formData).then(function (_updateSingle) {
                          req.flash('flashMsgSuccess', 'Sub-category Create Success.');
                          return res.redirect('/admin/user/index');
            
                      }).catch(function (err) {
                            console.log('err 1', err);
                            req.flash('flashMsgError', 'Error in Sub-category Update');
                            return res.view("admin/user/new", {
                              flashMsgError: req.flash('flashMsgError'),
                              flashMsgSuccess: req.flash('flashMsgSuccess'),
                              data: sinExistdata,
                              sinExistdata: sinExistdata,
                              allRolePermission: allRolePermission,
                              // allState: allState,
                              formActionTarget : "/admin/user/update/" + id,
                              status: 'Error',
                              errorType: 'validation-error',
                              customFieldErrors: {},
                              module: 'Users ',
                              submodule: 'Backend-user',
                              title: 'Backend-user ',
                              subtitle: 'Update',
                              link1: '/admin/user/index'
                            });
                          });// <--Create record Catch End
  
                     } //<--Validation Check Else End
                // =================================
              });
          } //<--sinExistdata Else End
          
      }).catch(function(err){
        console.log('err 2', err);
        req.flash('flashMsgError', 'Error in Record update');
        return res.redirect('/admin/user/index');
      });
    // =============Slug Create End=================

  },


  view: function (req, res) {
    var id = req.param('id');
    if (!id){
      req.flash('flashMsgError', 'User Id Not Found');
      return res.redirect('/admin/user/index');
    }

    Users.findOne({id:id}).populate('rolePermission').then(function (singleData){
      if (!singleData) {
        req.flash('flashMsgError', 'User Not Found In Database');
        return res.redirect('/admin/user/index');
      }else{
        return res.view("admin/user/view", {
          flashMsgError: req.flash('flashMsgError'),
          flashMsgSuccess: req.flash('flashMsgSuccess'),
          data: singleData,
          moment: moment,
          module: 'Users ',
          submodule: 'Backend-user',
          title: 'Backend-user ',
          subtitle: 'View',
          link1: '/admin/user/index'
        });
      }
    })
      .catch(function (err) {
        req.flash('flashMsgError', 'Error In User View');
        return res.redirect('/admin/user/index');
      });
  },

  changePassword: function (req, res) {
    console.log('i am at changePassword');
    var id = req.param('id');
    if (!id){
      req.flash('flashMsgError', 'User ID not found');
      return res.redirect('/admin/user/index');
    }

    Users.findOne({id:id}).exec(function (err, singleData){
      if (err) {
        req.flash('flashMsgError', 'Error Password change');
        return res.redirect('/admin/user/index');
      }
      if (singleData) {
        return res.view("admin/user/changePassword", {
          flashMsgError: req.flash('flashMsgError'),
          flashMsgSuccess: req.flash('flashMsgSuccess'),
          formActionTarget : "/admin/user/password-update/" + singleData.id,
          status: 'OK',
          fieldErrors: {},
          title: 'User',
          subtitle: 'Change Password',
          link1: '/admin/user/index'
        });
      }
    });
  },
  passwordUpdate: function (req, res) {
    var id = req.param('id');
    if (!id){
      req.flash('flashMsgError', 'User ID not found');
      return res.redirect('/admin/user/index');
    }

    var _formData = {
      password: req.param("password")  ? req.param("password").trim() : '',
      updatedBy: req.user.id,
      updatedByObj: {username: req.user.username, email: req.user.email, display_name: req.user.display_name}
    };
    // =============Custom Error Start==================
    const customFieldErrors = {};
    if (!_formData.password) {
      customFieldErrors.password = {message: 'Password is Required'};
    } else {
      if(_formData.password.length < 6) {
        customFieldErrors.password = {message: 'Password Min length is 6'};
      }
    }
    // =============Custom Error End====================

    //  ==================Save Start====================
    if (Object.keys(customFieldErrors).length) {
      req.flash('flashMsgError', 'Error in Password change');
        return res.view('admin/user/changePassword', {
          flashMsgError: req.flash('flashMsgError'),
          flashMsgSuccess: req.flash('flashMsgSuccess'),
          data: _formData,
          formActionTarget : "/admin/user/password-update/" + id,
          status: 'Error',
          customFieldErrors: customFieldErrors,
          fieldErrors: {},
          title: 'User',
          subtitle: 'Password Update',
          link1: '/admin/user/index'
      });

    } else {
      //  ==================Start=====================
      return Users.update({id: id}, _formData).then(function (_updateSingle) {
        req.flash('flashMsgSuccess', 'Password change Cussessfully');
          return res.redirect('/admin/user/index');
        
      }).catch(function (err) {
        req.flash('flashMsgError', 'Error in Password change');
        // ===============
        return res.view("admin/user/changePassword", {
          flashMsgError: req.flash('flashMsgError'),
          flashMsgSuccess: req.flash('flashMsgSuccess'),
          data: {},
          formActionTarget : "/admin/user/password-update/" + id,
          status: 'Error',
          errorType: 'validation-error',
          customFieldErrors: {},
          fieldErrors: {},
          title: 'User',
          subtitle: 'Password Update',
          link1: '/admin/user/index'
        });
  
      });// ------catch End----
    }
    //  ==================Save End======================
  },
  // -----User Define Action End-------

   
};

