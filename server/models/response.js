'use strict';
module.exports = function(sequelize, DataTypes) {
  var Response = sequelize.define('Response', {
    inviteId:DataTypes.INTEGER,
    email:DataTypes.STRING,
    name:DataTypes.STRING,
    availableDate:DataTypes.ARRAY(DataTypes.STRING),
    attend: DataTypes.BOOLEAN,
    chosenBiz: DataTypes.ARRAY(DataTypes.STRING),
    note: DataTypes.STRING,

  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });
  return Response;
};