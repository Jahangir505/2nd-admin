/**
 * HelpCenterCategory.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'helpCenterCategory',
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
    attributes: {
      name: {
        type: 'string',
        unique: true,
        required: true,
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
      helpCenter: {
        collection: 'helpcenter',
        via: 'helpCenterCategory'
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
