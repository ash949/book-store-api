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
  });
});


module.exports = {
  router: router
};