'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Document.belongsTo(models.Scholarship, { foreignKey: "scholarships_id" })
    }
  }
  Document.init({
    scholarships_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "document is required" },
        notEmpty: { msg: "document is required" },
      }
    }
  }, {
    sequelize,
    modelName: 'Document',
  });
  return Document;
};