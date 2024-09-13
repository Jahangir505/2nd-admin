/**
 * BlogComment.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'blogComment',
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
    },
    comment: {
      type: 'text',
    },
    blog:{
      model: 'blog',
    },
    createdBy:{
      model: 'users',
    },

  },

};

