import fs from 'fs/promises'
const path = require('path')
import * as Yup from 'yup'
import Property from '../models/Property'
import Category from '../models/Category'

import { isAdminOrOperator } from '../../middlewares/accesAuth'

class PropertyController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.string(),
      category_id: Yup.number().required(),
      address: Yup.string().required(),
      neighborhood: Yup.string().required(),
      town_house: Yup.string(),
      status: Yup.string().required(),
      dimensions: Yup.string().required(),
      rooms: Yup.number().required(),
      parking_space: Yup.number().required(),
      bathrooms: Yup.number().required(),
      description: Yup.string().max(500),
      contact: Yup.string().required(),
      offer: Yup.bool(),
    })
    if (!(await isAdminOrOperator(request.userId))) {
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
        .json({ error: 'Between 5 and 10 images are required!' })
    }

    const paths = request.files.map((file) => file.filename)

    const {
      name,
      price,
      category_id,
      address,
      neighborhood,
      town_house,
      status,
      dimensions,
      rooms,
      parking_space,
      bathrooms,
      description,
      contact,
      offer,
    } = request.body

    try {
      const property = await Property.create({
        name,
        price,
        category_id,
        address,
        neighborhood,
        town_house,
        status,
        dimensions,
        rooms,
        parking_space,
        bathrooms,
        description,
        contact,
        offer,
        path: paths,
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
      neighborhood: Yup.string(),
      town_house: Yup.string(),
      status: Yup.string(),
      dimensions: Yup.string(),
      rooms: Yup.number(),
      parking_space: Yup.number(),
      bathrooms: Yup.number(),
      description: Yup.string().max(500),
      contact: Yup.string(),
      offer: Yup.bool(),
    })

    if (!(await isAdminOrOperator(request.userId))) {
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
      return response.status(404).json({ error: 'Property not found!' })
    }

    const {
      name,
      price,
      category_id,
      address,
      neighborhood,
      town_house,
      status,
      dimensions,
      rooms,
      parking_space,
      bathrooms,
      description,
      contact,
      offer,
    } = request.body

    const updateData = {
      name,
      price,
      category_id,
      address,
      neighborhood,
      town_house,
      status,
      dimensions,
      rooms,
      parking_space,
      bathrooms,
      description,
      contact,
      offer,
    }

    const { files } = request

    let filePaths = files.map((file) => file.filename)
    const uploadsPath = path.resolve('./uploads')

    try {
      const filesInDir = await fs.readdir(uploadsPath)
      const propertyImg = findProperty.path.map((img) => img)
      const matchingImages = propertyImg.filter((img) =>
        filesInDir.includes(img),
      )

      if (matchingImages.length > 0) {
        for (let img of matchingImages) {
          await fs.unlink(path.join(uploadsPath, img))
        }
      }

      if (Array.isArray(files) && files.length <= 0) {
        updateData.path = propertyImg
      } else {
        updateData.path = filePaths
      }
    } catch (err) {
      return response.status(500).json({ error: `${err}` })
    }

    try {
      await Property.update(updateData, {
        where: { id },
      })

      return response
        .status(200)
        .json({ message: 'Property data updated successfully!' })
    } catch (err) {
      return response.status(500).json({ error: `${err}` })
    }
  }

  async delete(request, response) {
    if (!(await isAdminOrOperator(request.userId))) {
      return response.status(401).json()
    }

    const { id } = request.params

    const findProperty = await Property.findByPk(id)

    if (!findProperty) {
      return response.status(404).json({ error: 'Property not found!' })
    }

    const uploadsPath = path.resolve('./uploads')

    try {
      const files = await fs.readdir(uploadsPath)
      const propertyImg = findProperty.path.map((img) => img)
      const matchingImages = propertyImg.filter((img) => files.includes(img))

      if (matchingImages.length > 0) {
        for (let img of matchingImages) {
          await fs.unlink(path.join(uploadsPath, img))
        }
      }
    } catch (err) {
      return response.status(500).json({ error: `${err}` })
    }

    try {
      await Property.destroy({
        where: {
          id,
        },
      })

      return response
        .status(200)
        .json({ message: 'Property deleted successfully!' })
    } catch (error) {
      return response
        .status(400)
        .json({ error: 'Failed to delete property...' })
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
