'use strict';
module.exports = function(sequelize, DataTypes) {
  var Invite = sequelize.define('Invite', {
    userID:DataTypes.INTEGER,
    title: DataTypes.STRING,
    desc: DataTypes.STRING,
    dateStart: DataTypes.DATE,
    dateEnd: DataTypes.DATE,
    foodType: DataTypes.STRING,
    yelpBiz: DataTypes.STRING,

  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });
  return Invite;
};