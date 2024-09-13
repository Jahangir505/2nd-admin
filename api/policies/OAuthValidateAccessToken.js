module.exports = function (req, res, next) {
   //This authenticate() collect token information from "Model->Tokens-> authenticate()"
    // console.log('I am At api/policies/OAuthValidateAccessToken.js--', OAuth.authenticator1.authenticate)
    console.log('I am At api/policies/OAuthValidateAccessToken.js--');
    OAuth.authenticator1.authenticate('bearer', { session: false }, function(err, identity, authorization) {
    // if (!identity ) return res.send(401); //Unauthorized
    // if (!identity ) return res.send('i am not user');
    if (!identity )
    {
      return res.send({status: 'Unauthorized', err: {message: 'Unauthorized', status: 401}});
      // res.send(401);
    } else {
    // console.log('identity', identity);
    // console.log('authorization', authorization);
    req.identity = identity;
    req.authorization = authorization;

      return next();
    }
    
  })(req,res);

};

