const express = require('express');
const router = express.Router();
const Category = require('../models').Category;

router.get('/', (req, res) => {
  Category.findAll().then(categories => {
    res.statusCode = 200;
    res.json(categories);
  }).catch(err => {
    res.statusCode = 400;
    res.send(err.message);
  });
});

router.get('/:id', (req, res) => {
  Category.findByPk(req.params.id).then(category => {
    res.statusCode = 200;
    res.json(category);
  }).catch(err => {
    res.statusCode = 400;
    res.send(err.message);
  });
});


module.exports = {
  router: router
};