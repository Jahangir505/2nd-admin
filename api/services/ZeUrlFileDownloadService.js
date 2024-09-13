





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

urlFileForCreate: async function (downFileUrl, oldFile='', cusWidth=500, cusHeight=500, fileSaveLocation, fileCopyLocation='', downNum=1) {
  
  console.log('downFileUrl--', downFileUrl);
  console.log('oldFile--', oldFile);
  
  let resultResJsn = {};

  return new Promise(function(resolve, reject) {
    
    if(downFileUrl && downFileUrl != ''){
      console.log('downFileUrl 22--', downFileUrl);
      let cropImageName = downNum+moment().format("DDMMYYHmmSSS")+'.webp';
      // let url = 'https://wms360.co.uk/admin/uploads/product-images/96534-2023-02-19-08-24-52-Lacoste-Mens-Polo-Shirts-DH9265-Size-L-Ultra-Dry-Pique-Tennis-Sports-Jersey-Top-Top-Brand-Outlet-topbrandoutlet.co.uk-(1).jpg';
      downFileUrl = 'http://localhost:8000/uploads/cweb/brand-images/5369.jpg';
        
      
      axios.get(downFileUrl, { 
                  headers: {
                    'Content-Type': 'application/json',
                    // 'Access-Control-Allow-Origin': '*',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    'Access-Control-Allow-Origin': 'http://localhost:1337'
                    
                  },
                      responseType: 'arraybuffer'
                    })
                    .then((res) => {
                      console.log('Resizing Image!');
                      //  =======================Previous Old File Delete Start============================
                          if(oldFile){
                            if(fs.existsSync(sails.config.appPath +'/'+fileSaveLocation+'/'+ oldFile)){
                              fs.unlinkSync(sails.config.appPath +'/'+fileSaveLocation+'/'+ oldFile);
                            }

                            if(fs.existsSync(sails.config.appPath +'/'+fileCopyLocation+'/'+ oldFile)){
                              fs.unlinkSync(sails.config.appPath +'/'+fileCopyLocation+'/'+ oldFile);
                            }
                          }
                      //  =======================Previous Old File Delete End==============================
                      return sharp(res.data)
                      .resize(cusWidth, cusHeight)
                      .toFile(fileSaveLocation+'/'+cropImageName)
                      .then((shrInfo) => {
                        // console.log('shrInfoshrInfo1', shrInfo);
                       return shrInfo;
                      })
                      .then((shrInfo) => {
                        fs.copy(fileSaveLocation+'/'+cropImageName, fileCopyLocation+'/'+cropImageName, copyErr => {
                          if (shrInfo && copyErr) {
                            if(fs.existsSync(sails.config.appPath +'/'+fileSaveLocation+'/'+ cropImageName)){
                              fs.unlinkSync(sails.config.appPath +'/'+fileSaveLocation+'/'+ cropImageName);
                            }
                            resultResJsn.errorFound = true;
                            resultResJsn.coreFileName = cropImageName;
                            resultResJsn.errorMessage = 'File Copy faild';
                            return resolve(resultResJsn);
                            // return console.error(copyErr)
                          } else {
                            resultResJsn.errorFound = false;
                            resultResJsn.coreFileName = cropImageName;
                            // console.log('FIle Upload , in Service File Name'+cropImageName);
                            return resolve(resultResJsn);
                            
                          }
                        })
                       })
                    })
                    .catch((err) => {
                      console.log(`Couldn't process: ${err}`);
                      if(fs.existsSync(sails.config.appPath +'/'+fileSaveLocation+'/'+ cropImageName)){
                        fs.unlinkSync(sails.config.appPath +'/'+fileSaveLocation+'/'+ cropImageName);
                      }
                      //  console.log('shrErrshrErr--', shrErr);
                        resultResJsn.errorFound = true;
                        resultResJsn.coreFileName = '';
                        resultResJsn.errorMessage = 'Please Upload An Image 1';
                        return resolve(resultResJsn);
                    })
    } else {
      resultResJsn.errorFound = false;
      resultResJsn.coreFileName = oldFile;
      resultResJsn.errorMessage = 'oldFile Image 2';
      return resolve(resultResJsn);
    } //<--Main If End
     
  });

}, 
  
// ========================== Image Gallery Upload End=========================================

};
