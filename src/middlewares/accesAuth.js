import User from '../app/models/User'

export async function isAdminOrOperator(userId) {
  const { admin: isAdmin } = await User.findByPk(userId)
  const { operator: isOperator } = await User.findByPk(userId)

  if (!isAdmin && !isOperator) {
    return false
  }

  return true
}

export async function isAdmin(userId) {
  const { admin: isAdmin } = await User.findByPk(userId)

  if (!isAdmin) {
    return false
  }

  return true
}
