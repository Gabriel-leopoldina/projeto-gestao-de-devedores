import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'devedores'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('cep', 10).nullable()
      table.string('rua', 120).nullable()
      table.string('numero', 10).nullable()
      table.string('complemento', 100).nullable()
      table.string('bairro', 80).nullable()
      table.string('cidade', 80).nullable()
      table.string('uf', 2).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns(
        'cep',
        'rua',
        'numero',
        'complemento',
        'bairro',
        'cidade',
        'uf'
      )
    })
  }
}