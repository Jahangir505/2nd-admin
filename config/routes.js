/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {
  

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
   * etc. depending on your default view engine) your home page.              *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  // '/': {
  //   view: 'homepage'
  // },

  '/': {
    view: 'auth/admin-login',
    locals: {
      layout: 'layouts/loginpage-layout.ejs'
    }
  },

  // ====================Cornjob Start========================
  'get /corn-job/unset-is-new': {
    controller: 'CornjobController',
    action: 'unsetIsNew',
    skipAssets: true,
  },
  // ====================Cornjob End==========================

  // ===================Test Start========================

  'post /test/mail-send': {
    controller: 'TestController',
    action: 'mailSend',
    skipAssets: true,
  },

  'post /test/mail-send-template': {
    controller: 'TestController',
    action: 'mailSendTemplate',
    skipAssets: true,
  },
  // ===================Test End==========================



  // 'get /test/action': {
  //   controller: 'TestController',
  //   action: 'action',
  // },

  /***************************************************************************
   *                                                                          *
   * Custom routes here...                                                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the custom routes above, it   *
   * is matched against Sails route blueprints. See `config/blueprints.js`    *
   * for configuration options and examples.                                  *
   *                                                                          *
   ***************************************************************************/

// ----------------------Admin Panel Route Start---------------------


  'get /adminlogin': {
    view: 'auth/admin-login',
    locals: {
      layout: 'layouts/loginpage-layout.ejs'
    }
  },


  'POST /admin-login-do': {
    controller: 'AuthController',
    action: 'adminLoginDo',
    // view: 'auth/login-controler',
    locals: {
      layout: 'layouts/loginpage-layout.ejs'
    }
  },

  'get /admin/dashboard': {
    controller: 'AdminController',
    action: 'dashboard',
    locals: {
      layout: 'layouts/admin-layout.ejs'
    }
  },


  '/adminlogout': 'AuthController.adminLogout',

  
    // ======================== User Start ===================================
    'get /admin/user/index': {
      controller: 'UsersController',
      action: 'index',
      skipAssets: true,
    },
    'get /admin/user/new': {
      controller: 'UsersController',
      action: 'new',
      skipAssets: true,
    },
    'POST /admin/user/create': {
      controller: 'UsersController',
      action: 'create',
      skipAssets: true,
    },
    'get /admin/user/edit/:id': {
      controller: 'UsersController',
      action: 'edit',
      skipAssets: true,
    },

    'POST /admin/user/update/:id': {
      controller: 'UsersController',
      action: 'update',
      skipAssets: true,
    },

    'get /admin/user/view/:id': {
      controller: 'UsersController',
      action: 'view',
      skipAssets: true,
    },

    'get /admin/user/change-password/:id': {
      controller: 'UsersController',
      action: 'changePassword',
      skipAssets: true,
    },

    'POST /admin/user/password-update/:id': {
      controller: 'UsersController',
      action: 'passwordUpdate',
      skipAssets: true,
    },


    // ======================== User End =====================================

    // ======================== Customer Start ===================================
    'get /admin/customer/index': {
      controller: 'CustomerController',
      action: 'index',
      skipAssets: true,
    },
   
    // 'get /admin/customer/edit/:id': {
    //   controller: 'CustomerController',
    //   action: 'edit',
    //   skipAssets: true,
    // },

    // 'POST /admin/customer/update/:id': {
    //   controller: 'CustomerController',
    //   action: 'update',
    //   skipAssets: true,
    // },

    'get /admin/customer/view/:id': {
      controller: 'CustomerController',
      action: 'view',
      skipAssets: true,
    },

    // ======================== Customer End =====================================

    // ======================== Business Start ===================================
    'get /admin/business-user/index': {
      controller: 'BusinessUserController',
      action: 'index',
      skipAssets: true,
    },
   
    // 'get /admin/business-user/edit/:id': {
    //   controller: 'BusinessUserController',
    //   action: 'edit',
    //   skipAssets: true,
    // },

    // 'POST /admin/business-user/update/:id': {
    //   controller: 'BusinessUserController',
    //   action: 'update',
    //   skipAssets: true,
    // },

    'get /admin/business-user/view/:id': {
      controller: 'BusinessUserController',
      action: 'view',
      skipAssets: true,
    },

    // ======================== Business End =====================================

    // ======================== Ads Start ===================================

    'get /admin/ads/index': {
      controller: 'BusinessProfileController',
      action: 'index',
      skipAssets: true,
    },
    'get /admin/ads/view/:id': {
      controller: 'BusinessProfileController',
      action: 'view',
      skipAssets: true,
    },

  // ======================== Ads End =====================================


    


    // ======================== Rolepermission Start ===================================
    'get /admin/role-permission/index': {
      controller: 'RolePermissionController',
      action: 'index',
      skipAssets: true,
    },
    'get /admin/role-permission/new': {
      controller: 'RolePermissionController',
      action: 'new',
      skipAssets: true,
    },
    'POST /admin/role-permission/create': {
      controller: 'RolePermissionController',
      action: 'create',
      skipAssets: true,
  
    },
    'get /admin/role-permission/edit/:id': {
      controller: 'RolePermissionController',
      action: 'edit',
      skipAssets: true,
    },
  
    'POST /admin/role-permission/update/:id': {
      controller: 'RolePermissionController',
      action: 'update',
      skipAssets: true,
    },
  
    'get /admin/role-permission/view/:id': {
      controller: 'RolePermissionController',
      action: 'view',
      skipAssets: true,
      },

    'post /admin/role-permission/delete': {
      controller: 'RolePermissionController',
      action: 'delete',
      skipAssets: true,
    },

    'get /admin/role-permission/assign-to/:id': {
      controller: 'RolePermissionController',
      action: 'assignTo',
      skipAssets: true,
    },

    'POST /admin/role-permission/assign-to-save/:id': {
      controller: 'RolePermissionController',
      action: 'assignToSave',
      skipAssets: true,
    },
  
    
  
    // ======================== Rolepermission End =====================================

  // ======================== Category Start==================================
  'get /admin/category/index': {
    controller: 'CategoryController',
    action: 'index',
    skipAssets: true,
  },
  'get /admin/category/new': {
    controller: 'CategoryController',
    action: 'new',
    skipAssets: true,
  },
  'post /admin/category/create': {
    controller: 'CategoryController',
    action: 'create',
    skipAssets: true,
  },
  'get /admin/category/edit/:id': {
    controller: 'CategoryController',
    action: 'edit',
    skipAssets: true,
  },
  'post /admin/category/update/:id': {
    controller: 'CategoryController',
    action: 'update',
    skipAssets: true,
  },
  'get /admin/category/view/:id': {
    controller: 'CategoryController',
    action: 'view',
    skipAssets: true,
  },
  'post /admin/category/delete': {
    controller: 'CategoryController',
    action: 'delete',
    skipAssets: true,
  },

  'post /category/backend-api-related-subcategory': {
    controller: 'CategoryController',
    action: 'backendApiRelatedSubcategory',
    skipAssets: true,
  },

  // 'post /category/backend-api-related-data-one': {
  //   controller: 'CategoryController',
  //   action: 'backendApiRelatedDataOne',
  //   skipAssets: true,
  // },

  
  // ======================== Category End ===================================

  // ======================== Subcategory Start==================================

  'get /admin/sub-category/index': {
    controller: 'SubCategoryController',
    action: 'index',
    skipAssets: true,
  },
  'get /admin/sub-category/new': {
    controller: 'SubCategoryController',
    action: 'new',
    skipAssets: true,
  },
  'post /admin/sub-category/create': {
    controller: 'SubCategoryController',
    action: 'create',
    skipAssets: true,
  },
  'get /admin/sub-category/edit/:id': {
    controller: 'SubCategoryController',
    action: 'edit',
    skipAssets: true,
  },
  'post /admin/sub-category/update/:id': {
    controller: 'SubCategoryController',
    action: 'update',
    skipAssets: true,
  },
  'get /admin/sub-category/view/:id': {
    controller: 'SubCategoryController',
    action: 'view',
    skipAssets: true,
  },
  'post /admin/sub-category/delete': {
    controller: 'SubCategoryController',
    action: 'delete',
    skipAssets: true,
  },

  
