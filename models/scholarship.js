"use strict";
const { Model } = require("sequelize");
// const countriesList = require('countries-list').countries;
const countries = require("i18n-iso-countries");
module.exports = (sequelize, DataTypes) => {
  class Scholarship extends Model {
    static associate(models) {
      Scholarship.hasMany(models.BookmarkScholarship, {
        foreignKey: "ScholarshipId",
      });
    }
  }
  Scholarship.init(
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
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
      countryCode: DataTypes.STRING,
      gpaRequirement: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Scholarship",
    }
  );
  // Scholarship.beforeCreate((scholarship) =>{
  //   scholarship.isFullyFunded === true ? "Fully Funded" : "Partial"
  // })
Scholarship.beforeCreate((scholarship) => {
  if (scholarship.countries && Array.isArray(scholarship.countries)) {
      const countryCodes = scholarship.countries.map(countryName => countries.getAlpha2Code(countryName, 'id') || countries.getAlpha2Code(countryName, 'en'));
      console.log(countryCodes.filter(code => code !== undefined));
      scholarship.countryCode = countryCodes.filter(code => code !== undefined).join(", "); // Filter kode yang tidak ditemukan
  }

});
  Scholarship.beforeValidate((scholarship) => {
    scholarship.slug = scholarship.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]+/g, "")
      .replaceAll(" ", "-");
  });
  Scholarship.beforeUpdate((scholarship) => {
    console.log(scholarship);
    scholarship.slug = scholarship.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]+/g, "")
      .replaceAll(" ", "-");
  });
  return Scholarship;
};
