import { validator } from '@ioc:Adonis/Core/Validator'
import { isCNPJ, isCPF } from 'brazilian-values'

validator.rule('cpf', (value, _, options) => {
  if (typeof value !== 'string') {
    return
  }

  if (!isCPF(value)) {
    options.errorReporter.report(
      options.pointer,
      'cpf',
      'cpf validation failed',
      options.arrayExpressionPointer
    )
  }
  options.mutate(value.replace(/[^\d]+/g, ''))
})

validator.rule('cnpj', (value, _, options) => {
  if (typeof value !== 'string') {
    return
  }

  if (!isCNPJ(value)) {
    options.errorReporter.report(
      options.pointer,
      'cnpj',
      'cnpj validation failed',
      options.arrayExpressionPointer
    )
  }
  options.mutate(value.replace(/[^\d]+/g, ''))
})
