let express = require('express');
let jwt = require('jsonwebtoken');
let User = require('../models').User;
let bcrypt = require('bcrypt');
let authSecrets = require('../../config/auth');
let router = express.Router();

router.post('/login', (req, res) => {
  User.findOne({ where: { email: req.body.email } }).then((user) => {
    if (user) {
      bcrypt.compare(req.body.password, user.password).then((isMatched) => {
        if (isMatched) {
          user = user.get({ plain: true });
          delete user.password;
          res.json({
            token: jwt.sign(user, authSecrets.secret),
            user: user
          });
        } else {
          res.send('Password is incorrect');
        }
      });
    } else {
      res.send('Email is not registered');
    }

  });
});

module.exports = router;
