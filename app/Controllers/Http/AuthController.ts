import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  public async store({ request, response, auth, session }: HttpContextContract) {
    try {
      const { username, password } = request.all()
      const user = await User.findBy('username', username)
      if (!user) {
        return response.notFound('Usuário não encontrado')
      }
      await auth.attempt(user.email, password, { expiresIn: '7days' })
      session.flash('success', ['Login realizado com sucesso!'])
      return response.redirect('/dashboard')
    } catch (error) {
      return response.unauthorized({ message: 'Falha na autenticação', error })
    }
  }

  public async create({ view }: HttpContextContract) {
    return view.render('login')
  }

  public async destroy({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.redirect('/')
  }
}
