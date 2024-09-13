/**
 * BusinessCareer.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName     : 'businessCareer',
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    title: {
      type: 'string',
    },
    //fullTime = 1, halfTime = 2, Contracttual = 3, Hourly = 4
    job_type: {
      type: 'integer',
    },
    //entryLevel = 1, midLevel = 2, highLevel = 3
    job_level: {
      type: 'integer',
    },
    // Marketting=1, humenresource=2, AccountOfficer=3
    department: {
      // type: 'string',
      type: 'integer',
    },
    details: {
      type: 'string',
    },
    expiration_date: {
      type: 'date',
      defaultsTo: ''
    },
    views: {
      type: 'integer',
    },
    // Active=1, In-active=2
    status: {
      type: 'integer',
      required: true,
      defaultsTo: 1
    },
    slug: {
      type: 'string',
      unique: true,
    },
    businessProfile:{
      model: 'businessprofile',
    },
    customer:{
      model: 'users',
    },
  },

};

