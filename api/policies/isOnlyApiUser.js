module.exports = function(req, res, next) {
   if (req.isAuthenticated()) {
    console.log('He is valid user & API User');
      //  if(req.user.is_superadmin){
      if(req.user.user_role == 3){
        console.log('He is valid user & API User');
        //  req.logout();
        return next();
      }else{
        console.log('1.API User Logout');
        req.logout();
      }
    }
    else{
        // return res.redirect('/adminlogin');
        console.log('2.API User Logout');
        req.logout();
    }
};
