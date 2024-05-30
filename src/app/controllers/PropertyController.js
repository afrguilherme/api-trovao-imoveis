import fs from 'fs/promises'
const path = require('path')
import * as Yup from 'yup'
import Property from '../models/Property'
import Category from '../models/Category'
import User from '../models/User'
import { log } from 'console'

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

    if (!files || files.length < 5 || files.length > 10) {
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

    let filePaths = request.files.map((file) => file.filename)

    if (request.files.length >= 5 && request.files.length <= 10) {
      const uploadsPath = path.resolve('./uploads')

      try {
        const files = await fs.readdir(uploadsPath)

        const propertyImg = findProperty.path.map((img) => {
          return img
        })

        const matchingImages = propertyImg.filter((img) => files.includes(img))

        if (matchingImages) {
          for (let img of matchingImages) {
            fs.unlink(path.join(uploadsPath, img), (err) => {
              if (err) throw err
            })
          }
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
            path: filePaths,
          },
          {
            where: {
              id,
            },
          },
        )

        return response
          .status(200)
          .json({ message: 'Dados do imóvel editados com sucesso!' })
      } catch (err) {
        return response.status(500).json({ error: `${err}` })
      }
    } else {
      return response
        .status(400)
        .json({ error: 'Between 5 and 10 images are required!' })
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
