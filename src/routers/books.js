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

const loadAndSendBook = (req, res) => {
  let query = {where: { id: req.params.id }};
  if(req.params.authorId){
    query.where.authorId = req.params.authorId;
  }
  Book.findOne(query)
  .then(book => {
    if(book) {
      return Promise.resolve(book);
    }else{
      return Promise.reject('book not found');
    }
  })
  .then(book => {
    res.statusCode = 200;
    res.sendFile(`${uploadPath}/${book.id}.pdf`);
  })
  .catch(err => {
    res.statusCode = 400;
    let error = err || err.message
    res.send(error);
  })
}



// const createBook = (err, req, res, next) => {
const createBook = (req, res) => {
  bookUploader.single('bookPDF')(req, res, err => {
    let jsonToReturn = {
      book: null,
      err: []
    };
    let data = req.body;
    let tempBook = null;
    let tempFile = req.file || null;
    if(req.params.authorId){
      data.authorId = req.params.authorId;
    }
    
    (new Promise( (resolve, reject) => {
      if(!permitParams(req.body, permittedParameters)){
        reject('Your request contains unpermitted attributes. Permitted attributes for the requested route are: ' + permittedParameters);
      }
      if(err){
        if( err.message === 'Unexpected field'){
          err.message = "use 'bookPDF' as file field name";
        }
        reject(err.message || err.Error || 'could not upload the file');
      }
      resolve();
    }))
    .then(() => {
      return Book.create(data)
    })
    .then(book => {
      tempBook = book;
      data.BookCategories = data.BookCategories.map(x => { return {bookId: book.id, categoryId: x.categoryId} });
      return BookCategory.bulkCreate(data.BookCategories)
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        if(req.file){
          fs.rename(`${req.file.path}`, `${uploadPath}/${tempBook.id}.pdf`,(err) => {
            if(err){
              reject("could't rename the uploaded file to match books's id");
            }else{
              resolve();
            }
          });
        }else{
          reject("could't upload the book file");
        }
      });
    })
    .then(() => {
      jsonToReturn.book = tempBook.toJSON();
      return Promise.resolve(); 
    })
    .catch(err => {
      let errorToPush = err.message || err.Error || err;
      jsonToReturn.err.push(errorToPush);
    })
    .finally(() => {
      (new Promise((resolve, reject) => {
        if(jsonToReturn.err.length > 0){
          jsonToReturn.book = null;
          res.statusCode = 400;
          if(tempBook){
            tempBook.destroy();
          }
          if(tempFile){
            fs.unlink(tempFile.path, err => {
              if (err) jsonToReturn.err.push(err.message);   
              resolve();
            });
          }else{
            resolve();
          }
        }else{
          res.statusCode = 201;
          resolve();
        }
      })).finally(() => {
        res.json(jsonToReturn);
      });
    });
  });
};

// const updateBook1 = (req, res) => {
//   bookUploader.single('bookPDF')(req, res, err => {
//     let jsonToReturn = {
//       book: null,
//       err: []
//     };
//     let data = req.body;
//     let tempBook = null;
//     let tempFile = req.file || null;
//     if(req.params.authorId){
//       data.authorId = req.params.authorId;
//     }
//     let query = {where: { id: req.params.id }};
//     if(req.params.authorId){
//       query.where.authorId = req.params.authorId;
//     }
//     (new Promise( (resolve, reject) => {
//       if(err){
//         if( err.message === 'Unexpected field'){
//           err.message = "use 'bookPDF' as file field name";
//         }
//         reject(err);
//       }else{
//         resolve();
//       }
//     }))
//     .then(() => {
//       return Book.findOne(query)
//     })
//     .then(book => {
//       if(book){
//         tempBook = book;
//         return Promise.resolve();
//       }else{
//         return Promise.reject('book not found');
//       }
//     })
//   });
// };

const updateBook = (req, res) => {
  let jsonToReturn = {
    book: null,
    err: []
  };
  if(permitParams(req.body, permittedParameters)){
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
router.get('/:id/view', loadAndSendBook);
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




