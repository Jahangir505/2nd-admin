/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // process.env.TZ = 'UTC';
  // process.env.TZ = 'UTC+6';
  // process.env.TZ = 'Asia/Calcutta';
  // process.env.TZ = 'Asia/Dhaka';
  process.env.TZ = 'Europe/London';
  // process.env.TZ = "GMT+6";
  sails.hooks.http.app.set('trust proxy', true);
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
