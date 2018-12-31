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
  }
};