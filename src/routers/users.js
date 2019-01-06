"use strict";
let express = require("express");
let router = express.Router();
let User = require("../models").User;
let Admin = require("../models").Admin;
let Author = require("../models").Author;
let booksRouter = require("./books").router;

const permittedParameters = [
  "username",
  "email",
  "password",
  "isAuthor",
  "isAdmin"
];

const permitParams = require("./helpers").permitParams;
const authenticate = require("./helpers").authenticate;

const getUsers = (req, res) => {
  let jsonToReturn = {
    users: [],
    err: []
  };
  new Promise((resolve, reject) => {
    User.findAll()
      .then(users => {
        if (users && users.length > 0) {
          res.statusCode = 200;
          jsonToReturn.users = users;
        } else {
          res.statusCode = 404;
          jsonToReturn.err.push("no users found");
        }
        resolve();
      })
      .catch(err => {
        res.statusCode = 400;
        jsonToReturn.err.push(err.message);
        resolve();
      });
  }).finally(() => {
    res.json(jsonToReturn);
  });
};

const getUser = (req, res) => {
  let jsonToReturn = {
    user: null,
    err: []
  };
  let query = { where: { id: req.params.id } };
  new Promise((resolve, reject) => {
    User.findOne(query)
      .then(user => {
        if (user) {
          res.statusCode = 200;
          jsonToReturn.user = user.toJSON();
        } else {
          res.statusCode = 404;
          jsonToReturn.err.push("user not found");
        }
        resolve();
      })
      .catch(err => {
        res.statusCode = 400;
        jsonToReturn.err.push(err.message);
        resolve();
      });
  }).finally(() => {
    res.json(jsonToReturn);
  });
};

const createUser = (req, res) => {
  let jsonToReturn = {
    user: null,
    err: []
  };
  let tempUser = null;
  Promise.resolve(true)
    .then(result => {
      if (permitParams(req.body, permittedParameters)) {
        return Promise.resolve(true);
      } else {
        res.statusCode = 400;
        jsonToReturn.err.push(
          "Your request contains unpermitted attributes. Permitted attributes for the requested route are: " +
            permittedParameters
        );
        return Promise.resolve(false);
      }
    })
    .then(result => {
      if (result) {
        return new Promise((resolve, reject) => {
          User.create(req.body)
            .then(user => {
              tempUser = user;
              resolve(true);
            })
            .catch(err => {
              res.statusCode = 400;
              jsonToReturn.err.push(err.message);
              resolve(false);
            });
        });
      } else {
        return Promise.resolve(false);
      }
    })
    .then(result => {
      if (result) {
        if (req.body.hasOwnProperty("isAuthor") && req.body.isAuthor === true) {
          return new Promise((resolve, reject) => {
            Author.create({ id: tempUser.id })
              .then(author => {
                resolve(true);
              })
              .catch(err => {
                res.statusCode = 400;
                jsonToReturn.err.push(err.message);
                resolve(false);
              });
          });
        } else {
          return Promise.resolve(true);
        }
      } else {
        return Promise.resolve(false);
      }
    })
    .then(result => {
      if (result) {
        if (req.body.hasOwnProperty("isAdmin") && req.body.isAdmin === true) {
          return new Promise((resolve, reject) => {
            Admin.create({ id: tempUser.id })
              .then(admin => {
                resolve(true);
              })
              .catch(err => {
                res.statusCode = 400;
                jsonToReturn.err.push(err.message);
                resolve(false);
              });
          });
        } else {
          return Promise.resolve(true);
        }
      } else {
        return Promise.resolve(false);
      }
    })
    .then(result => {
      if (result) {
        return new Promise((resolve, reject) => {
          User.findByPk(tempUser.id)
            .then(user => {
              if (user) {
                res.statusCode = 201;
                jsonToReturn.user = user.toJSON();
                resolve(true);
              } else {
                res.statusCode = 400;
                jsonToReturn.err.push(
                  "something went really wrong while creating this user, could not get the created user"
                );
                resolve(false);
              }
            })
            .catch(err => {
              res.statusCode = 400;
              jsonToReturn.err.push(
                "something went really wrong while creating this user, could not get the created user"
              );
              resolve(false);
            });
        });
      } else {
        return Promise.resolve(false);
      }
    })
    .then(result => {
      if (!result) {
        jsonToReturn.user = null;
        if (tempUser) {
          return new Promise((resolve, reject) => {
            User.destroy({ where: { id: tempUser.id } })
              .then(() => {
                resolve();
              })
              .catch(err => {
                res.statusCode = 400;
                jsonToReturn.err.push(err.message);
                resolve();
              });
          });
        }
      }
    })
    .finally(() => {
      res.json(jsonToReturn);
    });
};

