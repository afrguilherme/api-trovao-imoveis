import Property from '../app/models/Property'

export const checkPropertyExists = async (request, response, next) => {
  const { id } = request.params

  if (!id) {
    return next() // Se não há ID, prossiga sem verificação
  }

  const property = await Property.findByPk(id)

  if (!property) {
    return response.status(404).json({ error: 'Property not found!' })
  }

  request.property = property
  next()
}
