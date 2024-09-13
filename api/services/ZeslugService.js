
var Q = require('q');
var _ = require('lodash');

var _slug = require('slug');
var uuidv4 = require('uuid/v4');

module.exports = {

  slugForCreate_ok: function(options) {


    console.log('options',options);

    var model = sails.models[options.model];



    // =================

    var attr = {
      // type: 'slug',
      type: options.type,
      // from: 'name',
      from: options.from,
      unique: true,
      defaultValue: options.defaultValue,        // IF `from` value null than use Field, default null
      multiField: true,
      blacklist: ['search']
    };
    var finalSlug = '';
    // var finalSlug = 'abcds';
    // console.log('Type ',attr.type);
    // if (attr.type === 'slug' && attr.from) {
    if (attr.type === 'slug') {
      // attr.type = 'string';

      var from = (attr.from) ? attr.from : attr.defaultValue;
      var defaultValue = (attr.defaultValue) ? attr.defaultValue : 'slug';
      var remove = (attr.remove) ? attr.remove : null;
      var lower = (attr.lower) ? attr.lower : true;
      var separator = (attr.separator) ? attr.separator : "-";

      var blacklist = (attr.blacklist) ? attr.blacklist : null;
      // var slugName = "";
      var slugName = (from) ? from : defaultValue;


      slugName = (slugName) ? _slug(slugName, {lower: lower, replacement: separator, remove: remove}) : 'slug';

      if (blacklist.indexOf(slugName) !== -1 || Array.isArray(blacklist) && blacklist.indexOf(slugName) !== -1) {
        console.log('Yes ');
      } else {
        console.log('No ');
      }

      console.log('Error in ServiceNo ');

      var criteria = {};
      // criteria['slug'] = { 'like': slugName+'%' };
      criteria['slug'] = slugName;
      criteria['select'] = ['slug'];

      // =========Query Start==========
      // finalSlug = 'abcds';

      model.find(criteria).then(function (found) {
        if (found && found.length > 0) {
          var slugNo = 1;
          var suffix = false;
          for (var i = 0; i < found.length; i++) {
            var str = found[i]['slug'];
            var regx = "^" + slugName + "-[0-9]*$";
            var patt = new RegExp(regx);
            if (patt.test(str)) {
              var res = str.replace(slugName + "-", "");
              if (!isNaN(res)) {
                var num = parseInt(res);
                if (num >= slugNo) {
                  suffix = true;
                  slugNo = num + 1;
                  console.log(slugNo);
                  // product['slug'] = slugName +separator+ slugNo;
                  // product.slug = slugName + separator + slugNo;
                  finalSlug = slugName + separator + slugNo;
                }

              }
            }
            else {
              if (!suffix) {
                suffix = true;
                // product['slug'] = slugName;
                finalSlug = slugName;
                if (str == slugName) {
                  suffix = true;
                  // product['slug'] = slugName +separator+ slugNo;
                  // product.slug = slugName + separator + slugNo;
                  finalSlug = slugName + separator + slugNo;
                }
              }
            }

          }

          if (!suffix) {
            // product['slug'] = slugName +separator+ uuidv4();
            // product.slug = slugName + separator + uuidv4();
            finalSlug = slugName + separator + uuidv4();
          }

        } else {
          // product['slug'] = slugName;
          // product.slug = slugName;
          finalSlug = slugName;

          console.log('Not Qry Found',finalSlug);
        }

        // console.log('Final', product['slug']);
        // delete product.slugfor;
        // next(false, product);
        console.log('Not Qry Found11',finalSlug);
        // return finalSlug;

      }).catch(function (err) {
        console.log(err);
        next();
      })
      // product.slug = 'asca1sw';
      // return next();

      // =========Query End==========
      // console.log('Final2', product.slug);

    }

    // =================







    // return model.attributes;
    // return slugName;
    return finalSlug;
    // return model;
  },

  slugForCreate: function(options) {
    // console.log('uuidv4uuidv4', uuidv4());
    var model = sails.models[options.model];
    // =================
    var attr = {
      type: options.type,
      from: options.from,
      unique: true,
      defaultValue: options.defaultValue,        // IF `from` value null than use Field, default null
      multiField: true,
      blacklist: ['search']
    };
    // var finalSlug = '';
    // var finalSlug = 'abcds';
    // console.log('Type ',attr.type);
    // if (attr.type === 'slug' && attr.from) {
    if (attr.type === 'slug') {
      // attr.type = 'string';

      var from = (attr.from) ? attr.from : attr.defaultValue;
      var defaultValue = (attr.defaultValue) ? attr.defaultValue : 'slug';
      var remove = (attr.remove) ? attr.remove : null;
      var lower = (attr.lower) ? attr.lower : true;
      var separator = (attr.separator) ? attr.separator : "-";
      var blacklist = (attr.blacklist) ? attr.blacklist : null;
      // var slugName = "";
      var slugName = (from) ? from : defaultValue;
      slugName = (slugName) ? _slug(slugName, {lower: lower, replacement: separator, remove: remove}) : 'slug';
      console.log('slugName is  ', slugName);
      if (blacklist.indexOf(slugName) !== -1 || Array.isArray(blacklist) && blacklist.indexOf(slugName) !== -1) {
        console.log('Yes ');
      } else {
        console.log('No ');
      }
      // console.log('Error in ServiceNo ');
      var criteria = {};
      criteria['slug'] = { 'like': slugName+'%' };
      // criteria['slug'] = slugName;
      criteria['select'] = ['slug'];
      // =============Embaded Start===============
      var finalSlug =  Q.all([
        model.find(criteria)
      ])
        .spread(function(found){
          // =========Q===
          if (found && found.length > 0) {
            var slugNo = 1;
            var suffix = false;
            for (var i = 0; i < found.length; i++) {
              var str = found[i]['slug'];
              var regx = "^" + slugName + "-[0-9]*$";
              var patt = new RegExp(regx);
              if (patt.test(str)) {
                var res = str.replace(slugName + "-", "");
                if (!isNaN(res)) {
                  var num = parseInt(res);
                  if (num >= slugNo) {
                    suffix = true;
                    slugNo = num + 1;
                    console.log(slugNo);
                    // product['slug'] = slugName +separator+ slugNo;
                    // product.slug = slugName + separator + slugNo;
                    finalSlug = slugName + separator + slugNo;
                  }
                }
              }
              else {
                if (!suffix) {
                  suffix = true;
                  // product['slug'] = slugName;
                  finalSlug = slugName;
                  if (str == slugName) {
                    suffix = true;
                    // product['slug'] = slugName +separator+ slugNo;
                    // product.slug = slugName + separator + slugNo;
                    finalSlug = slugName + separator + slugNo;
                  }
                }
              }

            }
            if (!suffix) {
              // product['slug'] = slugName +separator+ uuidv4();
              // product.slug = slugName + separator + uuidv4();
              finalSlug = slugName + separator + uuidv4();
            }
            console.log('Qry Found',finalSlug);
          } else {
            // product['slug'] = slugName;
            // product.slug = slugName;
            finalSlug = slugName;
            console.log('Not Qry Found',finalSlug);
          }
          return finalSlug;

        }).catch(function(err){
          console.log(err);
          next();
      });
      // =============Embaded End=================
      // =========Query Start==========
      // =========Query End==========
      // console.log('Final2', product.slug);

    }
    return finalSlug;
  },

  slugForUpdate: function(options) {
    // console.log('options',options);
    var model = sails.models[options.model];
    var attr = {
      // type: 'slug',
      type: options.type,
      // from: 'name',
      from: options.from,
      unique: true,
      defaultValue: options.defaultValue,        // IF `from` value null than use Field, default null
      multiField: true,
      blacklist: ['search'],
      itemId: options.itemId
    };
    // var finalSlug = '';
    // var finalSlug = 'abcds';
    // console.log('Type ',attr.type);
    // if (attr.type === 'slug' && attr.from) {
    if (attr.type === 'slug') {
      // attr.type = 'string';
      var from = (attr.from) ? attr.from : attr.defaultValue;
      var defaultValue = (attr.defaultValue) ? attr.defaultValue : 'slug';
      var remove = (attr.remove) ? attr.remove : null;
      var lower = (attr.lower) ? attr.lower : true;
      var separator = (attr.separator) ? attr.separator : "-";
      var blacklist = (attr.blacklist) ? attr.blacklist : null;
      // var slugName = "";
      var slugName = (from) ? from : defaultValue;
      slugName = (slugName) ? _slug(slugName, {lower: lower, replacement: separator, remove: remove}) : 'slug';

      if (blacklist.indexOf(slugName) !== -1 || Array.isArray(blacklist) && blacklist.indexOf(slugName) !== -1) {
        console.log('Yes ');
      } else {
        console.log('No ');
      }
      // console.log('Error in ServiceNo ');
      var criteria = {};
      criteria['slug'] = { 'like': slugName+'%' };
      // criteria['slug'] = slugName;
      criteria['select'] = ['slug'];
      criteria['id'] = {'!': [attr.itemId]};
      // =============Embaded Start===============
      var finalSlug =  Q.all([
        model.find(criteria)
      ])
        .spread(function(found){
          // =========Q===
          if (found && found.length > 0) {
            var slugNo = 1;
            var suffix = false;
            for (var i = 0; i < found.length; i++) {
              var str = found[i]['slug'];
              var regx = "^" + slugName + "-[0-9]*$";
              var patt = new RegExp(regx);
              if (patt.test(str)) {
                var res = str.replace(slugName + "-", "");
                if (!isNaN(res)) {
                  var num = parseInt(res);
                  if (num >= slugNo) {
                    suffix = true;
                    slugNo = num + 1;
                    console.log(slugNo);
                    // product['slug'] = slugName +separator+ slugNo;
                    // product.slug = slugName + separator + slugNo;
                    finalSlug = slugName + separator + slugNo;
                  }
                }
              }
              else {
                if (!suffix) {
                  suffix = true;
                  // product['slug'] = slugName;
                  finalSlug = slugName;
                  if (str == slugName) {
                    suffix = true;
                    // product['slug'] = slugName +separator+ slugNo;
                    // product.slug = slugName + separator + slugNo;
                    finalSlug = slugName + separator + slugNo;
                  }
                }
              }
            }
            if (!suffix) {
              // product['slug'] = slugName +separator+ uuidv4();
              // product.slug = slugName + separator + uuidv4();
              finalSlug = slugName + separator + uuidv4();
            }
            console.log('Qry Found',finalSlug);

          } else {
            // product['slug'] = slugName;
            // product.slug = slugName;
            finalSlug = slugName;
            // console.log('Not Qry Found',finalSlug);
          }
          // =========Q===
          return finalSlug;
        }).catch(function(err){
          console.log(err);
          next();
        });
      // =============Embaded End=================
            // console.log('Final2', product.slug);
    }
    // =================
    // return model.attributes;
    // return slugName;
    return finalSlug;
    // return model;
  },

};