const updateUser = (req, res) => {
  let jsonToReturn = {
    user: null,
    err: []
  };
  let tempUser = null;
  let query = { where: { id: req.params.id } };
  Promise.resolve(true)
    .then(result => {
      if (permitParams(req.body, permittedParameters)) {
        return Promise.resolve(true);
      } else {
        res.statusCode = 400;
        jsonToReturn.err.push(
          "Your request contains unpermitted attributes. Permitted attributes for the requested route are: " +
            permittedParameters
        );
        return Promise.resolve(false);
      }
    })
    .then(result => {
      if (result) {
        return new Promise((resolve, reject) => {
          User.findOne(query)
            .then(user => {
              if (user) {
                tempUser = user;
                resolve(true);
              } else {
                res.statusCode = 404;
                jsonToReturn.err.push("user not found");
                resolve(false);
              }
            })
            .catch(err => {
              res.statusCode = 400;
              jsonToReturn.err.push(err.message);
              resolve(false);
            });
        });
      } else {
        return Promise.reject(false);
      }
    })
    .then(result => {
      if (result) {
        return new Promise((resolve, reject) => {
          tempUser
            .update(req.body)
            .then(() => {
              resolve(true);
            })
            .catch(err => {
              res.statusCode = 400;
              jsonToReturn.err.push(err.message);
              resolve(false);
            });
        });
      } else {
        return Promise.reject(false);
      }
    })
    .then(result => {
      if (result) {
        if (req.body.hasOwnProperty("isAuthor")) {
          if (tempUser.Author === null && req.body.isAuthor === true) {
            return new Promise((resolve, reject) => {
              Author.create({ id: tempUser.id })
                .then(author => {
                  resolve(true);
                })
                .catch(err => {
                  res.statusCode = 400;
                  jsonToReturn.err.push(err.message);
                  resolve(false);
                });
            });
          } else if (tempUser.Author !== null && req.body.isAuthor === false) {
            return new Promise((resolve, reject) => {
              Author.destroy({ where: { id: tempUser.id } })
                .then(() => {
                  resolve(true);
                })
                .catch(err => {
                  res.statusCode = 400;
                  jsonToReturn.err.push(err.message);
                  resolve(false);
                });
            });
          } else {
            return Promise.resolve(true);
          }
        } else {
          return Promise.resolve(true);
        }
      } else {
        return Promise.reject(false);
      }
    })
    .then(result => {
      if (result) {
        if (req.body.hasOwnProperty("isAdmin")) {
          if (tempUser.Admin === null && req.body.isAdmin === true) {
            return new Promise((resolve, reject) => {
              Admin.create({ id: tempUser.id })
                .then(admin => {
                  resolve(true);
                })
                .catch(err => {
                  res.statusCode = 400;
                  jsonToReturn.err.push(err.message);
                  resolve(false);
                });
            });
          } else if (tempUser.Admin !== null && req.body.isAdmin === false) {
            return new Promise((resolve, reject) => {
              Admin.destroy({ where: { id: tempUser.id } })
                .then(() => {
                  resolve(true);
                })
                .catch(err => {
                  res.statusCode = 400;
                  jsonToReturn.err.push(err.message);
                  resolve(false);
                });
            });
          } else {
            return Promise.resolve(true);
          }
        } else {
          return Promise.resolve(true);
        }
      } else {
        return Promise.reject(false);
      }
    })
    .then(result => {
      if (result) {
        return new Promise((resolve, reject) => {
          User.findByPk(tempUser.id)
            .then(user => {
              if (user) {
                res.statusCode = 200;
                jsonToReturn.user = user.toJSON();
                resolve(true);
              } else {
                res.statusCode = 400;
                jsonToReturn.user = null;
                jsonToReturn.err.push(
                  "user not found, something went really wrong while updating this user"
                );
                resolve(false);
              }
            })
            .catch(err => {
              res.statusCode = 400;
              jsonToReturn.user = null;
              jsonToReturn.err.push(err.message);
              resolve(false);
            });
        });
      } else {
        jsonToReturn.user = null;
        return Promise.reject(false);
      }
    })
    .finally(() => {
      res.json(jsonToReturn);
    });
};

const deleteUser = (req, res) => {
  let userToReturn = null;
  let jsonToReturn = {
    user: null,
    err: []
  };
  let query = { where: { id: req.params.id } };
  new Promise((resolve, reject) => {
    User.findOne(query)
      .then(user => {
        if (user) {
          user
            .destroy()
            .then(() => {
              res.statusCode = 200;
              userToReturn = user.toJSON();
              jsonToReturn.user = userToReturn;
              resolve();
            })
            .catch(err => {
              res.statusCode = 400;
              jsonToReturn.err.push(err.message);
              resolve();
            });
        } else {
          res.statusCode = 404;
          jsonToReturn.err.push("user not found");
          resolve();
        }
      })
      .catch(err => {
        res.statusCode = 400;
        jsonToReturn.err.push(err.message);
        resolve();
      });
  }).finally(() => {
    res.json(jsonToReturn);
  });
};

const getRouter = passport => {
  router.get("/", authenticate([["isAdmin"]], passport), getUsers);
  router.get(
    "/:id",
    authenticate([["isAdmin"], ["sameUser"]], passport),
    getUser
  );
  router.post("/", authenticate([["isAdmin"]], passport), createUser);
  router.patch(
    "/:id",
    authenticate(
      [
        ["isAdmin", "notTargetingAdmin"],
        ["sameUser", "notChangingIsAdmin", "notChangingIsAuthor"]
      ],
      passport
    ),
    updateUser
  );
  router.put(
    "/:id",
    authenticate(
      [
        ["isAdmin", "notTargetingAdmin"],
        ["sameUser", "notChangingIsAdmin", "notChangingIsAuthor"]
      ],
      passport
    ),
    updateUser
  );
  router.delete(
    "/:id",
    authenticate([["isAdmin", "notTargetingAdmin"]], passport),
    deleteUser
  );

  router.use("/:authorId/books", booksRouter(passport));
  return router;
};

module.exports = {
  router: getRouter,
  getUsers: getUsers,
  getUser: getUser,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser
};
