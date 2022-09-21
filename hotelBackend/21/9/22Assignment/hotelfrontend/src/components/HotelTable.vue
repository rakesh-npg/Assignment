<template>
    <div>
        <v-btn @click="(() => flagData.formFlag = true)">New Entry</v-btn>

        <v-simple-table>
            <thead>
                <tr>
                   <th
                   v-for="head in tableHeaders" :key="head">{{head}}</th>
                </tr>
            </thead>

        </v-simple-table>

        <v-dialog v-model="flagData.formFlag">   
            <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                    New Entry 
                    </v-card-title>

                        
                    <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                    >

                        <v-text-field
                        v-model="formData.id"
                        label="ID" v-if="flagData.editForm">
                        
                        </v-text-field>
                
                        <v-text-field
                        v-model="formData.hotelName"
                        label="Name">
                        
                        </v-text-field>
                
                        <v-text-field
                        v-model="formData.hotelDoorno"
                        label="Door No">
                        
                        </v-text-field>
            

                        <v-text-field
                        v-model="formData.hotelLandmark"
                        label="Landmark">
                        
                        </v-text-field>
                        
                        <v-text-field 
                        v-model="formData.hotelPincode"  
                        label="pincode"
                        >
                        </v-text-field>

                        <v-text-field 
                        v-model="formData.customerID"  
                        label="customer ID"
                        >
                        </v-text-field>

                        <v-btn @click="validateForm" v-if="!flagData.editForm">
                        Submit
                        </v-btn>
                        
                        <v-btn @click="editForm" v-if="flagData.editForm">
                        Edit
                        </v-btn>

                    </v-form>

                </v-card>
            </v-dialog> 
        
    </div>
</template>


<script>
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios)

export default{
    data() {
        return {
            formData:{
                id: "", 
                hotelName: "", 
                hotelDoorno: "", 
                hotelLandmark: "", 
                hotelPincode: "", 
                cusomterId: "", 
            }, 
            flagData: {
                editForm: false,
                formFlag: false,  
            }, 
            tableHeaders: ["id", "address", "customerId"]

        }
    }, 
    methods: {
        async validateForm() {
            this.$refs.form.validate() 
            await axios.post('http://127.0.0.1:3333/hotel/create', this.formData)
            .then((resposne) => console.log(resposne))
        },

        async editForm() {
            this.$refs.form.validate() 
            await axios.post('http://127.0.0.1:3333/hotel/create', this.formData)
            .then((resposne) => console.log(resposne))
        }
    }, 
}

</script>