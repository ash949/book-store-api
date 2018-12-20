
const factory = require('../factories');
const chai = require('chai');
const chaiHTTP = require('chai-http');
const server = require('../../src/app');
const Category = require('../../src/models').Category;
const should = chai.should();

chai.use(chaiHTTP);

describe('GET /categories', () => {
  beforeEach((done) => {
    factory.cleanTable(Category).then(() => {
      done();
    });
  });
  context('There are two categories stored', () => {
    beforeEach((done) => {
      factory.createMany('category', 2).then((categories) => {
        done();
      });
    });
    it('It should get all the categories as an array of length 2', done => {
      chai.request(server).get('/categories').end( (err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(2);
        done();
      });
    });
  });
  context('Categories table is empty', () => {
    it('It should return an empty array', (done) => {
      chai.request(server).get('/categories').end( (err, res) => {
        res.should.have.status(200);
        res.body.length.should.be.eql(0);
        done();
      });
    });
  });
});