import * as Yup from 'yup'
import Category from '../models/Category'
import User from '../models/User'
import { isAdminOrOperator } from '../../middlewares/accesAuth'

class CategoryController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
    })

    if (!(await isAdminOrOperator(request.userId))) {
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

  async update(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
    })

    if (!(await isAdminOrOperator(request.userId))) {
      return response.status(401).json()
    }

    try {
      schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { name } = request.body
    const { id } = request.params

    const categoryExists = await Category.findByPk(id)

    if (!categoryExists) {
      return response
        .status(404)
        .json({ message: 'Make sure your category id is correct!' })
    }

    if (name) {
      const categoryNameExists = await Category.findOne({
        where: {
          name,
        },
      })

      // Condição para não permitir alterar o nome da categoria pelo nome de outra categoria já existente.
      if (categoryNameExists && categoryNameExists.id !== id) {
        return response.status(400).json({ error: 'Category already exists!' })
      }
    }

    await Category.update(
      {
        name,
      },
      {
        where: {
          id,
        },
      },
    )

    return response.status(200).json()
  }
  catch(error) {
    return response.status(400).json({ error: 'Failed to update category...' })
  }

  async delete(request, response) {
    if (!(await isAdminOrOperator(request.userId))) {
      return response.status(401).json()
    }

    const { id } = request.params

    const categoryExists = await Category.findByPk(id)

    if (!categoryExists) {
      return response.status(404).json({ error: 'Category not found!' })
    }

    try {
      await Category.destroy({
        where: {
          id,
        },
      })

      return response
        .status(200)
        .json({ message: 'Category deleted successfully!' })
    } catch (error) {
      return response
        .status(400)
        .json({ error: 'Failed to delete category...' })
    }
  }

  async index(request, response) {
    const categories = await Category.findAll()

    return response.json(categories)
  }
}

export default new CategoryController()
