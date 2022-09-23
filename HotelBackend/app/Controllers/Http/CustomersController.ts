import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Customer from 'App/Models/Customer'
import CustomerValidator from 'App/Validators/CustomerValidator'
import Hotel from 'App/Models/Hotel'


export default class CustomersController {
    public async create({request}:HttpContextContract) {
        const payload = await request.validate(CustomerValidator)
        const newCustomer = new Customer() 
        newCustomer.customer_id = payload.customerId
        newCustomer.customer_name = payload.customerName
        await newCustomer.save()
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

    public async read() {
        let data = await Customer.query() 
        .from((query) =>
        query
        .from('customers')
        .leftJoin('hotels', 'customers.customer_id', 'hotels.customer_id')
        .select('customers.customer_id')
        .groupBy('customers.customer_id')
        .count('hotels.customer_id')
        .as('query')
        ) .join('customers', 'query.customer_id', 'customers.customer_id')
        .then(d => d.map((h) => {
            return Object.assign({}, h.$attributes, h.$extras)
        }))

        return data
        
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

    public async insertMany() {
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
        //test = 'James'
        let data = await Customer.query() 
        .from((query) =>
        query
        .from('customers')
        .leftJoin('hotels', 'customers.customer_id', 'hotels.customer_id')
        .select('customers.customer_id')
        .groupBy('customers.customer_id')
        .count('hotels.customer_id')
        .as('query')
        ) .join('customers', 'query.customer_id', 'customers.customer_id')
        .where((query) => {
            if(/\d/.test(test)){
                 query.where('table_id', test)
            }
         })
         .orWhere((query) => {
             query.whereILike('customer_name',`${test}%`)
         
         })
        .then(d => d.map((h) => {
            return Object.assign({}, h.$attributes, h.$extras)
        }))
        return data
        
    }

    public async sort({request}: HttpContextContract) {
        let type = request.input('sortType')
        let column = request.input('col')

        if(column == 'customer_id') column = 'query.customer_id'
        else if(column == 'table_id') column = 'table_id'
        else if(column == 'customer_name') column == 'query.customer_name'

        let data = await Customer.query() 
        .from((query) =>
        query
        .from('customers')
        .leftJoin('hotels', 'customers.customer_id', 'hotels.customer_id')
        .select('customers.customer_id')
        .groupBy('customers.customer_id')
        .count('hotels.customer_id')
        .as('query')
        ) .join('customers', 'query.customer_id', 'customers.customer_id')
        .orderBy(`${column}`, `${type}`)
        .then(d => d.map((h) => {
            return Object.assign({}, h.$attributes, h.$extras)
        }))
        return data 
    }

    public async test() {
        return Customer.all() 
    }

}
