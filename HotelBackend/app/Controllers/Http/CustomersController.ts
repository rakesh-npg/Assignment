import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Customer from 'App/Models/Customer'
import CustomerValidator from 'App/Validators/CustomerValidator'
import Hotel from 'App/Models/Hotel'


export default class CustomersController {
    public async create({request}:HttpContextContract) {
        console.log(request)
        const payload = await request.validate(CustomerValidator)
        console.log('validation working')
        const newCustomer = new Customer() 
        newCustomer.customer_id = payload.customerId
        await newCustomer.save()
        let data = this.test() 
        return Customer.all() 
        
    }

    public async update({request}:HttpContextContract) {
        const searchVal = request.input('tableId')
        const payload = await request.validate(CustomerValidator)
        let seachCustomer = await Customer.findByOrFail("table_id", searchVal)
        seachCustomer.customer_name = payload.customerName
        await seachCustomer.save() 
        return Customer.all() 
    }

    public async read({request}:HttpContextContract) {
        return await Database
        .from((query) =>
        query
        .from('customers')
        .join('hotels', 'customers.customer_id', 'hotels.customer_id')
        .select('customers.customer_id')
        .count('customers.customer_id')
        .groupBy('customers.customer_id')
        .as('query')
        ) .join('customers', 'query.customer_id', 'customers.customer_id')
        
        //return Customer.all() 
    }

    public async delete({request}:HttpContextContract) {
        console.log(request.params().id)
        let val:number = request.params().id
        console.log(val)
        let delCustomer = await Customer.findByOrFail("table_id", val)
        await delCustomer.delete() 
        return Customer.all() 
    }

    public async insertMany({request}:HttpContextContract) {
        const newCustomer = await Customer.createMany([
            {
                customer_name : "Jacob",
                customer_id: 1,
            },
            {
                customer_name : "James",
                customer_id: 2,
            },
            {
                customer_name : "Jake",
                customer_id: 3,
            },
            {
                customer_name : "Jake",
                customer_id: 4,
            },
            {
                customer_name : "Jake",
                customer_id: 5,
            },
            
        ])

        return Customer.all() 
        
    }

    public async search({request}:HttpContextContract) {
        let test = request.input('searchVal')
        console.log(test)
        let a =  await Database
        .from((subquery) =>{
            subquery
        .from((query) =>
        query
        .from('customers')
        .join('hotels', 'customers.customer_id', 'hotels.customer_id')
        .select('customers.customer_id')
        .count('customers.customer_id')
        .groupBy('customers.customer_id')
        .as('query')
        ) .join('customers', 'query.customer_id', 'customers.customer_id')
        .as('subquery')
        }).select('subquery.*')
        .where((query) => {
           if(/\d/.test(test)){
                query.where('table_id', test)
                
           }
        })
        .orWhere((query) => {
            query.whereILike('customer_name',`%${test}%`)
        
        })
        console.log(a)

    }

    public async sort({request}: HttpContextContract) {
        let type = request.input('sortType')
        let column = request.input('col')
        return await Database
        .from((subquery) =>{
            subquery
        .from((query) =>
        query
        .from('customers')
        .join('hotels', 'customers.customer_id', 'hotels.customer_id')
        .select('customers.customer_id')
        .count('customers.customer_id')
        .groupBy('customers.customer_id')
        .as('query')
        ) .join('customers', 'query.customer_id', 'customers.customer_id')
        .as('subquery')
        }).select('*')
        
        .orderBy(`${column}`, `${type}`)
    }

    public async test() {

        return await Database.rawQuery(

''
        )
//         return await Database.rawQuery(
// 'select (select row_to_json(address) from (select hotels.hotel_landmark, hotels.hotel_doorno) as address) from hotels'
//         )


        // let data =  await Hotel
        // .query() 
        // .select('hotels.*')
        // return data
        // return await Hotel
        // .query()
        //     .from((up) => {
        //         up.from((sub) => {   
        //             sub.from((query) => {
        //                 query.select('address', 'hotels.customer_id', 'hotels.hotel_name', 'hotels.id')
        //                 .from('hotels')
        //                 .join((subquery) => {
        //                     subquery.from('hotels')
        //                 .select('hotels.id as id', 'hotels.hotel_doorno as doorno', 'hotels.hotel_landmark', 'hotels.hotel_pincode')
        //                 .as('address')
        //             }, 'address.id', 'hotels.id')
        //             .as('lap')
        //             })
        //             .as('data')
        //         }).leftJoin('customers', 'data.customer_id', 'customers.customer_id')
        //         .select('data.*', 'customers.customer_name')
        //         .as('val')
        //     })
        //     .select(Database.raw('select row_to_json(val)').wrap('(', ')'))
        // }
    
}
