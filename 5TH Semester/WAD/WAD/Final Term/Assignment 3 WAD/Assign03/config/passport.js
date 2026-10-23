const LocalStrategy = require("passport-local").Strategy;
const Person = require("../models/person");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await Person.findOne({ email });

          if (!user) {
            return done(null, false, { message: "User not found" });
          }

          const isPasswordCorrect = await user.comparePassword(password);

          if (!isPasswordCorrect) {
            return done(null, false, { message: "Incorrect password" });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await Person.findById(id);
    done(null, user);
  });
};
