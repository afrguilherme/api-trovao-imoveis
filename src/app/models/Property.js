import Sequelize, { Model } from 'sequelize'

class Property extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.INTEGER,
        address: Sequelize.STRING,
        neighborhood: Sequelize.STRING,
        town_house: Sequelize.STRING,
        status: Sequelize.STRING,
        dimensions: Sequelize.INTEGER,
        rooms: Sequelize.INTEGER,
        parking_space: Sequelize.INTEGER,
        bathrooms: Sequelize.INTEGER,
        description: Sequelize.STRING,
        contact: Sequelize.STRING,
        offer: Sequelize.BOOLEAN,
        path: Sequelize.ARRAY(Sequelize.STRING),
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            const result = this.path.map((file) => {
              return `http://localhost:3001/property-file/${file}`
            })
            return result
          },
        },
      },
      {
        sequelize,
      },
    )
    return this
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    })

    this.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    })
  }
}

export default Property
