import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { INVITATION_STATUS } from 'Contracts/enums/INVITATION_STATUS'

export default class extends BaseSchema {
  protected tableName = 'invitations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .enum('status', [
          INVITATION_STATUS.ACCEPTED,
          INVITATION_STATUS.CANCELED,
          INVITATION_STATUS.PENDING,
          INVITATION_STATUS.REJECTED,
          INVITATION_STATUS.CONTRACTED,
        ])
        .defaultTo(INVITATION_STATUS.PENDING)
        .notNullable()
      table.string('envelope_id')
      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table.text('description').notNullable()
      table.decimal('budget').notNullable()
      table
        .integer('collaborator_id')
        .notNullable()
        .unique()
        .references('id')
        .inTable('collaborators')
        .onDelete('CASCADE')
      table
        .integer('company_id')
        .notNullable()
        .references('id')
        .inTable('companies')
        .onDelete('CASCADE')
      table.primary(['collaborator_id', 'company_id'])
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
