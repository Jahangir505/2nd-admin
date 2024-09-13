
/*
* http://jsfiddle.net/b2fCE/1/
*https://stackoverflow.com/questions/12008908/angularjs-how-can-i-pass-variables-between-controllers
* */

(function () {
    'use strict';
    angular.module('app')
      .service('adminFilter', function() {

        // var baseurl = 'http://127.0.01:1335';
        // var baseurl = 'http://bpodata.zeteq.com';
        var baseUrl = 'http://peaceobservatory-cgs.org';

    var startDate = new Date('2017-05-02');
    var endDate = new Date('2017-05-24');
    var violenceType = '';
    var actor = '';
    var crosscut = '';

    var motiveIncident = '';

    var divisionname = '';
    var divisionid = '';

    var divisionlat = '';
    var divisionlon = '';

    var districtname = '';
    var districtid = '';
    var districtlat = '';
    var districtlon = '';



    // var stringValue = 'test string value';



    var objectValue = {
          jsonurl:  baseurl
    };

        var divisionObjValue = {

        };




    return {

      // getString: function() {
      //   return stringValue;
      // },
      // setString: function(value) {
      //   stringValue = value;
      // },

      getBaseUrl: function() {
        objectValue.baseurl = baseurl;
        return baseurl;
      },



      getstartDate: function() {
        objectValue.startdate = startDate;
        return startDate;
      },
      setstartDate: function(value) {
        startDate = value;
        objectValue.startdate = value;
        // divisionObjValue.startdate = value;
      },

      getendDate: function() {
        objectValue.enddate = endDate;
        return endDate;
      },
      setendDate: function(value) {
        endDate = value;
        objectValue.enddate = value;
        // divisionObjValue.enddate = value;
      },

      getviolenceType: function() {
        // delete objectValue["enddate"];
        return violenceType;
      },
      setviolenceType: function(value) {
        violenceType = value;
        if (value == "" || value === undefined || value == null) {
          delete objectValue["violenceType"];
        }else{
          objectValue.violenceType = value;
          // divisionObjValue.violenceType = value;
        }
      },

      getactor: function() {
        return actor;
      },
      setactor: function(value) {
        actor = value;
        if (value == "" || value === undefined || value == null) {
          delete objectValue["actor"];
        }else{
          objectValue.actor = value;
          // divisionObjValue.actor = value;
        }
      },


      getmotiveIncident: function() {
        return motiveIncident;
      },
      setmotiveIncident: function(value) {
        motiveIncident = value;

        if (value == "" || value === undefined || value == null) {
          delete objectValue["mtvincidentone"];
        }else{
          objectValue.mtvincidentone = value;
          // divisionObjValue.crosscut = value;
        }
      },





      getcrosscut: function() {
        return crosscut;
      },
      setcrosscut: function(value) {
        crosscut = value;

        if (value == "" || value === undefined || value == null) {
          delete objectValue["crosscut"];
        }else{
          objectValue.crosscut = value;
          // divisionObjValue.crosscut = value;
        }
      },



      // =========Division Start==============
      getDivisionName: function() {
        return divisionname;
      },
      setDivisionName: function(value) {
        divisionname = value;

        if (value == "" || value === undefined || value == null) {
          delete objectValue["divisionname"];
          // delete divisionObjValue["divisionname"];
        }else{
          objectValue.divisionname = value;
          // divisionObjValue.divisionname = value;
        }
      },
      getDivisionId: function() {
        return divisionid;
      },
      setDivisionId: function(value) {
        divisionid = value;

        if (value == "" || value === undefined || value == null) {
          delete objectValue["divisionid"];
          // delete divisionObjValue["divisionid"];
        }else{
          objectValue.divisionid = value;
          // divisionObjValue.divisionid = value;
        }

      },

      getDivisionLat: function() {
              return divisionlat;
      },
      setDivisionLat: function(value) {
        divisionlat = value;

        if (value == "" || value === undefined || value == null) {
          delete objectValue["divisionlat"];
          // delete divisionObjValue["divisionname"];
        }else{
          objectValue.divisionlat = value;
          // divisionObjValue.divisionname = value;
        }
      },
      getDivisionLon: function() {
        return divisionlon;
      },
      setDivisionLon: function(value) {
        divisionlon = value;

        if (value == "" || value === undefined || value == null) {
          delete objectValue["divisionlon"];
          // delete divisionObjValue["divisionname"];
        }else{
          objectValue.divisionlon = value;
          // divisionObjValue.divisionname = value;
        }
      },

      // =========Division End==============

      // =========District Start==============

      getDistrictName: function() {
        return districtname;
      },
      setDistrictName: function(value) {
        districtname = value;

        if (value == "" || value === undefined || value == null) {
          delete objectValue["districtname"];
        }else{
          objectValue.districtname = value;
        }
      },


      getDistrictId: function() {
        return districtid;
      },
      setDistrictId: function(value) {
        districtid = value;
      },



      getDistrictLat: function() {
        return districtlat;
      },
      setDistrictLat: function(value) {
        districtlat = value;

        if (value == "" || value === undefined || value == null) {
          delete objectValue["districtlat"];
        }else{
          objectValue.districtlat = value;
        }
      },
      getDistrictLon: function() {
        return districtlon;
      },
      setDistrictLon: function(value) {
        districtlon = value;

        if (value == "" || value === undefined || value == null) {
          delete objectValue["districtlon"];
        }else{
          objectValue.districtlon = value;
        }
      },
      // =========District End==============


      getObject: function() {
        return objectValue;
      },

      setObject: function(valve) {
        objectValue={};
        objectValue = valve;
      },



      getDivisionObj: function() {
        return objectValue;
      }
    }


  });
})();
