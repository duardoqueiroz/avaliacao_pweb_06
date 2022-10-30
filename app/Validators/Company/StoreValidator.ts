import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    cnpj: schema.string({}, [
      rules.cnpj(),
      rules.required(),
      rules.unique({ table: 'companies', column: 'cnpj' }),
    ]),
  })

  public messages: CustomMessages = {}
}
