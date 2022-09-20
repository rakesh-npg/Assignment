import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Customer from 'App/Models/Customer'
import CustomerValidator from 'App/Validators/CustomerValidator'


export default class CustomersController {
    public async create({request}:HttpContextContract) {
        const payload = await request.validate(CustomerValidator)
        console.log('validation working')
        const newCustomer = new Customer() 
        newCustomer.customer_name = payload.customerName
        newCustomer.customer_id = payload.customerID
        await newCustomer.save() 
        return Customer.all() 
        
    }

    public async update({request}:HttpContextContract) {
        const tableName =  1//request.input("columName")
        let seachCustomer = await Customer.findByOrFail("customer_id", 1)
        seachCustomer.customer_name = "newTestr"
        await seachCustomer.save() 
        return Customer.all() 
    }

    public async read({request}:HttpContextContract) {
        return Customer.all() 
    }

    public async delete({request}:HttpContextContract) {
        let val:number = request.params().id
        let delCustomer = await Customer.findByOrFail("customer_id", val)
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

    // public async search({request}:HttpContextContract) {
    //     let searchVal = request.input('searchVal')

    // }
    public async search({request}:HttpContextContract) {
        let test = request.input('searchVal')
        return await Database
        .from('customers')
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
        .from('customers')
        .select('*')
        .orderBy(`${column}`, `${type}`)
    }
}