// ======================== Subcategory End ===================================

// ======================== Business Career Start==================================

'get /admin/business-career/index': {
  controller: 'BusinessCareerController',
  action: 'index',
  skipAssets: true,
},
// 'get /admin/business-career/new': {
//   controller: 'BusinessCareerController',
//   action: 'new',
//   skipAssets: true,
// },
// 'post /admin/business-career/create': {
//   controller: 'BusinessCareerController',
//   action: 'create',
//   skipAssets: true,
// },
// 'get /admin/business-career/edit/:id': {
//   controller: 'BusinessCareerController',
//   action: 'edit',
//   skipAssets: true,
// },
// 'post /admin/business-career/update/:id': {
//   controller: 'BusinessCareerController',
//   action: 'update',
//   skipAssets: true,
// },
'get /admin/business-career/view/:id': {
  controller: 'BusinessCareerController',
  action: 'view',
  skipAssets: true,
},
// 'post /admin/business-career/delete': {
//   controller: 'BusinessCareerController',
//   action: 'delete',
//   skipAssets: true,
// },


// ======================== Business Career End ===================================

// ======================== Amenity Start==================================
'get /admin/amenity/index': {
  controller: 'AmenityController',
  action: 'index',
  skipAssets: true,
},
'get /admin/amenity/new': {
  controller: 'AmenityController',
  action: 'new',
  skipAssets: true,
},
'post /admin/amenity/create': {
  controller: 'AmenityController',
  action: 'create',
  skipAssets: true,
},
'get /admin/amenity/edit/:id': {
  controller: 'AmenityController',
  action: 'edit',
  skipAssets: true,
},
'post /admin/amenity/update/:id': {
  controller: 'AmenityController',
  action: 'update',
  skipAssets: true,
},
'get /admin/amenity/view/:id': {
  controller: 'AmenityController',
  action: 'view',
  skipAssets: true,
},
'post /admin/amenity/delete': {
  controller: 'AmenityController',
  action: 'delete',
  skipAssets: true,
},



