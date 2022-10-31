import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
  computed,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Invitation from './Invitation'
import Collaborator from './Collaborator'
import { INVITATION_STATUS } from 'Contracts/enums/INVITATION_STATUS'

export default class Company extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public cnpj: string

  @belongsTo(() => User, {
    foreignKey: 'id',
  })
  public user: BelongsTo<typeof User>

  @hasMany(() => Invitation)
  public invitations: HasMany<typeof Invitation>

  @manyToMany(() => Collaborator, {
    pivotTable: 'invitations',
    onQuery: (query) => {
      query.where('invitations.status', INVITATION_STATUS.CONTRACTED)
    },
  })
  public collaborators: ManyToMany<typeof Collaborator>

  @computed()
  public get sales() {
    return this.invitations.filter((i) => i.status === INVITATION_STATUS.CONTRACTED).length > 0
      ? this.invitations
          .filter((i) => i.status === INVITATION_STATUS.CONTRACTED)
          .map((i) => i.budget)
          .reduce((a, b) => a + b)
      : 0
  }

  @beforeFetch()
  @beforeFind()
  public static async eagerLoadRelations(query: ModelQueryBuilderContract<typeof Company>) {
    query.preload('user')
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
