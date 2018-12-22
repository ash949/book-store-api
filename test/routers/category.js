
const Category = require('../../src/models').Category;
const testGetAllEndPoint = require('../helpers').testGetAllEndPoint;
const testGetOneEndPoint = require('../helpers').testGetOneEndPoint;
const testPostEndPoint = require('../helpers').testPostEndPoint;
const testPutEndPoint = require('../helpers').testPutEndPoint;
const testDeleteEndPoint = require('../helpers').testDeleteEndPoint;

testGetAllEndPoint(Category);

testGetOneEndPoint(Category);

testPostEndPoint(Category, [], []);

testPutEndPoint(Category, {name: 'comedy'}, [], []);

testDeleteEndPoint(Category);


// describe('POST /categories', () => {
//   let testsCasesToFail = [
//     {
//       context: "If posted data is empty object",
//       expectedMessage: 'category name cannot be null',
//       data: {}
//     },
//     {
//       context: "If posted category.name is empty string",
//       expectedMessage: 'category name cannot be empty',
//       data: { name: '   '}
//     },
//     {
//       context: "If posted category.name is a number",
//       expectedMessage: 'category name must be a string',
//       data: { name: 123 }
//     },
//     {
//       context: "If posted category.name's length > 30",
//       expectedMessage: "category name's max length is 30",
//       data: { name: 'a'.repeat(40) }
//     },
//     {
//       context: "If posted object has an unpermitted property",
//       expectedMessage: 'posted data contain unpermitted content',
//       data: { name: 'comedy', unpermitted_data: 'text' }
//     },
//   ];

//   let validCategoryData = { name: "comedy" };

//   let res = null;
//   context("If posted object contains only 'name' property and contains a (1 <= length <= 30) string", () => {
//     before(done => {
//       res = null;
//       postCategoryData(Category, validCategoryData, server).then(response => {
//         res = response;
//         done();
//       });
//     });
//     after(done => {
//       factory.cleanTable(Category).then(() => {
//         done();
//       });
//     });
//     it("Response is expected to have 'category' property", () => {
//       expect(res.body["category"]).to.not.be.undefined;
//     });
//     context("If category name is not already registered", () => {
//       it('Response is expected to have status code 201', () => {
//         expect(res.status).to.equal(201);
//       });
//       it("Response is expected to have an object assigned to `category` property and has the attributes of Category Model", () => {
//         expect(checkAttributes(res.body.category, Category)).to.be.true;
//       });
//     });
    
//     context("If category name is already registered", () => {
//       before(done => {
//         res = null;
//         postCategoryData(Category, validCategoryData, server).then(response => {
//           res = response;
//           done();
//         });
//       });

//       it('Response is expected to have status code 400', () => {
//         expect(res.status).to.equal(400);
//       });
//       it("Response is expected to have 'category' property set to null", () => {
//         expect(res.body.category).to.be.null;
//       });
//       it("Response is expected to have 'err' property set to 'posted category name is already registered'", () => {
//         expect(res.body.err.toLowerCase()).to.equal('category name is already registered');
//       });
//     });
//   });

//   context('If posted data is invalid', () => {
//     testsCasesToFail.forEach(testCase => {
//       context(testCase.context, () => {
//         before(done => {
//           res = null;
//           postCategoryData(Category, testCase.data, server).then(response => {
//             res = response;
//             done();
//           });
//         });
//         after(done => {
//           factory.cleanTable(Category).then(() => {
//             done();
//           });
//         });
//         it('Response is expected to have status code 400', () => {
//           expect(res.status).to.equal(400);
//         });
//         it("Response is expected to have 'category' property set to null", () => {
//           expect(res.body.category).to.be.null;
//         });
//         it("Response is expected to have its 'err' property set to: " + testCase.expectedMessage.toLowerCase(), () => {
//           expect(res.body.err.toLowerCase()).to.equel(testCase.expectedMessage);
//         });
//       });
//     });
//   });
  
// });































// const HttpVerb = 'PATCH';
// const Model = Category;







// let testCasesWithInvalidUpdateData = [
//   {
//     expectedStatusCode: 400,
//     context: `If posted category name is empty string`,
//     expectedErrorMessage: 'category name cannot be empty',
//     data: { name: '   '}
//   },
//   {
//     expectedStatusCode: 400,
//     context: "If posted category name is a number",
//     expectedErrorMessage: 'category name must be a string',
//     data: { name: 123 }
//   },
//   {
//     expectedStatusCode: 400,
//     context: "If posted category name's length > 30",
//     expectedErrorMessage: "category name's max length allowed is 30",
//     data: { name: 'a'.repeat(40) }
//   },
//   {
//     expectedStatusCode: 400,
//     context: "If posted data has an unpermitted properties",
//     expectedErrorMessage: 'posted data contain unpermitted properties',
//     data: { name: 'comedy_new', unpermitted_data: 'text' }
//   }
// ];

// let testCasesWithValidUpdateData = [
//   {
//     expectedStatusCode: 200,
//     context: "If posted data contains 'name' property only and which has a (1 <= length <= 30) string",
//     data: { name: 'comedy_new' }
//   },
//   {
//     expectedStatusCode: 200,
//     context: "If posted data is empty object",
//     data: {}
//   },
//   {
//     expectedStatusCode: 200,
//     context: "If posted data contains 'name' property only and has the same data as the old 'name' value",
//     data: { name: 'comedy' }
//   }
// ];


// require('../helpers').testRestFulEndPount(
//   'PATCH',
//   Category,
//   testCasesWithValidUpdateData,
//   testCasesWithInvalidUpdateData
// );




// describe('DELETE /categories/:id', () => {});



    // let testCasesWithInvalidUpdateData = [
    //   {
    //     expectedStatusCode: 400,
    //     context: `If posted category name is empty string`,
    //     expectedErrorMessage: 'category name cannot be empty',
    //     data: { name: '   '}
    //   },
    //   {
    //     expectedStatusCode: 400,
    //     context: "If posted category name is a number",
    //     expectedErrorMessage: 'category name must be a string',
    //     data: { name: 123 }
    //   },
    //   {
    //     expectedStatusCode: 400,
    //     context: "If posted category name's length > 30",
    //     expectedErrorMessage: "category name's max length allowed is 30",
    //     data: { name: 'a'.repeat(40) }
    //   },
    //   {
    //     expectedStatusCode: 400,
    //     context: "If posted data has an unpermitted properties",
    //     expectedErrorMessage: 'posted data contain unpermitted properties',
    //     data: { name: 'comedy_new', unpermitted_data: 'text' }
    //   }
    // ];

    // let testCasesWithValidUpdateData = [
    //   {
    //     expectedStatusCode: 200,
    //     context: "If posted data contains 'name' property only and which has a (1 <= length <= 30) string",
    //     data: { name: 'comedy_new' }
    //   },
    //   {
    //     expectedStatusCode: 200,
    //     context: "If posted data is empty object",
    //     data: {}
    //   },
    //   {
    //     expectedStatusCode: 200,
    //     context: "If posted data contains 'name' property only and has the same data as the old 'name' value",
    //     data: { name: 'comedy' }
    //   }
    // ];
    // describe('DELETE /categories/:id', () => {});