'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Scholarship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Scholarship.hasMany(models.Category, { foreignKey: "scholarships_id" })
      Scholarship.hasMany(models.Country, { foreignKey: "scholarships_id" })
      Scholarship.hasMany(models.Degree, { foreignKey: "scholarships_id" })
      Scholarship.hasMany(models.Document, { foreignKey: "scholarships_id" })
      Scholarship.hasMany(models.FundingType, { foreignKey: "scholarships_id" })
      Scholarship.hasMany(models.Link, { foreignKey: "scholarships_id" })
      Scholarship.hasMany(models.Major, { foreignKey: "scholarships_id" })
      Scholarship.hasMany(models.University, { foreignKey: "scholarships_id" })
    }
  }
  Scholarship.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "name is required" },
        notEmpty: { msg: "name is required" }
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "slug is required" },
        notEmpty: { msg: "slug is required" }
      }
    },
    gpa_scale_4: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    gpa_scale_100: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    is_gpa_special: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    age_minimum: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    age_maximum: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    benefit: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: false
    },
    registration_date: {
      type: DataTypes.DATEONLY,
      defaultValue: null,
    },
    deadline_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: { msg: "deadline is required" },
        notEmpty: { msg: "deadline is required" }
      }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Buka - Updated",
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Scholarship',
  });
  return Scholarship;
};