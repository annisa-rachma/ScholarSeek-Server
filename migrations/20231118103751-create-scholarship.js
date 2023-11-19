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
        type: Sequelize.STRING
      },
      isFullyFunded: {
        type: Sequelize.BOOLEAN
      },
      registrationOpen: {
        type: Sequelize.DATEONLY
      },
      registrationDeadline: {
        type: Sequelize.DATEONLY
      },
      isOpen: {
        type: Sequelize.BOOLEAN
      },
      description: {
        type: Sequelize.TEXT
      },
      university: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      major: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      benefit: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
      ageRequirement: {
        type: Sequelize.STRING
      },
      englishTest: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      otherLangTest: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      standarizedTest: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      documents: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      others: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      links: {
        type: Sequelize.TEXT
      },
      degrees: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      countries: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      gpaRequirement: {
        type: Sequelize.STRING
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