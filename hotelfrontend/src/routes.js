import HotelTable from './components/HotelTable.vue';
import CustomerTable from './components/CustomerTable.vue';
import TestVue from './components/TestVue.vue'
export default[
    {
        path: '/Customer', 
        component: CustomerTable, 
        name: 'Customer'
    },
    {
        path: '/Hotel', 
        component: HotelTable, 
        name: 'Hotel'
    }, 
    {
        path: '/', 
        component: TestVue, 
        name: 'TEst'
    }
     

]