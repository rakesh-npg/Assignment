import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'hotels'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('hotel_name').notNullable()
      table.string('hotel_doorno').notNullable()
      table.string('hotel_landmark').notNullable()
      table.integer('hotel_pincode').notNullable()
      table.integer('customer_id').notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
