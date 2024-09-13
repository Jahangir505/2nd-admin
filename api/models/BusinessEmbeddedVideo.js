/**
 * BusinessEmbeddedVideo.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'businessEmbeddedVideo',
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    title: {
      type: 'string',
      defaultsTo: ''
    },
    link: {
      type: 'text',
      defaultsTo: ''
    },
    slug: {
      type: 'string',
      unique: true,
    },
    // active=1, inactive=2
    status: {
      type: 'integer',
      required: true,
      defaultsTo: 1
    },
    // Relation
    businessProfile:{
      model: 'businessprofile',
      required: false
    },
     
  },

};

