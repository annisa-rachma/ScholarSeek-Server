'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, {foreignKey: 'UserId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
      Comment.belongsTo(models.Thread, {foreignKey: 'ThreadId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    }
  }
  Comment.init({
    UserId: DataTypes.INTEGER,
    ThreadId: DataTypes.INTEGER,
    like: DataTypes.INTEGER,
    dislike: DataTypes.INTEGER,
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg : "Content is required"
        },
        notEmpty: {
          msg : "Content is required"
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: (el) => {
        el.like = el.dislike = 0
        el.status = 'active' //lainnya archived
      }
    },
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};