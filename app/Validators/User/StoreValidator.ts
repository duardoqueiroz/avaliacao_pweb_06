import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({}, [
      rules.email(),
      rules.required(),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    password: schema.string({}, [
      rules.required(),
      rules.minLength(8),
      rules.confirmed('password_confirmation'),
    ]),
    username: schema.string({}, [
      rules.required(),
      rules.unique({ table: 'users', column: 'username' }),
    ]),
    name: schema.string({}, [rules.required()]),
    phone: schema.string({}, [
      rules.required(),
      rules.mobile({ locale: ['pt-BR'] }),
      rules.unique({ table: 'users', column: 'phone' }),
    ]),
  })

  public messages: CustomMessages = {}
}
