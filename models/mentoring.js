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
    slug:DataTypes.STRING,
    schedule: DataTypes.DATE,
    hour: DataTypes.TIME,
    status: DataTypes.STRING,
    quota: DataTypes.INTEGER,
    room: DataTypes.STRING,
    topik: DataTypes.ARRAY(DataTypes.STRING),
    imageUrl : DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (el) => {
        el.slug = el.title.toLowerCase().split(' ').join('-')
        // if()
      }
    },
    sequelize,
    modelName: 'Mentoring',
  });
  return Mentoring;
};