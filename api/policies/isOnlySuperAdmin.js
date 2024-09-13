module.exports = function(req, res, next) {
  // console.log('At isOnlySuperafmin He is valid user & Superadmin', req.user);
  console.log('At isOnlySuperafmin He is valid user & Superadmin');
   if (req.isAuthenticated()) {
    console.log('He is valid user & Superadmin aut');
    //  if(req.user.is_superadmin){
     if(req.user.user_type == 1){
       console.log('He is valid user & Superadmin1');
      //  req.logout();
       return next();
     }else{
       return res.redirect('/adminLogout');
     }


    }
    else{
        // return res.redirect('/adminlogin');
        return res.redirect('/');
    }
};
