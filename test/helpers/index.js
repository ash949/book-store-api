process.env.NODE_ENV = 'test';
const factory = require('../factories');
const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const server = require('../../src/app');
const should = chai.should();
const expect = chai.expect;


const self = module.exports = {
  getModelAttributes : (Model) => {
    return Object.keys(Model.rawAttributes);
  },
  checkAttributes: (object, Model) => {
    const attributes = self.getModelAttributes(Model);
    for (let i = 0; i < attributes.length; i++) {
      if (!object.hasOwnProperty(attributes[i])) {
        return false;
      }
    }
    return true;
  },
  expectToHaveErrorMesssage: (message) => {
    it(`Response is expected to have its 'err' property set to: '${message}'`, () => {
      expect(res.body.err.toLowerCase()).to.equal(message);
    });
  },
  testGetAllEndPoint: (Model) => {
    const modelClassName = Model.name;
    const modelName = Model.name.toLowerCase();
    const resourceName = Model.getTableName();

    let res = null;
    before(done => {
      
      factory.cleanTable(Model).then(() => {
        done();
      });
    });

    describe(`GET /${resourceName}`, () => {
      beforeEach(done => {
        res = null;
        chai.request(server).get(`/${resourceName}`).end((err, response) => {
          res = response;
          done();
        });
      });
      it("Response's status code is expected to be 200", () => {
        expect(res.status).to.eql(200);
      });
      it(`Response's body is expected have '${modelName}' property`, () => {
        expect(res.body[modelName]).to.not.be.undefined;
      });
      it(`Response-body '${modelName}' property is expected to be an array`, () => {
        expect(res.body[modelName]).to.be.an('array');
      });
      it("Response's body is expected have 'err' property that is equal to null", () => {
        expect(res.body.err).to.be.null;
      });
      context(`If there is one or more ${resourceName} stored`, () => {
        before((done) => {
          factory.createMany(modelName, Math.ceil(Math.random()*10)).then((objects) => {
            done();
          });
        });
        after(done => {
          factory.cleanTable(Model).then(() => {
            done();
          });
        });
        it("Returned array's length expected to be greater than 0", () => {
          expect(res.body[modelName].length).to.be.greaterThan(0);
        });
        it(`each object in the returned array is expected to have ${modelClassName} Model attributes`, () => {
          res.body[modelName].forEach(object => {
            expect(self.checkAttributes(object, Model)).to.be.true;
          });
        });
      });
      context(`If ${resourceName} table is empty`, () => {
        before(done => {
          factory.cleanTable(Model).then(() => {
            done();
          });
        });
        it("Returned array's length expected to be 0", () => {
          expect(res.body[modelName].length).to.be.eql(0);
        });
      });
    });
  },

  testGetOneEndPoint: (Model) => {
    const modelClassName = Model.name;
    const modelName = Model.name.toLowerCase();
    const resourceName = Model.getTableName();

    before(done => {
      factory.cleanTable(Model).then(() => {
        done();
      });
    });

    describe(`GET /${resourceName}/:id`, () => {
      let objectId = 123;
      let res = null;
      before(done => {
        res = null;
        chai.request(server).get(`/${resourceName}/${objectId}`).end((err, response) => {
          res = response;
          done();
        });
      });
      
      it(`Response is expected to have '${modelName}' property`, () => {
        expect(res.body[modelName]).to.not.be.undefined;
      });

      context(`If the provided ID is not an integer`, () => {
        before(done => {
          res = null;
          factory.cleanTable(Model).then(() => {
            factory.create(modelName).then(object => {
              chai.request(server).get(`/${resourceName}/sdasdasd`).end((err, response) => {
                res = response;
                done();
              });
            });
          });
        });
        after(done => {
          factory.cleanTable(Model).then(() => {
            done();
          });
        });
        it('Response should have 400 status code', () => {
          expect(res.status).to.equal(400);
        });
        it(`Response's '${modelName}' property is expected to be set to 'null'`, () => {
          expect(res.body[modelName]).to.be.null;
        });
        it(`Response is expected to have an error(err) message`, () => {
          expect(res.body.err.trim().length).to.be.greaterThan(0);
        });
      });
      
      context(`Requesting a non-existing ${modelName}`, () => {
        
        before(done => {
          res = null;
          factory.cleanTable(Model).then(() => {
            chai.request(server).get(`/${resourceName}/1`).end((err, response) => {
              res = response;
              done();
            });
          });
        });
        it('Response should have 404 status code', () => {
          expect(res.status).to.equal(404);
        });
        it(`Response's '${modelName}' property is expected to be set to 'null'`, () => {
          expect(res.body[modelName]).to.be.null;
        });
        it(`Response should have error(err) message of '${modelName} not found'`, () => {
          expect(res.body.err.toLowerCase()).to.equal(`${modelName} not found`);
        });
      });

      context(`Requesting an existing ${modelName}`, () => {
        before(done => {
          res = null;
          factory.create(modelName).then(object => {
            objectId = object.id;
            chai.request(server).get(`/${resourceName}/${objectId}`).end((err, response) => {
              res = response;
              done();
            });
          });
        });
        after(done => {
          factory.cleanTable(Model).then(() => {
            done();
          });
        });
        it('Should respond with 200 status code', () => {
          expect(res.status).to.equal(200);
        });
        it("Response's 'err' property is expected to be set to 'null'", () => {
          expect(res.body.err).to.be.null;
        });
        it(`Returned ${modelName} is expected to have ${modelClassName} Model attributes`, () => {
          expect(self.checkAttributes(res.body[modelName], Model)).to.be.true;
        });
        it('The id of the returned object will equal the one passed in the URL', () => {
          expect(res.body[modelName].id).to.equal(objectId);
        });
      });
    });
  },

  testDeleteEndPoint: (Model) => {
    const modelClassName = Model.name;
    const modelName = Model.name.toLowerCase();
    const resourceName = Model.getTableName();

    
    
    describe(`DELETE /${resourceName}/:id`, () => {
      let testObjectId = null;
      let res = null;

      context(`If the provided ID is not an integer`, () => {
        before(done => {
          res = null;
          factory.cleanTable(Model).then(() => {
            factory.create(modelName).then(object => {
              chai.request(server).delete(`/${resourceName}/sdasdasd`).end((err, response) => {
                res = response;
                done();
              });
            });
          });
        });
        after(done => {
          factory.cleanTable(Model).then(() => {
            done();
          });
        });
        it('Response should have 400 status code', () => {
          expect(res.status).to.equal(400);
        });
        it(`Response's '${modelName}' property is expected to be set to 'null'`, () => {
          expect(res.body[modelName]).to.be.null;
        });
        it(`Response is expected to have an error(err) message`, () => {
          expect(res.body.err.trim().length).to.be.greaterThan(0);
        });
      });
      
      context(`If the provided ID is for an existing ${modelName}`, () => {
        before(done => {
          res = null;
          factory.cleanTable(Model).then(() => {
            factory.create(modelName).then(object => {
              testObjectId = object.id;
              chai.request(server).delete(`/${resourceName}/${testObjectId}`).end((err, response) => {
                res = response;
                done();
              });
            })
          });
        });
        it('Should respond with 200 status code', () => {
          expect(res.status).to.equal(200);
        });
        it("Response's 'err' property is expected to be set to 'null'", () => {
          expect(res.body.err).to.be.null;
        });
        it(`Response is expected to be an object with '${modelName}' property`,() => {
          expect(res.body[modelName]).to.not.be.undefined;
        });
        it(`Returned ${modelName} is expected to have ${modelClassName} Model attributes`, () => {
          expect(self.checkAttributes(res.body[modelName], Model)).to.be.true;
        });
        it('The id of the returned object will equal the one passed in the URL', () => {
          expect(res.body[modelName].id).to.equal(testObjectId);
        });
        it(`Requesting the deleted ${modelName} will return a response error message of ${modelName} not found`, done => {
          chai.request(server).get(`/${resourceName}/${testObjectId}`).end((err, response) => {
            res = response;
            expect(res.body.err.toLowerCase()).to.equal(`${modelName} not found`);
            done();
          });
        });
      });

      context(`If the provided ID is for a non existing ${modelName}`, () => {
        before(done => {
          res = null;
          factory.cleanTable(Model).then(() => {
            chai.request(server).delete(`/${resourceName}/1`).end((err, response) => {
              res = response;
              done();
            });
          });
        });
        it('Response should have 404 status code', () => {
          expect(res.status).to.equal(404);
        });
        it(`Response's '${modelName}' property is expected to be set to 'null'`, () => {
          expect(res.body[modelName]).to.be.null;
        });
        it(`Response should have error(err) message of '${modelName} not found'`, () => {
          expect(res.body.err.toLowerCase()).to.equal(`${modelName} not found`);
        });
      });
    });
  },

  testPostEndPoint: (Model, testCasesWithValidData, testCasesWithInvalidData) => {
    const modelClassName = Model.name;
    const modelName = Model.name.toLowerCase();
    const resourceName = Model.getTableName();
    describe(`POST /${resourceName}`, () => {
      before(done => {
        factory.cleanTable(Model).then(() => {
          done();
        });
      });
      afterEach(done => {
        factory.cleanTable(Model).then(() => {
          done();
        });
      });
      context('If posted data is valid', () => {
        testCasesWithValidData.forEach(testCase => {
          context(testCase.context, () => {
            it(`Response is expected to have status code ${testCase.expectedStatusCode}`, done => {
              chai.request(server).post(`/${resourceName}`).send(testCase.data).end((err, res) => {
                expect(res.status).to.equal(testCase.expectedStatusCode);
                done();
              });
            });
            it(`Response is expected to have 'err' property set to null`, done => {
              chai.request(server).post(`/${resourceName}`).send(testCase.data).end((err, res) => {
                expect(res.body.err).to.be.null;
                done();
              });
            });
            it(`Returned ${modelName} is expected to have ${modelClassName} Model attributes`, done => {
              chai.request(server).post(`/${resourceName}`).send(testCase.data).end((err, res) => {
                expect(self.checkAttributes(res.body[modelName], Model)).to.be.true;
                done();
              });
            });
            it(`Returned ${modelName} in the create response is expected to have the same values as the one returned from selecting it through GET /${resourceName}/:id`, done => {
              chai.request(server).post(`/${resourceName}`).send(testCase.data).end((err, createRes) => {
                chai.request(server).get(`/${resourceName}/${createRes.body[modelName].id}`).end((err, res) => {
                  expect(createRes.body[modelName]).to.eql(res.body[modelName]);
                  done();
                });
              });
            });
          });
        });
      });

      context('If posted data is invalid', () => {
        testCasesWithInvalidData.forEach(testCase => {
          context(testCase.context, () => {
            it(`Response is expected to have status code ${testCase.expectedStatusCode}`, done => {
              chai.request(server).post(`/${resourceName}`).send(testCase.data).end((err, res) => {
                expect(res.status).to.equal(testCase.expectedStatusCode);
                done();
              });
            });
            it(`Response is expected to have '${modelName}' property set to null`, done => {
              chai.request(server).post(`/${resourceName}`).send(testCase.data).end((err, res) => {
                expect(res.body[modelName]).to.be.null;
                done();
              });
            });
            it(`Response is expected to have 'err' property containing '${testCase.expectedError}'`, done => {
              chai.request(server).post(`/${resourceName}`).send(testCase.data).end((err, res) => {
                console.log(res.body.err);
                expect(res.body.err.toLowerCase()).to.contain(testCase.expectedError.toLowerCase());
                done();
              });
            });
            it(`Database is expected to be empty`, done => {
              chai.request(server).post(`/${resourceName}`).send(testCase.data).end((err, resIgnore) => {
                chai.request(server).get(`/${resourceName}/`).end((err, res) => {
                  expect(res.body[modelName].length).to.eql(0);
                  done();
                });
              });
            });
          });
        });
      });
    });
  },

  testPutEndPoint: (Model, testObjectData, testCasesWithValidData, testCasesWithInvalidData) => {
    const modelClassName = Model.name;
    const modelName = Model.name.toLowerCase();
    const resourceName = Model.getTableName();
    let testObjectId = null;
    let res = null;
    let testObject = null;
    describe(`PUT /${resourceName}/:id`, () => {
      before(done => {
        factory.cleanTable(Model).then(() => {
          done();
        });
      });
      after(done => {
        res = null
        factory.cleanTable(Model).then(() => {
          done();
        });
      });

      context(`If the provided ID is not an integer`, () => {
        before(done => {
          res = null;
          factory.cleanTable(Model).then(() => {
            factory.create(modelName).then(object => {
              chai.request(server).put(`/${resourceName}/sdasdasd`).send(testObjectData).end((err, response) => {
                res = response;
                done();
              });
            });
          });
        });
        after(done => {
          factory.cleanTable(Model).then(() => {
            done();
          });
        });
        it('Response should have 400 status code', () => {
          expect(res.status).to.equal(400);
        });
        it(`Response's '${modelName}' property is expected to be set to 'null'`, () => {
          expect(res.body[modelName]).to.be.null;
        });
        it(`Response is expected to have an error(err) message`, () => {
          expect(res.body.err.trim().length).to.be.greaterThan(0);
        });
      });

      context(`If the provided ID is for a non existing ${modelName}`, () => {
        before(done => {
          res = null;
          factory.cleanTable(Model).then(() => {
            chai.request(server).put(`/${resourceName}/1`).send(testObjectData).end((err, response) => {
              res = response;
              done();
            });
          });
        });
        it('Response should have 404 status code', () => {
          expect(res.status).to.equal(404);
        });
        it(`Response's '${modelName}' property is expected to be set to 'null'`, () => {
          expect(res.body[modelName]).to.be.null;
        });
        it(`Response should have error(err) message of '${modelName} not found'`, () => {
          expect(res.body.err.toLowerCase()).to.equal(`${modelName} not found`);
        });
      });

      context(`If the provided ID is for an existing ${modelName}`, () => {
        beforeEach(done => {
          res = null;
          factory.cleanTable(Model).then(() => {
            factory.create(modelName, testObjectData).then(object => {
              testObjectId = object.id;
              testObject = object;
              done();
            });
          });
        });
        context('If posted data is valid', () => {
          testCasesWithValidData.forEach(testCase => {
            context(testCase.context, () => {
              it(`Response is expected to have status code ${testCase.expectedStatusCode}`, done => {
                chai.request(server).put(`/${resourceName}/${testObjectId}`).send(testCase.data).end((err, res) => {
                  expect(res.status).to.equal(testCase.expectedStatusCode);
                  done();
                });
              });
              it(`Response is expected to have 'err' property set to null`, done => {
                chai.request(server).put(`/${resourceName}/${testObjectId}`).send(testCase.data).end((err, res) => {
                  expect(res.body.err).to.be.null;
                  done();
                });
              });
              it(`Returned ${modelName} is expected to have ${modelClassName} Model attributes`, done => {
                chai.request(server).put(`/${resourceName}/${testObjectId}`).send(testCase.data).end((err, res) => {
                  expect(self.checkAttributes(res.body[modelName], Model)).to.be.true;
                  done();
                });
                
              });
              it(`Returned ${modelName} in the update response is expected to have the same values as the one returned from selecting it through GET /${resourceName}/:id`, done => {
                chai.request(server).put(`/${resourceName}/${testObjectId}`).send(testCase.data).end((err, updateRes) => {
                  chai.request(server).get(`/${resourceName}/${updateRes.body[modelName].id}`).end((err, res) => {
                    expect(res.body[modelName]).to.eql(updateRes.body[modelName]);
                    done();
                  });
                });
              });
            });
          });
        });
  
        context('If posted data is invalid', () => {
          testCasesWithInvalidData.forEach(testCase => {
            context(testCase.context, () => {
              it(`Response is expected to have status code ${testCase.expectedStatusCode}`, done => {
                chai.request(server).put(`/${resourceName}/${testObjectId}`).send(testCase.data).end((err, res) => {
                  expect(res.status).to.equal(testCase.expectedStatusCode);
                  done();
                });
                
              });
              it(`Response is expected to have '${modelName}' property set to null`, done => {
                chai.request(server).put(`/${resourceName}/${testObjectId}`).send(testCase.data).end((err, res) => {
                  expect(res.body[modelName]).to.be.null;
                  done();
                });
                
              });
              it(`Response is expected to have 'err' property containing '${testCase.expectedError}'`, done => {
                chai.request(server).put(`/${resourceName}/${testObjectId}`).send(testCase.data).end((err, res) => {
                  console.log(res.body.err);
                  expect(res.body.err.toLowerCase()).to.contain(testCase.expectedError.toLowerCase());
                  done();
                });
              });
              it(`The Returned ${modelName} from requesting GET /${resourceName}/${testObjectId} will be the same as the test object created even after issuing the update request`, done => {
                chai.request(server).put(`/${resourceName}/${testObjectId}`).send(testCase.data).end((err, updateRes) => {
                  chai.request(server).get(`/${resourceName}/${testObjectId}`).end((err, res) => {
                    expect(res.body[modelName]).to.not.eql(testObject);
                    done();
                  });
                });
              });
            });
          });
        });
      });
      
    });
  }
}