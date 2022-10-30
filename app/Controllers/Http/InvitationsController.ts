import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Docusign from '@ioc:Docusign'
import Company from 'App/Models/Company'
import Invitation from 'App/Models/Invitation'
import StoreValidator from 'App/Validators/Invitation/StoreValidator'
import { INVITATION_STATUS } from 'Contracts/enums/INVITATION_STATUS'

export default class InvitationsController {
  public async store({ request, response, session }: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    const company = await Company.find(data.company_id)
    await company!.related('invitations').create(data)
    session.flash('success', ['Proposta enviada com sucesso!'])
    return response.redirect('/dashboard')
  }

  public async update({ params, response, session }: HttpContextContract) {
    const invitation = await Invitation.findOrFail(params.id)
    const accessToken = await Docusign.getJwt()
    const envelope = await Docusign.makeEnvelope(accessToken, invitation)
    invitation.envelopeId = envelope.envelopeId
    invitation.status = INVITATION_STATUS.ACCEPTED
    await invitation.save()
    session.flash('success', ['Cheque seu email, o contrato foi enviado!'])
    return response.redirect('/dashboard')
  }

  public async destroy({ params, response }: HttpContextContract) {
    const invitation = await Invitation.findOrFail(params.id)
    await invitation.delete()
    return response.redirect('/dashboard')
  }
}
