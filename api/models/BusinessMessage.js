/**
 * BusinessMessage.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'businessMessage',
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    // first_name: {
    //   type: 'string',
    // },
    // last_name: {
    //   type: 'string',
    // },
    // image: {
    //   type: 'text',
    // },
    // email: {
    //   type: 'string',
    // },
    // mobile_no: {
    //   type: 'string',
    // },
    message: {
      type: 'text',
    },
    // awaiting=1, replied=2
    status: {
      type: 'integer',
      required: true,
      defaultsTo: 1
    },


    // Relation
    category:{
      model: 'category',
    },
    subCategory:{
      model: 'subcategory',
    },

    businessProfile:{
      model: 'businessprofile',
    },
    // This id means, this message is reply of 'replayFor' id
    replyFor:{
      model: 'businessmessage',
    },

    businessUser:{
      model: 'users',
    },
    // businessUserObj: {
    //   type: 'json',
    //   defaultsTo: {email: '', name: '', image: ''}
    // },

    // Created By
    customer:{
      model: 'users',
    },

    createdBy:{
      model: 'users',
    },
    // customerObj: {
    //   type: 'json',
    //   defaultsTo: {email: '', name: '', image: ''}
    // },
    // updatedBy:{
    //   model: 'users',
    //   required: false,
    //   defaultsTo: ''
    // },
    

  },

};

