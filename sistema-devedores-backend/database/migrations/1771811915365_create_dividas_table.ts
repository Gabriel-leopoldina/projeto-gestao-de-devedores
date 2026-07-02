import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'dividas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('devedor_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('devedores')
        .onDelete('CASCADE')

      table.string('descricao').notNullable()
      table.decimal('valor', 10, 2).notNullable()

      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}