// ======================== Amenity End ===================================

 
  // ======================== Country Start==================================
  'get /admin/country/index': {
    controller: 'CountryController',
    action: 'index',
    skipAssets: true,
  },
  'get /admin/country/new': {
    controller: 'CountryController',
    action: 'new',
    skipAssets: true,
  },
  'post /admin/country/create': {
    controller: 'CountryController',
    action: 'create',
    skipAssets: true,
  },
  'get /admin/country/edit/:id': {
    controller: 'CountryController',
    action: 'edit',
    skipAssets: true,
  },
  'post /admin/country/update/:id': {
    controller: 'CountryController',
    action: 'update',
    skipAssets: true,
  },
  'get /admin/country/view/:id': {
    controller: 'CountryController',
    action: 'view',
    skipAssets: true,
    },
  'post /admin/country/delete': {
    controller: 'CountryController',
    action: 'delete',
    skipAssets: true,
  },

  'post /country/backend-api-related-state': {
    controller: 'CountryController',
    action: 'backendApiRelatedState',
    skipAssets: true,
  },
  // ======================== Country End ===================================

  // ======================== State Start==================================
  'get /admin/state/index': {
    controller: 'StateController',
    action: 'index',
    skipAssets: true,
  },
  'get /admin/state/new': {
    controller: 'StateController',
    action: 'new',
    skipAssets: true,
  },
  'post /admin/state/create': {
    controller: 'StateController',
    action: 'create',
    skipAssets: true,
  },
  'get /admin/state/edit/:id': {
    controller: 'StateController',
    action: 'edit',
    skipAssets: true,
  },
  'post /admin/state/update/:id': {
    controller: 'StateController',
    action: 'update',
    skipAssets: true,
  },
  'get /admin/state/view/:id': {
    controller: 'StateController',
    action: 'view',
    skipAssets: true,
    },
  'post /admin/state/delete': {
    controller: 'StateController',
    action: 'delete',
    skipAssets: true,
  },
  // ======================== State End ===================================

  // ======================== Page Start==================================
  'get /admin/site-page/index': {
    controller: 'SitePageController',
    action: 'index',
    skipAssets: true,
  },
  'get /admin/site-page/new': {
    controller: 'SitePageController',
    action: 'new',
    skipAssets: true,
  },
  'post /admin/site-page/create': {
    controller: 'SitePageController',
    action: 'create',
    skipAssets: true,
  },
  'get /admin/site-page/edit/:id': {
    controller: 'SitePageController',
    action: 'edit',
    skipAssets: true,
  },
  'post /admin/site-page/update/:id': {
    controller: 'SitePageController',
    action: 'update',
    skipAssets: true,
  },
  'get /admin/site-page/view/:id': {
    controller: 'SitePageController',
    action: 'view',
    skipAssets: true,
    },
  'post /admin/site-page/delete': {
    controller: 'SitePageController',
    action: 'delete',
    skipAssets: true,
  },
  // ======================== Page End ===================================

  // ======================== siteFaqCategory Start==================================
  'get /admin/site-faq-category/index': {
    controller: 'SiteFaqCategoryController',
    action: 'index',
    skipAssets: true,
  },
  'get /admin/site-faq-category/new': {
    controller: 'SiteFaqCategoryController',
    action: 'new',
    skipAssets: true,
  },
  'post /admin/site-faq-category/create': {
    controller: 'SiteFaqCategoryController',
    action: 'create',
    skipAssets: true,
  },
  'get /admin/site-faq-category/edit/:id': {
    controller: 'SiteFaqCategoryController',
    action: 'edit',
    skipAssets: true,
  },
  'post /admin/site-faq-category/update/:id': {
    controller: 'SiteFaqCategoryController',
    action: 'update',
    skipAssets: true,
  },
  'get /admin/site-faq-category/view/:id': {
    controller: 'SiteFaqCategoryController',
    action: 'view',
    skipAssets: true,
    },
  'post /admin/site-faq-category/delete': {
    controller: 'SiteFaqCategoryController',
    action: 'delete',
    skipAssets: true,
  },
  // ======================== siteFaqCategory End ===================================

// ======================== Site-faq Start==================================
'get /admin/site-faq/index': {
  controller: 'SiteFaqController',
  action: 'index',
  skipAssets: true,
},
'get /admin/site-faq/new': {
  controller: 'SiteFaqController',
  action: 'new',
  skipAssets: true,
},
'post /admin/site-faq/create': {
  controller: 'SiteFaqController',
  action: 'create',
  skipAssets: true,
},
'get /admin/site-faq/edit/:id': {
  controller: 'SiteFaqController',
  action: 'edit',
  skipAssets: true,
},
'post /admin/site-faq/update/:id': {
  controller: 'SiteFaqController',
  action: 'update',
  skipAssets: true,
},
'get /admin/site-faq/view/:id': {
  controller: 'SiteFaqController',
  action: 'view',
  skipAssets: true,
  },
