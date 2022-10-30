import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserStoreValidator from 'App/Validators/User/StoreValidator'
import CompanyStoreValidator from 'App/Validators/Company/StoreValidator'
import User from 'App/Models/User'

export default class CompaniesController {
  public async store({ request, response, session }: HttpContextContract) {
    const userData = await request.validate(UserStoreValidator)
    const companyData = await request.validate(CompanyStoreValidator)
    const user = await User.create(userData)
    const company = await user.related('company').create(companyData)
    session.flash('success', ['Registrado com sucesso!'])
    return response.redirect('/dashboard')
  }

  public async create({ view }: HttpContextContract) {
    return view.render('company/create')
  }
}
