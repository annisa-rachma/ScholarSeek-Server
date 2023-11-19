'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Scholarships', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gpa_scale_4: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      gpa_scale_100: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      is_gpa_special: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      age_minimum: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      age_maximum: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      benefit: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      registration_date: {
        type: Sequelize.DATEONLY,
        defaultValue: null
      },
      deadline_date: {
        type: Sequelize.DATEONLY,
        defaultValue: null,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Scholarships');
  }
};