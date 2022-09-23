import { DateTime } from 'luxon'
import { afterFetch, afterFind, BaseModel, beforeFetch, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'

export default class Hotel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column() 
  public hotelName:string 

  @column() 
  public hotelDoorno:string 

  @column() 
  public hotelLandmark:string 

  @column() 
  public hotelPincode:number 

  @column() 
  public customerId:number
  


  // @beforeFetch() 
  // public static async test() {

}
