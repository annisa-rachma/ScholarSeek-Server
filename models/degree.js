'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Degree extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Degree.belongsTo(models.Scholarship, { foreignKey: "scholarships_id" })
    }
  }
  Degree.init({
    scholarships_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: "NONDEGREE",
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Degree',
  });
  return Degree;
};