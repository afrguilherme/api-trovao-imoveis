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

    const { filename: path } = request.files
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
    })

    return response.status(201).json(property)
  }
}

export default new PropertyController()
