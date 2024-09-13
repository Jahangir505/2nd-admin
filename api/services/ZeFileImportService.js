





var fs = require('fs');
var moment = require('moment');

var Promise = require('bluebird');
var request = require('request');

var _ = require('lodash');
var Q = require('q');
var uuidv4 = require('uuid/v4');



module.exports = {
// ========================== Image Gallery Upload Strat=======================================
// importUpload: function (coreUploadFile, oldUploadedFile,uploadSaveLocation, noNeedUploadedFile, uploadNum) {
importUpload: function (coreUploadFile, oldUploadedFile='',uploadSaveLocation) {
    console.log(' --Come For Upload');

    return new Promise(function(resolve, reject) {
      var upFileResJsn = {};
        // ########################## CoreFile Upload Start ###############################
        if(coreUploadFile._files.length) {
          // console.log(uploadNum+'--CoreFile-1 Image Length', coreUploadFile._files.length);
          // var coreUploadFileName = uploadNum+'-'+moment().format("DD-MM-YY-H-mm-SSS-")+coreUploadFile._files[0].stream.filename;
          var coreUploadFileName = moment().format("DD-MM-YY-H-mm-SSS-")+coreUploadFile._files[0].stream.filename;

          // +++++++++++++++ 1 STart ++++++++++++++
          coreUploadFile.upload({
            dirname: '../../'+uploadSaveLocation,
            saveAs: coreUploadFileName,
            maxBytes: 300000000,
            // maxTimeToBuffer: 95000
          }, function onUploadComplete(err, files) {
            if (err) {
              upFileResJsn.errorFound = true;
              upFileResJsn.errorMessage = err.message;
              console.log('FIle Upload Error Found, in Service'+err.message);
            }
            else{
              if (files.length === 0) {
                upFileResJsn.errorFound = true;
                upFileResJsn.coreUploadFile = coreUploadFileName;
                upFileResJsn.errorMessage = 'No Import File was uploaded';
                // console.log('FIle Upload Error Not Found, in Service,'+'No Pdf File was uploaded');
              }else{
                upFileResJsn.errorFound = false;
                upFileResJsn.coreUploadFile = coreUploadFileName;
                console.log('FIle Upload , in Service File Name'+coreUploadFileName);
              }
            }
            return resolve(upFileResJsn);
          });
          // +++++++++++++++ 1 End ++++++++++++++++
        }else{
          upFileResJsn.errorFound = false;
          console.log('FIle Upload empty , in Service File Name : '+oldUploadedFile);
          // upFileResJsn.coreUploadFile = '';
          upFileResJsn.coreUploadFile = oldUploadedFile;
          coreUploadFile.upload({noop: true});
          return resolve(upFileResJsn);
        }
        // ########################## CoreFile Upload End #################################
    });

}
// ========================== Image Gallery Upload End=========================================

};
