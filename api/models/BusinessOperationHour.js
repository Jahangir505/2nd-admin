/**
 * BusinessOperationHour.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'businessOperationHour',
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {

    is_saturday_close: {
      type: "boolean",
      defaultsTo: false
    },
    is_saturday_24open: {
      type: "boolean",
      defaultsTo: false
    },
    saturday_start_time: {
      type: "string",
      defaultsTo: ''
    },
    saturday_end_time: {
      type: "string",
      defaultsTo: ''
    },


    is_sunday_close: {
      type: "boolean",
      defaultsTo: false
    },
    is_sunday_24open: {
      type: "boolean",
      defaultsTo: false
    },
    sunday_start_time: {
      type: "string",
      defaultsTo: ''
    },
    sunday_end_time: {
      type: "string",
      defaultsTo: ''
    },



    is_monday_close: {
      type: "boolean",
      defaultsTo: false
    },
    is_monday_24open: {
      type: "boolean",
      defaultsTo: false
    },
    monday_start_time: {
      type: "string",
      defaultsTo: ''
    },
    monday_end_time: {
      type: "string",
      defaultsTo: ''
    },
    
    is_tuesday_close: {
      type: "boolean",
      defaultsTo: false
    },
    is_tuesday_24open: {
      type: "boolean",
      defaultsTo: false
    },
    tuesday_start_time: {
      type: "string",
      defaultsTo: ''
    },
    tuesday_end_time: {
      type: "string",
      defaultsTo: ''
    },


    is_wednesday_close: {
      type: "boolean",
      defaultsTo: false
    },
    is_wednesday_24open: {
      type: "boolean",
      defaultsTo: false
    },
    wednesday_start_time: {
      type: "string",
      defaultsTo: ''
    },
    wednesday_end_time: {
      type: "string",
      defaultsTo: ''
    },


    is_thursday_close: {
      type: "boolean",
      defaultsTo: false
    },
    is_thursday_24open: {
      type: "boolean",
      defaultsTo: false
    },
    thursday_start_time: {
      type: "string",
      defaultsTo: ''
    },
    thursday_end_time: {
      type: "string",
      defaultsTo: ''
    },


    is_friday_close: {
      type: "boolean",
      defaultsTo: false
    },
    is_friday_24open: {
      type: "boolean",
      defaultsTo: false
    },
    friday_start_time: {
      type: "string",
      defaultsTo: ''
    },
    friday_end_time: {
      type: "string",
      defaultsTo: ''
    },
    friday_end_time: {
      type: "string",
      defaultsTo: ''
    },


    is_temporarily_closed: {
      type: "boolean",
      defaultsTo: false
    },
    is_permanently_closed: {
      type: "boolean",
      defaultsTo: false
    },
    reopen_date: {
      type: 'date',
      defaultsTo: ''
    },
    additional_detail: {
      type: "text",
    },

    // Relation
    businessProfile:{
      model: 'businessprofile',
    },
    // Created By

  },

};

