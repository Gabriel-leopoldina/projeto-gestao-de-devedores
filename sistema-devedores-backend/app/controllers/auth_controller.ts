import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  
  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await User.verifyCredentials(email, password)
      const token = await User.accessTokens.create(user)

      return response.ok({
        token: token.value!.release(),
        user: {
          id: user.id,
          email: user.email
        }
      })
    } catch (error) {
      return response.unauthorized({ error: 'E-mail ou senha incorretos' })
    }
  }

  
  async register({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.create({ email, password })

    return response.created({
      message: 'Usuário cadastrado com sucesso!',
      user: {
        id: user.id,
        email: user.email
      }
    })
  }

}