/**
 * BusinessProfile.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'businessProfile',
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    business_name: {
      type: 'string',
      defaultsTo: ''
    },
    business_description: {
      type: 'text',
      defaultsTo: ''
    },
    official_email: {
      type: 'string',
      defaultsTo: ''
    },
    official_phone: {
      type: 'string',
      defaultsTo: ''
    },
    Official_address_line1: {
      type: 'string',
      defaultsTo: ''
    },
    // relation
    country: {
      model: 'country',
    },
    // Relation
    state: {
      model: 'state',
    },
    city: {
      type: 'string',
      defaultsTo: ''
    },
    zip: {
      type: 'string',
      defaultsTo: ''
    },
    website_link: {
      type: 'string',
      defaultsTo: ''
    },
    history: {
      type: 'text',
      defaultsTo: ''
    },
    business_logo: {
      type: 'text',
    },
    licensee: {
      type: 'string',
      defaultsTo: ''
    },
    license_no: {
      type: 'string',
      defaultsTo: ''
    },
    issued_by: {
      type: 'string',
      defaultsTo: ''
    },
    license_type: {
      type: 'string',
      defaultsTo: ''
    },

    facebook_link: {
      type: 'string',
      defaultsTo: ''
    },
    twitter_link: {
      type: 'string',
      defaultsTo: ''
    },
    linkedin_link: {
      type: 'string',
      defaultsTo: ''
    },
    youtube_link: {
      type: 'string',
      defaultsTo: ''
    },
    
    location: {
      type: 'text',
      defaultsTo: ''
    },

    
    business_highlights: {
      type: 'text',
      defaultsTo: ''
    },
    view: {
      type: 'integer',
      defaultsTo: 0
    },
    slug: {
      type: 'string',
      unique: true,
    },
    //Fetured
    // is_featured: {
    //   type: "boolean",
    //   defaultsTo: false,
    // },
    // //1=pending, 2=approve, 3=rejected
    // status: {
    //   type: 'integer',
    //   defaultsTo: 2
    // },

    //Your Business
    sendEmailReviews: {
      type: "boolean",
      defaultsTo: false
    },
    sendEmailPost: {
      type: "boolean",
      defaultsTo: false
    },
    sendEmailDisplayInformation: {
      type: "boolean",
      defaultsTo: false
    },
    //Messaging and Leads
    sendEmailReceiveMessage: {
      type: "boolean",
      defaultsTo: false
    },
    receiveLeadsFromNearByJobs: {
      type: "boolean",
      defaultsTo: false
    },
    //2nd A Friendly Account
    statusOfBusinessInfoEdit: {
      type: "boolean",
      defaultsTo: false
    },
    contributions: {
      type: "boolean",
      defaultsTo: false
    },

    // Privacy Setting

    bookmarks: {
      type: "boolean",
      defaultsTo: false
    },
    direct_messages_from_user: {
      type: "boolean",
      defaultsTo: false
    },
    ads_display_off_2nd_friendly: {
      type: "boolean",
      defaultsTo: false
    },
       

    // Relation start

    //One to one relation
    user: {
      model: 'users',
      via: 'businessProfile'
    },

    // business Album relation
    businessAlbum: {
      collection: 'businessalbum',
      via: 'businessProfile'
    },
    // embadevideo relation
    businessEmbeddedVideo: {
      collection: 'businessembeddedvideo',
      via: 'businessProfile'
    },

    // operation hour relation
    businessOperationHour: {
      collection: 'businessoperationhour',
      via: 'businessProfile'
    },

    // Businessreview relation
    businessReview: {
      collection: 'businessreview',
      via: 'businessProfile'
    },


    // FAQ relation
    businessFaq: {
      collection: 'businessfaq',
      via: 'businessProfile'
    },

    // massage relation
    businessMessage: {
      collection: 'businessmessage',
      via: 'businessProfile'
    },

    // businessEvent relation
    businessEvent: {
      collection: 'businessevent',
      via: 'businessProfile'
    },






// amenetis Many to many relation
    amenity: {
      collection: 'amenity',
      via: 'businessProfile',
      through: 'businessprofileamenity'
    },

    // Category Many to many relation
    category: {
      collection: 'category',
      via: 'businessProfile',
      through: 'businessprofilecategory'
    },
    // SubCategory Many to many relation
    subCategory: {
      collection: 'subcategory',
      via: 'businessProfile',
      through: 'businessprofilesubcategory'
    },


    // Created By
    // createdBy:{
    //   model: 'users',
    //   required: false,
    //   defaultsTo: ''
    // },
    // createdByObj: {
    //   type: 'json',
    //   defaultsTo: {email: ''}
    // },
    // updatedBy:{
    //   model: 'users',
    //   required: false,
    //   defaultsTo: ''
    // },
    // updatedByObj: {
    //   type: 'json',
    //   defaultsTo: {email: ''}
    // }

  },

};

