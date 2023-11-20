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
    const dataMentoring = require("../data/mentoring.json").map((el) => {
      el.createdAt = el.updatedAt = new Date()
      el.slug = el.title.toLowerCase().split(' ').join('-')
      return el
    })
    await queryInterface.bulkInsert("Scholarships", scholarships);
    await queryInterface.bulkInsert("Mentorings", dataMentoring);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Scholarships", null, {});
    await queryInterface.bulkDelete("Mentorings", null, {});
  },
};
