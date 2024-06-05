import multer from 'multer'
import { v4 } from 'uuid'

import { extname, resolve } from 'node:path'

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'uploads'),
    filename: (request, file, callback) =>
      callback(null, v4() + extname(file.originalname)),
  }),

  // No caso dos arquivos passarem na validação não está prosseguindo com a requisição.
  fileFilter: (request, file, callback) => {
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
