'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BookmarkThreads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      ThreadId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Threads'
          },
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
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
    await queryInterface.dropTable('BookmarkThreads');
  }
};