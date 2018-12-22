const express = require('express');
const router = express.Router();
const Category = require('../models').Category;

router.get('/', (req, res) => {
  Category.findAll().then(categories => {
    res.statusCode = 200;
    res.json({
      categories: categories,
      err: null
    });
  });
});

router.get('/:id', (req, res) => {
  let jsonToReturn = {
    category: null,
    err: null
  };
  Category.findByPk(req.params.id).then(category => {
    if(category){
      res.statusCode = 200;
      jsonToReturn.category = category;
    }else{
      res.statusCode = 404;
      jsonToReturn.err = 'category not found';
    }
    res.json(jsonToReturn);
  }).catch(err => {
    console.log('WTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTFGFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFff');
    res.statusCode = 400;
    jsonToReturn.err = err.message;
    res.json(jsonToReturn);
  });
});

router.post('/', (req, res) => {
  let jsonToReturn = {
    category: null,
    err: null
  };
  Category.create(req.body).then(category => {
    res.statusCode = 201;
    jsonToReturn.category = category.toJSON();
    res.json(jsonToReturn);
  }).catch(err => {
    res.statusCode = 400;
    jsonToReturn.err = err.message;
    res.json(jsonToReturn);
  });
  
});


module.exports = {
  router: router
};