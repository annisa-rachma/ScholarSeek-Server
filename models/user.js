'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.userSchool, {foreignKey: 'UserId'})
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg : "First name is required"
        },
        notEmpty: {
          msg : "First name is required"
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg : "Last name is required"
        },
        notEmpty: {
          msg : "Last name is required"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args : true,
        msg : "Email already registered"
      },
      validate: {
        notNull: {
          msg : "Email is required"
        },
        notEmpty: {
          msg : "Email is required"
        },
        isEmail: {
          args: true,
          msg: "Invalid email format"
        },
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg : "Password is required"
        },
        notEmpty: {
          msg : "Password is required"
        }
      }
    },
    role: DataTypes.STRING,
    profileImg: DataTypes.STRING,
    linkedinUrl: DataTypes.STRING,
    description: DataTypes.TEXT,
    isAwardeeValidate: DataTypes.BOOLEAN
  }, {
    hooks: {
      beforeCreate: (user) => {
        user.password = hashPassword(user.password);
        user.isAwardeeValidate = false
        if(!user.profileImg) {
          user.profileImg = 'https://source.boringavatars.com/beam/40/bryan'
        }
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};