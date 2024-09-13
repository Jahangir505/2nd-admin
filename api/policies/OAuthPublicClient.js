module.exports = function (req, res, next) {
 console.log('I am in O auth Public Policies At api->policies->OAuthPublicClient.js');
  OAuth.authenticator1.authenticate(
    ['oauth2-public-client'],
    { session: false })(req,res,next);
};