'post /admin/site-faq/delete': {
  controller: 'SiteFaqController',
  action: 'delete',
  skipAssets: true,
},
// ======================== Site-faq End ===================================
// ======================== Site-press-category Start==================================
'get /admin/site-press-category/index': {
  controller: 'SitePressCategoryController',
  action: 'index',
  skipAssets: true,
},
'get /admin/site-press-category/new': {
  controller: 'SitePressCategoryController',
  action: 'new',
  skipAssets: true,
},
'post /admin/site-press-category/create': {
  controller: 'SitePressCategoryController',
  action: 'create',
  skipAssets: true,
},
'get /admin/site-press-category/edit/:id': {
  controller: 'SitePressCategoryController',
  action: 'edit',
  skipAssets: true,
},
'post /admin/site-press-category/update/:id': {
  controller: 'SitePressCategoryController',
  action: 'update',
  skipAssets: true,
},
'get /admin/site-press-category/view/:id': {
  controller: 'SitePressCategoryController',
  action: 'view',
  skipAssets: true,
  },
'post /admin/site-press-category/delete': {
  controller: 'SitePressCategoryController',
  action: 'delete',
  skipAssets: true,
},
// ======================== Site-press-category End ===================================

// ======================== Site-press Start==================================
'get /admin/site-press/index': {
  controller: 'SitePressController',
  action: 'index',
  skipAssets: true,
},
'get /admin/site-press/new': {
  controller: 'SitePressController',
  action: 'new',
  skipAssets: true,
},
'post /admin/site-press/create': {
  controller: 'SitePressController',
  action: 'create',
  skipAssets: true,
},
'get /admin/site-press/edit/:id': {
  controller: 'SitePressController',
  action: 'edit',
  skipAssets: true,
},
'post /admin/site-press/update/:id': {
  controller: 'SitePressController',
  action: 'update',
  skipAssets: true,
},
'get /admin/site-press/view/:id': {
  controller: 'SitePressController',
  action: 'view',
  skipAssets: true,
  },
'post /admin/site-press/delete': {
  controller: 'SitePressController',
  action: 'delete',
  skipAssets: true,
},
// ======================== Site-press End ===================================
// ======================== Blog-category Start==================================
'get /admin/blog-category/index': {
  controller: 'BlogCategoryController',
  action: 'index',
  skipAssets: true,
},
'get /admin/blog-category/new': {
  controller: 'BlogCategoryController',
  action: 'new',
  skipAssets: true,
},
'post /admin/blog-category/create': {
  controller: 'BlogCategoryController',
  action: 'create',
  skipAssets: true,
},
'get /admin/blog-category/edit/:id': {
  controller: 'BlogCategoryController',
  action: 'edit',
  skipAssets: true,
},
'post /admin/blog-category/update/:id': {
  controller: 'BlogCategoryController',
  action: 'update',
  skipAssets: true,
},
'get /admin/blog-category/view/:id': {
  controller: 'BlogCategoryController',
  action: 'view',
  skipAssets: true,
  },
'post /admin/blog-category/delete': {
  controller: 'BlogCategoryController',
  action: 'delete',
  skipAssets: true,
},
// ======================== Blog-category End ===================================

// ======================== Blog Start==================================
'get /admin/blog/index': {
  controller: 'BlogController',
  action: 'index',
  skipAssets: true,
},
'get /admin/blog/new': {
  controller: 'BlogController',
  action: 'new',
  skipAssets: true,
},
'post /admin/blog/create': {
  controller: 'BlogController',
  action: 'create',
  skipAssets: true,
},
'get /admin/blog/edit/:id': {
  controller: 'BlogController',
  action: 'edit',
  skipAssets: true,
},
'post /admin/blog/update/:id': {
  controller: 'BlogController',
  action: 'update',
  skipAssets: true,
},
'get /admin/blog/view/:id': {
  controller: 'BlogController',
  action: 'view',
  skipAssets: true,
  },
'post /admin/blog/delete': {
  controller: 'BlogController',
  action: 'delete',
  skipAssets: true,
},
// ======================== Blog End ===================================

// ======================== Help-center-category Start==================================
'get /admin/help-center-category/index': {
  controller: 'HelpCenterCategoryController',
  action: 'index',
  skipAssets: true,
},
'get /admin/help-center-category/new': {
  controller: 'HelpCenterCategoryController',
  action: 'new',
  skipAssets: true,
},
'post /admin/help-center-category/create': {
  controller: 'HelpCenterCategoryController',
  action: 'create',
  skipAssets: true,
},
'get /admin/help-center-category/edit/:id': {
  controller: 'HelpCenterCategoryController',
  action: 'edit',
  skipAssets: true,
},
'post /admin/help-center-category/update/:id': {
  controller: 'HelpCenterCategoryController',
  action: 'update',
  skipAssets: true,
},
'get /admin/help-center-category/view/:id': {
  controller: 'HelpCenterCategoryController',
  action: 'view',
  skipAssets: true,
},
'post /admin/help-center-category/delete': {
  controller: 'HelpCenterCategoryController',
  action: 'delete',
  skipAssets: true,
},
// ======================== Help-center-category End ===================================

