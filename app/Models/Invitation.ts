import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  belongsTo,
  BelongsTo,
  column,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import Company from './Company'
import Collaborator from './Collaborator'
import { INVITATION_STATUS } from 'Contracts/enums/INVITATION_STATUS'

export default class Invitation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public collaboratorId: number

  @column()
  public companyId: number

  @column()
  public description: string

  @column()
  public status: INVITATION_STATUS

  @column()
  public envelopeId: string

  @belongsTo(() => Collaborator)
  public collaborator: BelongsTo<typeof Collaborator>

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>

  @beforeFetch()
  @beforeFind()
  public static async eagerLoadRelations(query: ModelQueryBuilderContract<typeof Invitation>) {
    query.preload('collaborator').preload('company')
  }

  @column.dateTime()
  public startDate: DateTime

  @column.dateTime()
  public endDate: DateTime

  @column()
  public budget: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
