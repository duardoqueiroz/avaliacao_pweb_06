import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Collaborator from 'App/Models/Collaborator'
import Company from 'App/Models/Company'
import Invitation from 'App/Models/Invitation'
import { INVITATION_STATUS } from 'Contracts/enums/INVITATION_STATUS'

export default class DashboardController {
  public async index({ view, auth }: HttpContextContract) {
    const user = auth.user!
    await user.load((loader) => {
      loader.load('collaborator').load('company')
    })
    const companies = await Company.query()
      .preload('user')
      .preload('collaborators')
      .preload('invitations')

    const collaborators = await Collaborator.query()
      .preload('user')
      .preload('invitations')
      .preload('companies')

    var contracteds: Invitation[] = []
    var invitations: Invitation[] = []
    if (user.collaborator) {
      await user.collaborator?.load('invitations')
      contracteds = user.collaborator.invitations.filter(
        (i) => i.status === INVITATION_STATUS.CONTRACTED
      )
      invitations = user.collaborator.invitations.filter(
        (i) => i.status === INVITATION_STATUS.PENDING || i.status === INVITATION_STATUS.ACCEPTED
      )
    } else {
      await user.company?.load('invitations')
      contracteds = user.company.invitations.filter(
        (i) => i.status === INVITATION_STATUS.CONTRACTED
      )
      invitations = user.company.invitations.filter(
        (i) => i.status === INVITATION_STATUS.PENDING || i.status === INVITATION_STATUS.ACCEPTED
      )
    }
    return view.render('index', { user, contracteds, companies, collaborators, invitations })
  }
}