// ======================== Help-center Start==================================
'get /admin/help-center/index': {
  controller: 'HelpCenterController',
  action: 'index',
  skipAssets: true,
},
'get /admin/help-center/new': {
  controller: 'HelpCenterController',
  action: 'new',
  skipAssets: true,
},
'post /admin/help-center/create': {
  controller: 'HelpCenterController',
  action: 'create',
  skipAssets: true,
},
'get /admin/help-center/edit/:id': {
  controller: 'HelpCenterController',
  action: 'edit',
  skipAssets: true,
},
'post /admin/help-center/update/:id': {
  controller: 'HelpCenterController',
  action: 'update',
  skipAssets: true,
},
'get /admin/help-center/view/:id': {
  controller: 'HelpCenterController',
  action: 'view',
  skipAssets: true,
},
'post /admin/help-center/delete': {
  controller: 'HelpCenterController',
  action: 'delete',
  skipAssets: true,
},
// ======================== Help-center End ===================================



// ======================== Site-evennt-category Start==================================
'get /admin/site-event-category/index': {
  controller: 'SiteEventCategoryController',
  action: 'index',
  skipAssets: true,
},
'get /admin/site-event-category/new': {
  controller: 'SiteEventCategoryController',
  action: 'new',
  skipAssets: true,
},
'post /admin/site-event-category/create': {
  controller: 'SiteEventCategoryController',
  action: 'create',
  skipAssets: true,
},
'get /admin/site-event-category/edit/:id': {
  controller: 'SiteEventCategoryController',
  action: 'edit',
  skipAssets: true,
},
'post /admin/site-event-category/update/:id': {
  controller: 'SiteEventCategoryController',
  action: 'update',
  skipAssets: true,
},
'get /admin/site-event-category/view/:id': {
  controller: 'SiteEventCategoryController',
  action: 'view',
  skipAssets: true,
  },
'post /admin/site-event-category/delete': {
  controller: 'SiteEventCategoryController',
  action: 'delete',
  skipAssets: true,
},
// ======================== Site-evennt-category End ===================================

// ======================== Site-evennt Start==================================
'get /admin/site-event/index': {
  controller: 'SiteEventController',
  action: 'index',
  skipAssets: true,
},
'get /admin/site-event/new': {
  controller: 'SiteEventController',
  action: 'new',
  skipAssets: true,
},
'post /admin/site-event/create': {
  controller: 'SiteEventController',
  action: 'create',
  skipAssets: true,
},
'get /admin/site-event/edit/:id': {
  controller: 'SiteEventController',
  action: 'edit',
  skipAssets: true,
},
'post /admin/site-event/update/:id': {
  controller: 'SiteEventController',
  action: 'update',
  skipAssets: true,
},
'get /admin/site-event/view/:id': {
  controller: 'SiteEventController',
  action: 'view',
  skipAssets: true,
  },
'post /admin/site-event/delete': {
  controller: 'SiteEventController',
  action: 'delete',
  skipAssets: true,
},
// ======================== Site-evennt End ===================================


// ======================== Business-evennt Start==================================
'get /admin/business-event/index': {
  controller: 'BusinessEventController',
  action: 'index',
  skipAssets: true,
},
// 'get /admin/business-event/new': {
//   controller: 'BusinessEventController',
//   action: 'new',
//   skipAssets: true,
// },
// 'post /admin/business-event/create': {
//   controller: 'BusinessEventController',
//   action: 'create',
//   skipAssets: true,
// },
// 'get /admin/business-event/edit/:id': {
//   controller: 'BusinessEventController',
//   action: 'edit',
//   skipAssets: true,
// },
// 'post /admin/business-event/update/:id': {
//   controller: 'BusinessEventController',
//   action: 'update',
//   skipAssets: true,
// },
'get /admin/business-event/view/:id': {
  controller: 'BusinessEventController',
  action: 'view',
  skipAssets: true,
  },
// 'post /admin/business-event/delete': {
//   controller: 'BusinessEventController',
//   action: 'delete',
//   skipAssets: true,
// },
// ======================== Business-evennt End ===================================

// ======================== Site-Ticket-type Start==================================
'get /admin/site-ticket-type/index': {
  controller: 'SiteTicketTypeController',
  action: 'index',
  skipAssets: true,
},
'get /admin/site-ticket-type/new': {
  controller: 'SiteTicketTypeController',
  action: 'new',
  skipAssets: true,
},
'post /admin/site-ticket-type/create': {
  controller: 'SiteTicketTypeController',
  action: 'create',
  skipAssets: true,
},
'get /admin/site-ticket-type/edit/:id': {
  controller: 'SiteTicketTypeController',
  action: 'edit',
  skipAssets: true,
},
'post /admin/site-ticket-type/update/:id': {
  controller: 'SiteTicketTypeController',
  action: 'update',
  skipAssets: true,
},
'get /admin/site-ticket-type/view/:id': {
  controller: 'SiteTicketTypeController',
  action: 'view',
  skipAssets: true,
},
'post /admin/site-ticket-type/delete': {
  controller: 'SiteTicketTypeController',
  action: 'delete',
  skipAssets: true,
},
// ======================== Site-Ticket-type End ===================================

