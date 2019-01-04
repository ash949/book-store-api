'use strict';
let express = require('express');
let router = express.Router({mergeParams: true});

const util = require('util');
const fs = require('fs');
const multer = require('multer');
const uploadPath = require('../../config/app').bookUploadPath;


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.pdf')
  }
})

const bookUploader = multer(
  {
    storage: storage,
    fileFilter: (req, file, cb) => {
      if( file.mimetype ==='application/pdf'){
        cb(null, true);
      }else{
        cb(new Error('File must be a PDF'));
      }
    }
  }
);

const uploadBook = util.promisify(bookUploader.single('bookPDF'));

const Book = require('../models').Book;
const BookCategory = require('../models').BookCategory;


const permittedParameters = ['name', 'description', 'authorId', 'bookPDF', 'BookCategories'];

const permitParams = require('./helpers').permitParams;
const authenticate = require('./helpers').authenticate;

const getBooks = (req, res) => {
  let jsonToReturn = {
    books: [],
    err: []
  };
  let query = {where: {}};
  if(req.params.authorId){
    query.where.authorId = req.params.authorId;
  }
  (new Promise((resolve, reject) => {
    Book.findAll(query)
    .then(books => {
      if(books && (books.length > 0)){
        res.statusCode = 200;
        jsonToReturn.books = books;
        resolve();
      }else{
        res.statusCode = 404;
        jsonToReturn.err.push('no books found');
        resolve();
      }
    })
    .catch(err => {
      res.statusCode = 400;
      jsonToReturn.err.push(err.message);
      resolve();
    });
  }))
  .finally(() => {
    res.json(jsonToReturn);
  });
};

const getBook = (req, res) => {
  let jsonToReturn = {
    book: null,
    err: []
  };
  let query = {where: { id: req.params.id }};
  if(req.params.authorId){
    query.where.authorId = req.params.authorId;
  }
  (new Promise((resolve, reject) => {
    Book.findOne(query)
    .then(book => {
      if(book){
        res.statusCode = 200;
        jsonToReturn.book = book.toJSON();
        resolve();
      }else{
        res.statusCode = 404;
        jsonToReturn.err.push('book not found');
        resolve();
      }
    })
    .catch(err => {
      res.statusCode = 400;
      jsonToReturn.err.push(err.message);
      resolve();
    })
  }))
  .finally(() => {
    res.json(jsonToReturn);
  });
};


const loadAndSendBook = (req, res) => {
  let query = {where: { id: req.params.id }};
  let bookURL = null;
  let error = null;
  if(req.params.authorId){
    query.where.authorId = req.params.authorId;
  }
  (new Promise((resolve, reject) => {
    Book.findOne(query)
    .then(book => {
      if(book) {
        res.statusCode = 200;
        bookURL = `${uploadPath}/${book.id}.pdf`;
        resolve();
      }else{
        res.statusCode = 404;
        error = 'book not found';
        resolve();
      }
    })
    .catch(err => {
      res.statusCode = 400;
      error = err.message;
      resolve();
    });
  }))
  .finally(() => {
    if(bookURL){
      res.sendFile(bookURL);
    }else{
      res.send(error);
    }
  })
}

