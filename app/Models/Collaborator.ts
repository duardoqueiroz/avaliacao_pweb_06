import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  belongsTo,
  BelongsTo,
  column,
  computed,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import { INVITATION_STATUS } from 'Contracts/enums/INVITATION_STATUS'
import Company from './Company'
import Invitation from './Invitation'
import User from './User'

export default class Collaborator extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public cpf: string

  @belongsTo(() => User, {
    foreignKey: 'id',
  })
  public user: BelongsTo<typeof User>

  @hasMany(() => Invitation)
  public invitations: HasMany<typeof Invitation>

  @manyToMany(() => Company, {
    pivotTable: 'invitations',
    onQuery: (query) => {
      query.where('invitations.status', INVITATION_STATUS.CONTRACTED)
    },
  })
  public companies: ManyToMany<typeof Company>

  @computed()
  public get sales() {
    return this.invitations
      .filter((i) => i.status === INVITATION_STATUS.CONTRACTED)
      .map((i) => i.budget)
      .reduce((a, b) => a + b)
  }

  @beforeFetch()
  @beforeFind()
  public static async eagerLoadRelations(query: ModelQueryBuilderContract<typeof Collaborator>) {
    query.preload('user')
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
