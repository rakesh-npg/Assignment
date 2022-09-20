import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Hotel from 'App/Models/Hotel'
import HotelValidator from 'App/Validators/HotelValidator'

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
        let seachHotel = await Hotel.findByOrFail("id", 1)
        seachHotel.hotel_name = "newTestr"
        await seachHotel.save() 
        return  this.read() 
    }

    public async read() {
        let datas = await Hotel.all() 
       
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
                "customerId": datas[i].customer_id
            }
            finalData.push(completeData)
        }
        console.log(finalData)

        return JSON.stringify(finalData)
        
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
        return await Database
        .from('hotels')
        .select('*')
        .where((query) => {
            if(/\d/.test(test)){
            query.where('id', test)
            .orWhere('customer_id',"%"+test+"%")
            }
        })
        .orWhere((query) => {
            query.where('hotel_name','ilike',"%"+test)
            .orWhere('hotel_doorno','ilike',"%"+test)
            .orWhere('hotel_landmark','ilike',"%"+test)
            .orWhere('hotel_pincode','ilike',"%"+test)
            
        })

    }

    public async sort({request}: HttpContextContract) {
        let type = request.input('sort')
        let column = request.input('col')
        return await Database
        .from('hotels')
        .select('*')
        .orderBy(`${column}`, `${type}`)
    }
}
