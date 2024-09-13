





// var fs = require('fs');
var fs = require('fs-extra');
var moment = require('moment');

var Promise = require('bluebird');
var request = require('request');

var _ = require('lodash');
var Q = require('q');
var uuidv4 = require('uuid/v4');
const sharp = require('sharp');



module.exports = {
// ========================== Image Gallery Upload Strat=======================================

imageUploadForCreate: function (coreUploadFile, oldUploadedFile='', cusWidth=500, cusHeight=500, uploadSaveLocation, uploadCopyLocation='', noNeedUploadedFile=false, uploadNum=1) {
  let upFileResJsn = {};
  let maxAllowSize = 10 * 1000 * 1000;
  // let uploadFIleDtls = coreUploadFile._files[0].stream;

  return new Promise(function(resolve, reject) {
    if(noNeedUploadedFile){ //<--No Need File (Saved One Deleted) Start
      if(oldUploadedFile){
        if(fs.existsSync(sails.config.appPath +'/'+uploadSaveLocation+'/'+ oldUploadedFile)){
          fs.unlinkSync(sails.config.appPath +'/'+uploadSaveLocation+'/'+ oldUploadedFile);
        }

        if(fs.existsSync(sails.config.appPath +'/'+uploadCopyLocation+'/'+ oldUploadedFile)){
          fs.unlinkSync(sails.config.appPath +'/'+uploadCopyLocation+'/'+ oldUploadedFile);
        }
      }
      // =============Delete Previous File End=================
      upFileResJsn.errorFound = false;
      upFileResJsn.coreUploadFile = '';
      upFileResJsn.errorMessage = 'File del Success';
      coreUploadFile.upload({noop: true});
      return resolve(upFileResJsn);

    }else{ //<--No Need File End Enter File Upload

      // ########################## CoreFile Upload Start ###############################
      if(coreUploadFile._files.length) { //<--If file Present check Start FIle Upload
        let coreUploadFileName = uploadNum+'-'+moment().format("DD-MM-YY-H-mm-SSS-")+coreUploadFile._files[0].stream.filename;
        // let cropImageName = uploadNum+moment().format("DDMMYYHmmSSS")+'.jpg';
        let cropImageName = uploadNum+moment().format("DDMMYYHmmSSS")+'.webp';
        // +++++++++++++++ 1 STart ++++++++++++++
        coreUploadFile.upload({
          dirname: '../../'+uploadSaveLocation,
          saveAs: coreUploadFileName,
          maxBytes: maxAllowSize,
          // maxTimeToBuffer: 95000
        }, function onUploadComplete(upldErr, upldFile) {
          if (upldErr) { // <-- If Error Found When File Upload
            upFileResJsn.errorFound = true;
            upFileResJsn.errorMessage = upldErr.message;
            return resolve(upFileResJsn);
          }
          else{ // <--If File Upload Success
            if (upldFile && upldFile.length === 0) { // <--If No one file is upload
              upFileResJsn.errorFound = true;
              // upFileResJsn.coreUploadFile = coreUploadFileName;
              upFileResJsn.coreUploadFile = oldUploadedFile;
              upFileResJsn.errorMessage = 'No File was uploaded';
              return resolve(upFileResJsn);
            }else{ //<--Else file is uploaded
              //  =======================Previous Old File Delete Start============================
                  if(oldUploadedFile){
                    if(fs.existsSync(sails.config.appPath +'/'+uploadSaveLocation+'/'+ oldUploadedFile)){
                      fs.unlinkSync(sails.config.appPath +'/'+uploadSaveLocation+'/'+ oldUploadedFile);
                    }

                    if(fs.existsSync(sails.config.appPath +'/'+uploadCopyLocation+'/'+ oldUploadedFile)){
                      fs.unlinkSync(sails.config.appPath +'/'+uploadCopyLocation+'/'+ oldUploadedFile);
                    }
                  }
              //  =======================Previous Old File Delete End==============================

              // =========================Sharp Start========================================
              return sharp(uploadSaveLocation+'/'+coreUploadFileName)
              .resize(cusWidth, cusHeight)
              .toFile(uploadSaveLocation+'/'+cropImageName).then(function(shrInfo) { 
                  return shrInfo;
              }).then(function(shrInfo) {
                // console.log('Image height is ' + JSON.stringify(shrInfo));
                if(fs.existsSync(sails.config.appPath +'/'+uploadSaveLocation+'/'+ coreUploadFileName)){
                  fs.unlinkSync(sails.config.appPath +'/'+uploadSaveLocation+'/'+ coreUploadFileName);
                }
                // ==============FIle Move to Assets and Delete Crop Source file Start==============
                fs.copy(uploadSaveLocation+'/'+cropImageName, uploadCopyLocation+'/'+cropImageName, copyErr => {
                  if (shrInfo && copyErr) {
                    if(fs.existsSync(sails.config.appPath +'/'+uploadSaveLocation+'/'+ cropImageName)){
                      fs.unlinkSync(sails.config.appPath +'/'+uploadSaveLocation+'/'+ cropImageName);
                    }
                    upFileResJsn.errorFound = true;
                    upFileResJsn.coreUploadFile = cropImageName;
                    upFileResJsn.errorMessage = 'File Copy faild';
                    return resolve(upFileResJsn);
                    // return console.error(copyErr)
                  } else {
                    upFileResJsn.errorFound = false;
                    upFileResJsn.coreUploadFile = cropImageName;
                    // console.log('FIle Upload , in Service File Name'+cropImageName);
                    return resolve(upFileResJsn);
                    
                  }
                })
                // ==============FIle Move to Assets and Delete Crop Source file End================
              }).catch(function(shrErr){
                if(fs.existsSync(sails.config.appPath +'/'+uploadSaveLocation+'/'+ coreUploadFileName)){
                  fs.unlinkSync(sails.config.appPath +'/'+uploadSaveLocation+'/'+ coreUploadFileName);
                }
                //  console.log('shrErrshrErr--', shrErr);
                  upFileResJsn.errorFound = true;
                  upFileResJsn.coreUploadFile = oldUploadedFile;
                  upFileResJsn.errorMessage = 'File crop faild';
                  return resolve(upFileResJsn);
              });
              // =========================Sharp End==========================================
            }
          }
        });
        // +++++++++++++++ 1 End ++++++++++++++++
      }else{
        upFileResJsn.errorFound = false;
        upFileResJsn.errorMessage = 'FIle Upload Fail Please Try Again';
        // console.log('FIle Upload empty , in Service File Name : '+oldUploadedFile);
        // upFileResJsn.coreUploadFile = '';
        upFileResJsn.coreUploadFile = oldUploadedFile;
        coreUploadFile.upload({noop: true});
        return resolve(upFileResJsn);
      }
      // ########################## CoreFile Upload End #################################
    } //<--No Need File else End
  });

}, 
  imageUploadForUpdate: function (coreUploadFile, oldUploadedFile, uploadSaveLocation, noNeedUploadedFile=false, uploadNum=1) {
    return new Promise(function(resolve, reject) {

      var upFileResJsn = {};
      if(noNeedUploadedFile){
        if(oldUploadedFile){
          if(fs.existsSync(sails.config.appPath +'/'+uploadSaveLocation+'/'+ oldUploadedFile)){
            fs.unlinkSync(sails.config.appPath +'/'+uploadSaveLocation+'/'+ oldUploadedFile);
          }
        }
        // =============Delete Previous File End=================
        upFileResJsn.errorFound = false;
        upFileResJsn.coreUploadFile = '';
        coreUploadFile.upload({noop: true});
        return resolve(upFileResJsn);
      }else{
        // ########################## CoreFile Upload Start ###############################
        if(coreUploadFile._files.length) {
          var coreUploadFileName = uploadNum+'-'+moment().format("DD-MM-YY-H-mm-SSS-")+coreUploadFile._files[0].stream.filename;
          // +++++++++++++++ 1 STart ++++++++++++++
          coreUploadFile.upload({
            dirname: '../../'+uploadSaveLocation,
            saveAs: coreUploadFileName,
            maxBytes: 300000000
          }, function onUploadComplete(err, files) {
            if (err) {
              upFileResJsn.errorFound = true;
              upFileResJsn.errorMessage = err.message;
            }
            else{
              if (files.length === 0) {
                upFileResJsn.errorFound = true;
                upFileResJsn.coreUploadFile = coreUploadFileName;
                upFileResJsn.errorMessage = 'No Pdf File was uploaded';
              }else{
                // =============Delete Previous File Start===============
                if(oldUploadedFile){
                  if(fs.existsSync(sails.config.appPath +'/'+uploadSaveLocation+'/'+ oldUploadedFile)){
                    fs.unlinkSync(sails.config.appPath +'/'+uploadSaveLocation+'/'+ oldUploadedFile);
                  }
                }
                // =============Delete Previous File End=================
                upFileResJsn.errorFound = false;
                upFileResJsn.coreUploadFile = coreUploadFileName;
              }
            }
            return resolve(upFileResJsn);
          });
          // +++++++++++++++ 1 End ++++++++++++++++
        }else{
          upFileResJsn.errorFound = false;
          upFileResJsn.coreUploadFile = oldUploadedFile;
          coreUploadFile.upload({noop: true});
          return resolve(upFileResJsn);
        }
        // ########################## CoreFile Upload End #################################
      }
    });

  },
// ========================== Image Gallery Upload End=========================================

};
