'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Thread extends Model {
    static associate(models) {
      Thread.belongsTo(models.User, {foreignKey: 'UserId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
      Thread.hasMany(models.Comment, {foreignKey: 'ThreadId'})
      Thread.hasMany(models.BookmarkThread, {foreignKey: 'ThreadId'})
    }
  }
  Thread.init({
    UserId: DataTypes.INTEGER,
    like: DataTypes.INTEGER,
    dislike: DataTypes.INTEGER,
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg : "Title is required"
        },
        notEmpty: {
          msg : "Title is required"
        }
      }
    },
    slug :{
      type: DataTypes.STRING,
    },
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
    },
    isActive: DataTypes.BOOLEAN
  }, {
    hooks: {
      beforeCreate: (el) => {
        el.slug = el.title.toLowerCase().replace(/[^a-z0-9\s]+/g, '').replaceAll(' ','-')
        el.like = el.dislike = 0
        el.isActive = true
      }
    },
    sequelize,
    modelName: 'Thread',
  });
  return Thread;
};