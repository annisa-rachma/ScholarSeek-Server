'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userSchool extends Model {
    static associate(models) {
      userSchool.belongsTo(models.User, {foreignKey: 'UserId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    }
  }
  userSchool.init({
    UserId: DataTypes.INTEGER,
    school: DataTypes.STRING,
    major: DataTypes.STRING,
    scholarship: DataTypes.STRING,
    year: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'userSchool',
  });
  return userSchool;
};