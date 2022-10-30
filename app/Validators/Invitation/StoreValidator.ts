import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    collaborator_id: schema.number([
      rules.exists({ table: 'collaborators', column: 'id' }),
      rules.required(),
    ]),
    company_id: schema.number([
      rules.exists({ table: 'companies', column: 'id' }),
      rules.required(),
    ]),
    description: schema.string({}, [rules.required(), rules.minLength(50)]),
    budget: schema.number([rules.required(), rules.unsigned(), rules.range(0, 100_000_000)]),
    start_date: schema.date({}, [
      rules.required(),
      rules.after('today'),
      rules.beforeField('end_date'),
    ]),
    end_date: schema.date({}, [
      rules.required(),
      rules.after('today'),
      rules.afterField('start_date'),
    ]),
  })

  public messages: CustomMessages = {}
}
