'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class University extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      University.belongsTo(models.Scholarship, { foreignKey: "scholarships_id" })
    }
  }
  University.init({
    scholarships_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "university is required" },
        notEmpty: { msg: "university is required" },
      }
    }
  }, {
    sequelize,
    modelName: 'University',
  });
  return University;
};