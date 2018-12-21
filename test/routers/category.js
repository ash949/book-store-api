
const factory = require('../factories');
const chai = require('chai');
const chaiHTTP = require('chai-http');
const server = require('../../src/app');
const Category = require('../../src/models').Category;
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHTTP);

let categoryAttributes = [];

beforeEach(done => {
  factory.cleanTable(Category).then(() => {
    done();
  });
});

before(()=> {
  categoryAttributes = Object.keys(Category.rawAttributes);
});

describe('GET /categories', () => {
  it("Response's status code is expected to be 200", done => {
    chai.request(server).get('/categories').end( (err, res) => {
      expect(res.status).to.eql(200);
      done();
    });
  });
  it("Response's body is expected have 'categories' property", done => {
    chai.request(server).get('/categories').end( (err, res) => {
      expect(res.body.categories).to.not.be.undefined;
      done();
    });
  });
  it("Response's body is expected have 'err' property that is equal to null", done => {
    chai.request(server).get('/categories').end( (err, res) => {
      expect(res.body.err).to.be.null;
      done();
    });
  });
  context('If there is one or more categories stored', () => {
    beforeEach((done) => {
      factory.createMany('category', Math.ceil(Math.random()*10)).then((categories) => {
        done();
      });
    });
    it("Returned array's length expected to be greater than 0", done => {
      chai.request(server).get('/categories').end( (err, res) => {
        expect(res.body.categories.length).to.be.greaterThan(0);
        done();
      });
    });
    it("each object in the returned array is expected to have Category Model attributes", done => {
      chai.request(server).get('/categories').end( (err, res) => {
        res.body.categories.forEach(category => {
          for (let i = 0; i < categoryAttributes.length; i++) {
            if (!category.hasOwnProperty(categoryAttributes[i])) {
              expect.fail();
              break;
            }
          }
          expect(true).to.equal(true);
        });
        done();
      });
    });
  });
  context('If categories table is empty', () => {
    it("Returned array's length expected to be 0", done => {
      chai.request(server).get('/categories').end( (err, res) => {
        expect(res.body.categories.length).to.be.eql(0);
        done();
      });
    });
  });
});

describe('GET /categories/:id', () => {
  let categoryId = 123;
  let res = null;
  before(done => {
    chai.request(server).get(`/categories/${categoryId}`).end((err, response) => {
      res = response;
      done();
    });
  });
  
  it("Response is expected to have 'category' property", () => {
    expect(res.body.category).to.not.be.undefined;
  });
  
  context('Requesting a non-existing category', () => {
    it('Response should have 404 status code', () => {
      expect(res).to.have.status(404);
    });
    it("Response's 'category' property is expected to be set to 'null'", () => {
      expect(res.body.category).to.be.null;
    });
    it("Response should have error(err) message of 'category not found'", () => {
      expect(res.body.err.toLowerCase()).to.equal('category not found');
    });
  });

  context('Requesting an existing category', () => {
    let response = null;
    before(done => {
      factory.create('category').then(category => {
        categoryId = category.id;
        chai.request(server).get(`/categories/${categoryId}`).end((err, response) => {
          res = response;
          done();
        });
      });
    });
    it('Should respond with 200 status code', () => {
      expect(res).to.have.status(200);
    });
    it("Response's 'err' property is expected to be set to 'null'", () => {
      expect(res.body.err).to.be.null;
    });
    it("Response is expected to be an object with 'category' property",() => {
      expect(res.body.category).to.not.be.undefined;
    });
    it('Returned category is expected to have Category Model attributes', () => {
      for (let i = 0; i < categoryAttributes.length; i++) {
        if (!res.body.category.hasOwnProperty(categoryAttributes[i])) {
          expect.fail();
          break;
        }
      }
      expect(true).to.equal(true);
    });
    it('The id of the returned object will equel the one passed in the URL', () => {
      expect(res.body.category.id).to.equal(categoryId);
    });
  });
});
