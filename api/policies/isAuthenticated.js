module.exports = function(req, res, next) {
   if (req.isAuthenticated()) {
        return next();
    }
    else{
        // return res.redirect('/adminlogin');
        return res.redirect('/');
    }
};
