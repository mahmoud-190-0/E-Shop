const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

// ---------- Serialize / Deserialize ----------
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// ---------- Google Strategy ----------
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['profile', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // 1. Check if user already exists with Google ID
                let user = await User.findOne({ googleId: profile.id });
                if (user) return done(null, user);

                // 2. Check if email already registered
                const email = profile.emails?.[0]?.value;
                if (email) {
                    user = await User.findOne({ email });
                    if (user) {
                        user.googleId = profile.id;
                        user.provider = 'google';
                        await user.save();
                        return done(null, user);
                    }
                }

                // 3. Create new user
                user = await User.create({
                    googleId: profile.id,
                    email,
                    name: profile.displayName,
                    avatar: profile.photos?.[0]?.value,
                    provider: 'google'
                });

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);


module.exports = passport;