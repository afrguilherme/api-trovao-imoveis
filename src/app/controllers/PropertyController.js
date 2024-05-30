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

    if (!files || files.length < 5) {
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

    if (request.files) {
      const uploadsPath = path.resolve('./uploads')

      try {
        const files = await fs.readdir(uploadsPath)

        const propertyImg = findProperty.path.map((img) => {
          return img
        })

        const matchingImages = propertyImg.filter((img) => files.includes(img))
        console.log('Matching images:', matchingImages)

        return response.status(200).json({ matchingImages })
      } catch (err) {
        return response.status(500).json({ error: `${err}` })
      }
    } else {
      return response
        .status(400)
        .json({ error: 'At least 5 files are required!' })
    }

    // if (!findProperty) {
    //   return response
    //     .status(400)
    //     .json({ error: 'Make sure the property ID is correct!' })
    // }

    // async function deleteOldPaths() {
    //   if (findProperty.path && findProperty.path.length >= 5) {
    //     await findProperty.path.forEach((filePath) => {
    //       const fullPath = path.resolve(
    //         __dirname,
    //         '..',
    //         '..',
    //         'uploads',
    //         filePath,
    //       )
    //       fs.unlink(fullPath, (err) => {
    //         if (err) console.error(`Error deleting file: ${filePath}`, err)
    //       })
    //     })
    //   }
    // }
    // deleteOldPaths()

    // let newPaths = request.files.map((file) => file.filename)

    // if (!newPaths || newPaths.length < 5) {
    //   return response
    //     .status(400)
    //     .json({ error: 'At least 5 files are required!' })
    // }

    // let path = request.files.map((file) => file.filename)

    // if (request.files && request.files.length >= 5) {
    //   path = request.files.map((file) => {
    //     return file.filename
    //   })
    // } else {
    //   return response
    //     .status(400)
    //     .json({ error: 'At least 5 files are required!' })
    // }

    // const {
    //   name,
    //   price,
    //   category_id,
    //   address,
    //   town_house,
    //   status,
    //   dimensions,
    //   rooms,
    //   parking_space,
    //   bathrooms,
    //   description,
    //   contact,
    // } = request.body

    // try {
    //   Property.update(
    //     {
    //       name,
    //       price,
    //       category_id,
    //       address,
    //       town_house,
    //       status,
    //       dimensions,
    //       rooms,
    //       parking_space,
    //       bathrooms,
    //       description,
    //       contact,
    //       path: newPaths,
    //     },
    //     {
    //       where: {
    //         id,
    //       },
    //     },
    //   )

    //   return response.status(200).json()
    // } catch (error) {
    //   return response.status(400).json(error)
    // }
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
