'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let dataThread = require('../data/thread.json').map((el)=> {
      el.slug = el.title.toLowerCase().split(' ').join('-')
      el.createdAt = el.updatedAt = new Date()
      return el
    })
    let dataComments = require('../data/comment.json').map((el)=> {
      el.createdAt = el.updatedAt = new Date()
      return el
    })
    await queryInterface.bulkInsert('Threads', dataThread)
    await queryInterface.bulkInsert('Comments', dataComments)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Comments', null, {});
    await queryInterface.bulkDelete('Threads', null, {});
  }
};
