"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const scholarships = require("../data/scholarship.json").map(
      (scholarship) => {
        scholarship.createdAt = scholarship.updatedAt = new Date();
        return scholarship;
      }
    );
    await queryInterface.bulkInsert("Scholarships", scholarships);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Scholarships", null, {});
  },
};
