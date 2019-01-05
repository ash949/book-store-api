let passport = require('passport');
let JwtStrategy = require('passport-jwt').Strategy;
let JwtExtractor = require('passport-jwt').ExtractJwt;
const secret = require('../../config/auth').secret;
let User = require('../models').User;

let options = {
  jwtFromRequest: JwtExtractor.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
  passReqToCallback: true
};

const getUserIdFromURL = (url) => {
  const urlFragments = url.split('/');    
  let idToCheck = -1;
  try {
    let index = urlFragments.indexOf('users') + 1;
    idToCheck = parseInt(urlFragments[index])
    if(index === 0 || !Number.isInteger( idToCheck )){
      throw new Error('no user id found in the url');
    }
    return idToCheck;
  } catch (error) {
    return -1;
  }
}

const gaurds = {
  isUser: (payload, req) => {
    return result => {
      if(result){
        return new Promise((resolve, reject) => {
          console.log('isUser gaurd is checking');
          User.scope('withPassword').findOne({where: {id: payload.id}})
          .then(user => {
            user = user.toJSON();
            if (user && (payload.email === user.email) && (payload.password === user.password)) {
              console.log('isUser: passed');
              resolve(true);
            } else {
              console.log('isUser: blocked');
              resolve(false);
            }
          })
          .catch(() => {
            console.log('isUser: blocked');
            resolve(false);
          });
        });
      }else{
        console.log('isUser: skipped');
        return Promise.resolve(false);
      }
    }
  },
  notChangingIsAuthor: (payload, req) => {
    return result => {
      if(result){
        return new Promise((resolve, reject) => {
          console.log('notChangingIsAuthor gaurd is checking');
          if(req.body.hasOwnProperty('isAuthor')){
            console.log('notChangingIsAuthor: blocked');
            resolve(false);
          }else{
            console.log('notChangingIsAuthor: passed');
            resolve(true);
          }
        });
      }else{
        console.log('notChangingIsAuthor: skipped');
        return Promise.resolve(false);
      }
    }
  },
  notChangingIsAdmin: (payload, req) => {
    return result => {
      if(result){
        return new Promise((resolve, reject) => {
          console.log('notChangingIsAdmin gaurd is checking');
          if(req.body.hasOwnProperty('isAdmin')){
            console.log('notChangingIsAdmin: blocked');
            resolve(false);
          }else{
            console.log('notChangingIsAdmin: passed');
            resolve(true);
          }
        });
      }else{
        console.log('notChangingIsAdmin: skipped');
        return Promise.resolve(false);
      }
    }
  },
  isAuthor: (payload, req) => {
    return result => {
      if(result){
        return new Promise((resolve, reject) => {
          console.log('isAuthor gaurd is checking');
          if(payload.Author){
            console.log('isAuthor: passed');
            resolve(true);
          }else{
            console.log('isAuthor: blocked');
            resolve(false);
          }
        });
      }else{
        console.log('isAuthor: skipped');
        return Promise.resolve(false);
      }
    }
  },
  isAdmin: (payload, req) => {
    return result => {
      if(result){
        return new Promise((resolve, reject) => {
          console.log('isAdmin gaurd is checking');
          if(payload.Admin){
            console.log('isAdmin: passed');
            resolve(true);
          }else{
            console.log('isAdmin: blocked');
            resolve(false);
          }
        });
      }else{
        console.log('isAdmin: skipped');
        return Promise.resolve(false);
      }
    }
  },
  notTargetingAdmin: (payload, req) => {
    return result => {
      if(result){
        return new Promise((resolve, reject) => {
          console.log('notTargetingAdmin gaurd is checking');
          const idToCheck = getUserIdFromURL(req.originalUrl);
          console.log(idToCheck);
          if(idToCheck !== -1){
            
            User.findByPk(idToCheck).then(urlUser => {
              
              if(urlUser && urlUser.Admin && urlUser.id !== payload.id){
                console.log('notTargetingAdmin: blocked');
                resolve(false);
              }else{
                console.log('notTargetingAdmin: passed');
                resolve(true);
              }
            }).catch(() => {
              console.log('notTargetingAdmin: blocked');
              resolve(false);
            });
          }else{
            console.log('notTargetingAdmin: blocked');
            resolve(false);
          }
        });
      }else{
        console.log('notTargetingAdmin: skipped');
        return Promise.resolve(false);
      }
    }
  },
  sameUser: (payload, req) => {
    return result => {
      if(result){
        return new Promise((resolve, reject) => {
          console.log('sameUser gaurd is checking');
          const idToCheck = getUserIdFromURL(req.originalUrl);
          if(idToCheck !== -1){
            User.findByPk(idToCheck).then(urlUser => {
              if(urlUser && (urlUser.id === payload.id) ){
                console.log('sameUser: passed');
                resolve(true);
              }else{
                console.log('sameUser: blocked');
                resolve(false);
              }
            }).catch(() => {
              console.log('sameUser: blocked');
              resolve(false);
            });
          }else{
            console.log('sameUser: blocked');
            resolve(false);
          }
        });
      }else{
        console.log('sameUser: skipped');
        return Promise.resolve(false);
      }
    }
  },
  
}

passport.use('auth', new JwtStrategy(options, (req, payload, done) => {
  let gaurdPaths = req.auth.gaurdPaths;
  let paths = [];
  let pass = false;
  let gaurdsPromises = [];
  console.log('chaining: isUser - The mandatory starting gaurd' );
  gaurdsPromises.push(gaurds.isUser(payload, req));
  for (let i = 0; i < gaurdPaths.length; i++) {
    let gaurdPath = gaurdPaths[i];
    for (let j = 0; j < gaurdPath.length; j++) {
      let gaurdName = gaurdPath[j];
      console.log('chaining: ' + gaurdName);
      gaurdsPromises.push(gaurds[gaurdName](payload, req));
    }
    
    if(i < (gaurdPaths.length - 1) ){
      console.log("chaining: (" + gaurdPath + ") path's ending reslove" );
      gaurdsPromises.push(result => {
        pass = result;
        if(pass){
          return Promise.resolve(false);
        }else{
          return Promise.resolve(true);
        }
      });
      console.log('chaining: isUser - for the next path' );
      gaurdsPromises.push(gaurds.isUser(payload, req));
    }
  }
  console.log('chaining: the final task' );
  gaurdsPromises.push(result => {
    if(pass !== true){
      pass = result;
    }
  });
  
  gaurdsPromises.reduce((gaurdChain, task) => {
    console.log(task.name + '*');
    return gaurdChain.then(task);
  }, Promise.resolve(true))
  .finally(() => {
    if(pass){
      console.log('There is a path that has been resolved');
      console.log('===========================================================');
      return done(null, payload);
    }else{
      console.log('All paths are rejected');
      console.log('===========================================================');
      return done(null, false);
    }
  });
}));

module.exports = passport;
