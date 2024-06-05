import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import PropertyController from './app/controllers/PropertyController'
import CategoryController from './app/controllers/CategoryController'

import authMiddleware from './middlewares/auth'

const routes = new Router()

const upload = multer(multerConfig)

routes.post('/users', UserController.store)
routes.post('/session', SessionController.store)
routes.get('/properties', PropertyController.index)
routes.get('/categories', CategoryController.index)
routes.use(authMiddleware) // Indica que as rotas abaixo desta linha utiliza a autenticação de token.
routes.post(
  '/properties',
  upload.array('files', 10),
  PropertyController.store,
  (error, request, response, next) => {
    if (error) {
      return response.status(400).json({ error: error.message })
    }

    return next()
  },
)
routes.put(
  '/properties/:id',
  upload.array('files', 10),
  PropertyController.update,
  (error, request, response, next) => {
    if (error) {
      return response.status(400).json({ error: error.message })
    }

    return next()
  },
)
routes.post('/categories', CategoryController.store)
export default routes
