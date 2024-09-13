module.exports = function(req, res, next) {
  // console.log('At isSuperadminAndAdmin, He is valid user', req.user);
  console.log('At isSuperadminAndAdmin, He is valid user');
   if (req.isAuthenticated()) {
    //  if(req.user.is_superadmin){
     if((req.user.user_type == 1) || (req.user.user_type == 2)){
       console.log('He is valid user, Superadmin Or Admin');
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
