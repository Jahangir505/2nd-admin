module.exports = function (req, res, next) {
   //This authenticate() collect token information from "Model->Tokens-> authenticate()"
    // console.log('I am At api/policies/OAuthValidateAccessTokenOnlyForApiUser.js--', OAuth.authenticator1.authenticate)
    console.log('I am At api/policies/OAuthValidateAccessTokenOnlyForCustomer.js--')
    OAuth.authenticator1.authenticate('bearer', { session: false }, function(err, identity, authorization) {
    // if (!identity ) return res.send(401); //Unauthorized
    // if (!identity ) return res.send('i am not user');
    if (!identity )
    {
      return res.send({status: 'Unauthorized', err: {message: 'Unauthorized', status: 401}});
      // ============================
      // let resTempJson = {status: 'Unauthorized11', err: {message: 'Unauthorized', status: 401}};
      // let resJson = JSON.stringify(resTempJson);
      // res.setHeader('Content-Type', 'application/json');
      // res.setHeader('Cache-Control', 'no-store');
      // res.setHeader('Pragma', 'no-cache');
      // // res.end(resJson);
      // return res.send(resJson);
      // ============================
      // res.send(401);
    } else {
      if(identity.user_type == 5){
        // console.log('identity', identity);
        // console.log('authorization', authorization);
        req.identity = identity;
        req.authorization = authorization;
        return next();
      } else{
        identity = null;
        req.identity = null;
        req.authorization = null;
        authorization = null;
        return res.send({status: 'Unauthorized', err: {message: 'Unauthorized', status: 401}});
        // res.send(401);
      }
    
    }
    
  })(req,res);

};

