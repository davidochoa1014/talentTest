const router = require("express").Router();
const c = require("../controllers/authController");
const passport = require('passport');


router.post("/register", c.register);
router.post("/login", c.login);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  c.socialLoginCallback
);

router.get('/azure', passport.authenticate('microsoft'));
router.get('/azure/callback', 
  passport.authenticate('microsoft', { failureRedirect: '/login' }), 
  c.socialLoginCallback
);


module.exports = router;
