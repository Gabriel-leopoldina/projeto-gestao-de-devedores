import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'devedores'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('nome').notNullable()

      table.string('cpf', 14).unique().nullable()
      table.string('cnpj', 18).unique().nullable()
      table.string('telefone', 20).nullable()

      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}