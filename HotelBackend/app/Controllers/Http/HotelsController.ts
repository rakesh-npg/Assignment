import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Hotel from 'App/Models/Hotel'
import HotelValidator from 'App/Validators/HotelValidator'
import Customer from 'App/Models/Customer'
// import { count } from 'rxjs'

export default class HotelsController {
    public async create({request}:HttpContextContract) {
        console.log(request.requestBody)
        const payload = await request.validate(HotelValidator)
        console.log('validation working')
        const newHotel = new Hotel() 
        newHotel.hotelName = payload.hotelName 
        newHotel.hotelDoorno = payload.hotelDoorno
        newHotel.hotelLandmark = payload.hotelLandmark
        newHotel.hotelPincode = payload.hotelPincode
        newHotel.customerId = payload.customerId
        await newHotel.save() 
        return this.read() 
        
    }
    public async update({request}:HttpContextContract) {
        const payload = await request.validate(HotelValidator)
        let searchHotel = await Hotel.findByOrFail("id", request.input('id'))
        searchHotel.hotelName = payload.hotelName
        searchHotel.hotelDoorno = payload.hotelDoorno
        searchHotel.hotelLandmark = payload.hotelLandmark
        searchHotel.hotelPincode = payload.hotelPincode
        searchHotel.customerId = payload.customerId 
        await searchHotel.save() 
        return  this.read() 
    }
    

    public async read() {
        let data =  await Hotel.query()
        .select('*')
        .select(Database.raw(`json_build_object('doorNo', hotel_doorno, 'landMark', hotel_landmark, 'pincode', hotel_pincode) as address`))
        .join('customers', 'hotels.customer_id', 'customers.customer_id')
        .orderBy('customers.customer_name', 'desc')
        .then(d => d.map((h) => {
            const data = h.toJSON()
            //console.log(h)
            return {
                ...data,
                address: h.$extras.address,
                customerName: h.$extras.customer_name
            }
        }))
        
        return data
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
                "hotelName": "McDonalds", 
                "hotelDoorno": "13B", 
                "hotelLandmark": "Satyabama",
                "hotelPincode" : 600100, 
                "customerId": 2, 
            },
            {
                "hotelName": "Thalpakatti", 
                "hotelDoorno": "12A", 
                "hotelLandmark": "NGP",
                "hotelPincode" : 600101, 
                "customerId": 2, 
            },
            {
                "hotelName": "10Muffins", 
                "hotelDoorno": "35C", 
                "hotelLandmark": "KamalHouse",
                "hotelPincode" : 600028, 
                "customerId": 3, 
            },
            {
                "hotelName": "10Muffins", 
                "hotelDoorno": "16", 
                "hotelLandmark": "IndiaBUlls",
                "hotelPincode" : 600100, 
                "customerId": 4, 
            },
            {
                "hotelName": "Nicky", 
                "hotelDoorno": "1B", 
                "hotelLandmark": "Hiranandini",
                "hotelPincode" : 600099, 
                "customerId": 4, 
            },
            
        ])

        return this.read() 
        
    }

    public async search({request}:HttpContextContract) {
        let test = request.input('searchVal')
        //test ='600100'
        let data =  await Hotel.query()
        .select('*')
        .select(Database.raw(`json_build_object('doorNo', hotel_doorno, 'landMark', hotel_landmark, 'pincode', hotel_pincode) as address`))
        .join('customers', 'hotels.customer_id', 'customers.customer_id')
        .where((query) => {
            if(/\d/.test(test)){
                //console.log('test')
            query.where('hotels.hotel_pincode', test)
            .orWhere('hotels.customer_id', test) 
            .orWhere('id', test)
            }
        })
        .orWhere((query) => {
            query.whereILike('hotelName', `${test}%`)
        })
        .then(d => d.map(h => {
            const dataVal = h.toJSON()
            return {
                ...dataVal,
                address: h.$extras.address
                customerName: h.$extras.customer_name
            }
        }))

        

        return data

    }

    public async sort({request}: HttpContextContract) {
        let type = request.input('sortType')
        let column = request.input('col')
        if(column == 'name') column = 'hotelName'
        else if(column == 'customer_id') column = 'hotels.customer_id'
        else if(column == 'customerName') column = 'customers.customer_name'
        else if(column == 'address')  column = 'hotels.hotel_pincode'
        console.log(column)
        let dataVal =  await Hotel.query()
        .select('*')
        .select(Database.raw(`json_build_object('doorNo', hotel_doorno, 'landMark', hotel_landmark, 'pincode', hotel_pincode) as address`))
        .join('customers', 'hotels.customer_id', 'customers.customer_id')
        .orderBy(`${column}`, `${type}`)
        .then(d => d.map(h => {
            const dataVal = h.toJSON()
            return {
                ...dataVal,
                address: h.$extras.address
                customerName: h.$extras.customer_name
            }
        }))

        return dataVal
        
        
    }

    public async test({request}: HttpContextContract) {
        

        let data =  await Hotel.query()
        .select('hotelName', 'id')
        .select(Database.raw(`json_build_object('doorNo', hotelDoorno, 'landMark', hotelLandmark, 'pincode', hotelPincode) as address`))
        .then(d => d.map(h => {
            const data = h.toJSON()
            return {
                ...data,
                address: h.$extras.address
            }
        }))

        return data
        
      
     
}
}

