const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/api/auth/google/callback'
    },
        async (accessToken, refreshToken, profile, done) => {
            const email = profile.emails && profile.emails[0].value;
            if (!email) return done(null, false);

            let user = await User.findOne({ email });
            if (!user) {
                user = new User({ username: profile.displayName, email, password: 'oauth' });
                await user.save();
            }
            return done(null, user);
        }));

    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user);
    });
};