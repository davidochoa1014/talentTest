const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy; // Importamos Azure
const userService = require('../services/userService');

// --- ESTRATEGIA: GOOGLE ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    callbackURL: "http://localhost:3001/api/auth/google/callback",
    proxy: true 
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const socialUser = {
        email: profile.emails[0].value,
        name: profile.displayName,
        provider: 'google',
        providerId: profile.id
      };
      const user = await userService.findOrCreateSocialUser(socialUser);
      return done(null, user);
    } catch (err) {
      console.error("Error en Google:", err);
      return done(err, null);
    }
  }
));

// ---AZURE (MICROSOFT) ---
passport.use(new MicrosoftStrategy({
    clientID: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_ID,
    callbackURL: "http://localhost:3001/api/auth/azure/callback",
    scope: ['user.read'],
    tenant: 'common',
    pkce: true,
    state: true,
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {

        const email = (profile.emails && profile.emails[0]) 
                    ? profile.emails[0].value 
                    : profile.userPrincipalName;

      const socialUser = {
        email: email,
        name: profile.displayName,
        provider: 'azure',
        providerId: profile.id
      };

      const user = await userService.findOrCreateSocialUser(socialUser);
      return done(null, user);
    } catch (err) {
      console.error("Error en Azure:", err);
      return done(err, null);
    }
  }
));

//Configuration of de Sesión 
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;