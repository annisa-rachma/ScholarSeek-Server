'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MentoringSessions extends Model {
    static associate(models) {
      MentoringSessions.belongsTo(models.User, {foreignKey: 'UserId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
      MentoringSessions.belongsTo(models.Mentoring, {foreignKey: 'MentoringId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})

    }
  }
  MentoringSessions.init({
    UserId: DataTypes.INTEGER,
    MentoringId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MentoringSessions',
  });
  return MentoringSessions;
};