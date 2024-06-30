import { v4 } from 'uuid'
import * as Yup from 'yup'

import { isAdminOrOperator, isAdmin } from '../../middlewares/accesAuth'

import User from '../models/User'
class UserController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
      admin: Yup.boolean(),
      operator: Yup.boolean(),
    })

    try {
      schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { name, email, password, admin, operator } = request.body

    const userExists = await User.findOne({
      where: {
        email,
      },
    })

    if (userExists) {
      return response
        .status(400)
        .json({ error: 'User email already been used!' })
    }

    const user = await User.create({
      id: v4(),
      name,
      email,
      password,
      admin,
      operator,
    })

    return response.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  }

  async index(request, response) {
    try {
      if (!(await isAdmin(request.userId))) {
        return response
          .status(401)
          .json({ error: 'Only administrators can list all users!' })
      }

      const users = await User.findAll()

      const allUsers = users.map((user) => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      })

      return response.status(200).json(allUsers)
    } catch (err) {
      return response.status(400).json(err)
    }
  }
}

export default new UserController()
