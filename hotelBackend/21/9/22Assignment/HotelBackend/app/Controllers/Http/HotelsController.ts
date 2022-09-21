import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Hotel from 'App/Models/Hotel'
import HotelValidator from 'App/Validators/HotelValidator'

// import { count } from 'rxjs'

export default class HotelsController {
    public async create({request}:HttpContextContract) {
        console.log(request.requestBody)
        const payload = await request.validate(HotelValidator)
        console.log('validation working')
        const newHotel = new Hotel() 
        newHotel.hotel_name = payload.hotelName 
        newHotel.hotel_doorno = payload.hotelDoorno
        newHotel.hotel_landmark = payload.hotelLandmark
        newHotel.hotel_pincode = payload.hotelPincode
        newHotel.customer_id = payload.customerId
        await newHotel.save() 
        return this.read() 
        
    }
    public async update({request}:HttpContextContract) {
        const payload = await request.validate(HotelValidator)
        let searchHotel = await Hotel.findByOrFail("id", request.input('id'))
        searchHotel.hotel_name = payload.hotelName
        searchHotel.hotel_doorno = payload.hotelDoorno
        searchHotel.hotel_landmark = payload.hotelLandmark
        searchHotel.hotel_pincode = payload.hotelPincode
        searchHotel.customer_id = payload.customerId 
        await searchHotel.save() 
        return  this.read() 
    }
    protected async innerRead() {
        return  await Database
        .from(
            (query) => {query
        .from('hotels')
        .leftJoin('customers', 'hotels.customer_id', 'customers.customer_id')
        .select('hotels.*')
        .select('customers.customer_name')
        .as('val')
            })
    }

    protected async addressAdder(datas) {
        let finalData = [] 
        for(let i =0; i<datas.length;i++){

            let address = {
                "doorNo" : datas[i].hotel_doorno, 
                "landmark": datas[i].hotel_landmark, 
                "pincode" : datas[i].hotel_pincode
            }

            let completeData = {
                "id": datas[i].id, 
                "address": address, 
                "customerId": datas[i].customer_id, 
                "name":datas[i].hotel_name,
                "customerName":datas[i].customer_name
            }
            finalData.push(completeData)
        }
        console.log(finalData)

        return JSON.stringify(finalData)

    }

    public async read() {
        let datas =  await this.innerRead() 
        return this.addressAdder(datas) 
    }

    public async delete({request}:HttpContextContract) {
        let val:number = request.params().id
        let delHotel = await Hotel.findByOrFail("id", val)
        await delHotel.delete() 
        return  this.read() 
    }

    public async insertMany({request}:HttpContextContract) {
        const newHotel = await Hotel.createMany([
            {
                "hotel_name": "McDonalds", 
                "hotel_doorno": "13B", 
                "hotel_landmark": "Satyabama",
                "hotel_pincode" : 600100, 
                "customer_id": 2, 
            },
            {
                "hotel_name": "Thalpakatti", 
                "hotel_doorno": "12A", 
                "hotel_landmark": "NGP",
                "hotel_pincode" : 600101, 
                "customer_id": 2, 
            },
            {
                "hotel_name": "10Muffins", 
                "hotel_doorno": "35C", 
                "hotel_landmark": "KamalHouse",
                "hotel_pincode" : 600028, 
                "customer_id": 3, 
            },
            {
                "hotel_name": "10Muffins", 
                "hotel_doorno": "16", 
                "hotel_landmark": "IndiaBUlls",
                "hotel_pincode" : 600100, 
                "customer_id": 4, 
            },
            {
                "hotel_name": "Nicky", 
                "hotel_doorno": "1B", 
                "hotel_landmark": "Hiranandini",
                "hotel_pincode" : 600099, 
                "customer_id": 4, 
            },
            
        ])

        return this.read() 
        
    }

    public async search({request}:HttpContextContract) {
        let test = request.input('searchVal')
        let data =  await Database
        .from(
            (query) => {query
        .from('hotels')
        .leftJoin('customers', 'hotels.customer_id', 'customers.customer_id')
        .select('hotels.*')
        .select('customers.customer_name')
        .as('val')
            })
        .select('*')
        .where((query) => {
            if(/\d/.test(test)){
            query.where('table_id', test)
            }
        })
        .orWhere((query) => {
            query.where('hotel_name','ilike',"%"+test)
            
        })
        return this.addressAdder(data)

    }

    public async sort({request}: HttpContextContract) {
        let type = request.input('sortType')
        let column = request.input('col')
        console.log(column)
        if(column == 'name') column = 'hotel_name'
        else if(column == 'customerId') column = 'customer_id'
        else if(column == 'customerName') column = 'customer_name'
        let data =   await Database
        .from(
            (query) => {query
        .from('hotels')
        .leftJoin('customers', 'hotels.customer_id', 'customers.customer_id')
        .select('hotels.*')
        .select('customers.customer_name')
        .as('val')
            })
        //.orderBy('hotel_name', 'asc')
        .orderBy(`${column}`, `${type}`)
        return this.addressAdder(data)


    }

    public async test({request}: HttpContextContract) {
        

        return await Database
        .from(
            (query) => {query
        .from('hotels')
        .leftJoin('customers', 'hotels.customer_id', 'customers.customer_id')
        .select('hotels.*')
        .select('customers.customer_name')
        .as('val')
            }).join('customers', 'val.customer_id', )
    }


     
}
