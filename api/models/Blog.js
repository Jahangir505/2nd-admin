/**
 * Blog.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'blog',
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    title: {
      type: 'string',
      required: true,
    },
    details: {
      type: 'text',
    },
    
    image: {
      type: 'text',
    },
    // Sticky Post=1, Featured Post=2, Recommended Post = 3
    blog_type: {
      type: 'integer',
      required: true,
      defaultsTo: 2
    },
    // view: {
    //   type: 'integer',
    //   defaultsTo: 0
    // },
    blogCategory:{
      model: 'blogcategory',
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