const createBook = (req, res) => {
  bookUploader.single('bookPDF')(req, res, err => {
    let jsonToReturn = {
      book: null,
      err: []
    };
    let data = req.body;
    let tempBook = null;
    let tempFile = req.file || null;
    res.statusCode = 400;
    if(req.params.authorId){
      data.authorId = req.params.authorId;
    }
    (new Promise( (resolve, reject) => {
      if(!permitParams(req.body, permittedParameters)){
        res.statusCode = 400;
        jsonToReturn.err.push('Your request contains unpermitted attributes. Permitted attributes for the requested route are: ' + permittedParameters);
        resolve(false);
      }
      if(err){
        if( err.message === 'Unexpected field'){
          err.message = "use 'bookPDF' as file field name";
        }
        res.statusCode = 400;
        jsonToReturn.err.push(err.message || err.Error || 'could not upload the file');
        resolve(false);
      }
      resolve(true);
    }))
    .then(result => {
      if(result){
        return (new Promise((resolve, reject) => {
          Book.create(data)
          .then(book => {
            tempBook = book;
            resolve(true);
          })
          .catch(err => {
            res.statusCode = 400;
            jsonToReturn.err.push(err.message);
            resolve(false);
          });
        }));
      }else{
        return Promise.resolve(false);
      }
    })
    .then(result => {
      if(result){
        if(data.BookCategories){
          if(Array.isArray(data.BookCategories)){
            let bookCategories = data.BookCategories.map(x => {
              x.bookId = tempBook.id;
              return x;
            });
            return (new Promise((resolve, reject) => {
              BookCategory.bulkCreate(bookCategories)
              .then(bookCategories => {
                resolve(true);
              })
              .catch(err => {
                res.statusCode = 400;
                jsonToReturn.err.push(err.message);
                resolve(false);    
              });
            }));
          }else{
            res.statusCode = 400;
            jsonToReturn.err.push('passed book categories is not an array');
            return Promise.resolve(false);
          }
        }else{
          return Promise.resolve(true);
        }
      }else{
        return Promise.resolve(false);
      }
    })
    .then(result => {
      if(result){
        if(req.file){
          fs.rename(`${req.file.path}`, `${uploadPath}/${tempBook.id}.pdf`,(err) => {
            if(err){
              res.statusCode = 400;
              jsonToReturn.err.push("could't rename the uploaded file to match books's id.");
              return Promise.resolve(false);
            }else{
              res.statusCode = 201;
              jsonToReturn.book = tempBook.toJSON();
              return Promise.resolve(true);
            }
          });
        }else{
          res.statusCode = 400;
          jsonToReturn.err.push("could't upload the book file");
          return Promise.resolve(false);
        }
      }else{
        return Promise.resolve(false);
      }
    })
    .then(result => {
      if(!result){
        if(req.file){
          fs.unlink(req.file.path, err => {
            if (err) {
              jsonToReturn.err.push("could't delete the file uploaded");
            }
            if(tempBook){
              tempBook.destroy();
            }
          });
        }
      }
    })
    .finally(() => {
      res.json(jsonToReturn);
    });
  });
};

