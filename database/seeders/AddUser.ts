import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Collaborator from 'App/Models/Collaborator'
import Company from 'App/Models/Company'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        id: 1,
        email: 'eduardoldq1@gmail.com',
        password: '12345678',
        name: 'Eduardo Queiroz',
        phone: '(82) 99933-1076',
        username: 'eduardoldq1',
      },
      {
        id: 2,
        email: 'elq1@aluno.ifal.edu.br',
        password: '12345678',
        name: 'Eduardo Lúcio de Queiroz',
        phone: '(82) 99933-1077',
        username: 'elq1',
      },
      {
        id: 3,
        email: 'felipe.alencar@ifal.edu.br',
        password: '12345678',
        name: 'Felipe Alencar',
        phone: '(82) 99933-1078',
        username: 'felipealencar',
      },
    ])
    await Company.create({
      id: 3,
      cnpj: '08417491000182',
    })
    await Collaborator.createMany([
      {
        id: 1,
        cpf: '11736132423',
      },
      {
        id: 2,
        cpf: '11736132424',
      },
    ])
  }
}
