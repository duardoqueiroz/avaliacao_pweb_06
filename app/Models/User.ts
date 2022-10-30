import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Company from './Company'
import Collaborator from './Collaborator'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public name: string

  @column()
  public username: string

  @column()
  public phone: string

  @column()
  public rememberMeToken: string | null

  @hasOne(() => Company, {
    foreignKey: 'id',
  })
  public company: HasOne<typeof Company>

  @hasOne(() => Collaborator, {
    foreignKey: 'id',
  })
  public collaborator: HasOne<typeof Collaborator>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
