'use strict';
let express = require('express');
let router = express.Router();
let User = require('../models').User;
let booksRouter = require('./books');

const permittedParameters = ['username', 'email', 'password', 'isAuthor', 'isAdmin'];

const permitParams = require('./helpers').permitParams;

const getUsers = (req, res) => {
  let jsonToReturn = {
    user: null,
    err: null
  };
  User.findAll().then((users)=>{
    jsonToReturn.user = users;
    res.statusCode = 200;
    res.json(jsonToReturn);
  }).catch((err)=>{
    res.statusCode = 400;
    jsonToReturn.err = err.message;
    res.json(jsonToReturn);
  });
};

const getUser = (req, res) => {
  let jsonToReturn = {
    user: null,
    err: null
  };
  User.findByPk(req.params.id).then((user)=>{
    if(user){
      res.statusCode = 200;
      jsonToReturn.user = user.toJSON();
    }else{
      res.statusCode = 404;
      jsonToReturn.err = 'user not found';
    }
    res.send(jsonToReturn);
  }).catch((err)=>{
    res.statusCode = 400;
    jsonToReturn.err = err.message;
    res.json(jsonToReturn);
  });
};

const createUser = (req, res) => {
  let jsonToReturn = {
    user: null,
    err: null
  };
  if(permitParams(req.body, permittedParameters)){
    User.create(req.body).then(user => {
      jsonToReturn.user = user.toJSON();
      Promise.all([
        user.setAuthor(req.body.isAuthor),
        user.setAdmin(req.body.isAdmin),
      ]).then(results => {
        if(results[0]){
          jsonToReturn.user.isAuthor = true;
        }
        if(results[1]){
          jsonToReturn.user.isAdmin = true;
        }
        res.statusCode = 201;
        res.json(jsonToReturn);
      });
    }).catch((err)=>{
      res.statusCode = 400;
      jsonToReturn.err = err.message;
      res.json(jsonToReturn);
    });
  }else{
    res.statusCode = 400;
    jsonToReturn.err = 'Your request contains unpermitted attributes. Permitted attributes for the requested route are: ' + permittedParameters;
    res.json(jsonToReturn);
  }
};

const updateUser = (req, res) => {
  let jsonToReturn = {
    user: null,
    err: null
  };
  if(permitParams(req.body, permittedParameters)){
    User.findByPk(req.params.id).then(user => {
      if(user){
        user.update(req.body).then(()=>{
          res.statusCode = 200;
          jsonToReturn.user = user.toJSON();
          res.json(jsonToReturn);
        }).catch((err)=>{
          res.statusCode = 400;
          jsonToReturn.err = err.message
          res.json(jsonToReturn);
        });
      }else{
        res.statusCode = 404;
        jsonToReturn.err = 'user not found';
        res.json(jsonToReturn);
      }
    }).catch((err)=>{
      res.statusCode = 400;
      jsonToReturn.err = err.message;
      res.json(jsonToReturn);
    });
  }else{
    res.statusCode = 400;
    jsonToReturn.err = 'Your request contains unpermitted attributes. Permitted attributes for the requested route are: ' + permittedParameters;
    res.json(jsonToReturn);
  }
};

const deleteUser = (req, res) => {
  let userToReturn = null;
  let jsonToReturn = {
    user: null,
    err: null
  };
  User.findByPk(req.params.id).then(user => {
    if(user){
      userToReturn = user.toJSON();
      user.destroy();
      res.statusCode = 200;
      jsonToReturn.user = userToReturn;
    }else{
      res.statusCode = 404;
      jsonToReturn.err = 'user not found';
    }
    res.json(jsonToReturn);
  }).catch((err)=>{
    res.statusCode = 400;
    jsonToReturn.err = err.message;
    res.json(jsonToReturn);
  });
};

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

router.use('/:authorId/books', booksRouter.router);

module.exports = {
  router: router,
  getUsers: getUsers,
  getUser: getUser,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser
};