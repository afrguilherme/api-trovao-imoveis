import * as Yup from 'yup'
import Property from '../models/Property'

class PropertyController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.string(),
      category: Yup.string().required(),
      address: Yup.string().required(),
      town_house: Yup.string(),
      status: Yup.string().required(),
      dimensions: Yup.string().required(),
      rooms: Yup.number().required(),
      parking_space: Yup.number().required(),
      bathrooms: Yup.number().required(),
      description: Yup.string().max(500),
      contact: Yup.string().required(),
    })

    try {
      schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { files } = request

    // Atribuição de imagens a colunas diferentes de forma provisória.
    const path = files[0].filename
    const path1 = files[1].filename
    const path2 = files[2].filename
    const path3 = files[3].filename

    const {
      name,
      price,
      category,
      address,
      town_house,
      status,
      dimensions,
      rooms,
      parking_space,
      bathrooms,
      description,
      contact,
    } = request.body

    try {
      const property = await Property.create({
        name,
        price,
        category,
        address,
        town_house,
        status,
        dimensions,
        rooms,
        parking_space,
        bathrooms,
        description,
        contact,
        path,
        path1,
        path2,
        path3,
      })

      return response.status(201).json(property)
    } catch (error) {
      return response.status(400).json(error)
    }
  }
}

export default new PropertyController()
