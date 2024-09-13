module.exports = function (req, res, next) {
  // console.log(req.allParams());
  req.body.grant_type = 'password';
  // req.body.client_id = 'WcZNKy0vIU6qHtpWlib70kQKYV13Ty7e';
  req.body.client_id = sails.config.zeCommon.front_client_id;

  console.log('Grant_typee', req.param("grant_type"));
  console.log('client_id', req.param("client_id"));
  // console.log('username', req.param("username"));

 console.log('I am in O auth Public Policies At api->policies->OAuthPublicClientForFrontend.js');
  OAuth.authenticator1.authenticate(
    ['oauth2-public-client'],
    { session: false })(req,res,next);
};
