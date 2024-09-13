
/*
* Reference https://stackoverflow.com/questions/23300134/where-i-create-or-modify-global-variables-of-the-view-ejs
*https://stackoverflow.com/questions/31221526/how-in-sails-to-access-globals-in-assets
*
* */

module.exports.email = {
   
    service: 'smtp.zeptomail.com',
    auth: {
        user: "emailapikey",
        pass: "wSsVR612qBGmB6l+nWeuL+g+zFUHAFulHUV0igHw6napF6vG9sc/wkDKVlL1SKUZRTY/FGBBoe4rnk0Cg2EM2o97w1lWCyiF9mqRe1U4J3x17qnvhDzOVmVflxOOJY4LwQVpn2hpEs0i+g=="
        },
    

    transporter:{
        host: 'smtp.zeptomail.com',
        port: 465,
        secure: true,
        auth: {
            user: "emailapikey",
            pass: "wSsVR612qBGmB6l+nWeuL+g+zFUHAFulHUV0igHw6napF6vG9sc/wkDKVlL1SKUZRTY/FGBBoe4rnk0Cg2EM2o97w1lWCyiF9mqRe1U4J3x17qnvhDzOVmVflxOOJY4LwQVpn2hpEs0i+g=="
            },
        tls: {
            rejectUnauthorized: false
        }
    },
    templateDir: 'views/admin/mail-template/',
    from: 'no-reply@topbrandoutlet.co.uk',
    testMode: false,
    ssl: true, 
  }
  
