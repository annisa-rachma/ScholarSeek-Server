'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookmarkThread extends Model {
    static associate(models) {
      BookmarkThread.belongsTo(models.Thread, {foreignKey: 'ThreadId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
      BookmarkThread.belongsTo(models.User, {foreignKey: 'UserId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    }
  }
  BookmarkThread.init({
    UserId: DataTypes.INTEGER,
    ThreadId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BookmarkThread',
  });
  return BookmarkThread;
};