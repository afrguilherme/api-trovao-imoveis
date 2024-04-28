import { Router } from 'express'
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import PropertyController from './app/controllers/PropertyController'

const routes = new Router()

routes.post('/users', UserController.store)
routes.post('/session', SessionController.store)
routes.post('/properties', PropertyController.store)

export default routes
