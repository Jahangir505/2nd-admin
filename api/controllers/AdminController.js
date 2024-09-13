/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var sysa = require('util');
var execa = require('child_process').exec;

var Promise = require('bluebird');
var fs = require('fs');
var moment = require('moment');
var request = require('request');
var _ = require('lodash');
var Q = require('q');

var path = require('path');
var dbName = sails.config.connections.sakMongodbServer.database;


module.exports = {

  _config: {
    actions: false,
    shortcuts: false,
    // rest: true
  },


// ==================== Dashboard Start ===============================

  dashboard: function(req, res, next) {
   // var one = sails.config.myGlobalVariables.globalOne; //returns: This is a string
   // var two = sails.config.myGlobalVariables.globalTwo;
   //  console.log('one',one)
   //  console.log('two',two)
   //  console.log('Loged user Id',req.user)


    // res.render('admin-sidebar', { content: 'extra' })
    return res.view('admin/dashboard',
                          {
                            logedmessage: 'Hello You are logged in succesfully.'
                          });
  },
 
  
  // ==================== Dashboard End =================================
  // ========================== DB Backup Start==============================
  bdBackupName : function (req, res) {


    var _newData = {
      name: "",
    };

    return res.view("admin/bdBackup/name", {
      flashMsgError: req.flash('flashMsgError'),
      flashMsgSuccess: req.flash('flashMsgSuccess'),
      data: _newData,
      formActionTarget : "/admin/dbbackup",
      status: 'OK',
      title: 'DB Backup',
      subtitle: 'Name',
      link1: '/admin/dbbackup/name'
    });
  },

  exeDbBackupCorn :function(req, res) {
    //res.json("db backup complete"); return;
    console.log("Inside exeDbBackupCorn..............");
    var bdBackupName = req.param("name") ? req.param("name").trim() : '';
    var fromWeb = req.param("fromWeb") ? req.param("fromWeb").trim() : '';

    var proJectFolder = path.resolve(__dirname, '..', '..');

    var child;

    var now = new Date();
    var crnttDtTime = moment().format("DD-MM-YYYY:H:mm:ss");
    console.log('DB Backup Time  : ',crnttDtTime);


    var strDateTime = [[AddZero(now.getDate()), AddZero(now.getMonth() + 1), now.getFullYear()].join("-"), [AddZero(now.getHours()), AddZero(now.getMinutes())].join("-"), now.getHours() >= 12 ? "PM" : "AM"].join("-");

    var backupFolderName = strDateTime;
    if(bdBackupName){
      backupFolderName = strDateTime+'-'+bdBackupName;
    }

    function AddZero(num) {
      return (num >= 0 && num < 10) ? "0" + num : num + "";
    }
    child = execa('mongodump --db'+' '+dbName+' '+'--out'+' '+proJectFolder+'/backupDB/'+backupFolderName, function (error, stdout, stderr)
    {
      // sysa.print('stdout: ' + stdout);
      // sysa.print('stderr: ' + stderr);
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {

        if(fromWeb){
          req.flash('flashMsgError', 'Backup Error'+error);
          return res.redirect('/admin/dbbackup/name');
        }else{
          console.log('exec error: ' + error);
        }
      }

      if(fromWeb){
        req.flash('flashMsgSuccess', 'Backup Successfully');
        return res.redirect('/admin/dbbackup/name');
      }else{
        res.json(true);
      }
    });
  },
  // ========================== DB Backup End================================







};

