"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Scholarship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Scholarship.init(
    {
      name: DataTypes.STRING,
      isFullyFunded: DataTypes.BOOLEAN,
      registrationOpen: DataTypes.DATEONLY,
      registrationDeadline: DataTypes.DATEONLY,
      isOpen: DataTypes.BOOLEAN,
      description: DataTypes.TEXT,
      university: DataTypes.ARRAY(DataTypes.STRING),
      major: DataTypes.ARRAY(DataTypes.STRING),
      benefit: DataTypes.ARRAY(DataTypes.STRING),
      ageRequirement: DataTypes.STRING,
      englishTest: DataTypes.ARRAY(DataTypes.STRING),
      otherLangTest: DataTypes.ARRAY(DataTypes.STRING),
      standarizedTest: DataTypes.ARRAY(DataTypes.STRING),
      documents: DataTypes.ARRAY(DataTypes.STRING),
      others: DataTypes.ARRAY(DataTypes.STRING),
      links: DataTypes.TEXT,
      degrees: DataTypes.ARRAY(DataTypes.STRING),
      countries: DataTypes.ARRAY(DataTypes.STRING),
      gpaRequirement: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Scholarship",
    }
  );
  return Scholarship;
};
