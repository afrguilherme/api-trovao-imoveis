export const validateCategoryId = (req, res, next) => {
  const { id } = req.params
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'A valid category ID is required!' })
  }
  next()
}

export const validatePropertyId = (req, res, next) => {
  const { id } = req.params
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'A valid property ID is required!' })
  }
  next()
}
