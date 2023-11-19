'use strict';
const fs = require("fs")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const seedScholarship = JSON.parse(fs.readFileSync("./data/scholarships/scholarships.json", "utf-8")).map((el) => {
      delete el[el.id]
      delete el.id
      el.createdAt = el.updatedAt = new Date();
      return el
    })
    const seedFundingType = JSON.parse(fs.readFileSync("./data/scholarships/fundingType.json", "utf-8")).map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el
    })
    const seedDegrees = JSON.parse(fs.readFileSync("./data/scholarships/degrees.json", "utf-8")).map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el
    })
    const seedLinks = JSON.parse(fs.readFileSync("./data/scholarships/links.json", "utf-8")).map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el
    })
    const seedDocuments = JSON.parse(fs.readFileSync("./data/scholarships/documents.json", "utf-8")).map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el
    })
    const seedCountries = JSON.parse(fs.readFileSync("./data/scholarships/countries.json", "utf-8")).map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el
    })
    const seedMajors = JSON.parse(fs.readFileSync("./data/scholarships/majors.json", "utf-8")).map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el
    })
    const seedUniversities = JSON.parse(fs.readFileSync("./data/scholarships/universities.json", "utf-8")).map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el
    })
    const seedCategories = JSON.parse(fs.readFileSync("./data/scholarships/categories.json", "utf-8")).map((el) => {
      delete el.pk_id
      el.createdAt = el.updatedAt = new Date();
      return el
    })
    const seedTests = JSON.parse(fs.readFileSync("./data/scholarships/tests.json", "utf-8")).map((el) => {
      delete el.pk_id
      el.createdAt = el.updatedAt = new Date();
      return el
    })
    await queryInterface.bulkInsert("Scholarships", seedScholarship)
    await queryInterface.bulkInsert("FundingTypes", seedFundingType)
    await queryInterface.bulkInsert("Degrees", seedDegrees)
    await queryInterface.bulkInsert("Links", seedLinks)
    await queryInterface.bulkInsert("Documents", seedDocuments)
    await queryInterface.bulkInsert("Countries", seedCountries)
    await queryInterface.bulkInsert("Majors", seedMajors)
    await queryInterface.bulkInsert("Universities", seedUniversities)
    await queryInterface.bulkInsert("Categories", seedCategories)
    await queryInterface.bulkInsert("Tests", seedTests)
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Scholarships", null, {})
    await queryInterface.bulkDelete("FundingTypes", null, {})
    await queryInterface.bulkDelete("Degrees", null, {})
    await queryInterface.bulkDelete("Links", null, {})
    await queryInterface.bulkDelete("Documents", null, {})
    await queryInterface.bulkDelete("Countries", null, {})
    await queryInterface.bulkDelete("Majors", null, {})
    await queryInterface.bulkDelete("Universities", null, {})
    await queryInterface.bulkDelete("Categories", null, {})
    await queryInterface.bulkDelete("Tests", null, {})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};