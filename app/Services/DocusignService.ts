import { docusignConfig } from 'Config/docusign'
import { ApiClient } from 'docusign-esign'
import { readFileSync } from 'fs'
import { readFile } from 'fs/promises'
import PizZip = require('pizzip')
import Docxtemplater from 'docxtemplater'
import Application from '@ioc:Adonis/Core/Application'
import axios from 'axios'
import DateTimeHelper from 'App/Helpers/DateTimeHelper'
import { DateTime } from 'luxon'
import { IDocusignProvider } from 'Contracts/interfaces/IDocusignProvider'
import Invitation from 'App/Models/Invitation'

export default class DocusignService implements IDocusignProvider {
  protected apiClient: ApiClient
  protected integrationKey: string
  protected consentUrl: string
  protected userId: string
  protected accountId: string
  protected apiBasePath: string
  protected oAuthBasePath: string
  protected scopes: string[]

  constructor(config: typeof docusignConfig) {
    this.integrationKey = config.integrationKey
    this.userId = config.userId
    this.apiBasePath = config.apiBasePath
    this.oAuthBasePath = config.oAuthBasePath
    this.scopes = config.scopes
    this.accountId = config.accountId
    this.apiClient = new ApiClient({
      basePath: this.apiBasePath,
      oAuthBasePath: this.oAuthBasePath,
    })
    this.consentUrl = `https://${
      config.oAuthBasePath
    }/oauth/auth?response_type=code&scope=${this.scopes.join('%20').toString()}&client_id=${
      config.integrationKey
    }&redirect_uri=${config.redirectUri}`
  }

  public async getJwt() {
    const privateKey = await readFile(Application.resourcesPath('docusign/private.key'), 'utf8')

    try {
      const response = await this.apiClient.requestJWTUserToken(
        this.integrationKey,
        this.userId,
        this.scopes,
        Buffer.from(privateKey, 'utf8'),
        3600
      )
      const accessToken = response.body.access_token
      return accessToken
    } catch (err) {
      if (err.response) {
        if (err.response.body.error === 'consent_required') {
          console.log('Consent required!')
          console.log(`Please, access Consent URL and accept: ${this.consentUrl}`)
        }
      }
    }
    return null
  }

  private makeFile(invitation: Invitation) {
    const content = readFileSync(Application.resourcesPath('docusign/contract.docx'), 'binary')
    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    })

    doc.render({
      company_name: invitation.company.user.name,
      company_email: invitation.company.user.email,
      company_phone: invitation.company.user.phone,
      company_cnpj: invitation.company.cnpj,
      collaborator_name: invitation.collaborator.user.name,
      collaborator_email: invitation.collaborator.user.email,
      collaborator_phone: invitation.collaborator.user.phone,
      collaborator_cpf: invitation.collaborator.cpf,
      description: invitation.description,
      start_date: invitation.startDate.toLocaleString(),
      end_date: invitation.endDate.toLocaleString(),
      budget: invitation.budget,
    })

    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    })

    return buf
  }

  public async makeEnvelope(accessToken: string, invitation: Invitation): Promise<any> {
    const base64Doc = Buffer.from(this.makeFile(invitation)).toString('base64')

    try {
      const envelope = await axios.post(
        `${this.apiBasePath}/restapi/v2/accounts/${this.accountId}/envelopes`,
        {
          recipients: {
            signers: [
              {
                email: invitation.company.user.email,
                name: invitation.company.user.name,
                recipientId: '1',
                tabs: {
                  signHereTabs: [
                    {
                      anchorString: 'ASSINATURA CONTRATANTE',
                      anchorUnits: 'pixels',
                      anchorXOffset: '65',
                      anchorYOffset: '-40',
                    },
                  ],
                  dateSignedTabs: [
                    {
                      pageNumber: '2',
                      anchorString: 'ASSINATURA CONTRATANTE',
                      anchorUnits: 'pixels',
                      anchorXOffset: '50',
                      anchorYOffset: '40',
                      fontSize: '5',
                    },
                  ],
                },
              },
              {
                email: invitation.collaborator.user.email,
                name: invitation.collaborator.user.name,
                recipientId: '2',
                tabs: {
                  signHereTabs: [
                    {
                      anchorString: 'ASSINATURA CONTRATADO',
                      anchorUnits: 'pixels',
                      anchorXOffset: '65',
                      anchorYOffset: '-40',
                    },
                  ],
                  dateSignedTabs: [
                    {
                      pageNumber: '2',
                      anchorString: 'ASSINATURA CONTRATADO',
                      anchorUnits: 'pixels',
                      anchorXOffset: '50',
                      anchorYOffset: '40',
                      fontSize: '5',
                    },
                  ],
                },
              },
            ],
          },
          emailSubject: `Contrato de ${invitation.company.user.name} para ${invitation.collaborator.user.name}`,
          documents: [
            {
              documentId: '1',
              documentBase64: base64Doc,
              name: `${invitation.company.user.name} Contract`,
              fileExtension: 'doc',
            },
          ],
          notification: {
            expirations: {
              expireEnabled: 'true',
              expireAfter: `${DateTimeHelper.diffInDays(
                DateTime.now().startOf('day'),
                DateTime.fromISO(invitation.endDate.toString())
              )}`,
              expireWarn: '2',
            },
          },
          status: 'sent',
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return envelope.data
    } catch (error) {
      console.log(error)
    }
  }
}
