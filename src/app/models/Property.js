import Sequelize, { Model } from 'sequelize'

class Property extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.INTEGER,
        category: Sequelize.STRING,
        address: Sequelize.STRING,
        town_house: Sequelize.STRING,
        status: Sequelize.STRING,
        dimensions: Sequelize.STRING,
        rooms: Sequelize.INTEGER,
        parking_space: Sequelize.INTEGER,
        bathrooms: Sequelize.INTEGER,
        description: Sequelize.STRING,
        contact: Sequelize.STRING,
        path: Sequelize.STRING,
        path1: Sequelize.STRING,
        path2: Sequelize.STRING,
        path3: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3002/property-file/${this.path}`
          },
        },
        url1: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3002/property-file/${this.path1}`
          },
        },
        url2: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3002/property-file/${this.path2}`
          },
        },
        url3: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3002/property-file/${this.path3}`
          },
        },
      },
      {
        sequelize,
      },
    )
  }
}

export default Property
