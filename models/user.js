'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    profileImg: DataTypes.STRING,
    school: DataTypes.ARRAY,
    major: DataTypes.ARRAY,
    scholarship: DataTypes.ARRAY,
    linkedinUrl: DataTypes.STRING,
    description: DataTypes.TEXT,
    isMentorValidate: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};