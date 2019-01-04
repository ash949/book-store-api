module.exports = {
  permitParams: (object, permittedParameters) => {
    objectAttrs = Object.keys(object);
    for (let i = 0; i < objectAttrs.length; i++) {
      if( !(permittedParameters.includes(objectAttrs[i])) ){
        return false;
      }
    }
    return true;
  },
  respnondWithError: (res, jsonToReturn, statusCode, error) => {
    res.statusCode = statusCode;
    jsonToReturn.err = error;
    res.json(jsonToReturn);
  },
  respnondWithSuccess: (res, jsonToReturn, statusCode, object, modelName) => {
    res.statusCode = statusCode;
    jsonToReturn[modelName] = object;
    res.json(jsonToReturn);
  },
  respnondWithSuccessAndError: (res, jsonToReturn, statusCode, object, modelName, error) => {
    res.statusCode = statusCode;
    jsonToReturn[modelName] = object;
    jsonToReturn.err = error;
    res.json(jsonToReturn);
  },
  isAdmin: (req) => {
    if(req.hasOwnProperty('user') && req.user.Admin){
      return true;
    }else{
      return false;
    }
  },
  isAuthor: (req) => {
    if(req.hasOwnProperty('user') && req.user.Author){
      return true;
    }else{
      return false;
    }
  },
  isSameToLoggedInUser: (req, user) => {
    if(req.hasOwnProperty('user') && req.user.id == user.id){
      return true;
    }else{
      return false;
    }
  },
  authenticate: (gaurds, passport) => {
    return (req, res, next) => {
      delete req.auth;
      req.auth = {};
      delete req.auth.gaurdPaths;
      req.auth.gaurdPaths = gaurds;
      passport.authenticate('auth', { session: false })(req, res, next);
    }
  }
};