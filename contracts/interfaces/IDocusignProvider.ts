import Invitation from 'App/Models/Invitation'

export interface IDocusignProvider {
  makeEnvelope(accessToken: string, invitation: Invitation): Promise<any>
  getJwt(): Promise<string>
}
