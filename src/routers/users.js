let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt');
let User = require('../models').User;

const getUsers = (req, res) => {
  User.findAll().then((users)=>{
    if(users.length === 0){
      res.statusCode = 404;
    }else{
      res.statusCode = 200;
    }
    res.json(users);
  }).catch((err)=>{
    res.statusCode = 400;
    res.send(`sequelize-select-findAll Exception Error: ${err.message}`);
  });
};

const getUser = (req, res) => {
  User.findByPk(req.params.id).then((user)=>{
    if(user){
      res.statusCode = 200;
      res.json(user);
    }else{
      res.statusCode = 404;
      res.send('User not found');
    }
  }).catch((err)=>{
    res.statusCode = 400;
    res.send(`sequelize-select-findByPk Exception Error: ${err.message}`);
  });
};

const createUser = (req, res) => {
  User.create(req.body).then((user)=>{
    res.statusCode = 201;
    res.json(user.get({ plain: true }));
  }).catch((err)=>{
    res.statusCode = 400;
    res.send(`sequelize-create Exception Error: ${err.message}`);
  });
};

const updateUser = (req, res) => {
  User.findByPk(req.params.id).then((user)=>{
    if(user){
      user.update(req.body).then(()=>{
        res.statusCode = 200;
        res.json(user);
      }).catch((err)=>{
        res.statusCode = 400;
        res.send(`sequelize-update Exception Error: ${err.message}`);
      });
    }else{
      res.statusCode = 404;
      res.send('User not found');
    }
  }).catch((err)=>{
    res.statusCode = 400;
    res.send(`sequelize-update-findByPk Exception Error: ${err.message}`);
  });
};

const deleteUser = (req, res) => {
  User.findByPk(req.params.id).then( (user)=>{
    if(user){
      userToReturn = user.get({ plain: true });
      user.destroy();
      res.statusCode = 200;
      res.json(userToReturn) ;
    }else{
      res.statusCode = 404;
      res.send('User not found');
    }
  }).catch((err)=>{
    res.statusCode = 400;
    res.send(`sequelize-delete Exception Error: ${err.message}`);
  });
};

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);


module.exports = {
  router: router,
  getUsers: getUsers,
  getUser: getUser,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser
};