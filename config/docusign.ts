import Env from '@ioc:Adonis/Core/Env'

export const docusignConfig = {
  integrationKey: Env.get('DOCUSIGN_INTEGRATION_KEY'),
  secretKey: Env.get('DOCUSIGN_SECRET_KEY'),
  scopes: ['signature', 'impersonation'],
  redirectUri: Env.get('DOCUSIGN_REDIRECT_URI'),
  apiBasePath: Env.get('DOCUSIGN_API_BASE_PATH'),
  oAuthBasePath: Env.get('DOCUSIGN_OAUTH_BASE_PATH'),
  userId: Env.get('DOCUSIGN_USER_ID'),
  accountId: Env.get('DOCUSIGN_ACCOUNT_ID'),
}
