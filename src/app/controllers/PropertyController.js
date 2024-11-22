import fs from 'fs/promises'
const path = require('path')
import * as Yup from 'yup'
import Property from '../models/Property'
import Category from '../models/Category'
import User from '../models/User'

import { isAdminOrOperator } from '../../middlewares/accesAuth'

class PropertyController {
  async store(request, response) {
    if (!(await isAdminOrOperator(request.userId))) {
      return response.status(401).json()
    }

    const { files } = request

    if (!files) {
      return response
        .status(400)
        .json({ error: 'At least 1 image is required!' })
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
        user_id: request.userId,
      })

      return response.status(201).json(property)
    } catch (error) {
      return response.status(400).json(error)
    }
  }

  async update(request, response) {
    if (!(await isAdminOrOperator(request.userId))) {
      return response.status(401).json()
    }

    const { id } = request.params
    const findProperty = await Property.findByPk(id)

    if (!findProperty) {
      return response.status(404).json({ error: 'Property not found!' })
    }

    const { files } = request // Pode ser undefined
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

    const uploadsPath = path.resolve('./uploads')
    const existingImages = findProperty.path || [] // Imagens atuais no banco

    try {
      // Se `files` for undefined ou vazio, mantém as imagens existentes
      if (!Array.isArray(files) || files.length === 0) {
        updateData.path = existingImages
      } else {
        // Se houver upload de novas imagens, substitui as antigas
        const newFilePaths = files.map((file) => file.filename)

        // Excluir apenas as imagens que estão no diretório e no registro
        const filesInDir = await fs.readdir(uploadsPath)
        const matchingImages = existingImages.filter((img) =>
          filesInDir.includes(img),
        )

        for (let img of matchingImages) {
          await fs.unlink(path.join(uploadsPath, img))
        }

        updateData.path = newFilePaths
      }
    } catch (err) {
      return response.status(500).json({ error: `${err}` })
    }

    try {
      await Property.update(updateData, { where: { id } })
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
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email'],
        },
      ],
    })

    return response.json(properties)
  }

  async show(request, response) {
    const { id } = request.params

    try {
      const property = await Property.findByPk(id, {
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'email'],
          },
        ],
      })

      if (!property) {
        return response.status(404).json({ error: 'Property not found!' })
      }

      return response.status(200).json(property)
    } catch (error) {
      return response
        .status(500)
        .json({ error: 'Failed to retrieve property.' })
    }
  }
}

export default new PropertyController()