// ========================Site-Customer Ticket Start==================================
'get /admin/site-customer-ticket/index': {
  controller: 'SiteTicketController',
  action: 'customerTicketIndex',
  skipAssets: true,
},
'get /admin/site-customer-ticket/view/:id': {
  controller: 'SiteTicketController',
  action: 'customerTicketView',
  skipAssets: true,
},

// ========================Site-Customer Ticket End ===================================

// ========================Site-Business Ticket Start==================================
'get /admin/site-business-ticket/index': {
  controller: 'SiteTicketController',
  action: 'businessTicketIndex',
  skipAssets: true,
},

'get /admin/site-business-ticket/view/:id': {
  controller: 'SiteTicketController',
  action: 'businessTicketView',
  skipAssets: true,
},


// ========================Site-Business Ticket End ===================================

// ======================== Business review Start ===================================
'get /admin/testimonial/index': {
  controller: 'BusinessReviewController',
  action: 'testimonialIndex',
  skipAssets: true,
},

'get /admin/testimonial/view/:id': {
  controller: 'BusinessReviewController',
  action: 'testimonialView',
  skipAssets: true,
},

'post /admin/testimonial/delete': {
  controller: 'BusinessReviewController',
  action: 'testimonialDelete',
  skipAssets: true,
},

// ======================== Business review End =====================================




  


  // ========================== DB Backup Start==============================
  'get /admin/dbbackup/name': {
    controller: 'AdminController',
    action: 'bdBackupName',
  },

  'get /admin/dbbackup': {
    controller: 'AdminController',
    action: 'exeDbBackupCorn',
  },
  // ========================== DB Backup End================================
  
 

  
  // ----------------------Admin Panel Route End---------------------

  

// ########################---Frontend Customer API Route Start----#########################################
  


// ************************Frontend Common Un-protected Start***************************
'post /frontend/common/top-menu': {
  controller: 'Frontend/FrontUnProtectedController',
  action: 'topMenu',
},

'post /frontend/common/home-page': {
  controller: 'Frontend/FrontUnProtectedController',
  action: 'homePage',
},

'post /frontend/common/view-more-upcoming-events': {
  controller: 'Frontend/FrontUnProtectedController',
  action: 'viewMoreUpcomingEvents',
},

'post /frontend/common/ ': {
  controller: 'Frontend/FrontUnProtectedController',
  action: 'advertisementDetails',
  skipAssets: true,
},
'post /frontend/common/event-details': {
  controller: 'Frontend/FrontUnProtectedController',
  action: 'eventDetails',
  skipAssets: true,
},

'post /frontend/common/blog-details': {
  controller: 'Frontend/FrontUnProtectedController',
  action: 'blogDetails',
  skipAssets: true,
},

'post /frontend/common/sub-category-details': {
  controller: 'Frontend/FrontUnProtectedController',
  action: 'subCategoryDetails',
  skipAssets: true,
},


'post /frontend/common/site-faq': {
  controller: 'Frontend/FrontUnProtectedController',
  action: 'siteFaq',
  skipAssets: true,
},

'post /frontend/common/site-events': {
  controller: 'Frontend/FrontUnProtectedController',
  action: 'siteEvents',
  skipAssets: true,
},
'post /frontend/common/career-all': {
  controller: 'Frontend/FrontUnProtectedController',
  action: 'careerAll',
  skipAssets: true,
},

'post /frontend/common/blog-all': {
  controller: 'Frontend/FrontUnProtectedController',
  action: 'blogAll',
  skipAssets: true,
},

'post /frontend/common/press-all': {
  controller: 'Frontend/FrontUnProtectedController',
  action: 'pressAll',
  skipAssets: true,
},
'post /frontend/common/blog-post-comment': {
  controller: 'Frontend/FrontUnProtectedController',
  action: 'blogPostComment',
  skipAssets: true,
},
'post /frontend/common/page-details': {
  controller: 'Frontend/FrontUnProtectedController',
  action: 'pageDetails',
  skipAssets: true,
},
// ************************Frontend Common Un-protected End*****************************

// ************************Frontend Common Protected Start***************************
// 'post /frontend/common/blog-post-comment': {
//   controller: 'Frontend/FrontProtectedController',
//   action: 'careerView',
//   skipAssets: true,
// },
// ************************Frontend Common Protected End*****************************



// ************************Customer Un-protected Start*****************************


// 'post /frontend/customer-login': {
//   controller: 'Frontend/FrontCustomerUnProtectedController',
//   action: 'loginForToken',
// },
// ************************Customer Un-protected End*******************************



// ************************Customer Protected Start********************************

'post /frontend/customer/dashboard': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'dashboard',
  skipAssets: true,
},
//@@@@@@@Account Setting Start
'post /frontend/customer/account-information-all': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'accountInformationAll',
  skipAssets: true,
},
'post /frontend/customer/account-information-save': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'accountInformationSave',
  skipAssets: true,
},

