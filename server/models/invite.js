'use strict';
module.exports = function(sequelize, DataTypes) {
  var Invite = sequelize.define('Invite', {
    userID:DataTypes.INTEGER,
    host:DataTypes.STRING,
    title: DataTypes.STRING,
    desc: DataTypes.STRING,
    dateStart: DataTypes.STRING,
    dateEnd: DataTypes.STRING,
    yelpBiz: DataTypes.ARRAY(DataTypes.STRING),
    yelpBizName: DataTypes.ARRAY(DataTypes.STRING)

  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });
  return Invite;
};