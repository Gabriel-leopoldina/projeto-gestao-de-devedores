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

  @column()
  declare cep?: string

  @column()
  declare rua?: string

  @column()
  declare numero?: string

  @column()
  declare complemento?: string

  @column()
  declare bairro?: string

  @column()
  declare cidade?: string

  @column()
  declare uf?: string

  @hasMany(() => Divida, { foreignKey: 'devedorId' })
  declare dividas: HasMany<typeof Divida>
}