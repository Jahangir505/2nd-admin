/**
 * SitePage.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'sitePage',
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'text',
    },
    image: {
      type: 'text',
    },
    view: {
      type: 'integer',
      defaultsTo: 0
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

