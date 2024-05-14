'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('properties', 'category_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'categories',
        key: 'id',
      },
      onUpdate: 'CASCADE', //Quando houver alterações no registro da coluna caregory_id alterar também na tabela de produtos.
      onDelete: 'SET NULL',
      allowNull: true,
    })
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('properties', 'category_id')
  },
}
