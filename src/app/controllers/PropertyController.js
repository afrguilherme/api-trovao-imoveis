import * as Yup from 'yup'
import Property from '../models/Property'
import Category from '../models/Category'
import User from '../models/User'

class PropertyController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.string(),
      category_id: Yup.number().required(),
      address: Yup.string().required(),
      town_house: Yup.string(),
      status: Yup.string().required(),
      dimensions: Yup.string().required(),
      rooms: Yup.number().required(),
      parking_space: Yup.number().required(),
      bathrooms: Yup.number().required(),
      description: Yup.string().max(500),
      contact: Yup.string().required(),
    })

    const { admin: isAdmin } = await User.findByPk(request.userId)
    const { operator: isOperator } = await User.findByPk(request.userId)

    if (!isAdmin && !isOperator) {
      return response.status(401).json()
    }

    try {
      schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { files } = request

    if (!files || files.length <= 5) {
      return response
        .status(400)
        .json({ error: 'At least 5 files are required!' })
    }

    const path = request.files.map((file) => file.filename)

    const {
      name,
      price,
      category_id,
      address,
      town_house,
      status,
      dimensions,
      rooms,
      parking_space,
      bathrooms,
      description,
      contact,
    } = request.body

    try {
      const property = await Property.create({
        name,
        price,
        category_id,
        address,
        town_house,
        status,
        dimensions,
        rooms,
        parking_space,
        bathrooms,
        description,
        contact,
        path,
      })

      return response.status(201).json(property)
    } catch (error) {
      return response.status(400).json(error)
    }
  }

  async update(request, response) {
    const schema = Yup.object({
      name: Yup.string(),
      price: Yup.string(),
      category_id: Yup.number(),
      address: Yup.string(),
      town_house: Yup.string(),
      status: Yup.string(),
      dimensions: Yup.string(),
      rooms: Yup.number(),
      parking_space: Yup.number(),
      bathrooms: Yup.number(),
      description: Yup.string().max(500),
      contact: Yup.string(),
    })

    const { admin: isAdmin } = await User.findByPk(request.userId)
    const { operator: isOperator } = await User.findByPk(request.userId)

    if (!isAdmin && !isOperator) {
      return response.status(401).json()
    }

    try {
      schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { id } = request.params

    const findProperty = await Property.findByPk(id)

    if (!findProperty) {
      return response
        .status(400)
        .json({ error: 'Make sure your product ID is correct!' })
    }

    let path = request.files.map((file) => file.filename)

    if (request.files && request.files.length >= 5) {
      path = request.files.map((file) => {
        return file.filename
      })
    } else {
      return response
        .status(400)
        .json({ error: 'At least 5 files are required!' })
    }

    const {
      name,
      price,
      category_id,
      address,
      town_house,
      status,
      dimensions,
      rooms,
      parking_space,
      bathrooms,
      description,
      contact,
    } = request.body

    try {
      Property.update(
        {
          name,
          price,
          category_id,
          address,
          town_house,
          status,
          dimensions,
          rooms,
          parking_space,
          bathrooms,
          description,
          contact,
          path,
        },
        {
          where: {
            id,
          },
        },
      )

      return response.status(200).json()
    } catch (error) {
      return response.status(400).json(error)
    }
  }

  async index(request, response) {
    const properties = await Property.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    })

    return response.json(properties)
  }
}

export default new PropertyController()
