import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  public table_id: number

  @column() 
  public customer_id: number 

  @column() 
  public customer_name: string 
}
