import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'customers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('table_id').unique().notNullable()
      table.integer('customer_id').notNullable()
      table.string('customer_name').notNullable() 
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
