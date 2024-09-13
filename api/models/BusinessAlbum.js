/**
 * BusinessAlbum.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'businessAlbum',
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    name: {
      type: 'string',
      defaultsTo: ''
    },
    image: {
      type: 'text',
    },
    // active=1, inactive=2
    status: {
      type: 'integer',
      required: false,
      defaultsTo: 1
    },
    slug: {
      type: 'string',
      unique: true,
    },
    // Relation Start
    businessProfile:{
      model: 'businessprofile',
      required: false
    },

    businessAlbumPhoto: {
      collection: 'businessalbumphoto',
      via: 'businessAlbum'
    },

    

     // Created By
    // createdBy:{
    //   model: 'users',
    //   required: false,
    //   defaultsTo: ''
    // },
    // createdByObj: {
    //   type: 'json',
    //   defaultsTo: {email: ''}
    // },
    // updatedBy:{
    //   model: 'users',
    //   required: false,
    //   defaultsTo: ''
    // },
    // updatedByObj: {
    //   type: 'json',
    //   defaultsTo: {email: ''}
    // }

  },

};

