import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserStoreValidator from 'App/Validators/User/StoreValidator'
import CollaboratorStoreValidator from 'App/Validators/Collaborator/StoreValidator'
import User from 'App/Models/User'

export default class CollaboratorsController {
  public async store({ request, response, session }: HttpContextContract) {
    const userData = await request.validate(UserStoreValidator)
    const collaboratorData = await request.validate(CollaboratorStoreValidator)
    const user = await User.create(userData)
    await user.related('collaborator').create(collaboratorData)
    session.flash('success', ['Registrado com sucesso!'])
    return response.redirect('/dashboard')
  }

  public async create({ view }: HttpContextContract) {
    return view.render('collaborator/create')
  }
}
