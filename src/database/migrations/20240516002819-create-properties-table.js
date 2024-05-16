'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('properties', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      category_id: {
        type: Sequelize.INTEGER,
        onUpdate: 'CASCADE', //Quando houver alterações no registro da coluna caregory_id alterar também na tabela de produtos.
        onDelete: 'SET NULL',
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id',
        },
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      town_house: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dimensions: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rooms: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      parking_space: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      bathrooms: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      contact: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      path1: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      path2: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      path3: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('properties')
  },
}
