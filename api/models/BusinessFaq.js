/**
 * BusinessFaq.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'businessFaq',
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    question: {
      type: 'text',
      defaultsTo: ''
    },
    answer: {
      type: 'text',
      defaultsTo: ''
    },
    // active=1, inactive=2
    status: {
      type: 'integer',
      required: true,
      defaultsTo: 2
    },
    slug: {
      type: 'string',
      unique: true,
    },
    // Relation
    businessProfile:{
      model: 'businessprofile',
      // required: true
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
  },

};

