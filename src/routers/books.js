'use strict';
let express = require('express');
let router = express.Router({mergeParams: true});
const Book = require('../models').Book;
const User = require('../models').User;
const Author = require('../models').Author;
const Category = require('../models').Category;
const BookCategory = require('../models').BookCategory;

const permittedParameters = ['name', 'description', 'authorId', 'BookCategories'];

const permitParams = require('./helpers').permitParams;
const respnondWithError = require('./helpers').respnondWithError;
const respnondWithSuccess = require('./helpers').respnondWithSuccess;
const respnondWithSuccessAndError = require('./helpers').respnondWithSuccessAndError;

const getBooks = (req, res) => {
  let jsonToReturn = {
    book: null,
    err: null
  };
  let query = {where: {}};
  if(req.params.authorId){
    query.where.authorId = req.params.authorId;
  }
  Book.findAll(query).then(books => {
    respnondWithSuccess(res, jsonToReturn, 200, books, 'book');
  }).catch((err)=>{
    respnondWithError(res, jsonToReturn, 400, err.message);
  });
};

const getBook = (req, res) => {
  let jsonToReturn = {
    book: null,
    err: null
  };
  let query = {where: { id: req.params.id }};
  if(req.params.authorId){
    query.where.authorId = req.params.authorId;
  }
  Book.findOne(query).then(book => {
    if(book){
      respnondWithSuccess(res, jsonToReturn, 200, book.toJSON(), 'book');
    }else{
      respnondWithError(res, jsonToReturn, 404, 'book not found');
    }
  }).catch((err)=>{
    respnondWithError(res, jsonToReturn, 400, err.message);
  });
};

const createBook = (req, res) => {
  let jsonToReturn = {
    book: null,
    err: null
  };
  if(permitParams(req.body, permittedParameters)){
    let data = req.body;
    if(req.params.authorId){
      data.authorId = req.params.authorId;
    }
    Book.create(data, {
      include: [
        {
          model: BookCategory
        }
      ]
    }).then(book => {
      respnondWithSuccess(res, jsonToReturn, 201, book.toJSON(), 'book');
    }).catch((err)=>{
      respnondWithError(res, jsonToReturn, 400, err.message);
    });
  }else{
    respnondWithError(res, jsonToReturn, 400, 'Your request contains unpermitted attributes. Permitted attributes for the requested route are: ' + permittedParameters);
  }
};

const updateBook = (req, res) => {
  let jsonToReturn = {
    book: null,
    err: []
  };
  if(permitParams(req.body, permittedParameters)){
    let data = req.body;
    if(req.params.authorId){
      data.authorId = req.params.authorId;
    }
    let query = {where: { id: req.params.id }};
    if(req.params.authorId){
      query.where.authorId = req.params.authorId;
    }
    Book.findOne(query).then(book => {
      if(book){
        book.update(data).then(() => {
          BookCategory.destroy({where: {bookId: book.id}});
          let bookCategories = data.BookCategories.map(x => {
            x.bookId = book.id;
            return x;
          });
          BookCategory.bulkCreate(bookCategories).then(() => { 
            respnondWithSuccess(res, jsonToReturn, 200, book.toJSON(), 'book');
          }).catch(err => {
            respnondWithSuccessAndError(res, jsonToReturn, 400, book.toJSON(), 'book', "couldn't add all specified categories");
          });
        });
      }else{
        respnondWithError(res, jsonToReturn, 404, 'book not found');
      }
    }).catch((err)=>{
      respnondWithError(res, jsonToReturn, 400, err.message);
    });
  }else{
    respnondWithError(res, jsonToReturn, 400, 'Your request contains unpermitted attributes. Permitted attributes for the requested route are: ' + permittedParameters);
  }
};

const deleteBook = (req, res) => {
  let bookToReturn = null;
  let jsonToReturn = {
    book: null,
    err: null
  };
  let query = {where: { id: req.params.id }};
  if(req.params.authorId){
    query.where.authorId = req.params.authorId;
  }
  Book.findOne(query).then(book => {
    if(book){
      book.destroy();
      respnondWithSuccess(res, jsonToReturn, 200, book.toJSON(), 'book');
    }else{
      respnondWithError(res, jsonToReturn, 404, 'book not found');
    }
  }).catch((err)=>{
    respnondWithError(res, jsonToReturn, 400, err.message);
  });
};

router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', createBook);
router.patch('/:id', updateBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);


module.exports = {
  router: router,
  getBooks: getBooks,
  getBook: getBook,
  createBook: createBook,
  updateBook: updateBook,
  deleteBook: deleteBook
};