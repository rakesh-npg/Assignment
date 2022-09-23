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
    

    public async read() {
        let data =  await Hotel.query()
        .select('*')
        .select(Database.raw(`json_build_object('doorNo', hotel_doorno, 'landMark', hotel_landmark, 'pincode', hotel_pincode) as address`))
        .join('customers', 'hotels.customer_id', 'customers.customer_id')
        .then(d => d.map(h => {
            const data = h.toJSON()
            //console.log(h)
            return {
                ...data,
                address: h.$extras.address
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
        let dataVal =  await Hotel.query()
        .select('*')
        .select(Database.raw(`json_build_object('doorNo', hotel_doorno, 'landMark', hotel_landmark, 'pincode', hotel_pincode) as address`))
        .where((query) => {
            query.where('hotel_name', test)
        })
        .orWhere((query) => {
            if(/\d/.test(test)){
            query.where('hotel_pincode', test)
            .orWhere('customer_id', test)
            .orWhere('id', test)
            }
        })
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

    public async sort({request}: HttpContextContract) {
        let type = request.input('sortType')
        let column = request.input('col')
        if(column == 'name') column = 'hotel_name'
        else if(column == 'customerId') column = 'customer_id'
        else if(column == 'customerName') column = 'customer_name'
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
        .select('hotel_name', 'id')
        .select(Database.raw(`json_build_object('doorNo', hotel_doorno, 'landMark', hotel_landmark, 'pincode', hotel_pincode) as address`))
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

