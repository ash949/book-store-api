let passport = require('passport');
let JwtStrategy = require('passport-jwt').Strategy;
let JwtExtractor = require('passport-jwt').ExtractJwt;
const secret = require('../../config/auth').secret;
let User = require('../models').User;

let options = {
  jwtFromRequest: JwtExtractor.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
};

passport.use(new JwtStrategy(options, (payload, done) => {
  User.findByPk(payload.id).then((user, err) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      user = user.get({ plain: true });
      delete user.password;
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
}));

module.exports = passport;
