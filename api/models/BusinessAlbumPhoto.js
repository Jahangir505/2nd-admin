/**
 * BusinessAlbumPhoto.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'businessAlbumPhoto',
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    title: {
      type: 'string',
      defaultsTo: ''
    },
    image: {
      type: 'text',
    },
    // active=1, inactive=2
    status: {
      type: 'integer',
      required: true,
      defaultsTo: 1
    },
    slug: {
      type: 'string',
      unique: true,
    },

    //Relation start
    businessProfile:{
      model: 'businessprofile',
      required: false
    },
    businessAlbum:{
      model: 'businessalbum',
      required: true
    },

  },

};

