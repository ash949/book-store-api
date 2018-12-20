
const FactoryGirl = require('factory-girl');
const fs = require('fs');
const path = require('path');

process.env.NODE_ENV = 'test';

const factory = FactoryGirl.factory;
const adapter = new FactoryGirl.SequelizeAdapter();

factory.setAdapter(adapter);

let factoriesFiles = fs.readdirSync(__dirname);
for (let i = 0; i < factoriesFiles.length; i++){
  if(factoriesFiles[i] === path.basename(__filename)){
    continue;
  }else{
    require(path.join(__dirname, factoriesFiles[i]))(factory);
  } 
}

factory.cleanTable = (Model) => {
  return Model.destroy({where: {}});
};

module.exports = factory;
