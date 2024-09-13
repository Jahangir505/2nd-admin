/**
 * BusinessEvent.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'businessEvent',
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
    category: {
      model: 'category',
    },
    start_date_time: {
      type: 'string',
    },
    end_date_time: {
      type: 'datetime',
    },
    venue_name: {
      type: 'text',
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
    view: {
      type: 'integer',
      defaultsTo: 0
    },
    // Upcoming=1, Completed=2, Live=3, Applied=4, Cancelled=5
    status: {
      type: 'integer',
      required: true,
      defaultsTo: 1
    },
    slug: {
      type: 'string',
      unique: true,
    },

    businessProfile:{
      model: 'businessprofile',
    },
    businessReview: {
      collection: 'businessreview',
      via: 'businessEvent'
    },

    

  },

};

