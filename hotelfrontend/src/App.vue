<template>
  <v-app>
    <HotelTable/>
    <CustomerTable/>
    <v-main>
    </v-main>
  </v-app>
</template>

<script>

import HotelTable from './components/HotelTable.vue';
import CustomerTable from './components/CustomerTable.vue';
export default {
  name: 'App',

  components: {
    HotelTable,
    CustomerTable,
},

  data: () => ({
    //
  }),
};
</script>
