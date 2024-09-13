/**
 *  BusinessReview.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'businessReview',
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    
    rating: {
      type: 'integer',
      defaultsTo: 0
    },
    comment: {
      type: 'text',
    },
    // isFeatured: {
    //   type: "boolean",
    //   defaultsTo: false
    // },
    isTestimonial: {
      type: "boolean",
      defaultsTo: false
    },

    // Relation
    businessProfile:{
      model: 'businessprofile',
    },
    businessEvent:{
      model: 'businessevent',
    },
    customer:{
      model: 'users',
    },
    // Created By
    // createdBy:{
    //   model: 'users',
    //   required: false,
    //   defaultsTo: ''
    // },
    // createdByObj: {
    //   type: 'json',
    //   defaultsTo: {email: '', name: '', image: ''}
    // },
    // updatedBy:{
    //   model: 'users',
    //   required: false,
    //   defaultsTo: ''
    // },

  },

};

