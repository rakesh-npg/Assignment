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
                        <v-icon small @click="sortData(i, head)">{{sortIconFlagDisplay(i)}}</v-icon>
                   </template>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="data in tableData" :key="data.id">
                    <td v-for="column in tableHeaders" :key="column">
                    
                        {{data[column]}}

                    <template v-if="column == 'edit/delete'">
                        <v-icon small @click="editData(data)">mdi-pencil</v-icon>
                        <v-icon small @click="deleteData(data)">mdi-delete</v-icon>
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
                    
                    lazy-validation
                    >

                        
                        <v-text-field
                        v-model="formData.customerId"
                        label="ID">
                        
                        </v-text-field>
                
                        <v-text-field
                        v-model="formData.customerName"
                        label="Name">
                        
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
                customerId: "", 
                customerName: "",  
                tableId: "", 
            }, 
            flagData: {
                editForm: false,
                formFlag: false, 
                sortArrow: [false, false, false],  
            }, 
            tableHeaders: ["table_id", "customer_id", "customer_name", "count", "edit/delete"], 
            tableData: [
            ], 
            appKeyHeader: {headers : {appkey : process.env.VUE_APP_KEY}}

        }
    },

    mounted() {
        this.read() 
    }, 

    methods: {
        async validateForm() {
            this.$refs.form.validate() 
            console.log(this.formData)
            await axios.post('http://127.0.0.1:3333/cust/create', this.formData, this.appKeyHeader)
            .then((resposne) => console.log(resposne))
            this.flagData.formFlag = false 
            this.read() 
            this.$refs.form.reset() 
        },

        async read() {
            await axios.get('http://127.0.0.1:3333/cust/read', this.appKeyHeader).then((response) => {
                console.log(response)
                this.tableData = response.data
            })
        }, 

        async editForm() {
            this.$refs.form.validate() 
            console.log('edition done')
            await axios.post('http://127.0.0.1:3333/cust/update', this.formData, this.appKeyHeader)
            .then((resposne) => console.log(resposne))
            this.$refs.form.reset() 
            this.flagData.formFlag = false 
            this.flagData.editForm = false
            this.read() 
        },

        async deleteData(data) {
            console.log(data['table_id'])
            await axios.delete(`http://127.0.0.1:3333/cust/delete/${data["table_id"]}`, this.appKeyHeader)
            this.read() 
        },
        async sortData(i, head) {
            let sortType = this.flagData.sortArrow[i] ? 'desc' : 'asc'
            let tempData = {
                sortType: sortType, 
                col: head
            } 
            console.log(tempData)
            await axios.post('http://127.0.0.1:3333/cust/sort', tempData, this.appKeyHeader).then((resposne) => {
                console.log(resposne)
                this.tableData = resposne.data 
            })
            console.log('sortData', head, i)
            console.log(this.flagData.sortArrow[i])
            this.flagData.sortArrow[i] = !this.flagData.sortArrow[i]
        }, 

        async searchFunc(data) {
            console.log(data)
            let tempData = {
                searchVal : data
            }

            await axios.post('http://127.0.0.1:3333/cust/search', tempData, this.appKeyHeader).then((response) => {
                this.tableData = response.data
            })
        }, 

        editData(data) {
            console.log('workinf')
            console.log(data)
            this.formData.customerId = data.customer_id
            this.formData.customerName = data.customer_name 
            this.formData.tableId = data.table_id
            this.flagData.formFlag = true 
            this.flagData.editForm = true
            
        }, 

        sortIconFlagDisplay(flag) {
            
            if(this.flagData.sortArrow[flag]) 
            return 'mdi-arrow-down'
            else 
            return 'mdi-arrow-up'
        }, 

        clickOut(){
            this.$refs.form.reset() 
            this.flagData.editForm = false 
            this.flagData.formFlag = false 
        },
    }, 
}

</script>