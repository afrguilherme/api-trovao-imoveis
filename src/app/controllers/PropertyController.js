import * as Yup from 'yup'

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
      description: Yup.string(),
      contact: Yup.string().required(),
    })

    try {
      schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    return response.status(201).json({ message: 'ok' })
  }
}

export default new PropertyController()
