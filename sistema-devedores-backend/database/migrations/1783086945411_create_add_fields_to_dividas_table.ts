import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'dividas'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.date('data_vencimento')
      table.enum('status', ['PENDENTE', 'PAGA']).defaultTo('PENDENTE')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('data_vencimento')
      table.dropColumn('status')
    })
  }
}