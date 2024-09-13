/**
 * BusinessProfileSubCategory.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'businessProfile_subCategory',
  schema: true,
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    businessProfile: {
      model: 'businessprofile'
    },
    subCategory: {
      model: 'subcategory'
    },

  },

};

