process.env.NODE_ENV = 'test';
const Category = require('../../src/models').Category;
const expectToHaveErrorMesssage = require('../helpers').expectToHaveErrorMesssage;
const testGetAllEndPoint = require('../helpers').testGetAllEndPoint;
const testGetOneEndPoint = require('../helpers').testGetOneEndPoint;
const testPostEndPoint = require('../helpers').testPostEndPoint;
const testPutEndPoint = require('../helpers').testPutEndPoint;
const testDeleteEndPoint = require('../helpers').testDeleteEndPoint;
const attributes = require('../../db/schemas/category').getAttributes(
  require('sequelize')
);

testGetAllEndPoint(Category);

testGetOneEndPoint(Category);

testPostEndPoint(Category, [
  {
    expectedStatusCode: 201,
    context: "If posted object contains only 'name' property and contains a (1 <= length <= 30) string",
    data: { name: "comedy" }
  }
], [
  {
    expectedStatusCode: 400,
    context: "If posted data is empty object",
    expectedError: 'notNull Violation',
    data: {}
  },
  {
    expectedStatusCode: 400,
    context: "If posted category.name is empty string",
    expectedError: attributes.name.validate.notEmpty.msg,
    data: { name: '   ' }
  },
  {
    expectedStatusCode: 400,
    context: "If posted category.name is an array",
    expectedError: 'string violation',
    data: { name: {aa: 'sd'} }
  },
  {
    expectedStatusCode: 400,
    context: "If posted category.name is an object",
    expectedError: 'string violation',
    data: { name: {aa: 'sd'} }
  },
  {
    expectedStatusCode: 400,
    context: "If posted category.name's length > 30",
    expectedError: attributes.name.validate.len.msg,
    data: { name: 'a'.repeat(40) }
  },
  {
    expectedStatusCode: 400,
    context: "If posted data contains unpermitted attributes",
    expectedError: 'Your request contains unpermitted attributes',
    data: { name: 'I am allowed', attr: 'I am not allowed' }
  },
  {
    expectedStatusCode: 400,
    context: "If posted data contains 'createdAt' attribute",
    expectedError: 'Your request contains unpermitted attributes',
    data: { name: 'I am allowed', createdAt: Date.now() }
  },
  {
    expectedStatusCode: 400,
    context: "If posted data contains 'updatedAt' attribute",
    expectedError: 'Your request contains unpermitted attributes',
    data: { name: 'I am allowed', updatedAt: Date.now() }
  },
  {
    expectedStatusCode: 400,
    context: "If posted data contains 'id' attribute",
    expectedError: 'Your request contains unpermitted attributes',
    data: { name: 'I am allowed', id: 123 }
  },
]);

testPutEndPoint(Category, { name: 'comedy' }, 
[
  {
    expectedStatusCode: 200,
    context: "If posted data contains 'name' property only and which has a (1 <= length <= 30) string",
    data: { name: 'comedy_new' }
  },
  {
    expectedStatusCode: 200,
    context: "If posted data is empty object",
    data: {}
  },
  {
    expectedStatusCode: 200,
    context: "If posted data contains 'name' property only and has the same data as the old 'name' value",
    data: { name: 'comedy' }
  }
], [
  {
    expectedStatusCode: 400,
    context: `If posted category name is empty string`,
    expectedError: attributes.name.validate.notEmpty.msg,
    data: { name: '   ' }
  },
  {
    expectedStatusCode: 400,
    context: "If posted category name's length > 30",
    expectedError: attributes.name.validate.len.msg,
    data: { name: 'a'.repeat(40) }
  },
  {
    expectedStatusCode: 400,
    context: "If posted category.name is an array",
    expectedError: 'string violation',
    data: { name: {aa: 'sd'} }
  },
  {
    expectedStatusCode: 400,
    context: "If posted category.name is an object",
    expectedError: 'string violation',
    data: { name: {aa: 'sd'} }
  },
  {
    expectedStatusCode: 400,
    context: "If posted data contains unpermitted attributes",
    expectedError: 'Your request contains unpermitted attributes',
    data: { name: 'I am allowed', attr: 'I am not allowed' }
  },
  {
    expectedStatusCode: 400,
    context: "If posted data contains 'createdAt' attribute",
    expectedError: 'Your request contains unpermitted attributes',
    data: { name: 'I am allowed', createdAt: Date.now() }
  },
  {
    expectedStatusCode: 400,
    context: "If posted data contains 'updatedAt' attribute",
    expectedError: 'Your request contains unpermitted attributes',
    data: { name: 'I am allowed', updatedAt: Date.now() }
  },
  {
    expectedStatusCode: 400,
    context: "If posted data contains 'id' attribute",
    expectedError: 'Your request contains unpermitted attributes',
    data: { name: 'I am allowed', id: 123 }
  }
]);

testDeleteEndPoint(Category);