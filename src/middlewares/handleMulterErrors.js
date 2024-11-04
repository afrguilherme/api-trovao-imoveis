import multer from 'multer'

export const handleMulterError = (error, request, response, next) => {
  if (error instanceof multer.MulterError) {
    return response.status(400).json({ error: error.message })
  } else if (error) {
    return response.status(400).json({ error: error.message })
  }
  next()
}
