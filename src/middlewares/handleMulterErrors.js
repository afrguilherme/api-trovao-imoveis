const path = require('path')
import fs from 'fs/promises'
import multer from 'multer'

export const validateImageCount = async (request, response, next) => {
  if (
    request.files &&
    (request.files.length < 5 || request.files.length > 10)
  ) {
    const paths = request.files.map((file) => file.filename)

    await Promise.all(
      paths.map(async (file) => {
        const filePath = path.resolve(__dirname, '..', '..', 'uploads', file)
        await fs.unlink(filePath)
      }),
    )

    return response
      .status(400)
      .json({ error: 'Between 5 and 10 images are required!' })
  }
  next()
}

export const handleMulterError = (error, request, response, next) => {
  if (error instanceof multer.MulterError) {
    return response.status(400).json({ error: error.message })
  } else if (error) {
    return response.status(400).json({ error: error.message })
  }
  next()
}
