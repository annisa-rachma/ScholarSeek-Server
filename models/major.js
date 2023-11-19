'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Major extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Major.belongsTo(models.Scholarship, { foreignKey: "scholarships_id" })
    }
  }
  Major.init({
    scholarships_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "major is required" },
        notEmpty: { msg: "major is required" },
      }
    }
  }, {
    sequelize,
    modelName: 'Major',
  });
  return Major;
};