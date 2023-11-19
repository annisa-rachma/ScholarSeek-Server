'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Link extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Link.belongsTo(models.Scholarship, { foreignKey: "scholarships_id" })
    }
  }
  Link.init({
    scholarships_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "link is required" },
        notEmpty: { msg: "link is required" },
      }
    }
  }, {
    sequelize,
    modelName: 'Link',
  });
  return Link;
};