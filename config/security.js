module.exports.security = {
  oauth : {
    version : '2.0',
    token : {
      length: 32,
      // expiration: 360000 //in Second
      expiration: 5*60*60,// 5Hour //day*hour*min*sec 5 Day= 5*24*60*60
      // apiuser_expiration: 600
      // apiuser_expiration: 12*60*60 //12Hour= 12*60*60 //One Year in Second = 365*24*60*60
      apiuser_expiration: 55*60 //2Min=2*60//12Hour= 12*60*60 //One Year in Second = 365*24*60*60
      // app_expiration: 31557600000 //One Year in Second
    }
  },
  admin: {
    email: {
      address: 'ctgrobin@gmail.com',
      password: '457@3hjyu%%6$$545'
    },

  },
  server: {
    // url: 'http://server.onlybuy.co.uk/'
    url: 'http://localhost:1338'
  }
};
