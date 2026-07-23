import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  
  async login({ request, response }: HttpContext) {
    const { username, password } = request.only(['username', 'password'])

    try {
      const user = await User.verifyCredentials(username, password)
      const token = await User.accessTokens.create(user)

      return response.ok({
        token: token.value!.release(),
        user: {
          id: user.id,
          username: user.username
        }
      })
    } catch (error) {
      return response.unauthorized({ error: 'Usuário ou senha incorretos' })
    }
  }

  
  async register({ request, response }: HttpContext) {

    const { username, password, email } = request.only(['username', 'password', 'email'])

    const user = await User.create({ username, password, email })

    return response.created({
      message: 'Usuário cadastrado com sucesso!',
      user: {
        id: user.id,
        username: user.username
      }
    })
  }

}