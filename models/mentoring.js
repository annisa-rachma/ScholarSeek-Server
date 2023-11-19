'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mentoring extends Model {
    static associate(models) {
      Mentoring.belongsTo(models.User, {foreignKey: 'CreatorId', onDelete: 'CASCADE', onUpdate: 'CASCADE'})
      Mentoring.hasMany(models.MentoringSessions, {foreignKey: 'MentoringId'})
    }
  }
  Mentoring.init({
    CreatorId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    schedule: DataTypes.DATE,
    hour: DataTypes.TIME,
    status: DataTypes.STRING,
    quota: DataTypes.INTEGER,
    room: DataTypes.STRING,
    topik: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    sequelize,
    modelName: 'Mentoring',
  });
  return Mentoring;
};