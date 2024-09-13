/**
 * SiteTicketMessage.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'siteTicketMessage',
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    ticked_id: {
      type: 'string',
      unique: true,
    },
    user_type: {
      type: 'integer',
    },
    message: {
      type: 'text',
    },
    attachment: {
      type: 'text',
    },
    // In Progress=1, Cancelled=2, Completed=3
    status: {
      type: 'integer',
      required: true,
      defaultsTo: 1
    },
    //Relation
    siteTicket:{
      model: 'siteticket',
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

  },

};

