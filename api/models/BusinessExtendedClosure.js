/**
 * BusinessExtendedClosure.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'businessExtendedClosure',
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {

    is_temporarily_close: {
      type: "boolean",
      defaultsTo: false
    },
    is_permanently_close: {
      type: "boolean",
      defaultsTo: false
    },
    reopen_date: {
      type: 'date',
      defaultsTo: ''
    },
    additional_detail: {
      type: 'text',
      defaultsTo: ''
    },
    // Relation
    businessProfile:{
      model: 'businessprofile',
    },

  },

};

