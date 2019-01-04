let express = require('express');
let jwt = require('jsonwebtoken');
let User = require('../models').User;
let bcrypt = require('bcrypt');
let secret = require('../../config/auth').secret;
let router = express.Router();
const permitParams = require('./helpers').permitParams;

const loginUser = (req, res) => {
  User.scope('withPassword').findOne({ where: { email: req.body.email } }).then((user) => {
    if (user) {
      bcrypt.compare(req.body.password, user.password).then((isMatched) => {
        if (isMatched) {
          user = user.toJSON();
          res.json({
            token: jwt.sign(user, secret),
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
};

const signupUser = (req, res) => {
  let jsonToReturn = {
    user: null,
    err: []
  };
  const permittedParameters = ['username', 'email', 'password'];
  let i = 0;
  (new Promise((resolve, reject) => {
    if(permitParams(req.body, permittedParameters)){
      resolve();
    }else{
      reject('Your request contains unpermitted attributes. Permitted attributes for the requested route are: ' + permittedParameters);
    }
  }))
  .then(() => {
    return User.create(req.body);
  })
  .then(user => {
    jsonToReturn.user = user.toJSON();
  })
  .catch(err => {
    let errorToPush = err.message || err;
    jsonToReturn.err.push(errorToPush);
  })
  .finally(() => {
    if(jsonToReturn.err.length > 0){
      res.statusCode = 400;
    }else{
      res.statusCode = 201;
    }
    res.json(jsonToReturn);
  });    
};

const getRouter = (passport) => {
  router.post('/login', loginUser);
  router.post('/signup', signupUser);

  return router;
}

module.exports = getRouter;
