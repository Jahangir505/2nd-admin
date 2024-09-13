/**
 * SiteTicketType.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'siteTicketType',
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {

    name: {
      type: 'string',
    },
    // awaiting=1, replied=2
    status: {
      type: 'integer',
      required: true,
      defaultsTo: 1
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

