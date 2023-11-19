'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Test extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Test.belongsTo(models.Category, { foreignKey: "category_id" })
    }
  }
  Test.init({
    category_id: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    min_score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Test',
  });
  return Test;
};