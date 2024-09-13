/**
 * SiteTicket.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'siteTicket',
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,

  attributes: {
    ticked_id: {
      type: 'string',
      unique: true,
    },
    title: {
      type: 'string',
    },
    siteTicketType:{
      model: 'sitetickettype',
    },
    //business = 1, customer = 2
    user_type: {
      type: 'integer',
    },
    // In Progress=1, Cancelled=2, Completed=3
    status: {
      type: 'integer',
      required: true,
      defaultsTo: 1
    },
    
    slug: {
      type: 'string',
      unique: true,
    },
    //Relation
    replyFor:{
      model: 'siteTicket',
    },
    siteTicketMessage: {
      collection: 'siteticketmessage',
      via: 'siteTicket'
    },
    // Created By
    createdBy:{
      model: 'users',
    },
    businessProfile:{
      model: 'businessprofile',
    },
    customerProfile: {
      model: 'customerProfile',
    },
    updatedBy:{
      model: 'users',
    },

  },

};

