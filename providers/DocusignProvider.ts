import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import DocusignService from 'App/Services/DocusignService'
export default class DocusignProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton('Docusign', (): DocusignService => {
      const { docusignConfig } = this.app.config.get('docusign')
      return new DocusignService(docusignConfig)
    })
  }

  public async boot() {
    // All bindings are ready, feel free to use them
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
