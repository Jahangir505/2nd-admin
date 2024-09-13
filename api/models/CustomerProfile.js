/**
 * CustomerProfile.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'customerProfile',
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    //male=1,female=2,Other=3
    gender: {
      type: 'integer',
      defaultsTo: 0
    },
    mobile_no: {
      type: 'string',
      defaultsTo: ''
    },
    image: {
      type: 'text',
    },
    address: {
      type: 'string',
      defaultsTo: ''
    },
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
      // defaultsTo: ''
    },

    facebook_link: {
      type: 'string',
    },
    twitter_link: {
      type: 'string',
    },
    linkedin_link: {
      type: 'string',
    },
    youtube_link: {
      type: 'string',
    },

    //Notification
    //Get email updates about
    friendRequests: {
      type: "boolean",
      defaultsTo: false
    },
    newFollowers: {
      type: "boolean",
      defaultsTo: false
    },
    complimentsMessages: {
      type: "boolean",
      defaultsTo: false
    },
    contentFriendsShare: {
      type: "boolean",
      defaultsTo: false
    },
    messagesFromBusiness: {
      type: "boolean",
      defaultsTo: false
    },
    
    //We'll also let you know about
    businesseLike: {
      type: "boolean",
      defaultsTo: false
    },
    friendlyTipsAndTricks: {
      type: "boolean",
      defaultsTo: false
    },
    discountAndPromotion: {
      type: "boolean",
      defaultsTo: false
    },
    surveys: {
      type: "boolean",
      defaultsTo: false
    },
    //Friend activity
    friendYourCity: {
      type: "boolean",
      defaultsTo: false
    },
    friendAllCity: {
      type: "boolean",
      defaultsTo: false
    },
    //Reactions to your posts
    reviewVotes: {
      type: "boolean",
      defaultsTo: false
    },
    checkInComment: {
      type: "boolean",
      defaultsTo: false
    },
    checkInLikes: {
      type: "boolean",
      defaultsTo: false
    },
    tipLikes: {
      type: "boolean",
      defaultsTo: false
    },
    //From 2ndA Friendly
    dealsAndAnnouncements: {
      type: "boolean",
      defaultsTo: false
    },

    // Privacy Setting

    find_friends: {
      type: "boolean",
      defaultsTo: false
    },
    bookmarks: {
      type: "boolean",
      defaultsTo: false
    },
    direct_messages_from_business: {
      type: "boolean",
      defaultsTo: false
    },
    ads_display_off_2nd_friendly: {
      type: "boolean",
      defaultsTo: false
    },

    user: {
      model: 'users',
      via: 'customerProfile'
    },
    
    


  },

};

