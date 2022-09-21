import { DateTime } from 'luxon'
import { afterFetch, afterFind, BaseModel, beforeFetch, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'

export default class Hotel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column() 
  public hotel_name:string 

  @column() 
  public hotel_doorno:string 

  @column() 
  public hotel_landmark:string 

  @column() 
  public hotel_pincode:number 

  @column() 
  public customer_id:number
  
  @afterFetch()
  public static async processMarkdown(post) {
    console.log(post)
    return "test"
  }

  // @beforeFetch() 
  // public static async test() {

}
