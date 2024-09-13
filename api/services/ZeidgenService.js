
var moment = require('moment');

var Q = require('q');
var _ = require('lodash');

var uuidv4 = require('uuid/v4');



module.exports = {

  uniqueIdForFieldCreate__: function(options) {

    var idDatePart = moment().format("DDMMYY");
    // var idDatePart = moment().format("DD-MM-YY");

    var model = sails.models[options.model];
    // var model = sails.models['obsprofile'];
    // console.log('MOdel1', model);
    // console.log('MOdel', options.model);
    //
    var checkField = options.checkField;

    var separator = '-';

    var criteria = {};
    // qdata.title = { 'like': '%'+paTitle+'%' };
    // criteria[checkField] = { 'like': idDatePart+'%' };
    criteria[checkField] = { 'like': idDatePart+'%' };
    criteria['select'] = [checkField];


    // =============Embaded Start===============
    var finalIdNumber =  Q.all([
      model.find(criteria)
      // ObsProfile.find(criteria)
    ])
      .spread(function(found){

        // =========Q===
        if (found && found.length > 0) {
          var slugNo = 1;
          var suffix = false;
          for (var i = 0; i < found.length; i++) {

            var str = found[i][checkField];

            console.log('str ---', str);

            var regx = "^" + idDatePart + "-[0-9]*$";
            // var regx = "^" + idDatePart + "-[0-9]*$"+zeServerNo+"-";
            var patt = new RegExp(regx);
            if (patt.test(str)) {
              var res = str.replace(idDatePart + "-", "");
              // var res = str.replace(idDatePart + "-"+zeServerNo+"-", "");
              console.log('res ---', res);

              if (!isNaN(res)) {
                var num = parseInt(res);
                if (num >= slugNo) {
                  suffix = true;
                  slugNo = num + 1;
                  // console.log(slugNo);
                  // finalIdNumber = idDatePart + separator + zeServerNo + separator + slugNo;
                  finalIdNumber = idDatePart + separator + slugNo;

                  console.log('I am Here 1', finalIdNumber );

                }

              }
            }
            else {
              if (!suffix) {
                suffix = true;
                finalIdNumber = idDatePart;
                console.log('I am Here 2 1', finalIdNumber );
                if (str == idDatePart) {
                  suffix = true;
                  // finalIdNumber = idDatePart + separator + zeServerNo + separator + slugNo;
                  finalIdNumber = idDatePart + separator + slugNo;
                  console.log('I am Here 2', finalIdNumber );
                }
              }
            }

          }


        } else {
          // finalIdNumber = idDatePart + separator + zeServerNo + separator + 1;
          finalIdNumber = idDatePart + separator + 1;
          // console.log('Not Qry Found',finalIdNumber);
          console.log('I am Here 3', finalIdNumber );
        }


        // =========Q===

        return finalIdNumber;

      }).catch(function(err){
        console.log(err);
        next();
      });
    // =============Embaded End=================
    return finalIdNumber;
  },
  uniqueIdForFieldCreate: function(options) {

    var idDatePart = moment().format("DDMMYY")+'-'+zeServerNo;
    // var idDatePart = moment().format("DD-MM-YY");

    var model = sails.models[options.model];
    // var model = sails.models['obsprofile'];
    // console.log('MOdel1', model);
    // console.log('MOdel', options.model);
    //
    var checkField = options.checkField;

    var separator = '-';

    var criteria = {};
    // qdata.title = { 'like': '%'+paTitle+'%' };
    // criteria[checkField] = { 'like': idDatePart+'%' };
    criteria[checkField] = { 'like': idDatePart+'%' };
    criteria['select'] = [checkField];


    // =============Embaded Start===============
    var finalIdNumber =  Q.all([
      model.find(criteria)
      // ObsProfile.find(criteria)
    ])
      .spread(function(found){

        // =========Q===
        if (found && found.length > 0) {
          var slugNo = 1;
          var suffix = false;
          for (var i = 0; i < found.length; i++) {

            var str = found[i][checkField];

            console.log('str ---', str);

            // var regx = "^" + idDatePart + "-[0-9]*$";
            var regx = "^" + idDatePart + "-[0-9]*$";
            console.log('regx ---', regx);
            var patt = new RegExp(regx);
            console.log('patt ---', patt);

            if (patt.test(str)) {
              var res = str.replace(idDatePart + "-", "");
              // var res = str.replace(idDatePart + "-"+zeServerNo+"-", "");
              console.log('res ---', res);

              if (!isNaN(res)) {
                var num = parseInt(res);
                if (num >= slugNo) {
                  suffix = true;
                  slugNo = num + 1;
                  // console.log(slugNo);
                  // finalIdNumber = idDatePart + separator + zeServerNo + separator + slugNo;
                  finalIdNumber = idDatePart + separator + slugNo;

                  console.log('I am Here 1', finalIdNumber );

                }

              }
            }
            else {
              if (!suffix) {
                suffix = true;
                finalIdNumber = idDatePart;
                console.log('I am Here 2 1', finalIdNumber );
                if (str == idDatePart) {
                  suffix = true;
                  // finalIdNumber = idDatePart + separator + zeServerNo + separator + slugNo;
                  finalIdNumber = idDatePart + separator + slugNo;
                  console.log('I am Here 2', finalIdNumber );
                }
              }
            }

          }


        } else {
          // finalIdNumber = idDatePart + separator + zeServerNo + separator + 1;
          finalIdNumber = idDatePart + separator + 1;
          // console.log('Not Qry Found',finalIdNumber);
          console.log('I am Here 3', finalIdNumber );
        }
        // =========Q===
        return finalIdNumber;

      }).catch(function(err){
        console.log(err);
        next();
      });
    // =============Embaded End=================
    return finalIdNumber;
  },

  uniqueIdForFieldMigrate: function(options) {

    var creatDate = moment(options.createdAt);
    // var dateComponent = creatDate.utc().format('YYYY-MM-DD');
    // var dateComponent = creatDate.utc().format('DDMMYY');
    // var timeComponent = creatDate.utc().format('HH:mm:ss');
    // console.log('dateComponent  = ', dateComponent);
    var idDatePart = creatDate.utc().format('DDMMYY');
    var model = sails.models[options.model];
    var checkField = options.checkField;

    var separator = '-';

    var criteria = {};
    criteria[checkField] = { 'like': idDatePart+'%' };
    criteria['select'] = [checkField];
    // =============Embaded Start===============
    var finalIdNumber =  Q.all([
      model.find(criteria)
    ])
      .spread(function(found){
        // =========Q===
        if (found && found.length > 0) {
          var slugNo = 1;
          var suffix = false;
          for (var i = 0; i < found.length; i++) {
            var str = found[i][checkField];
            var regx = "^" + idDatePart + "-[0-9]*$";
            var patt = new RegExp(regx);
            if (patt.test(str)) {
              var res = str.replace(idDatePart + "-", "");
              if (!isNaN(res)) {
                var num = parseInt(res);
                if (num >= slugNo) {
                  suffix = true;
                  slugNo = num + 1;
                  finalIdNumber = idDatePart + separator + slugNo;
                }
              }
            }
            else {
              if (!suffix) {
                suffix = true;
                finalIdNumber = idDatePart;
                if (str == idDatePart) {
                  suffix = true;
                  finalIdNumber = idDatePart + separator + slugNo;
                }
              }
            }
          }
        } else {
          finalIdNumber = idDatePart + separator + 1;
        }
        // =========Q===
        return finalIdNumber;

      }).catch(function(err){
        console.log(err);
        next();
      });
    // =============Embaded End=================
    return finalIdNumber;
  },

  uniqueIdForDamageProperty: function(options) {
    var creatDate = moment(options.createdAt);
    // var dateComponent = creatDate.utc().format('YYYY-MM-DD');
    // var dateComponent = creatDate.utc().format('DDMMYY');
    // var timeComponent = creatDate.utc().format('HH:mm:ss');
    // console.log('dateComponent  = ', dateComponent);
    var idDatePart = creatDate.utc().format('DDMMYY');
    var model = sails.models[options.model];
    var checkField = options.checkField;
    var separator = '-';
    var criteria = {};
    criteria[checkField] = { 'like': idDatePart+'%' };
    criteria['select'] = [checkField];
    // =============Embaded Start===============
    var finalIdNumber =  Q.all([
      model.find(criteria)
    ])
      .spread(function(found){
        // =========Q===
        if (found && found.length > 0) {
          var slugNo = 1;
          var suffix = false;
          for (var i = 0; i < found.length; i++) {
            var str = found[i][checkField];
            var regx = "^" + idDatePart + "-[0-9]*$";
            var patt = new RegExp(regx);
            if (patt.test(str)) {
              var res = str.replace(idDatePart + "-", "");
              if (!isNaN(res)) {
                var num = parseInt(res);
                if (num >= slugNo) {
                  suffix = true;
                  slugNo = num + 1;
                  finalIdNumber = idDatePart + separator + slugNo;
                }
              }
            }
            else {
              if (!suffix) {
                suffix = true;
                finalIdNumber = idDatePart;
                if (str == idDatePart) {
                  suffix = true;
                  finalIdNumber = idDatePart + separator + slugNo;
                }
              }
            }
          }
        } else {
          finalIdNumber = idDatePart + separator + 1;
        }
        // =========Q===
        return finalIdNumber;
      }).catch(function(err){
        console.log(err);
        next();
      });
    // =============Embaded End=================
    return finalIdNumber;
  },

  uniqueIdForIncidentCreate: function(options) {
    var currentMome = moment();
    var idDatePart = currentMome.utc().format('DDMMYY');
    // console.log('bbb  = ', bbb);
    // var idDatePart = moment().format("DDMMYY");
    // var idDatePart = moment().format("DD-MM-YY");
    console.log('idDatePart  = ', idDatePart);
    var model = sails.models[options.model];
    // var model = sails.models['obsprofile'];
    // console.log('MOdel1', model);
    // console.log('MOdel', options.model);
    //
    var checkField = options.checkField;
    var separator = '-';
    var criteria = {};
    // qdata.title = { 'like': '%'+paTitle+'%' };
    // criteria[checkField] = { 'like': idDatePart+'%' };
    criteria[checkField] = { 'like': idDatePart+'%' };
    criteria['select'] = [checkField];
    // =============Embaded Start===============
    var finalIdNumber =  Q.all([
      model.find(criteria)
      // ObsProfile.find(criteria)
    ])
      .spread(function(found){
        // =========Q===
        if (found && found.length > 0) {
          var slugNo = 1;
          var suffix = false;
          for (var i = 0; i < found.length; i++) {
            var str = found[i][checkField];
            // console.log('str ---', str);
            // var regx = "^" + idDatePart + "-[0-9]*$";
            var regx = "^" + idDatePart + "-[0-9]*$";
            // console.log('regx ---', regx);
            var patt = new RegExp(regx);
            // console.log('patt ---', patt);

            if (patt.test(str)) {
              var res = str.replace(idDatePart + "-", "");
              // var res = str.replace(idDatePart + "-"+zeServerNo+"-", "");
              // console.log('res ---', res);

              if (!isNaN(res)) {
                var num = parseInt(res);
                if (num >= slugNo) {
                  suffix = true;
                  slugNo = num + 1;
                  // console.log(slugNo);
                  // finalIdNumber = idDatePart + separator + zeServerNo + separator + slugNo;
                  finalIdNumber = idDatePart + separator + slugNo;
                  // console.log('I am Here 1', finalIdNumber );
                }
              }
            }
            else {
              if (!suffix) {
                suffix = true;
                finalIdNumber = idDatePart;
                console.log('I am Here 2 1', finalIdNumber );
                if (str == idDatePart) {
                  suffix = true;
                  // finalIdNumber = idDatePart + separator + zeServerNo + separator + slugNo;
                  finalIdNumber = idDatePart + separator + slugNo;
                  // console.log('I am Here 2', finalIdNumber );
                }
              }
            }
          }
        } else {
          // finalIdNumber = idDatePart + separator + zeServerNo + separator + 1;
          finalIdNumber = idDatePart + separator + 1;
          // console.log('Not Qry Found',finalIdNumber);
          // console.log('I am Here 3', finalIdNumber );
        }
        // =========Q===
        return finalIdNumber;

      }).catch(function(err){
        console.log(err);
        next();
      });
    // =============Embaded End=================
    return finalIdNumber;
  },

  uniqueCouponNumberCreate: function(options) {
    var currentMome = moment();
    var idDatePart = currentMome.utc().format('DDMMYY');
    // console.log('bbb  = ', bbb);
    // var idDatePart = moment().format("DDMMYY");
    // var idDatePart = moment().format("DD-MM-YY");
    console.log('idDatePart  = ', idDatePart);
    var model = sails.models[options.model];
    // var model = sails.models['obsprofile'];
    // console.log('MOdel1', model);
    // console.log('MOdel', options.model);
    //
    var checkField = options.checkField;
    var separator = '#';
    var criteria = {};
    // qdata.title = { 'like': '%'+paTitle+'%' };
    // criteria[checkField] = { 'like': idDatePart+'%' };
    criteria[checkField] = { 'like': idDatePart+'%' };
    criteria['select'] = [checkField];
    // =============Embaded Start===============
    var finalIdNumber =  Q.all([
      model.find(criteria)
      // ObsProfile.find(criteria)
    ])
      .spread(function(found){
        // =========Q===
        if (found && found.length > 0) {
          var slugNo = 1;
          var suffix = false;
          for (var i = 0; i < found.length; i++) {
            var str = found[i][checkField];
            // console.log('str ---', str);
            // var regx = "^" + idDatePart + "-[0-9]*$";
            //here # is custom set for separation
            var regx = "^" + idDatePart + "#[0-9]*$";
            console.log('regx ---', regx);
            var patt = new RegExp(regx);
            console.log('patt ---', patt);
            if (patt.test(str)) {
             console.log('patt-test-str===',patt.test(str))
              var res = str.replace(idDatePart + "#", "");
              // var res = str.replace(idDatePart + "-"+zeServerNo+"-", "");
              console.log('res ---', res);
              if (!isNaN(res)) {
                var num = parseInt(res);
                if (num >= slugNo) {
                  suffix = true;
                  slugNo = num + 1;
                  // console.log(slugNo);
                  // finalIdNumber = idDatePart + separator + zeServerNo + separator + slugNo;
                  finalIdNumber = idDatePart + separator + slugNo;
                  // console.log('I am Here 1', finalIdNumber );
                }
              }
            }
            else {
              if (!suffix) {
                suffix = true;
                finalIdNumber = idDatePart;
                console.log('I am Here 2 1', finalIdNumber );
                if (str == idDatePart) {
                  suffix = true;
                  // finalIdNumber = idDatePart + separator + zeServerNo + separator + slugNo;
                  finalIdNumber = idDatePart + separator + slugNo;
                  // console.log('I am Here 2', finalIdNumber );
                }
              }
            }
          }
        } else {
          // finalIdNumber = idDatePart + separator + zeServerNo + separator + 1;
          finalIdNumber = idDatePart + separator + 1;
          // console.log('Not Qry Found',finalIdNumber);
          console.log('If First', finalIdNumber );
        }
        // =========Q===
        return finalIdNumber;
      }).catch(function(err){
        console.log(err);
        next();
      });
    // =============Embaded End=================;
    return finalIdNumber;
  },

};
