import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'
import Env from '@ioc:Adonis/Core/Env'
import Invitation from 'App/Models/Invitation'
import { INVITATION_STATUS } from 'Contracts/enums/INVITATION_STATUS'

Route.post('/contract/accept', async ({ request, response }: HttpContextContract) => {
  const data = request.all()

  if (data['data']['accountId'] === Env.get('DOCUSIGN_ACCOUNT_ID')) {
    if (data['event'] === 'envelope-completed') {
      const invitation = await Invitation.findBy('envelope_id', data['data']['envelopeId'])

      if (!invitation) {
        return response.notFound('Invitation not found!')
      }
      if (invitation.status !== INVITATION_STATUS.ACCEPTED) {
        return response.badRequest('The invitation to the campaign must be accepted!')
      }

      invitation.merge({
        envelopeId: data['data']['envelopeId'],
        status: INVITATION_STATUS.CONTRACTED,
      })
      await invitation.save()

      await invitation.load((loader) => {
        loader
          .load('company', (company) => company.preload('user'))
          .load('collaborator', (collaborator) => collaborator.preload('user'))
      })

      return response.ok({ message: 'The influencer is now part of the campaign!' })
    }
    return response.badRequest('The contract was not completed!')
  }
  return response.unauthorized('Invalid Account!')
})
