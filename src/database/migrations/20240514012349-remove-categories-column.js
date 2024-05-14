'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn('properties', 'category')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('properties', 'category', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },
}
