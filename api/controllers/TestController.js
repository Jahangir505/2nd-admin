/**
 * TestController
 *
 * @description :: Test Controller
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

let moment = require('moment');

let _ = require('lodash');
let Q = require('q');

let jsonfile = require('jsonfile');
let zeCommon = sails.config.zeCommon;

let Promise = require('bluebird');
let promisify = Promise.promisify;
let mailer = require('nodemailer');
let randToken = require('rand-token');

let zeEmail = sails.config.zeEmail;

let mysql = require('mysql');

// var bcrypt = require('bcrypt-nodejs');
var bcrypt = require('bcrypt');

let nodemailer = require('nodemailer');
let transport = nodemailer.createTransport({
  host: "smtp.zeptomail.com",
  port: 587,
  auth: {
  user: "emailapikey",
  pass: "wSsVR612qBGmB6l+nWeuL+g+zFUHAFulHUV0igHw6napF6vG9sc/wkDKVlL1SKUZRTY/FGBBoe4rnk0Cg2EM2o97w1lWCyiF9mqRe1U4J3x17qnvhDzOVmVflxOOJY4LwQVpn2hpEs0i+g=="
  }
});

let transporter1 = mailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'zqarif@gmail.com', // like : abc@gmail.com
      pass: 'gsystzciicutkrvb'           // like : pass@123
  },
  testMode: true
});

// Gmail setting
let transporter_google = mailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  ignoreTLS: false,
  auth: {
      user: 'zqarif@gmail.com', // like : abc@gmail.com
      pass: 'gsystzciicutkrvb'           // like : pass@123
  }
  });

let transporter_web_mail = mailer.createTransport({
  host: 'mail.combosoft.co.uk',
  port: 465,
  secure: true,
  // ignoreTLS: false,
  auth: {
      user: 'zqarif@combosoft.co.uk', // like : abc@gmail.com
      pass: '#PSMi%sZhk&Y'           // like : pass@123
  }
  });

let emailGeneratedCode = function (options) {
  var url = options.verifyURL,
    email = options.email;
    console.log('email', email);


  message = 'Hello!';
  message += '<br/>';
  message += 'Please aaa visit the verification link to complete the registration process.';
  message += '<br/><br/>';
  message += 'Account with ' + options.type + " : " + options.id;
  message += '<br/><br/>';
  message += '<a href="';
  message += url;
  message += '">Verification Link</a>';
  message += '<br/>';

  // transporter_google.sendMail({
  transporter_web_mail.sendMail({
    // from: sails.config.security.admin.email.address,
    from: 'zqarif@combosoft.co.uk',
    to: email,
    subject: 'Test Tbo Oauth App Account Registration',
    html: message
  }, function (err, info) {
    console.log("Email Response err:", err);
    console.log("Email Response:", info);
  });

  return {
    status: 'success',
    url: url
  }
};

module.exports = {
  // ==================Password compare start======================
  passCompare: function(req,res){
    res.json({msg:'Agfgfgfgfg',success: true});
  },
  // ==================Password compare end========================


  // ======================Zepto Email Start========================
  zeptoMailSend: function(req,res){

    var transport = nodemailer.createTransport({
      host: "smtp.zeptomail.com",
      port: 587,
      auth: {
      user: "emailapikey",
      pass: "wSsVR612qBGmB6l+nWeuL+g+zFUHAFulHUV0igHw6napF6vG9sc/wkDKVlL1SKUZRTY/FGBBoe4rnk0Cg2EM2o97w1lWCyiF9mqRe1U4J3x17qnvhDzOVmVflxOOJY4LwQVpn2hpEs0i+g=="
      }
  });
  
  var mailOptions = {
      from: '"Example Team" no-reply@topbrandoutlet.co.uk',
      to: 'zqarif@gmail.com',
      subject: 'Test Email',
      // html: 'Test email sent successfully.',
      html: res.view("admin/mail-template/test/test-html"),
  };
  
  transport.sendMail(mailOptions, (error, info) => {
      if (error) {
      return console.log(error);
      }
      console.log('Successfully sent', info);
  });



    res.json({
      success: true,
      message: 'mail send',
    });
  },

  // ======================Zepto Email End==========================

  // ===============Shipping Country set Start==================
  shippingCountrySet: function (req, res){
    // res.json({dataFouund: false, Data: serverOne})
    

      var fromVal = 1
      let howManyFetch = 1724;
      let toVal = fromVal + howManyFetch ;
      let odrBy = 'id';

      let tableName = 'country_regional_codes';

      let conn = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'ze123456',
        database: 'datamigrate'
      });

      let sql = "SELECT * FROM `"+tableName+"` WHERE "+odrBy+" BETWEEN "+fromVal+" AND "+toVal+" ORDER BY "+odrBy+ " ASC";

     
      conn.query(sql, function(mysql_err, rows, fields) {
        let allRows = [];


        if ((!rows) || rows.length ==0) {
          // console.log("From Server One not found Enough Data");
          sails.log("From Server One not found Enough Data");
          res.json(404, "From Server One not found Enough Data");
          return;
        }
        else {
          console.log("From serverOne FOund rows length", rows.length);
          console.log("serverOne OptTableId Min ", _.minBy(rows, 'id').id);
          console.log("serverOne OptTableId MAx ", _.maxBy(rows, 'id').id);

          console.log('Server One Fetch ID From  '+ _.minBy(rows, 'id').id + ' To '+ _.maxBy(rows, 'id').id+' and Total Count '+ rows.length);
          sails.log('Server One Fetch ID From  '+ _.minBy(rows, 'id').id + ' To '+ _.maxBy(rows, 'id').id+' and Total Count '+ rows.length);

          rows.forEach(function(row){

              if((row['country_name'] != '') && (row['country_code'] != '')){
                    let mongo_row = {
                      country_name: row['country_name'],
                      country_alpha2: row['country_alpha2'],
                      country_alpha3: row['country_alpha3'],
                      country_code: row['country_code'],
                      country_region: row['country_region'],
                      country_sub_region: row['country_sub_region'],
                      country_region_code: row['country_region_code'],
                      country_sub_region_code: row['country_sub_region_code'],
                      
                      createdBy: '639ea114d3573d3fca4a0695',
                      createdByObj: {username: 'combosoft', email: 'combosoft@gmail.com', display_name: 'Combosoft Ltd'},
                      updatedBy: '',
                      updatedByObj: {username: '', email: '', display_name: ''}
                    };
                    allRows.push(mongo_row);
              }
             
          });
          console.log('allRows--', allRows.length);
          Shippingcountry.create(allRows).exec(function(err, data){
            // res.json(data);
            // res.json({dataFouund: true, data: data});
            if(!err){
              res.json({
                status: 'success',
                dataFound: true,
                data_length: data.length,
                from_value: fromVal,
                to_value: toVal
              });
            } else {
              res.json({
                status: 'error',
                err: err
              });
            }
            
          });
          // ====================End======================

        }



      // res.json({dataFouund: true, status: 'success', date: rows})

    });

    




  },
  shippingCountrySetUnBlocked_ok: function (req, res) {

    var qdata = {
    };
    // =============Embaded Start===============
    return Promise.all([
        Shippingcountry.find(qdata)
    ])
      .spread(function(allRecord){
        allRecord.map((sinCountry)=>{
          sinCountry.shipping_charge_name_1 = '';
          sinCountry.shipping_charge_1 = 0;
          sinCountry.max_item_limit_1 = 0;
          sinCountry.each_item_charge_1 = 0;

          sinCountry.shipping_charge_name_2 = '';
          sinCountry.shipping_charge_2 = 0;
          sinCountry.max_item_limit_2 = 0;
          sinCountry.each_item_charge_2 = 0;

          sinCountry.shipping_charge_name_3 = '';
          sinCountry.shipping_charge_3 = 0;
          sinCountry.max_item_limit_3 = 0;
          sinCountry.each_item_charge_3 = 0;

          sinCountry.shipping_charge_name_4 = '';
          sinCountry.shipping_charge_4 = 0;
          sinCountry.max_item_limit_4 = 0;
          sinCountry.each_item_charge_4 = 0;

          sinCountry.shipping_charge_name_5 = '';
          sinCountry.shipping_charge_5 = 0;
          sinCountry.max_item_limit_5 = 0;
          sinCountry.each_item_charge_5 = 0;

          sinCountry.is_blocked = false;
          sinCountry.save();
        })
        
        res.json({
          status: 'success',
          dataFound: true,
          
        });

        // **************************
      }).catch(function(err){
        res.json({
          status: 'error',
          err: err
        });
      });
    // =============Embaded End=================

  },
  // ===============Shipping Country set End====================

  // ===============slug set Start==================
  slugSet: function (req, res){
    // res.json({dataFouund: false, Data: serverOne})
    

      var fromVal = 1
      let howManyFetch = 1724;
      let toVal = fromVal + howManyFetch ;
      let odrBy = 'id';

      let tableName = 'cweb_slug';

      let conn = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'ze123456',
        database: 'datamigrate'
      });

      let sql = "SELECT * FROM `"+tableName+"` WHERE "+odrBy+" BETWEEN "+fromVal+" AND "+toVal+" ORDER BY "+odrBy+ " ASC";

     
      conn.query(sql, function(mysql_err, rows, fields) {
        let allPrevSlug = [];

        let allQrySku = [];

        if ((!rows) || rows.length ==0) {
          // console.log("From Server One not found Enough Data");
          sails.log("From Server One not found Enough Data");
          res.json(404, "From Server One not found Enough Data");
          return;
        }
        else {
          console.log("From serverOne FOund rows length", rows.length);
          console.log("serverOne OptTableId Min ", _.minBy(rows, 'id').id);
          console.log("serverOne OptTableId MAx ", _.maxBy(rows, 'id').id);

          console.log('Server One Fetch ID From  '+ _.minBy(rows, 'id').id + ' To '+ _.maxBy(rows, 'id').id+' and Total Count '+ rows.length);
          sails.log('Server One Fetch ID From  '+ _.minBy(rows, 'id').id + ' To '+ _.maxBy(rows, 'id').id+' and Total Count '+ rows.length);

          rows.forEach(function(row){

              if((row['sku'] != '') && (row['slug'] != '')){
                    let mongo_row = {
                      sku: row['sku'],
                      slug: row['slug'],
                    };
                    allQrySku.push(row['sku'])
                    allPrevSlug.push(mongo_row);
              }
             
          });
          console.log('allPrevSlug--', allPrevSlug.length);
          // res.json({
          //   status: 'success',
          //   dataFound: true,
          //   allPrevSlug: allPrevSlug.length,
          //   // allPrevSlug: allPrevSlug,
          //   allQrySku: allQrySku,
          //   from_value: fromVal,
          //   to_value: toVal
          // });

          // ====================Start====================
          let notExistSku = [];
          let existSku = [];
          return Promise.all([
            Product.find({sku: allQrySku, product_type: 3}).populate('variantMasterProduct'),
          ]).spread(function(allVariantPro){

            allPrevSlug.map((sinSku)=>{
              let targetVariant = _.find(allVariantPro, { 'sku': sinSku.sku });
              if(!targetVariant){
                notExistSku.push(sinSku.sku);
              } else {
                targetVariant.variantMasterProduct.slug = sinSku.slug;
                targetVariant.variantMasterProduct.save();

                // existSku.push(sinSku.sku);
                existSku.push(targetVariant.variantMasterProduct.id);
              }

            })
            console.log('notExistSku', notExistSku);
            res.json({
              status: 'success',
              dataFound: true,
              allPrevSlug: allPrevSlug.length,
              // allPrevSlug: allPrevSlug,
              allVariantPro: allVariantPro.length,
              allQrySku: allQrySku.length,
              notExistSku: notExistSku,
              existSku: existSku.length,
              from_value: fromVal,
              to_value: toVal
            });



          }).catch(function(err){
            return res.send({
              status: 'error',
              message: 'server error'+err,
            });
          });
          // ====================End======================

        }



      // res.json({dataFouund: true, status: 'success', date: rows})

    });

    




  },
  // ===============slug set End====================

  // ===============bulk related product set Start==================
  relatedProductSet: function(req,res){
    return Promise.all([
      Category.find(),
      Subsubcategory.find(),
      // Product.find({product_type: [1,2]}).sort('id DESC'),
      Product.find({product_type: [1,2]}).sort('id Asc'),
   ])
    .spread(function(allCategory, allSubsubcategory, allProduct){
        
      allCategory.map((sinCat)=>{
        // console.log('Category--',sinCat.name);
        allSubsubcategory.map((sinSubsubCat)=>{
            // console.log('sinSubsubCat----',sinSubsubCat.name);
                  let filtProductArr = _.filter(allProduct, function(sinPro) { return sinPro.category == sinCat.id && sinPro.subsubcategory == sinSubsubCat.id});
                  console.log('pro count', filtProductArr.length);
                  if(filtProductArr && filtProductArr.length>0){
                        // filtProductArr.map((sinProduct)=>{
                          
                        // })
                        let relProObjArr = [];
                        let relProIdArr = [];
                        for(let i=0; i<filtProductArr.length; i++){

                          // console.log('i am here 1====', i);
                          if(filtProductArr[i].id == undefined){
                            console.log('ddddddd', filtProductArr[i]);
                          }
                          relProIdArr.push(filtProductArr[i].id);
                          // console.log('i am here 2');
                          let itemObj = {
                            id: filtProductArr[i].id,
                            name: filtProductArr[i].name,
                            featured_image: filtProductArr[i].featured_image,
                            slug: filtProductArr[i].slug,
                          }
                          // console.log('i am here 3');
                          relProObjArr.push(itemObj);
                          // console.log('i am here 4');

                          if(((i+1)%5) == 0){
                            if(filtProductArr[i+1]){
                              // console.log('idddd', filtProductArr[i+1]);
                              // if(filtProductArr[i+1].id == '648ffaf2e39b310c0fd0a867'){
                              //   console.log('rrrrr', filtProductArr[i+1]);
                              // }
                              // console.log('idddd', filtProductArr[i+1].id);
                              filtProductArr[i+1].relatedProduct = relProIdArr;
                              filtProductArr[i+1].relatedProductArr = JSON.parse(JSON.stringify(relProObjArr));
                              filtProductArr[i+1].save();
                              console.log('relProIdArr==', relProIdArr.length);
                              console.log('relProObjArr==', relProObjArr.length);
                              relProObjArr = [];
                              relProIdArr = [];
                            }
                            
                          }
                           
                        }
                  }
          })

      })
      
      
      return res.send({
          status: 'success',
          category: allCategory.length,
          subsubcategory: allSubsubcategory.length,
          product: allProduct.length,
      });

    }).catch(function(err){
        return res.send({
            status: 'error',
            message: 'server error'+err,
        });
    });
  },
  // ===============bulk related product set End====================
  

  // ===============serverOneConnection Start==================
  userFetch: function (req, res){
    // res.json({dataFouund: false, Data: serverOne})
    Users.findOne({is_active: true}).max(['wp_user_id']).then(function (maxValUser){
      console.log(maxValUser.wp_user_id);

      if((maxValUser) && (maxValUser.wp_user_id > 0)) {
        var maxVal = maxValUser.wp_user_id;
        var fromVal = maxVal + 1;
        // console.log('maxValUser Found');
        // console.log('Server One Allsms MAX wp_user_id = '+maxValUser.wp_user_id);
        sails.log('Server One Allsms MAX wp_user_id = '+maxValUser.wp_user_id);

      }else{
        var fromVal = 1;
        // console.log('Server One Allsms MAX wp_user_id Not Found');
        sails.log('Server One Allsms MAX wp_user_id Not Found');
      }

      let howManyFetch = 200;
      let toVal = fromVal + howManyFetch ;
      let odrBy = 'id';

      let tableName = 'cweb_user';

      let conn = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'ze123456',
        database: 'datamigrate'
      });

      let sql = "SELECT * FROM `"+tableName+"` WHERE "+odrBy+" BETWEEN "+fromVal+" AND "+toVal+" ORDER BY "+odrBy+ " ASC";

     
      conn.query(sql, function(mysql_err, rows, fields) {
        let allRows = [];
        if ((!rows) || rows.length ==0) {
          // console.log("From Server One not found Enough Data");
          sails.log("From Server One not found Enough Data");
          res.json(404, "From Server One not found Enough Data");
          return;
        }
        else {
          console.log("From serverOne FOund rows length", rows.length);
          console.log("serverOne OptTableId Min ", _.minBy(rows, 'id').id);
          console.log("serverOne OptTableId MAx ", _.maxBy(rows, 'id').id);

          console.log('Server One Fetch ID From  '+ _.minBy(rows, 'id').id + ' To '+ _.maxBy(rows, 'id').id+' and Total Count '+ rows.length);
          sails.log('Server One Fetch ID From  '+ _.minBy(rows, 'id').id + ' To '+ _.maxBy(rows, 'id').id+' and Total Count '+ rows.length);

          rows.forEach(function(row){

              if((row['username'] != '') && (row['email'] != '')){
                    let mongo_row = {
                      email: row['email'],
                      username: row['username'],
                      password: row['password'],
                      password_reset_code: randToken.generate(32),
                      user_role: row['user_role'],
                      nickname: row['nickname'],
                      first_name: row['first_name'],
                      last_name: row['last_name'],
                      display_name: row['display_name'],
                      country: row['country'],
                      post_code: row['postcode'],
                      city: row['city'],
                      county: row['state'],
                      date_registered: row['user_registered'],
                      date_verified: new Date(),
                      wp_user_id: row['id'],
                      is_active: true,
                      createdAt: row['user_registered'],
                    };

                    if(row['user_role'] == 1){
                      mongo_row.is_token_based_user = false; 
                      mongo_row.is_superadmin = true; 
                      mongo_row.is_show_record_list = true; 
                      mongo_row.is_create_record = true; 
                      mongo_row.is_edit_record = true; 
                      mongo_row.is_delete_record = true; 
                      mongo_row.is_show_record = true; 
                    }

                    if(row['user_role'] == 4){
                      mongo_row.is_customer = true; 
                      mongo_row.is_token_based_user = true; 
                    }

                    allRows.push(mongo_row);
              }
             
          });
          console.log('allRows--', allRows.length);
          Users.create(allRows).exec(function(err, data){
            // res.json(data);
            // res.json({dataFouund: true, data: data});
            if(!err){
              res.json({
                status: 'success',
                dataFound: true,
                data_length: data.length,
                from_value: fromVal,
                to_value: toVal
              });
            } else {
              res.json({
                status: 'error',
                err: err
              });
            }
            
          });

        }



      // res.json({dataFouund: true, status: 'success', date: rows})

    });

    }).catch(function (err) {
        console.log("Server One Data Fetch Error");
        // res.json(err);
        res.json({dataFouund: false, err: err})
      });




  },
  // ===============serverOneConnection End====================
  abc: function(req,res){
    res.json({success: true});
  },
  mailSendTemplate_1: function(req,res){

    let mailtransporter = mailer.createTransport({
  host: 'mail.combosoft.co.uk',
  port: 465,
  secure: true,
  // ignoreTLS: false,
  auth: {
      user: 'zqarif@combosoft.co.uk', // like : abc@gmail.com
      pass: '#PSMi%sZhk&Y'           // like : pass@123
  }
  });

  mailtransporter.sendMail({
    // from: sails.config.security.admin.email.address,
    from: 'zqarif@combosoft.co.uk',
    to: 'zqarif@gmail.com',
    subject: 'New Tbo Oauth App Account Registration',
    // html: '<div> Hello I am Mail</div>'
    html: res.view("admin/mail-template/order")
  }, function (err, info) {
    console.log("Email Response err:", err);
    console.log("Email Response:", info);
  });



    res.json({
      success: true,
      message: 'mail send',
    });
  },
  mailSend: function(req,res){
    emailGeneratedCode({
      id: '1234',
      type: 'ty-123',
      verifyURL: sails.config.security.server.url + "/users/verify/",
      email: 'iamrifatrocky24@gmail.com'
    });
    
    
    
    res.json({
      success: true,
      message: 'mail send',
    });
  },

  createUser: function(req,res){
    
    let newUser = {
      email: 'abc1@gmail.com',
      username: 'abc1',
      password: '111111111111',
      password_reset_code: randToken.generate(32),
      user_role: 4,
      nickname: 'abc1',
      first_name: 'first_name',
      last_name: 'last_name',
      display_name: 'last_name',
      createdAt: '2020-05-14 01:48:47'
    }

    return Users.create(newUser).then(function (createData) {
      res.json({
        status: 'success',
        user: createData,
        createdAt: moment(createData.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        message: 'user created',
      });
      
    }).catch(function (err) {
        res.json({
          status: 'error',
          message: 'Catch error'+err,
        });

    });// ------catch End----
    
    
    
    
  },

  mailSendTemplate: function(req,res){

    let user = {
      name: 'arif',
      email: 'zqarif@gmail.com'
    }
    ZeMailerService.testEmail(user);  // <= Here we using


    res.json({
      success: true,
      message: 'mail send',
    });
  },


  getUpazilla: function (req, res) {
    Upazilla.find({district: '5979a2d548c829d0883d8bd7'},{select: ['name','id', 'lon','lat']}).sort('name ASC').exec(function (err, result) {
      if (err) {
        return res.serverError(err);
      }
      if (result) {
        res.json(result);
      }
    });

  },


  // <!--=========Loadesh Check Start==========-->

  checkFlattenDeep: function (req, res){
    //Merge all Array
    var arr1 = [2];
    var arr2 = [2, [3, [4]], 5];
    var arr3 = [];

    var result = _.flattenDeep([arr1,arr2,arr3]);
    res.json({ result: _.uniq(result) });

  },

  checkArrayCombination: function (req, res){
    var parts = [[0, 1], [0, 1, 2, 3], [0, 1, 2]],
    result = parts.reduce((a, b) => a.reduce((r, v) => r.concat(b.map(w => [].concat(v, w))), []));

     console.log(result.map(a => a.join(', ')));
     res.json({ result: result.map(a => a.join(', ')) });
  },
  checkArrayCombinationByObj: function (req, res){
    // var parts = [['Green', 'Yello'], ['S', 'XL', 'XXL'], ['Hoddy', 'Jogger']],
    // var parts = [['Green', 'Yello'], ['S', 'XL', 'XXL'], ['Hoddy', 'Jogger'], ['Hoddy', 'Jogger']];
    var parts = [['Green', 'Yello']];
    console.log(parts.length);
   var result = parts.reduce((a, b) => a.reduce((r, v) => r.concat(b.map(w => [].concat(v, w))), []));

    //  console.log(result.map(a => a.join(', ')));
     res.json(
      { 
        type: typeof parts ,
        length: parts.length ,
        // result: result.map(a => a.join('_')) 
      }
    );
  },

  checkArrayCombinationObjReturn_ok1: function (req, res){
          let attribute = [
            {"id":"63b123700d1deb2048aa0bc0","name":"size"},
            {"id":"63b1237a0d1deb2048aa0bc1","name":"color"}
          ];
          let allTermsArr = [
            {"termsId":"63b124cf0d1deb2048aa0bc5","termsName":"xl","attributeId":"63b123700d1deb2048aa0bc0","attributeName":"size","productId":"63bc0fdca9fa0867017b1e2b"},
            {"termsId":"63b124740d1deb2048aa0bc3","termsName":"xs","attributeId":"63b123700d1deb2048aa0bc0","attributeName":"size","productId":"63bc0fdca9fa0867017b1e2b"},
            {"termsId":"63b124ed0d1deb2048aa0bc7","termsName":"green","attributeId":"63b1237a0d1deb2048aa0bc1","attributeName":"color","productId":"63bc0fdca9fa0867017b1e2b"},
            {"termsId":"63b125160d1deb2048aa0bc8","termsName":"red","attributeId":"63b1237a0d1deb2048aa0bc1","attributeName":"color","productId":"63bc0fdca9fa0867017b1e2b"}
          ];

          let makeCombineArr = [];
          let makeCombineArrNew = [];
          let readyCombineArr = [];
          let readyCombineArrNew = [];
          let finalCombineArr = [];
          if(attribute && attribute.length > 0) {
            attribute.forEach(function (sinAttr) {
                  let addedTerms = _.filter(allTermsArr, { 'attributeId': sinAttr.id}).map((item) => item.termsName);
                  let addedTermsNew = _.filter(allTermsArr, { 'attributeId': sinAttr.id}).map((item) => ({termsId: item.termsId, termsName: item.termsName, attributeId: item.attributeId, attributeName: item.attributeName }));
                  makeCombineArr.push(addedTerms)
                  makeCombineArrNew.push(addedTermsNew)
            });
        }
        console.log('combineArr--', makeCombineArr);
        console.log('makeCombineArrNew--', makeCombineArrNew);
        if(makeCombineArr && makeCombineArr.length > 0 ) {
          readyCombineArr = makeCombineArr.reduce((a, b) => a.reduce((r, v) => r.concat(b.map(w => [].concat(v, w))), []));
            if(makeCombineArr.length > 1 ) {
            
              finalCombineArr = readyCombineArr.map(a => a.join('_'));
            } else{
              finalCombineArr = readyCombineArr;
            }
        }
        res.json(
          { 
            type: typeof makeCombineArr ,
            length: makeCombineArr.length ,
            makeCombineArr: makeCombineArr,
            makeCombineArrNew: makeCombineArrNew,
            readyCombineArr: readyCombineArr,
            finalCombineArr: finalCombineArr
          }
        );
  },

  checkArrayCombinationObjReturn_ok2: function (req, res){
    let combo = [
        ['Green', 'Yello'],
        ['S', 'XL', 'XXL'],
        ['Hoddy', 'Jogger']
      ];

      let arr = [
        [0,1],
        [0,1,2,3],
        [0,1,2]
     ];

     const combineAll = (array) => {
      const resa = [];
      let max = array.length-1;
      const helper = (arr, i) => {
         for (let j=0, l=array[i].length; j<l; j++) {
            let copy = arr.slice(0);
            copy.push(array[i][j]);
            if (i==max)
            resa.push(copy);
            else
            helper(copy, i+1);
         };
      };
      helper([], 0);
      return resa;
   };
   let result1 = combineAll(combo);

    
    console.log('result1', result1);
    
    res.json(
      { 
        result1: result1
      }
    );
  },

  checkArrayCombinationObjReturn_ok3_final: function (req, res){
    // let combo = [
    //     ['Green', 'Yello'],
    //     ['S', 'XL', 'XXL'],
    //     ['Hoddy', 'Jogger']
    //   ];

    //   let arr = [
    //     [0,1],
    //     [0,1,2,3],
    //     [0,1,2]
    //  ];

     let combineArr = [
      [
        { termsId: '63b124c20d1deb2048aa0bc4', termsName: 's' },
        { termsId: '63b124cf0d1deb2048aa0bc5', termsName: 'xl' },
        { termsId: '63b124740d1deb2048aa0bc3', termsName: 'xs' }
      ],
      [
        { termsId: '63b124ed0d1deb2048aa0bc7', termsName: 'green' },
        { termsId: '63b125160d1deb2048aa0bc8', termsName: 'red' }
      ],
      [
        { termsId: '63b6b71412c9ee6c10478f9b', termsName: 'hoddy' },
        { termsId: '63b6b72212c9ee6c10478f9c', termsName: 'joggar' }
      ]
    ]

     const combineAll = (array) => {
          const resa = [];
          let max = array.length-1;
          const helper = (arr, i) => {
            for (let j=0, l=array[i].length; j<l; j++) {
                let copy = arr.slice(0);
                console.log('aaa--', array[i][j]);
                copy.push(array[i][j]);
                if (i==max)
                resa.push(copy);
                else
                helper(copy, i+1);
            };
          };
          helper([], 0);
          return resa;
   };
   let resultObjArr = combineAll(combineArr);
   let finalResult = [];
    console.log('resultObjArr', resultObjArr);

    let finalresult = [];
    for (let i=0;  i<resultObjArr.length; i++) {
        
        // tempNameCombo = tempNameCombo+'_'+resultObjArr[i].termsName
        console.log('RRRR len ', resultObjArr[i].length );
        let termSku = '';
        let termIds = [];
        for (let j=0;  j<resultObjArr[i].length; j++) {
          console.log('hjhj', resultObjArr[i][j].termsName);
          termIds.push(resultObjArr[i][j].termsId)
          if(j == 0) {
            termSku = resultObjArr[i][j].termsName;
          } else {
            termSku = termSku + '_' +  resultObjArr[i][j].termsName;
          }
          
        }
        let tempObj = {
          sku: termSku,
          termIds: termIds

        }
        finalResult.push(tempObj);
    }
    // finalResult.push()
    console.log('finalResult--', finalResult);


    
    res.json(
      { 
        resultObjArr: resultObjArr,
        finalResult: finalResult
      }
    );
  },

  checkArrayCombinationObjReturn: function (req, res){
    
     let combineArr = [
      [
        { termsId: '63b124c20d1deb2048aa0bc4', termsName: 's' },
        { termsId: '63b124cf0d1deb2048aa0bc5', termsName: 'xl' },
        { termsId: '63b124740d1deb2048aa0bc3', termsName: 'xs' }
       ],
      [
        { termsId: '63b124ed0d1deb2048aa0bc7', termsName: 'green' },
        { termsId: '63b125160d1deb2048aa0bc8', termsName: 'red' }
      ],
      [
        { termsId: '63b6b71412c9ee6c10478f9b', termsName: 'hoddy' },
        { termsId: '63b6b72212c9ee6c10478f9c', termsName: 'joggar' }
      ]
    ];

    let combineArrNew = [
      [
          {
              "termsId": "63b124cf0d1deb2048aa0bc5",
              "termsName": "xl",
              "attributeId": "63b123700d1deb2048aa0bc0",
              "attributeName": "size"
          },
          {
              "termsId": "63b124740d1deb2048aa0bc3",
              "termsName": "xs",
              "attributeId": "63b123700d1deb2048aa0bc0",
              "attributeName": "size"
          }
      ],
      [
          {
              "termsId": "63b124ed0d1deb2048aa0bc7",
              "termsName": "green",
              "attributeId": "63b1237a0d1deb2048aa0bc1",
              "attributeName": "color"
          },
          {
              "termsId": "63b125160d1deb2048aa0bc8",
              "termsName": "red",
              "attributeId": "63b1237a0d1deb2048aa0bc1",
              "attributeName": "color"
          }
      ]
  ]

  // ===================New Star=====================
      // const resa = [];
      // let max = combineArr.length-1;
      // for (let j=0;  j<combineArr[i].length; j++) {

      // }
  // ===================New End======================

  // let resultObjArr = zeCommon.combineAll(combineArr);
  let resultObjArr = zeCommon.combineAll(combineArrNew);


   
   let finalResult = [];
    // console.log('resultObjArr', resultObjArr);

    let finalresult = [];
    for (let i=0;  i<resultObjArr.length; i++) {
        
        // tempNameCombo = tempNameCombo+'_'+resultObjArr[i].termsName
        // console.log('RRRR len ', resultObjArr[i].length );
        let termSku = '';
        let termIds = [];
        let tempTermsArr = [];
        for (let j=0;  j<resultObjArr[i].length; j++) {
          // console.log('hjhj', resultObjArr[i][j].termsName);
          let sinTermObj = {
                    termsId: resultObjArr[i][j].termsId,
                    termsName: resultObjArr[i][j].termsName,
                    attributeId: resultObjArr[i][j].attributeId,
                    attributeName: resultObjArr[i][j].attributeName
                  };
              tempTermsArr.push(sinTermObj);
              termIds.push(resultObjArr[i][j].termsId)
              if(j == 0) {
                termSku = resultObjArr[i][j].termsName;
              } else {
                termSku = termSku + '_' +  resultObjArr[i][j].termsName;
              }
          
        }
        let tempObj = {
          sku: termSku,
          termIds: termIds,
          termsArr: tempTermsArr

        }
        finalResult.push(tempObj);
    }
    // finalResult.push()
    console.log('Att common finalResult--', finalResult);


    
    res.json(
      { 
        resultObjArr: resultObjArr,
        finalResult: finalResult
      }
    );
  },

  // checkArrayCombinationByObj: function (req, res){
  //   const charSet = [['Green', 'Yello']];
  //   result = charSet.reduce((a,b)=>a.flatMap(x=>b.map(y=>x+y)),[''])

  //    console.log(result);
  //    res.json({ result: result });
  // },

  checkIntersection: function (req, res){
   //Creates an array of unique values that are included in all given arrays using SameValueZero for equality comparisons. The order and references of result values are determined by the first array.
    var arr1 = [2];
    var arr2 = [2, 3, 4, 5];
    var arr3 = [];

    // var result = _.intersection(arr1,arr2,arr3);
    var result = _.intersection(arr3);


    res.json({ result: result });

  },

  selectedArrItem: function (req, res){
    let sinAttrAllTerms = [
      {
        "id": "63b124e00d1deb2048aa0bc6",  
        "name": "Yello",
      },
      {
        "id": "63b124ed0d1deb2048aa0bc7",
        "name": "Green",
      },
      {
        "id": "63b125160d1deb2048aa0bc8",
        "name": "Red",
      },
      {
        "id": "63b12d1ab3820c238edd306e",
        "name": "Brown",
      }
    ]
  let excludeProjects = ['63b124e00d1deb2048aa0bc6', '63b124ed0d1deb2048aa0bc7'];
    // let result =_.filter(sinAttrAllTerms, (v) => !_.includes(excludeProjects, v.id));
    let result =_.filter(sinAttrAllTerms, (v) => _.includes(excludeProjects, v.id));
     res.json({ result: result });
   },

   arrayEquel: function (req, res){
      // var array1 = [['a', 'b'], ['b', 'c']];
      // var array2 = [['b', 'c'], ['a', 'b']];
      var array1 = ['63b124e00d1deb2048aa0bc6', '63b124ed0d1deb2048aa0bc7'];
      var array2 = ['63b124ed0d1deb2048aa0bc7', '63b124e00d1deb2048aa0bc6'];
      // let result =_.isEqual(array1.sort(), array2.sort()); //true
      let result =_.isEqual(_.sortBy(array1), _.sortBy(array2)); //true
      res.json({ result: result });
   },


  checkMap: function (req, res){
    //Creates an array of unique values that are included in all given arrays using SameValueZero for equality comparisons. The order and references of result values are determined by the first array.
    // var arr1 = [2];
    // var arr2 = [2, 3, 4, 5];
    // var arr3 = [];
    //
    // // var result = _.intersection(arr1,arr2,arr3);
    // var result = arr1,arr2,arr3;
    // // var result = _.intersection(arr2);


    // var data = ['abc','xyz','123'];
    var data = [['abc'],['xyz'],['123']];
    var result = _.map(data).join(', ');


    res.json({ result: result });

  },


  // <!--=========Loadesh Check End============-->
  action: function(req,res){
    res.json({success: true});
  }

};