// ***Security Setting Start
'post /frontend/customer/change-password': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'changePassword',
  skipAssets: true,
},

'post /frontend/customer/setting-notification-all': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'settingNotificationAll',
  skipAssets: true,
},

'post /frontend/customer/setting-notification-update': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'settingNotificationUpdate',
  skipAssets: true,
},




// 'post /frontend/customer/account-notification-all': {
//   controller: 'Frontend/FrontCustomerProtectedController',
//   action: 'accountNotificationAll',
//   skipAssets: true,
// },
// 'post /frontend/customer/account-notification-save': {
//   controller: 'Frontend/FrontCustomerProtectedController',
//   action: 'accountNotificationSave',
//   skipAssets: true,
// },

// ***Privacy Setting
'post /frontend/customer/privacy-setting-all': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'privacySettingAll',
  skipAssets: true,
},
'post /frontend/customer/privacy-setting-update': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'privacySettingUpdate',
  skipAssets: true,
},



// @@@@ Account Information Start



'post /frontend/customer/send-message-to-bussiness': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'sendMessageToBussiness',
  skipAssets: true,
},

'post /frontend/customer/message-to-bussiness-all': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'sendMessageToBussinessAll',
  skipAssets: true,
},

'post /frontend/customer/message-to-bussiness-recent': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'sendMessageToBussinessRecent',
  skipAssets: true,
},

'post /frontend/customer/send-message-show': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'sendMessageShow',
  skipAssets: true,
},

'post /frontend/customer/post-review-to-bussiness': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'postReviewToBussiness',
  skipAssets: true,
},

'post /frontend/customer/post-review-all': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'postReviewAll',
  skipAssets: true,
},

'post /frontend/customer/post-review-recent': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'postReviewRecent',
  skipAssets: true,
},

'post /frontend/customer/post-review-show': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'postReviewShow',
  skipAssets: true,
},
// @@@@Support Start
'post /frontend/customer/support-all': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'supportAll',
  skipAssets: true,
},
'post /frontend/customer/support-new': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'supportNew',
  skipAssets: true,
},
'post /frontend/customer/support-create': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'supportCreate',
  skipAssets: true,
},

'post /frontend/customer/support-edit': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'supportEdit',
  skipAssets: true,
},

'post /frontend/customer/support-update': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'supportUpdate',
  skipAssets: true,
},

'post /frontend/customer/support-view': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'supportView',
  skipAssets: true,
},
'post /frontend/customer/support-re-message': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'supportReMessage',
  skipAssets: true,
},

// @@@@Career Start
'post /frontend/customer/career-all': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'careerAll',
  skipAssets: true,
},
'post /frontend/customer/career-view': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'careerView',
  skipAssets: true,
},


'post /frontend/customer/career-view': {
  controller: 'Frontend/FrontCustomerProtectedController',
  action: 'careerView',
  skipAssets: true,
},





  
// ************************Customer Protected End********************************** 


// ########################----Frontend Customer API Route End----###########################################


// ########################----Frontend Business API Route Start----#########################################
  
// ************************Login register Start*****************************
'post /frontend/business-registration': {
  controller: 'Frontend/FrontLoginRegisterController',
  action: 'businessRegister',
  skipAssets: true,
},

'get /business/verify/:email': {
  controller: 'Frontend/FrontLoginRegisterController',
  action: 'businessVarify',
  skipAssets: true,
},

'post /frontend/customer-registration': {
  controller: 'Frontend/FrontLoginRegisterController',
  action: 'customerRegister',
},

'get /customer/verify/:email': {
  controller: 'Frontend/FrontLoginRegisterController',
  action: 'customerVarify',
},

//Bussiness & Customer Login
'post /frontend/login': {
  controller: 'Frontend/FrontLoginRegisterController',
  action: 'loginForToken',
  skipAssets: true,
},
// ************************Login register End*******************************




// ************************Business Un-protected Start*****************************
// ************************Business Un-protected End*******************************

// ************************Business Protected Start********************************

//@@@@Account Setting Start
// ***DashboardStart
'post /frontend/business/dashboard': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'dashboard',
  skipAssets: true,
},

// ***Profile Start
'post /frontend/business/about-the-business-all': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'aboutTheBusinessAll',
  skipAssets: true,
},

'post /frontend/business/about-the-business-save': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'aboutTheBusinessSave',
  skipAssets: true,
},

// ***Security Start

'post /frontend/business/change-password': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'changePassword',
  skipAssets: true,
},

'post /frontend/business/change-phone-no': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'changePhoneNo',
  skipAssets: true,
},

// ***Notification Start

// 'post /frontend/business/business-notification-all': {
//   controller: 'Frontend/FrontBusinessProtectedController',
//   action: 'businessNotificationAll',
//   skipAssets: true,
// },

// 'post /frontend/business/business-notification-save': {
//   controller: 'Frontend/FrontBusinessProtectedController',
//   action: 'businessNotificationSave',
//   skipAssets: true,
// },

'post /frontend/business/setting-notification-all': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'settingNotificationAll',
  skipAssets: true,
},

