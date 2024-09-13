/**
 * Country.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    code: {
      type: 'string',
      unique: true,
      required: true,
    },
    name: {
      type: 'string',
      unique: true,
      required: true,
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
    //Relation
    // backendusers: {
    //   collection: 'users',
    //   via: 'country'
    // },
    state: {
      collection: 'state',
      via: 'country'
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

