/**
 * RolePermission.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'rolePermission',
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    role_name: {
      type: 'string',
      unique: true,
      required: true,
    },
    slug: {
      type: 'string',
      unique: true,
    },
     // #################adminAdsData Module Start###################
     prv_adminAdsData: { //module menu permission
      type: 'boolean',
      defaultsTo: false
    },

    //  *********adminAdsData Module***category Sub Module Start************
    prv_adminAdsData_category: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_adminAdsData_category_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_category_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_category_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_category_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_category_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_category_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********adminAdsData Module***category Sub Module End**************

     //  *********adminAdsData Module***subCategory Sub Module Start************
     prv_adminAdsData_subCategory: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_adminAdsData_subCategory_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_subCategory_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_subCategory_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_subCategory_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_subCategory_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_subCategory_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********adminAdsData Module***subCategory Sub Module End**************

    //  *********adminAdsData Module***amenity Sub Module Start************
    prv_adminAdsData_amenity: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_adminAdsData_amenity_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_amenity_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_amenity_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_amenity_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_amenity_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_amenity_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********adminAdsData Module***amenity Sub Module End**************

     //  *********adminAdsData Module***country Sub Module Start************
     prv_adminAdsData_country: { //sub module Menu
      type: 'boolean',
      defaultsTo: false// Created By
    },

    prv_adminAdsData_country_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_country_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_country_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_country_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_country_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_country_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********adminAdsData Module***country Sub Module End**************

    //  *********adminAdsData Module***state Sub Module Start************
    prv_adminAdsData_state: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_adminAdsData_state_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_state_create: {
      type: 'boolean',
      defaultsTo: false
    },    
    prv_adminAdsData_state_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_state_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_state_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminAdsData_state_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********adminAdsData Module***state Sub Module End**************

    // #################adminAdsData Module End#####################

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    // #################user Module Start###################
    prv_user: { //module menu permission
      type: 'boolean',
      defaultsTo: false
    },
    
    //  *********user Module***customer Sub Module Start************
    prv_user_customer: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },
    
    prv_user_customer_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_user_customer_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_user_customer_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_user_customer_view: {
      type: 'boolean',
      defaultsTo: false
    },
    
    prv_user_customer_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********user Module***customer Sub Module End**************

    // #################advertisement Module Start###################
    prv_advertisement: { //module menu permission
      type: 'boolean',
      defaultsTo: false
    },

    //  *********advertisement Module***ads Sub Module Start************
    prv_advertisement_ads: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_advertisement_ads_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_advertisement_ads_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_advertisement_ads_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_advertisement_ads_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_advertisement_ads_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_advertisement_ads_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********advertisement Module***ads Sub Module End**************

    //  *********advertisement Module***reviewComments Sub Module Start************
    prv_advertisement_reviewComments: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_advertisement_reviewComments_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_advertisement_reviewComments_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_advertisement_reviewComments_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_advertisement_reviewComments_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_advertisement_reviewComments_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_advertisement_reviewComments_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********advertisement Module***reviewComments Sub Module End**************


    // #################advertisement Module End#####################

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    // #################emails Module Start###################
    prv_emails: { //module menu permission
      type: 'boolean',
      defaultsTo: false
    },

    //  *********emails Module***inbox Sub Module Start************
    prv_emails_inbox: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_emails_inbox_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_inbox_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_inbox_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_inbox_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_inbox_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_inbox_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********emails Module***inbox Sub Module End**************

    //  *********emails Module***important Sub Module Start************
    prv_emails_important: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_emails_important_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_important_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_important_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_important_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_important_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_important_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********emails Module***important Sub Module End**************

    //  *********emails Module***sent Sub Module Start************
    prv_emails_sent: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_emails_sent_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_sent_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_sent_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_sent_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_sent_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_sent_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********emails Module***sent Sub Module End**************

    //  *********emails Module***draft Sub Module Start************
    prv_emails_draft: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_emails_draft_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_draft_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_draft_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_draft_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_draft_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_draft_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********emails Module***draft Sub Module End**************

    //  *********emails Module***trash Sub Module Start************
    prv_emails_trash: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_emails_trash_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_trash_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_trash_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_trash_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_trash_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_emails_trash_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********emails Module***trash Sub Module End**************

    // #################emails Module End#####################

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    // #################chat Module Start###################
    prv_chat: { //module menu permission
      type: 'boolean',
      defaultsTo: false
    },

    //  *********chat Module***customer Sub Module Start************
    prv_chat_customer: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_chat_customer_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_chat_customer_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_chat_customer_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_chat_customer_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_chat_customer_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_chat_customer_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********chat Module***customer Sub Module End**************

    //  *********chat Module***business Sub Module Start************
    prv_chat_business: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_chat_business_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_chat_business_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_chat_business_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_chat_business_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_chat_business_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_chat_business_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********chat Module***business Sub Module End**************

    // #################chat Module End#####################

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    // #################pages Module Start###################
    prv_pages: { //module menu permission
      type: 'boolean',
      defaultsTo: false
    },

    //  *********pages Module***allPages Sub Module Start************
    prv_pages_allPages: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_pages_allPages_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_pages_allPages_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_pages_allPages_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_pages_allPages_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_pages_allPages_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_pages_allPages_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********pages Module***allPages Sub Module End**************

    
    // #################pages Module End#####################

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    // #################testimonial Module Start###################
    prv_testimonial: { //module menu permission
      type: 'boolean',
      defaultsTo: false
    },

    //  *********testimonial Module***customer Sub Module Start************
    prv_testimonial_customer: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_testimonial_customer_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_testimonial_customer_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_testimonial_customer_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_testimonial_customer_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_testimonial_customer_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_testimonial_customer_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********testimonial Module***customer Sub Module End**************

    //  *********testimonial Module***business Sub Module Start************
    prv_testimonial_business: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_testimonial_business_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_testimonial_business_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_testimonial_business_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_testimonial_business_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_testimonial_business_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_testimonial_business_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********testimonial Module***business Sub Module End**************


    // #################testimonial Module End#####################

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    // #################faq Module Start###################
    prv_faq: { //module menu permission
      type: 'boolean',
      defaultsTo: false
    },

    //  *********faq Module***allFAQ Sub Module Start************
    prv_faq_allFAQ: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_faq_allFAQ_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_faq_allFAQ_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_faq_allFAQ_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_faq_allFAQ_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_faq_allFAQ_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_faq_allFAQ_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********faq Module***allFAQ Sub Module End**************


    // #################faq Module End#####################

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    // #################press Module Start###################
    prv_press: { //module menu permission
      type: 'boolean',
      defaultsTo: false
    },

    //  *********press Module***allPress Sub Module Start************
    prv_press_allPress: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_press_allPress_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_press_allPress_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_press_allPress_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_press_allPress_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_press_allPress_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_press_allPress_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********press Module***allPress Sub Module End**************


    // #################press Module End#####################

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    // #################adminEvent Module Start###################
    prv_adminEvent: { //module menu permission
      type: 'boolean',
      defaultsTo: false
    },

    //  *********adminEvent Module***allEvent Sub Module Start************
    prv_adminEvent_allEvent: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_adminEvent_allEvent_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminEvent_allEvent_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminEvent_allEvent_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminEvent_allEvent_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminEvent_allEvent_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminEvent_allEvent_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********adminEvent Module***allEvent Sub Module End**************

    //  *********adminEvent Module***category Sub Module Start************
    prv_adminEvent_category: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_adminEvent_category_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminEvent_category_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminEvent_category_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminEvent_category_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminEvent_category_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_adminEvent_category_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********adminEvent Module***category Sub Module End**************



    // #################adminEvent Module End#####################

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    // #################businessEvent Module Start###################
    prv_businessEvent: { //module menu permission
      type: 'boolean',
      defaultsTo: false
    },

    //  *********businessEvent Module***allEvent Sub Module Start************
    prv_businessEvent_allEvent: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_businessEvent_allEvent_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_businessEvent_allEvent_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_businessEvent_allEvent_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_businessEvent_allEvent_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_businessEvent_allEvent_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_businessEvent_allEvent_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********businessEvent Module***allEvent Sub Module End**************


    //  *********businessEvent Module***category Sub Module Start************
    prv_businessEvent_category: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_businessEvent_category_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_businessEvent_category_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_businessEvent_category_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_businessEvent_category_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_businessEvent_category_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_businessEvent_category_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********businessEvent Module***category Sub Module End**************


    // #################businessEvent Module End#####################

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    // #################blog Module Start###################
    prv_blog: { //module menu permission
      type: 'boolean',
      defaultsTo: false
    },

    //  *********blog Module***allBlog Sub Module Start************
    prv_blog_allBlog: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_blog_allBlog_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_blog_allBlog_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_blog_allBlog_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_blog_allBlog_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_blog_allBlog_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_blog_allBlog_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********blog Module***allBlog Sub Module End**************

    //  *********blog Module***category Sub Module Start************
    prv_blog_category: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_blog_category_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_blog_category_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_blog_category_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_blog_category_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_blog_category_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_blog_category_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********blog Module***category Sub Module End**************

    //  *********blog Module***blogComment Sub Module Start************
    prv_blog_blogComment: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_blog_blogComment_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_blog_blogComment_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_blog_blogComment_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_blog_blogComment_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_blog_blogComment_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_blog_blogComment_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********blog Module***blogComment Sub Module End**************



    // #################blog Module End#####################

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    // #################career Module Start###################
    prv_career: { //module menu permission
      type: 'boolean',
      defaultsTo: false
    },

    //  *********career Module***allJob Sub Module Start************
    prv_career_allJob: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_career_allJob_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_career_allJob_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_career_allJob_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_career_allJob_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_career_allJob_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_career_allJob_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********career Module***allJob Sub Module End**************

    //  *********career Module***application Sub Module Start************
    prv_career_application: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_career_application_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_career_application_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_career_application_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_career_application_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_career_application_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_career_application_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********career Module***application Sub Module End**************

    // #################career Module End#####################

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    // #################support Module Start###################
    prv_support: { //module menu permission
      type: 'boolean',
      defaultsTo: false
    },

    //  *********support Module***customerTicket Sub Module Start************
    prv_support_customerTicket: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_support_customerTicket_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_support_customerTicket_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_support_customerTicket_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_support_customerTicket_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_support_customerTicket_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_support_customerTicket_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********support Module***customerTicket Sub Module End**************

    //  *********support Module***businessTicket Sub Module Start************
    prv_support_businessTicket: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_support_businessTicket_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_support_businessTicket_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_support_businessTicket_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_support_businessTicket_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_support_businessTicket_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_support_businessTicket_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********support Module***businessTicket Sub Module End**************

    //  *********support Module***ticketType Sub Module Start************
    prv_support_ticketType: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_support_ticketType_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_support_ticketType_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_support_ticketType_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_support_ticketType_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_support_ticketType_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_support_ticketType_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********support Module***ticketType Sub Module End**************

    // #################support Module End#####################
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    // #################newsletter Module Start###################
    prv_newsletter: { //module menu permission
      type: 'boolean',
      defaultsTo: false
    },

    //  *********newsletter Module***overview Sub Module Start************
    prv_newsletter_overview: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_newsletter_overview_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_newsletter_overview_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_newsletter_overview_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_newsletter_overview_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_newsletter_overview_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_newsletter_overview_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********newsletter Module***overview Sub Module End**************

    //  *********newsletter Module***allNewsletter Sub Module Start************
    prv_newsletter_allNewsletter: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_newsletter_allNewsletter_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_newsletter_allNewsletter_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_newsletter_allNewsletter_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_newsletter_allNewsletter_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_newsletter_allNewsletter_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_newsletter_allNewsletter_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********newsletter Module***allNewsletter Sub Module End**************

    //  *********newsletter Module***group Sub Module Start************
    prv_newsletter_group: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_newsletter_group_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_newsletter_group_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_newsletter_group_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_newsletter_group_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_newsletter_group_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_newsletter_group_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********newsletter Module***group Sub Module End**************

    //  *********newsletter Module***subscriber Sub Module Start************
    prv_newsletter_subscriber: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_newsletter_subscriber_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_newsletter_subscriber_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_newsletter_subscriber_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_newsletter_subscriber_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_newsletter_subscriber_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_newsletter_subscriber_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********newsletter Module***subscriber Sub Module End**************

    // #################newsletter Module End#####################



    //  *********user Module***business Sub Module Start************
    prv_user_business: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },
    
    prv_user_business_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_user_business_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_user_business_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_user_business_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_user_business_delete: {
      type: 'boolean',    
      defaultsTo: false
    },
    prv_user_business_download: {
      type: 'boolean',    
      defaultsTo: false
    },
    //  *********user Module***business Sub Module End**************

     //  *********user Module***backendUser Sub Module Start************
     prv_user_backendUser: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },
    
    prv_user_backendUser_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_user_backendUser_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_user_backendUser_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_user_backendUser_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_user_backendUser_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_user_backendUser_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********user Module***backendUser Sub Module End**************

    //  *********user Module***rolepermission Sub Module Start************
    prv_user_rolepermission: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },
    
    prv_user_rolepermission_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_user_rolepermission_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_user_rolepermission_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_user_rolepermission_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_user_rolepermission_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_user_rolepermission_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********user Module***rolepermission Sub Module End**************

    // #################user Module End#####################
    
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    // #################helpCenter Module Start###################
    prv_helpCenter: { //module menu permission
      type: 'boolean',
      defaultsTo: false
    },

    //  *********helpCenter Module***allTopic Sub Module Start************
    prv_helpCenter_allTopic: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_helpCenter_allTopic_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_helpCenter_allTopic_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_helpCenter_allTopic_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_helpCenter_allTopic_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_helpCenter_allTopic_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_helpCenter_allTopic_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********helpCenter Module***allTopic Sub Module End**************

    //  *********helpCenter Module***category Sub Module Start************
    prv_helpCenter_category: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_helpCenter_category_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_helpCenter_category_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_helpCenter_category_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_helpCenter_category_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_helpCenter_category_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_helpCenter_category_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********helpCenter Module***category Sub Module End**************

    // #################helpCenter Module End#####################

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    // #################log Module Start###################
    prv_log: { //module menu permission
      type: 'boolean',
      defaultsTo: false
    },

    //  *********log Module***errorLog Sub Module Start************
    prv_log_errorLog: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_log_errorLog_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_log_errorLog_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_log_errorLog_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_log_errorLog_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_log_errorLog_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_log_errorLog_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********log Module***errorLog Sub Module End**************

    //  *********log Module***loginAudit Sub Module Start************
    prv_log_loginAudit: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_log_loginAudit_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_log_loginAudit_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_log_loginAudit_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_log_loginAudit_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_log_loginAudit_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_log_loginAudit_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********log Module***loginAudit Sub Module End**************

    //  *********log Module***activity Sub Module Start************
    prv_log_activity: { //sub module Menu
      type: 'boolean',
      defaultsTo: false
    },

    prv_log_activity_index: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_log_activity_create: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_log_activity_update: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_log_activity_view: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_log_activity_delete: {
      type: 'boolean',
      defaultsTo: false
    },
    prv_log_activity_download: {
      type: 'boolean',
      defaultsTo: false
    },
    //  *********log Module***activity Sub Module End**************
    // #################log Module End#####################
    users: {
      collection: 'users',
      via: 'rolePermission'
    },  
      // Created By
    createdBy:{
      model: 'users',
      required: false,
      defaultsTo: ''
    },
    createdByObj: {
      type: 'json',
      defaultsTo: {email: ''}
    },
    updatedBy:{
      model: 'users',
      required: false,
      defaultsTo: ''
    },
    updatedByObj: {
      type: 'json',
      defaultsTo: {email: ''}
    }
    


  }
  
} 