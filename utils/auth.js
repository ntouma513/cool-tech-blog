const withAuth = (req, res, next) => {
  console.log("Checking session data in auth middleware:", req.session);

  if (!req.session.logged_in || !req.session.user_id) {
    console.log("User is not authenticated, redirecting to login.");
    return res.redirect('/login');
  }

  console.log("User is authenticated, proceeding.");
  next();
};

module.exports = withAuth;
