import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Divida from '#models/divida'

export default class Devedor extends BaseModel {
  public static table = 'devedores'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare cpf: string

  @column()
  declare cnpj: string

  @column()
  declare valor: number

  @column()
  declare telefone: string

  @hasMany(() => Divida, { foreignKey: 'devedorId' })
  declare dividas: HasMany<typeof Divida>
}