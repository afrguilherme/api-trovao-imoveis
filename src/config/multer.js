import multer from 'multer'
import { v4 } from 'uuid'
import { extname, resolve } from 'node:path'

import User from '../app/models/User'
import Property from '../app/models/Property'

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

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'uploads'),
    filename: (request, file, callback) =>
      callback(null, v4() + extname(file.originalname)),
  }),

  fileFilter: async (request, file, callback) => {
    accessAuth(request.userId, (authError, authResult) => {
      if (authError) {
        return callback(authError, false)
      }
    })

    const { id } = request.params

    if (id) {
      const property = await Property.findByPk(id)

      if (!property) {
        return callback(new Error('property not found!'))
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
