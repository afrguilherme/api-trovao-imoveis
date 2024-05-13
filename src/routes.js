import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import PropertyController from './app/controllers/PropertyController'
import authMiddleware from './middlewares/auth'

const routes = new Router()

const upload = multer(multerConfig)

routes.post('/users', UserController.store)
routes.post('/session', SessionController.store)
routes.post('/properties', upload.array('files', 10), PropertyController.store)
routes.get('/properties', PropertyController.index)
routes.use(authMiddleware) // Indica que as rotas abaixo desta linha utiliza a autenticação de token.

export default routes
