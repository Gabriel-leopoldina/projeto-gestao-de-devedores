import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Devedor from './devedor.js'
import { DateTime } from 'luxon'

export default class Divida extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare devedorId: number

  @column()
  declare descricao: string

  @column()
  declare valor: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  //RELACIONAMENTO
  @belongsTo(() => Devedor)
  declare devedor: BelongsTo<typeof Devedor>
}