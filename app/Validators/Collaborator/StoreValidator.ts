import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    cpf: schema.string({}, [
      rules.cpf(),
      rules.required(),
      rules.unique({ table: 'collaborators', column: 'cpf' }),
    ]),
  })

  public messages: CustomMessages = {}
}
