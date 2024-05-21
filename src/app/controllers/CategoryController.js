import * as Yup from 'yup'
import Category from '../models/Category'
import User from '../models/User'

class CategoryController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
    })

    // Validação de admin e operador para permissão de cadastro de categoria.
    const { admin: isAdmin } = await User.findByPk(request.userId)
    const { operator: isOperator } = await User.findByPk(request.userId)

    if (!isAdmin && !isOperator) {
      return response.status(401).json()
    }

    try {
      schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { name } = request.body

    const categoryExists = await Category.findOne({
      where: {
        name,
      },
    })

    if (categoryExists) {
      return response.status(400).json({ error: 'Category already exists!' })
    }

    try {
      const category = await Category.create({
        name,
      })

      return response.status(201).json({ id: category.id, name: category.name })
    } catch (error) {
      return response
        .status(400)
        .json({ error: 'Failed to create new category...' })
    }
  }

  async index(request, response) {
    const categories = await Category.findAll()

    return response.json(categories)
  }
}

export default new CategoryController()
