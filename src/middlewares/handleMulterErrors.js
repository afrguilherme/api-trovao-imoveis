const path = require('path')
import fs from 'fs/promises'
import multer from 'multer'
import Category from '../app/models/Category'

export const validateImageCount = async (request, response, next) => {
  const { files } = request
  const { category_id } = request.body

  try {
    const category = await Category.findByPk(category_id)

    if (!files || files.length === 0) {
      return next()
    }

    if (files.length < 5 || files.length > 10 || !category) {
      const paths = files.map((file) => file.filename)

      await Promise.all(
        paths.map(async (file) => {
          const filePath = path.resolve(__dirname, '..', '..', 'uploads', file)
          await fs.unlink(filePath)
        }),
      )

      return response
        .status(400)
        .json({ error: 'Invalid image count or category not found!' })
    }

    next()
  } catch (err) {
    return response.status(500).json({ error: 'Internal server error!' })
  }
}

export const handleMulterError = (error, request, response, next) => {
  if (error instanceof multer.MulterError) {
    return response.status(400).json({ error: error.message })
  } else if (error) {
    return response.status(400).json({ error: error.message })
  }
  next()
}
