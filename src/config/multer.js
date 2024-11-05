import multer from 'multer'
import { v4 } from 'uuid'
import { extname, resolve } from 'node:path'
import * as Yup from 'yup'

import User from '../app/models/User'
import Property from '../app/models/Property'
import Category from '../app/models/Category'

const accessAuth = async (userId, callback) => {
  try {
    const user = await User.findByPk(userId)
    if (!user) {
      return callback(new Error('User not found!'), false)
    }
    const { admin: isAdmin, operator: isOperator } = user
    if (!isAdmin && !isOperator) {
      return callback(new Error('Unauthorized!'), false)
    }
    return callback(null, true)
  } catch (error) {
    return callback(new Error('Error during authorization!'), false)
  }
}

const schema = Yup.object({
  name: Yup.string().required(),
  price: Yup.number(),
  category_id: Yup.number().required(),
  address: Yup.string().required(),
  neighborhood: Yup.string().required(),
  town_house: Yup.string(),
  status: Yup.string().required(),
  dimensions: Yup.number().required(),
  rooms: Yup.number().required(),
  parking_space: Yup.number().required(),
  bathrooms: Yup.number().required(),
  description: Yup.string().max(500),
  contact: Yup.string().required(),
  offer: Yup.bool(),
})

const updateSchema = Yup.object({
  name: Yup.string(),
  price: Yup.string(),
  category_id: Yup.number(),
  address: Yup.string(),
  neighborhood: Yup.string(),
  town_house: Yup.string(),
  status: Yup.string(),
  dimensions: Yup.number(),
  rooms: Yup.number(),
  parking_space: Yup.number(),
  bathrooms: Yup.number(),
  description: Yup.string().max(500),
  contact: Yup.string(),
  offer: Yup.bool(),
})

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'uploads'),
    filename: (request, file, callback) =>
      callback(null, v4() + extname(file.originalname)),
  }),

  limits: {
    files: 10,
  },

  fileFilter: async (request, file, callback) => {
    accessAuth(request.userId, (authError, authResult) => {
      if (authError) {
        return callback(authError, false)
      }
    })

    const { id } = request.params
    const { category_id } = request.body

    try {
      const category = await Category.findByPk(category_id)

      if (!category) {
        throw new Error('Category not found!')
      }
    } catch (error) {
      return callback(
        error.message === 'Category not found!'
          ? error
          : new Error('System error, try again later!'),
        false,
      )
    }

    if (id) {
      try {
        updateSchema.validateSync(request.body, { abortEarly: false })
      } catch (err) {
        return response.status(400).json({ error: err.errors })
      }

      const property = await Property.findByPk(id)

      if (!property) {
        return callback(new Error('Property not found!'))
      }
    } else {
      try {
        schema.validateSync(request.body, { abortEarly: false })
      } catch (validationError) {
        return callback(
          new Error(`Validation error: ${validationError.errors.join(', ')}`),
          false,
        )
      }
    }

    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/svg+xml',
    ]

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true)
    } else {
      callback(new Error('Invalid file type!'))
    }
  },
}
