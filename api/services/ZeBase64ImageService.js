





// var fs = require('fs');
let fs = require('fs-extra');
let moment = require('moment');

let Promise = require('bluebird');
let request = require('request');

let _ = require('lodash');
let Q = require('q');
let uuidv4 = require('uuid/v4');
const sharp = require('sharp');
let axios = require('axios');

module.exports = {
// ========================== Image Gallery Upload Strat=======================================

imageCreate: async function (mainBase64Img, oldFile='', cusWidth=500, cusHeight=500, fileSaveLocation, fileCopyLocation='', imgNum=1) {
  
      // console.log("mainBase64Img--", mainBase64Img);
      console.log("oldFile--", oldFile);

      let resultResJsn = {};

      return new Promise(function (resolve, reject) {
        if (mainBase64Img && mainBase64Img != "") {
          // console.log("mainBase64Img 22--", mainBase64Img);
          let cropImageName = imgNum + moment().format("DDMMYYHmmSSS") + ".webp";
          let base64Data = mainBase64Img.replace(/^data:image\/png;base64,/, "");
          let imgBuffer = Buffer.from(base64Data, "base64");

          //  =======================Previous Old File Delete Start============================
          if (oldFile) {
            if (
              fs.existsSync(sails.config.appPath + "/" + fileSaveLocation + "/" + oldFile)) {
              fs.unlinkSync(sails.config.appPath + "/" + fileSaveLocation + "/" + oldFile);
            }

            if (fs.existsSync(sails.config.appPath + "/" + fileCopyLocation + "/" + oldFile)) {
              fs.unlinkSync(sails.config.appPath + "/" + fileCopyLocation + "/" + oldFile);
            }
          }
          //  =======================Previous Old File Delete End==============================
          return sharp(imgBuffer)
            .resize(cusWidth, cusHeight)
            .toFile(fileSaveLocation + "/" + cropImageName)
            .then((shrInfo) => {
              // console.log('shrInfoshrInfo1', shrInfo);
              return shrInfo;
            })
            .then((shrInfo) => {
              fs.copy(fileSaveLocation + "/" + cropImageName, fileCopyLocation + "/" + cropImageName, (copyErr) => {
                  if (shrInfo && copyErr) {
                    if (fs.existsSync(sails.config.appPath + "/" + fileSaveLocation + "/" + cropImageName)) {
                      fs.unlinkSync(sails.config.appPath + "/" + fileSaveLocation + "/" + cropImageName);
                    }
                    resultResJsn.errorFound = true;
                    resultResJsn.coreFileName = cropImageName;
                    resultResJsn.errorMessage = "File Copy faild";
                    return resolve(resultResJsn);
                    // return console.error(copyErr)
                  } else {
                    resultResJsn.errorFound = false;
                    resultResJsn.coreFileName = cropImageName;
                    // console.log('FIle Upload , in Service File Name'+cropImageName);
                    return resolve(resultResJsn);
                  }
                }
              );
            })
            .catch((err) => {
              console.log(`Couldn't process: ${err}`);
              if (fs.existsSync(sails.config.appPath + "/" + fileSaveLocation + "/" + cropImageName)) {
                fs.unlinkSync(sails.config.appPath + "/" + fileSaveLocation + "/" + cropImageName);
              }
              //  console.log('shrErrshrErr--', shrErr);
              resultResJsn.errorFound = true;
              resultResJsn.coreFileName = "";
              resultResJsn.errorMessage = "Please Upload Error";
              return resolve(resultResJsn);
            });
        } else {
          resultResJsn.errorFound = false;
          resultResJsn.coreFileName = oldFile;
          resultResJsn.errorMessage = "oldFile Image 2";
          return resolve(resultResJsn);
        } //<--Main If End
      });

}, 
  
// ========================== Image Gallery Upload End=========================================

};
