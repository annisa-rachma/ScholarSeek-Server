'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Country.belongsTo(models.Scholarship, { foreignKey: "scholarships_id" })
    }
  }
  Country.init({
    scholarships_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "country is required" },
        notEmpty: { msg: "country is required" },
      }
    }
  }, {
    sequelize,
    modelName: 'Country',
  });
  return Country;
};