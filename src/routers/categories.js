'use strict';
let express = require('express');
let router = express.Router();
let Category = require('../models').Category;

const permittedParameters = ['name'];

const permitParams = require('./helpers').permitParams;
const authenticate = require('./helpers').authenticate;

const getCategories = (req, res) => {
  let jsonToReturn = {
    category: null,
    err: null
  };
  Category.findAll().then((categories)=>{
    jsonToReturn.category = categories;
    res.statusCode = 200;
    res.json(jsonToReturn);
  }).catch((err)=>{
    res.statusCode = 400;
    jsonToReturn.err = err.message;
    res.json(jsonToReturn);
  });
};

const getCategory = (req, res) => {
  let jsonToReturn = {
    category: null,
    err: null
  };
  Category.findByPk(req.params.id).then((category)=>{
    if(category){
      res.statusCode = 200;
      jsonToReturn.category = category.toJSON();
    }else{
      res.statusCode = 404;
      jsonToReturn.err = 'category not found';
    }
    res.send(jsonToReturn);
  }).catch((err)=>{
    res.statusCode = 400;
    jsonToReturn.err = err.message;
    res.json(jsonToReturn);
  });
};

const createCategory = (req, res) => {
  let jsonToReturn = {
    category: null,
    err: null
  };
  if(permitParams(req.body, permittedParameters)){
    Category.create(req.body).then((category)=>{
      res.statusCode = 201;
      jsonToReturn.category = category.toJSON();
      res.json(jsonToReturn);
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

const updateCategory = (req, res) => {
  let jsonToReturn = {
    category: null,
    err: null
  };
  if(permitParams(req.body, permittedParameters)){
    Category.findByPk(req.params.id).then((category)=>{
      if(category){
        category.update(req.body).then(()=>{
          res.statusCode = 200;
          jsonToReturn.category = category.toJSON();
          res.json(jsonToReturn);
        }).catch((err)=>{
          res.statusCode = 400;
          jsonToReturn.err = err.message
          res.json(jsonToReturn);
        });
      }else{
        res.statusCode = 404;
        jsonToReturn.err = 'category not found';
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

const deleteCategory = (req, res) => {
  let categoryToReturn = null;
  let jsonToReturn = {
    category: null,
    err: null
  };
  Category.findByPk(req.params.id).then( (category)=>{
    if(category){
      categoryToReturn = category.toJSON();
      category.destroy();
      res.statusCode = 200;
      jsonToReturn.category = categoryToReturn;
    }else{
      res.statusCode = 404;
      jsonToReturn.err = 'category not found';
    }
    res.json(jsonToReturn);
  }).catch((err)=>{
    res.statusCode = 400;
    jsonToReturn.err = err.message;
    res.json(jsonToReturn);
  });
};

const getRouter = (passport) => {

  // for test only, I will skip authentication and authorization
  if(process.env.NODE_ENV !== 'test'){
    router.use(authenticate([
      ['isAdmin']
    ], passport));
  }

  
  router.get('/', getCategories);
  router.get('/:id', getCategory);
  router.post('/', createCategory);
  router.patch('/:id', updateCategory);
  router.put('/:id', updateCategory);
  router.delete('/:id', deleteCategory);

  return router;

};


module.exports = {
  router: getRouter,
  getCategories: getCategories,
  getCategory: getCategory,
  createCategory: createCategory,
  updateCategory: updateCategory,
  deleteCategory: deleteCategory
};