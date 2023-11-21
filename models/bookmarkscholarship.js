'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookmarkScholarship extends Model {
    static associate(models) {
      BookmarkScholarship.belongsTo(models.User, {foreignKey: 'UserId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
      BookmarkScholarship.belongsTo(models.Scholarship, {foreignKey: 'ScholarshipId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    }
  }
  BookmarkScholarship.init({
    UserId: DataTypes.INTEGER,
    ScholarshipId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BookmarkScholarship',
  });
  return BookmarkScholarship;
};