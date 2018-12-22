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
      it(`Response's body is expected have '${resourceName}' property`, () => {
        expect(res.body[resourceName]).to.not.be.undefined;
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
          expect(res.body[resourceName].length).to.be.greaterThan(0);
        });
        it(`each object in the returned array is expected to have ${modelClassName} Model attributes`, () => {
          res.body[resourceName].forEach(object => {
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
          expect(res.body[resourceName].length).to.be.eql(0);
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
        it('The id of the returned object will equel the one passed in the URL', () => {
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
        it('The id of the returned object will equel the one passed in the URL', () => {
          expect(res.body[modelName].id).to.equal(testObjectId);
        });
        it(`Requesting the deleted ${modelName} will return a response error message of ${modelName} not found`, done => {
          chai.request(server).get(`/${resourceName}/${testObjectId}`).end((err, response) => {
            res = response;
            done();
          });
          expect(res.body.err.toLowerCase()).to.equel(`${modelName} not found`);
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
    let res = null;
    describe(`POST /${resourceName}`, () => {
      before(done => {
        factory.cleanTable(Model).then(() => {
          done();
        });
      });
      afterEach(done => {
        res = null
        factory.cleanTable(Model).then(() => {
          done();
        });
      });
      context('If posted data is valid', () => {
        testCasesWithValidData.forEach(testCase => {
          beforeEach(done => {
            res = null;
            chai.request(server).post(`/${resourceName}`).send(testCase.data).end((err, response) => {
              res = response;
              done();
            });
          });
          context(testCase.context, () => {
            it(`Response is expected to have status code 200`, () => {
              expect(res.status).to.equal(200);
            });
            it(`Response is expected to have 'err' property set to null`, () => {
              expect(res.body.err).to.be.null;
            });
            it(`Returned ${modelName} is expected to have ${modelClassName} Model attributes`, () => {
              expect(self.checkAttributes(res.body[modelName], Model)).to.be.true;
            });
          });
        });
      });

      context('If posted data is invalid', () => {
        testCasesWithInvalidData.forEach(testCase => {
          beforeEach(done => {
            res = null;
            chai.request(server).post(`/${resourceName}`).send(testCase.data).end((err, response) => {
              res = response;
              done();
            });
          });
          context(testCase.context, () => {
            it('Response is expected to have status code 400', () => {
              expect(res.status).to.equal(400);
            });
            it(`Response is expected to have '${modelName}' property set to null`, () => {
              expect(res.body[modelName]).to.be.null;
            });
            it("Response is expected to have its 'err' property set to: " + testCase.expectedMessage.toLowerCase(), () => {
              expect(res.body.err.toLowerCase()).to.equel(testCase.expectedMessage);
            });
          });
        });
      });
    });
  },

  testPutEndPoint: (Model, originalObjectData, testCasesWithValidData, testCasesWithInvalidData) => {
    const modelClassName = Model.name;
    const modelName = Model.name.toLowerCase();
    const resourceName = Model.getTableName();
    let originalObjectId = null;
    let res = null;
    let test
    describe(`PUT /${resourceName}/:id`, () => {
      before(done => {
        factory.cleanTable(Model).then(() => {
          done();
        });
      });
      afterEach(done => {
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
              chai.request(server).put(`/${resourceName}/sdasdasd`).send(originalObjectData).end((err, response) => {
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
            chai.request(server).put(`/${resourceName}/1`).send(originalObjectData).end((err, response) => {
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
        context('If posted data is valid', () => {
          testCasesWithValidData.forEach(testCase => {
            beforeEach(done => {
              res = null;
              factory.cleanTable(Model).then(() => {
                factory.create(modelName, originalObjectData).then(object => {
                  originalObjectId = object.id;
                  chai.request(server).put(`/${resourceName}/${originalObjectId}`).send(testCase.data).end((err, response) => {
                    res = response;
                    done();
                  });
                });
              });
              
            });
            context(testCase.context, () => {
              it(`Response is expected to have status code 200`, () => {
                expect(res.status).to.equal(200);
              });
              it(`Response is expected to have 'err' property set to null`, () => {
                expect(res.body.err).to.be.null;
              });
              it(`Returned ${modelName} is expected to have ${modelClassName} Model attributes`, () => {
                expect(self.checkAttributes(res.body[modelName], Model)).to.be.true;
              });
              it(`Returned ${modelName} in the update response is expected to have the same values as the one returned from selecting it through GET /${resourceName}/${originalObjectId}`, done => {
                let objectFromGetRequest = null;
                chai.request(server).get(`/${resourceName}/${originalObjectData}`).end((err, response) => {
                  objectFromGetRequest = response.body[modelName];
                  done();
                });
                expect(res.body[modelName]).to.eql(objectFromGetRequest);
              });
            });
          });
        });
  
        context('If posted data is invalid', () => {
          testCasesWithInvalidData.forEach(testCase => {
            beforeEach(done => {
              res = null;
              factory.cleanTable(Model).then(() => {
                factory.create(modelName, originalObjectData).then(object => {
                  originalObjectId = object.id;
                  chai.request(server).put(`/${resourceName}/${originalObjectId}`).send(testCase.data).end((err, response) => {
                    res = response;
                    done();
                  });
                });
              });
            });
            context(testCase.context, () => {
              it('Response is expected to have status code 400', () => {
                expect(res.status).to.equal(400);
              });
              it(`Response is expected to have '${modelName}' property set to null`, () => {
                expect(res.body[modelName]).to.be.null;
              });
              it("Response is expected to have its 'err' property set to: " + testCase.expectedMessage.toLowerCase(), () => {
                expect(res.body.err.toLowerCase()).to.equel(testCase.expectedMessage);
              });
              it(`Returned ${modelName} in the update response is expected to not have the same values as the one returned from selecting it through GET /${resourceName}/${originalObjectId}`, done => {
                let objectFromGetRequest = null;
                chai.request(server).get(`/${resourceName}/${originalObjectData}`).end((err, response) => {
                  objectFromGetRequest = response.body[modelName];
                  done();
                });
                expect(res.body[modelName]).to.not.eql(objectFromGetRequest);
              });
            });
          });
        });
      });
      
    });
  }
}