'use strict';
let express = require('express');
let router = express.Router();
let User = require('../models').User;
let Admin= require('../models').Admin;
let Author = require('../models').Author;
let booksRouter = require('./books');

const permittedParameters = ['username', 'email', 'password', 'isAuthor', 'isAdmin'];

const permitParams = require('./helpers').permitParams;
const isAdmin = require('./helpers').isAdmin;
const checkPrivilege = require('./helpers').checkPrivilege;
const respnondWithSuccess = require('./helpers').respnondWithSuccess;
const respnondWithSuccessAndError = require('./helpers').respnondWithSuccessAndError;
const isSameToLoggedInUser = require('./helpers').isSameToLoggedInUser;

const getUsers = (req, res) => {
  let jsonToReturn = {
    user: null,
    err: []
  };

  (new Promise((resolve, reject) => {
    if(isAdmin(req)){
      resolve();
    }else{
      reject('Not Authorized');
    }
  }))
  .then(() => {
    return User.findAll()
  })
  .then(users => {
    jsonToReturn.user = users;
  })
  .catch(err => {
    let errorToPush = err.message || err;
    jsonToReturn.err.push(errorToPush);
  })
  .finally(() => {
    if(jsonToReturn.err.length > 0){
      res.statusCode = 400;
    }else{
      res.statusCode = 200;
    }
    res.json(jsonToReturn);
  });
};

const getUser = (req, res) => {
  let jsonToReturn = {
    user: null,
    err: []
  };
  User.findByPk(req.params.id)
  .then(user => {
    if(user){
      return Promise.resolve(user);
    }else{
      return Promise.reject('user not found');
    }
  })
  .then(user =>{
    if(isAdmin(req) || isSameToLoggedInUser(req, user)){
      jsonToReturn.user = user.toJSON();
    }else{
      return Promise.reject('Not Authorized');
    }
  })
  .catch(err => {
    let errorToPush = err.message || err;
    jsonToReturn.err.push(errorToPush);
  })
  .finally(() => {
    if(jsonToReturn.err.length > 0){
      res.statusCode = 400;
    }else{
      res.statusCode = 200;
    }
    res.json(jsonToReturn);
  });
};

const createUser = (req, res) => {
  let jsonToReturn = {
    user: null,
    err: []
  };
  let tempUser = null;
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
    tempUser = user;
    jsonToReturn.user = user.toJSON();
    return Promise.resolve();
  })
  .then(() => {
    if(isAdmin(req)){
      if(req.body.hasOwnProperty('isAuthor') && req.body.isAuthor === true){
        return Author.create({id: tempUser.id});
      }else{
        return Promise.resolve(true);
      }
    }else{
      return Promise.reject('Not Authorized to setAuthor');
    }
    
  })
  .then(author => {
    if(typeof author === 'boolean'){
      jsonToReturn.err.push('isAuthor contain invalid data or the user is already an author');
      return Promise.resolve(true);
    }else{
      return tempUser.setAuthor(author);
    }
  })
  .then(() => {
    if(isAdmin(req)){
      if(req.body.hasOwnProperty('isAdmin') && req.body.isAdmin === true){
        return Admin.create({id: tempUser.id});
      }else{
        return Promise.resolve(true);
      }
    }else{
      return Promise.reject('Not Authorized to setAdmin');
    }   
  })
  .then(admin => {
    if(typeof admin === 'boolean'){
      jsonToReturn.err.push('isAdmin contain invalid data or the user is already an admin');
      return Promise.resolve(true);
    }else{
      return tempUser.setAdmin(admin);
    }
  })
  .then(() => {
    return User.findByPk(jsonToReturn.user.id);
  })
  .then(user => {
    console.log(user.toJSON());
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

const updateUser = (req, res) => {
  let jsonToReturn = {
    user: null,
    err: []
  };
  let tempUser = null;
  let i = 0;
  (new Promise((resolve, reject) => {
    if(permitParams(req.body, permittedParameters)){
      resolve();
    }else{
      reject('Your request contains unpermitted attributes. Permitted attributes for the requested route are: ' + permittedParameters);
    }
  }))
  .then(() => {
    return User.findByPk(req.params.id);
  })
  .then(user => {
    if(user){
      tempUser = user;
      return Promise.resolve();
    }else{
      return Promise.reject('user not found');
    }
  })
  .then(() => {
    if(isAdmin(req) || isSameToLoggedInUser(req, tempUser)){
      return tempUser.update(req.body);
    }else{
      return Promise.reject('Not Authorized');
    }
  })
  .then(() => {
    jsonToReturn.user = tempUser.toJSON();
    return Promise.resolve();
  })
  .then(() => {
    if(isAdmin(req)){
      if(req.body.hasOwnProperty('isAuthor')){
        if(jsonToReturn.user.Author === null && req.body.isAuthor === true){
          return Author.create({id: tempUser.id});
        }else if(jsonToReturn.user.Author !== null && req.body.isAuthor === false){
          return Author.destroy({where: {id: tempUser.id}});
        }else{
          return Promise.resolve(false);
        }
      }else{
        return Promise.resolve(true);
      }
    }else{
      return Promise.reject('Not Authorized to change isAuthor');
    }
  })
  .then(author => {
    if(author === false){
      jsonToReturn.err.push('isAuthor contains invalid data or the change required is already applied');
    }
    return Promise.resolve();
  })
  .then(() => {
    if(isAdmin(req)){
      if(req.body.hasOwnProperty('isAdmin')){
        if(jsonToReturn.user.Admin === null && req.body.isAdmin === true){
          return Admin.create({id: tempUser.id});
        }else if(jsonToReturn.user.Admin !== null && req.body.isAdmin === false){
          return Admin.destroy({where: {id: tempUser.id}});
        }else{
          return Promise.resolve(false);
        }
      }else{
        return Promise.resolve(true);
      }
    }else{
      return Promise.reject('Not Authorized to change isAdmin');
    }
  })
  .then(admin => {
    if(admin === false){
      jsonToReturn.err.push('isAdmin contains invalid data or the change required is already applied');
    }
    return Promise.resolve();
  })
  .then(() => {
    return User.findByPk(jsonToReturn.user.id);
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
      res.statusCode = 200;
    }
    res.json(jsonToReturn);
  });
};

const deleteUser = (req, res) => {
  let userToReturn = null;
  let jsonToReturn = {
    user: null,
    err: []
  };
  (new Promise((resolve, reject)=> {
    if(isAdmin(req)){
      resolve();
    }else{
      reject('Not Authorized');
    }
  }))
  .then(() => {
    return User.findByPk(req.params.id)
  })
  .then(user => {
    if(user){
      userToReturn = user.toJSON();
      user.destroy();
      jsonToReturn.user = userToReturn;
    }else{
      return Promise.reject('user not found');
    }
  })
  .catch(err => {
    let errorToPush = err.message || err;
    jsonToReturn.err.push(errorToPush);
  })
  .finally(() => {
    if(jsonToReturn.err.length > 0){
      res.statusCode = 400;
    }else{
      res.statusCode = 200;
    }
    res.json(jsonToReturn);
  });
};

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;