/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'


Route.get('/', async () => {
  return { hello: 'world' }
})


Route.group(() => {
  
  Route.post('/create', "CustomersController.create")
  Route.post('/update', "CustomersController.update")
  Route.get('/read', "CustomersController.read")
  Route.delete('/delete/:id',"CustomersController.delete" )
  Route.get('/all', "CustomersController.insertMany" )
  
}).prefix('/cust') 


Route.group(() => {
  
  Route.post('/create', "HotelsController.create")
  Route.post('/update', "HotelsController.update")
  Route.get('/read', "HotelsController.read")
  Route.delete('/delete/:id',"HotelsController.delete" )
  Route.get('/all', "HotelsController.insertMany" )
  Route.post('/search',"HotelsController.search" )
  Route.post('/sort', "HotelsController.sort")
  
}).prefix('/hotel')