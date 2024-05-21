import jwt from 'jsonwebtoken'
import authConfig from '../config/auth'

export default function authMiddleware(request, response, next) {
  const authToken = request.headers.authorization

  if (!authToken) {
    return response.status(401).json({ error: 'Token not provided!' })
  }

  const [_, token] = authToken.split(' ') // Formato desestruturado
  //  const test = authToken.split(' ').at(1) .at é utilizado para indicar posição de um array, como o uso de [].

  try {
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        throw new Error()
      }

      request.userId = decoded.id
      request.userName = decoded.name
      return next()
    })
  } catch (err) {
    return response.status(401).json({ error: 'Token is invalid!' })
  }
}
