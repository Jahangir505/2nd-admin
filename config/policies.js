/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions (`true` allows public     *
   * access)                                                                  *
   *                                                                          *
   ***************************************************************************/

  '*': true,
  // '*': 'OAuthValidateAccessToken',

  OAuthController: {
    '*' :  'OAuthValidateAccessToken',
    'token': 'OAuthPublicClient'
  },
  
  // ********************** Backend Start *********************************
  
  AuthController: {
    'adminLoginDo': true,
    'adminLogout': true
  },
  UsersController: {
    '*' : 'OAuthValidateAccessToken',
    // 'register' : true,
    'register' : true,
    'localregister' : 'isOnlySuperAdmin',
    'verify/:email' : true,

    'new' : 'isOnlySuperAdmin',
    'create' : 'isOnlySuperAdmin',
    'index' : 'isOnlySuperAdmin',
    'edit' : 'isOnlySuperAdmin',
    'update' : 'isOnlySuperAdmin',
    'view' : 'isOnlySuperAdmin',
    'changePassword' : 'isOnlySuperAdmin',
    'passwordUpdate' : 'isOnlySuperAdmin',
    'setCustomerForPurchase' : 'isOnlySuperAdmin',
  },
  // CustomerController: {
  //   '*' : 'isOnlySuperAdmin',
  // },
  TestController: {
    // '*': 'isAuthenticated'
    // '*': 'OAuthValidateAccessToken',
    // 'checkMap': true,
    // 'action': 'OAuthValidateAccessToken',
    '*': true
  },
  CornjobController: {
    '*': true
  },
  ClientsController: {
    '*' : 'OAuthValidateAccessToken',
    'register' : true,
    'verify/:email' : true
  },
  AdminController: {
    '*': 'isAllBackendUser',
    // 'bdBackupName': 'isOnlySuperAdmin',
    'bdBackupName': 'isOnlySuperAdmin',
    // 'exeDbBackupCorn': true,
  },
  CustomerController: {
    '*': 'isAllBackendUser',
  },
  BusinessUserController: {
    '*': 'isAllBackendUser',
  },
  BusinessProfileController: {
    '*': 'isAllBackendUser',
  },
  BusinessCareerController: {
    '*': 'isAllBackendUser',
  },
  RolePermissionController: {
    '*': 'isAllBackendUser',
  },
  CountryController: {
    '*': 'isAllBackendUser',
  },
  StateController: {
    '*': 'isAllBackendUser',
  },
  CategoryController: {
    '*': 'isAllBackendUser',
  },
  SubCategoryController: {
    '*': 'isAllBackendUser',
  },
  AmenityController: {
    '*': 'isAllBackendUser',
  },
  SitePageController: {
    '*': 'isAllBackendUser',
  },
  SiteFaqCategoryController: {
    '*': 'isAllBackendUser',
  },
  SiteFaqController: {
    '*': 'isAllBackendUser',
  },
  SitePressCategoryController: {
    '*': 'isAllBackendUser',
  },
  BlogCategoryController: {
    '*': 'isAllBackendUser',
  },
  BlogController: {
    '*': 'isAllBackendUser',
  },
  SitePressController: {
    '*': 'isAllBackendUser',
  },
  SiteEventCategoryController: {
    '*': 'isAllBackendUser',
  },
  SiteEventController: {
    '*': 'isAllBackendUser',
  },
  BusinessEventController: {
    '*': 'isAllBackendUser',
  },
  SiteTicketTypeController: {
    '*': 'isAllBackendUser',
  },
  SiteTicketController: {
    '*': 'isAllBackendUser',
  },
  HelpCenterCategoryController: {
    '*': 'isAllBackendUser',
  },
  HelpCenterController: {
    '*': 'isAllBackendUser',
  },
  
// ********************** Backend Start *********************************

// ********************** Apiuser Start *********************************
  

  // 'Apiuser/ApiBrandController': {
  //   '*': 'OAuthAccessTokenOnlyForApiUser',
  //   'createtest': 'isAllBackendUser',
  // },
  
// ********************** Apiuser End ***********************************


// ********************** Frontend Start ********************************

// ********************** Frontend Common UnProtected Start ******************************
'Frontend/FrontUnProtectedController': {
  '*': true,
},
'Frontend/FrontProtectedController': {
  '*': 'OAuthAccessTokenOnlyForCommon',
},
// ********************** Frontend Common UnProtected End ********************************

// ********************** Customer Start ********************************
  
  // 'Frontend/FrontCustomerController': {
  //   'register': true,
  //   'varifyCustomer': true,
  //   'loginForToken': 'OAuthPublicClientForCustomer',
  // },
  // 'Frontend/FrontUserController': {
  //   '*': 'OAuthAccessTokenOnlyForCustomer',
  // },

  'Frontend/FrontLoginRegisterController': {
    '*': true,
    'loginForToken': 'OAuthPublicClientForFrontend',
    
  },
  'Frontend/FrontCustomerUnProtectedController': {
    '*': true,
  },
  'Frontend/FrontCustomerProtectedController': {
    '*': 'OAuthAccessTokenOnlyForCustomer',
  },

  'Frontend/FrontBusinessUnProtectedController': {
    '*': true,
  },
  'Frontend/FrontBusinessProtectedController': {
    '*': 'OAuthAccessTokenOnlyForBusiness',
  },
  

// ********************** Customer End **********************************

// ********************** Frontend End **********************************


// ********************** Frontend Start ********************************

// ********************** Customer Start ********************************
  

// ********************** Customer End **********************************
  
  // ********************** Frontend End **********************************





  // FeedbackController: {
  //   '*': true
  // },
  // SubscribeController: {
  //   '*': 'isDatavalidatorSuperadmin'
  // },


  /***************************************************************************
   *                                                                          *
   * Here's an example of mapping some policies to run before a controller    *
   * and its actions                                                          *
   *                                                                          *
   ***************************************************************************/
  // RabbitController: {

  // Apply the `false` policy as the default for all of RabbitController's actions
  // (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
  // '*': false,

  // For the action `nurture`, apply the 'isRabbitMother' policy
  // (this overrides `false` above)
  // nurture	: 'isRabbitMother',

  // Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
  // before letting any users feed our rabbits
  // feed : ['isNiceToAnimals', 'hasRabbitFood']
  // }
};