const updateBook = (req, res) => {
  bookUploader.single('bookPDF')(req, res, err => {
    let jsonToReturn = {
      book: null,
      err: []
    };
    
    let tempBook = null;
    let tempFile = req.file || null;
    let data = req.body;
    let query = {where: { id: req.params.id }};
    if(req.params.authorId){
      data.authorId = req.params.authorId;
      query.where.authorId = req.params.authorId;
    }
    
    (new Promise( (resolve, reject) => {
      if(!permitParams(req.body, permittedParameters)){
        res.statusCode = 400;
        jsonToReturn.err.push('Your request contains unpermitted attributes. Permitted attributes for the requested route are: ' + permittedParameters);
        resolve(false);
      }
      if(err){
        if( err.message === 'Unexpected field'){
          err.message = "use 'bookPDF' as file field name";
        }
        res.statusCode = 400;
        jsonToReturn.err.push(err.message || err.Error || 'could not upload the file');
        resolve(false);
      }
      resolve(true);
    }))
    .then(result => {
      if(result){
        return (new Promise((resolve, reject) => {
          Book.findOne(query)
          .then(book => {
            tempBook = book;
            resolve(true);
          })
          .catch(err => {
            res.statusCode = 404;
            jsonToReturn.err.push('book not found');
            resolve(false);
          });
        }));
      }else{
        return Promise.resolve(false);
      }
    })
    .then(result => {
      if(result){
        if(req.file){
          fs.unlink(`${uploadPath}/${tempBook.id}.pdf`, err => {
            if (err) return Promise.reject("could not delete the old file");
            return Promise.resolve(true);
          });
        }else{
          return Promise.resolve(true);
        }
      }else{
        return Promise.resolve(false);
      }
    })
    .then(result => {
      if(result){
        if(tempBook){
          fs.rename(`${req.file.path}`, `${uploadPath}/${tempBook.id}.pdf`,(err) => {
            if(err){
              res.statusCode = 400;
              jsonToReturn.err.push("could't rename the uploaded file to match books's id");
              return Promise.resolve(false);
            }else{
              return Promise.resolve(true);
            }
          });
        }else{
          return Promise.resolve(true);
        }
      }else{
        return Promise.resolve(false);
      }
    })
    .then(result => {
      if(result){
        if(data.BookCategories){
          if(Array.isArray(data.BookCategories)){
            BookCategory.destroy({where: {bookId: tempBook.id}});
            let bookCategories = data.BookCategories.map(x => {
              x.bookId = tempBook.id;
              return x;
            });
            return (new Promise((resolve, reject) => {
              BookCategory.bulkCreate(bookCategories)
              .then(bookCategories => {
                resolve(true);
              })
              .catch(err => {
                res.statusCode = 400;
                jsonToReturn.err.push(err.message);
                resolve(false);
              });
            }));
          }else{
            res.statusCode = 400;
            jsonToReturn.err.push('passed book categories is not an array');
            return Promise.resolve(false);
          }
        }else{
          return Promise.resolve(true);
        }
      }else{
        return Promise.resolve(false);
      }
    })
    .then(result => {
      if(result){
        return (new Promise((resolve, reject) => {
          tempBook.update(data)
          .then(() => {
            resolve(true);    
          })
          .catch(err => {
            res.statusCode = 400;
            jsonToReturn.err.push(err.message);
            resolve(false);
          });
        }));
      }else{
        return Promise.resolve(false);
      }
    })
    .then(result => {
      if(result){
        return (new Promise((resolve, reject) => {
          Book.findByPk(tempBook.id)
          .then(book => {
            res.statusCode = 200;
            jsonToReturn.book = book.toJSON();
          })
          .catch(err => {
            res.statusCode = 400;
            jsonToReturn.err.push(err.message);
          });
        }));
      }
    })
    .finally(() => {
      res.json(jsonToReturn);
    });
  });
};

const deleteBook = (req, res) => {
  let bookToReturn = null;
  let jsonToReturn = {
    book: null,
    err: []
  };
  let query = {where: { id: req.params.id }};
  if(req.params.authorId){
    query.where.authorId = req.params.authorId;
  }
  Book.findOne(query)
  .then(book => {
    if(book){      
      bookToReturn = book.toJSON();
      jsonToReturn.book = bookToReturn;
      book.destroy();
      return Promise.resolve(true);
    }else{
      res.statusCode = 404;
      jsonToReturn.err.push('book not found');
      return Promise.resolve(false);
    }
  })
  .then(result => {
    if(result){
      return new Promise((resolve, reject) => {
        fs.unlink(`${uploadPath}/${bookToReturn.id}.pdf`, err => {
          if (err){
            res.statusCode = 400;
            jsonToReturn.err.push("Book recored is deleted but could not delete the book file, maybe there is no file named after this book's id");
          }else{
            res.statusCode = 200;
          }
        });
      });
    }
  })
  .finally(() => {
    res.json(jsonToReturn);
  });
};

const getRouter = (passport) => {
  router.get('/', authenticate([
    []
  ], passport), getBooks);
  router.get('/:id', authenticate([
    []
  ], passport), getBook);
  router.get('/:id/view', authenticate([
    []
  ], passport), loadAndSendBook);
  router.post('/', authenticate([
    ['isAdmin'],
    ['isAuthor', 'sameUser']
  ], passport), createBook);
  router.patch('/:id', authenticate([
    ['isAdmin'],
    ['isAuthor', 'sameUser']
  ], passport), updateBook);
  router.put('/:id', authenticate([
    ['isAdmin'],
    ['isAuthor', 'sameUser']
  ], passport), updateBook);
  router.delete('/:id', authenticate([
    ['isAdmin'],
    ['isAuthor', 'sameUser']
  ], passport), deleteBook);
  
  return router;
}


module.exports = {
  router: getRouter,
  getBooks: getBooks,
  getBook: getBook,
  createBook: createBook,
  updateBook: updateBook,
  deleteBook: deleteBook
};




