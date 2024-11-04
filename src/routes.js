import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import PropertyController from './app/controllers/PropertyController'
import CategoryController from './app/controllers/CategoryController'

import authMiddleware from './middlewares/auth'
import { handleMulterError } from './middlewares/handleMulterErrors'
import { checkPropertyExists } from './middlewares/checkPropertyExists'
import {
  validateCategoryId,
  validatePropertyId,
} from './middlewares/validateId'

const routes = new Router()

const upload = multer(multerConfig)

routes.post('/users', UserController.store)
routes.post('/session', SessionController.store)
routes.get('/properties', PropertyController.index)
routes.get('/categories', CategoryController.index)
routes.use(authMiddleware) // Indica que as rotas abaixo desta linha utiliza a autenticação de token.
routes.get('/users', UserController.index)

routes.put('/categories/:id', validateCategoryId, CategoryController.update)
routes.delete('/categories/:id', validateCategoryId, CategoryController.delete)
routes.delete('/categories', (req, res) => {
  return res.status(400).json({ error: 'A category ID is required!' })
})

routes.post(
  '/properties',
  upload.array('files', 10),
  handleMulterError,
  PropertyController.store,
)

routes.put(
  '/properties/:id',
  checkPropertyExists,
  upload.array('files', 10),
  handleMulterError,
  PropertyController.update,
)

routes.put('/properties', (req, res) => {
  return res.status(400).json({ error: 'A category ID is required!' })
})

routes.delete('/properties/:id', validatePropertyId, PropertyController.delete)
routes.delete('/properties', (req, res) => {
  return res.status(400).json({ error: 'A property ID is required!' })
})

routes.post('/categories', CategoryController.store)
export default routes
