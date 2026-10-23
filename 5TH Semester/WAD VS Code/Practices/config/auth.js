const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User.model");

passport.use(
    new LocalStrategy({ usernameField: "username", passwordField: "password" },
        async (username, password, done) => {
            try {
                const user = await User.findOne({ username });
                if (!user) {
                    return done(null, false, { message: "Incorrect username" });
                }

                if (user.password !== password) {
                    return done(null, false, { message: "Incorrect password" });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

module.exports=passport;
