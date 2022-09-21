import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Customer from 'App/Models/Customer'
import CustomerValidator from 'App/Validators/CustomerValidator'


export default class CustomersController {
    public async create({request}:HttpContextContract) {
        console.log(request)
        const payload = await request.validate(CustomerValidator)
        console.log('validation working')
        const newCustomer = new Customer() 
        newCustomer.customer_name = payload.customerName
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
        .where((query) => {
            if(/\d/.test(test)){
            query.where('customer_id', test)
            }
        })
        .orWhere((query) => {
            query.where('customer_name','ilike',"%"+test)
        
        })

    }

    public async sort({request}: HttpContextContract) {
        let type = request.input('sortType')
        console.log(type)
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
        //.orderBy('customer_name', 'asc')
        
        .orderBy(`${column}`, `${type}`)
    }

    public async test() {
        return await Database
        .from((query) =>
        query
        .from('customers')
        .join('hotels', 'customers.customer_id', 'hotels.customer_id')
        .select('customers.*')
        .count('customers.customer_id')
        .groupBy('customers.customer_id','customers.table_id')
        .as('query')
        ) //.join('customers', 'query.customer_id', 'customers.customer_id')
        

    }
    
}
