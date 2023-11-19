'use strict';

const { hashPassword } = require('../helpers/bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let dataUser = require('../data/user.json').map((el) => {
      let firstName = el.firstName.toLowerCase().split(' ').join('-')
      let lastName = el.lastName.toLowerCase().split(' ').join('-')
      el.slug = `${firstName}-${lastName}`
      el.createdAt = el.updatedAt = new Date()
      el.password = hashPassword(el.password)
      return el
    })
    let dataUserSchool = require('../data/userSchool.json').map((el)=> {
      el.createdAt = el.updatedAt = new Date()
      return el
    })
    await queryInterface.bulkInsert('Users', dataUser)
    await queryInterface.bulkInsert('userSchools', dataUserSchool)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('userSchools', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