'post /frontend/business/setting-notification-update': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'settingNotificationUpdate',
  skipAssets: true,
},

// ***Privacy Setting
'post /frontend/business/privacy-setting-all': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'privacySettingAll',
  skipAssets: true,
},
'post /frontend/business/privacy-setting-update': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'privacySettingUpdate',
  skipAssets: true,
},


//@@@@Account Setting End


//  @@@@ Business Information Start
// ***Category SubCategory Start
'post /frontend/business/category-sub-category-all-and-selected': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'categorySubCategoryAllAndSelected',
  skipAssets: true,
},

'post /frontend/business/single-subcategory-add-remove': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'singleSubCategoryAddRemove',
  skipAssets: true,
},

// ***Amenity Start
'post /frontend/business/amenity-all-and-selected': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'amenityAllAndSelected',
  skipAssets: true,
},

'post /frontend/business/single-amenity-add-remove': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'singleAmenityAddRemove',
  skipAssets: true,
},

// ***Hours-of-operation-and-extended-closure Start
'post /frontend/business/hours-of-operation-and-extended-closure': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'hoursOfOperationAndExtendedClosure',
  skipAssets: true,
},


'post /frontend/business/hours-of-operation-save': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'hoursOfOperationSave',
  skipAssets: true,
},

'post /frontend/business/hours-of-operation-extended-closure-save': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'hoursOfOperationExtendedClosureSave',
  skipAssets: true,
},

// ***Photo-album Start
'post /frontend/business/photo-album-all': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'photoAlbumAll',
  skipAssets: true,
},

'post /frontend/business/photo-album-save': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'photoAlbumSave',
  skipAssets: true,
},

'post /frontend/business/photo-album-Update': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'photoAlbumUpdate',
  skipAssets: true,
},
'post /frontend/business/photo-album-delet': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'photoAlbumDelet',
  skipAssets: true,
},

// ***Album-photo Start
'post /frontend/business/album-photo-all': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'albumPhotoAll',
  skipAssets: true,
},

'post /frontend/business/album-photo-save': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'albumPhotoSave',
  skipAssets: true,
},
'post /frontend/business/album-photo-update': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'albumPhotoUpdate',
  skipAssets: true,
},

'post /frontend/business/album-photo-delet': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'albumPhotoDelet',
  skipAssets: true,
},

// ***Embedded-video Start
'post /frontend/business/embedded-video-all': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'embeddedVideoAll',
  skipAssets: true,
},

'post /frontend/business/embedded-video-save': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'embeddedVideoSave',
  skipAssets: true,
},

'post /frontend/business/embedded-video-update': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'embeddedVideoUpdate',
  skipAssets: true,
},

'post /frontend/business/embedded-video-delet': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'embeddedVideoDelete',
  skipAssets: true,
},

// ***Review Start
'post /frontend/business/review-all': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'reviewAll',
  skipAssets: true,
},

'post /frontend/business/review-update': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'reviewUpdate',
  skipAssets: true,
},

// ***Message Start
'post /frontend/business/message-all': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'messageAll',
  skipAssets: true,
},

'post /frontend/business/message-update': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'messageUpdate',
  skipAssets: true,
},

'post /frontend/business/message-edit': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'messageEdit',
  skipAssets: true,
},

// ***Event Start
'post /frontend/business/event-all': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'eventAll',
  skipAssets: true,
},

'post /frontend/business/event-new': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'eventNew',
  skipAssets: true,
},
'post /frontend/business/event-create': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'eventCreate',
  skipAssets: true,
},

'post /frontend/business/event-edit': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'eventEdit',
  skipAssets: true,
},

'post /frontend/business/event-update': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'eventUpdate',
  skipAssets: true,
},

'post /frontend/business/event-view': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'eventView',
  skipAssets: true,
},

'post /frontend/business/event-delet': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'eventDelet',
  skipAssets: true,
},

// ***Support Start
'post /frontend/business/support-all': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'supportAll',
  skipAssets: true,
},
'post /frontend/business/support-new': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'supportNew',
  skipAssets: true,
},
'post /frontend/business/support-create': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'supportCreate',
  skipAssets: true,
},

'post /frontend/business/support-edit': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'supportEdit',
  skipAssets: true,
},

'post /frontend/business/support-update': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'supportUpdate',
  skipAssets: true,
},

'post /frontend/business/support-view': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'supportView',
  skipAssets: true,
},

'post /frontend/business/support-re-message': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'supportReMessage',
  skipAssets: true,
},

// ***Career Start
'post /frontend/business/career-all': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'careerAll',
  skipAssets: true,
},
'post /frontend/business/career-create': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'careerCreate',
  skipAssets: true,
},

'post /frontend/business/career-edit': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'careerEdit',
  skipAssets: true,
},
'post /frontend/business/career-update': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'careerUpdate',
  skipAssets: true,
},

'post /frontend/business/career-view': {
  controller: 'Frontend/FrontBusinessProtectedController',
  action: 'careerView',
  skipAssets: true,
},









// ************************Business Protected End********************************** 

// #########################----Frontend Business API Route End----###########################################





};
