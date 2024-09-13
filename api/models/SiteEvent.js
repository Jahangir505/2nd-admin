/**
 * SiteEvent.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'siteEvent',
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {

    title: {
      type: 'string',
    },
    image: {
      type: 'text',
    },
    siteEventCategory:{
      model: 'siteeventcategory',
    },
    // expiration_date: {
    //   type: 'datetime',
    // },
    start_date_time: {
      type: 'datetime',
    },
    end_date_time: {
      type: 'datetime',
    },
    
    venue_name: {
      type: 'string',
    },
    ticket_price: {
      type: 'float',
      defaultsTo: 0.00
    },
    address: {
      type: 'text',
    },
    phone_no: {
      type: 'string',
    },
// Relation
    country: {
      model: 'country',
    },
    state: {
      model: 'state',
    },
    city: {
      type: 'string',
    },
    zip_code: {
      type: 'string',
    },
    website: {
      type: 'string',
    },
    details: {
      type: 'text',
    },
    history: {
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
    isFeatured: {
      type: "boolean",
      defaultsTo: false
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

