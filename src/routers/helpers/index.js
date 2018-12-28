module.exports = {
  permitParams: (object, permittedParameters) => {
    objectAttrs = Object.keys(object);
    for (let i = 0; i < objectAttrs.length; i++) {
      if( !(permittedParameters.includes(objectAttrs[i])) ){
        return false;
      }
    }
    return true;
  }
};