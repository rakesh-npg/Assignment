<template>
    <div>
        <SearchBox @searchEmitPop="searchFunc"/>

        <v-btn @click="(() => flagData.formFlag = true)">New Entry</v-btn>

        <v-simple-table>
            <thead>
                <tr>
                   <th
                   v-for="(head, i) in tableHeaders" :key="head">
                   {{head}}
                   <template v-if="head != 'edit/delete'">
                        <v-icon small @click="sortData(i, head)">mdi-arrow-down</v-icon>
                   </template>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="data in tableData" :key="data.id">
                    <td v-for="column in tableHeaders" :key="column">
                    
                    <template v-if="column != 'address'">
                        {{data[column]}}
                    </template>

                    <template v-if="column == 'edit/delete'">
                        <v-icon small @click="editData(data)">mdi-pencil</v-icon>
                        <v-icon small @click="deleteData(data)">mdi-delete</v-icon>
                    </template>

                    <template v-if="column == 'address'">
                        DoorNo {{ data[column]['doorNo']}}
                        Landmark {{ data[column]['landmark']}}
                        pincode{{ data[column]['pincode']}}
                    </template>
                </td>
                </tr>
            </tbody>

        </v-simple-table>

        <v-dialog v-model="flagData.formFlag" @click:outside="clickOut">   
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
                        v-model="formData.customerId"  
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
import SearchBox from './SearchBox.vue';
Vue.use(VueAxios, axios)

export default{
    data() {
        return {
            formData: {
                id: "",
                hotelName: "",
                hotelDoorno: "",
                hotelLandmark: "",
                hotelPincode: "",
                customerId: "",
            },
            flagData: {
                editForm: false,
                formFlag: false,
                sortArrow: [false, false, false],
            },
            tableHeaders: ["id","hotel_name", "address", "customer_id","customerName", "edit/delete"],
            tableData: [
            ]
        };
    },
    mounted() {
        this.read() 
    },

    methods: {
        async read() {
            axios.get('http://127.0.0.1:3333/hotel/read')
            .then((response) =>{
            console.log(response)
            this.tableData = response.data})
        },
        

        async validateForm() {
            this.$refs.form.validate();
            console.log("vlaidation done");
            console.log(this.formData)
            await axios.post('http://127.0.0.1:3333/hotel/create', this.formData)
            .then((resposne) => console.log(resposne))
            this.$refs.form.reset();
            this.flagData.formFlag = false 
            this.read() 
        },
        async editForm() {
            this.$refs.form.validate();
            console.log("edition done");
            await axios.post('http://127.0.0.1:3333/hotel/update', this.formData)
            .then((resposne) => console.log(resposne))
            this.$refs.form.reset();
            this.flagData.formFlag = false;
            this.flagData.editForm = false;
            this.read() 
        },
        async sortData(i, head) {
            let sortType = this.flagData.sortArrow[i] ? 'desc' : 'asc'
            console.log(sortType, i, head)
            let tempData = {
                sortType: sortType, 
                col: head
            }   
            console.log(tempData)
            await axios.post('http://127.0.0.1:3333/hotel/sort', tempData).then((resposne) => {
                console.log(resposne)
                this.tableData = resposne.data 
            })
            console.log(this.flagData.sortArrow[i]);
            this.flagData.sortArrow[i] = !this.flagData.sortArrow[i];
        },

        async searchFunc(data){
            console.log(data)
            let tempData = {
                searchVal : data
            }

            await axios.post('http://127.0.0.1:3333/hotel/search', tempData).then((response) => {
                this.tableData = response.data
            })
        }, 

        async deleteData(data) {
            await axios.delete(`http://127.0.0.1:3333/hotel/delete/${data["id"]}`)
            this.read() 
        },
        
        editData(data) {
            console.log("workinf");
            console.log(data)
            this.formData.customerId = data.customer_id
            this.formData.id = data.id
            this.formData.hotelName = data.hotel_name
            this.formData.hotelDoorno  = data.address.doorNo
            this.formData.hotelLandmark  = data.address.landMark
            this.formData.hotelPincode = data.address.pincode
            this.flagData.formFlag = true;
            this.flagData.editForm = true;
        },
        sortIconFlagDisplay(flag) {
            if (this.flagData.sortArrow[flag])
                return "mdi-arrow-down";
            else
                return "mdi-arrow-up";
        },
        clickOut() {
            this.$refs.form.reset();
            this.flagData.editForm = false;
            this.flagData.formFlag = false;
        },
    },
    components: { SearchBox }
}

</script>