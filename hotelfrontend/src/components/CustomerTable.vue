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
                    v-model="valid"
                    lazy-validation
                    >

                        
                        <v-text-field
                        v-model="formData.id"
                        label="ID">
                        
                        </v-text-field>
                
                        <v-text-field
                        v-model="formData.Name"
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
                id: "", 
                Name: "",  
            }, 
            flagData: {
                editForm: false,
                formFlag: false, 
                sortArrow: [false, false, false],  
            }, 
            tableHeaders: ["id", "Name", "edit/delete"], 
            tableData: [
                {
                    "id": 1,  
                    "Name": "James", 
    
                }, 
                {
                    "id":2, 
                    "Name": "John", 
                
                }
            ]

        }
    },

    // mounted() {
    //     read() 
    // }, 

    methods: {
        async validateForm() {
            this.$refs.form.validate() 
            console.log('vlaidation done')
            // await axios.post('http://127.0.0.1:3333/cust/create', this.formData)
            // .then((resposne) => console.log(resposne))
            this.$refs.form.reset() 
        },

        // async read() {
        //     //
        // }, 

        async editForm() {
            this.$refs.form.validate() 
            console.log('edition done')
            // await axios.post('http://127.0.0.1:3333/cust/update', this.formData)
            // .then((resposne) => console.log(resposne))
            this.$refs.form.reset() 
            this.flagData.formFlag = false 
            this.flagData.editForm = false
        },

        async sortData(i, head) {
            // let sortType = this.flagData.sortArrow[i] ? 'desc' : 'asc'
            // let tempData = {
            //     sortType: sortType, 
            //     col: head
            // } 
            //send here 
            console.log('sortData', head, i)
            console.log(this.flagData.sortArrow[i])
            this.flagData.sortArrow[i] = !this.flagData.sortArrow[i]
        }, 

        async searchFunc(data) {
            console.log(data)
        }, 

        editData(data) {
            console.log('workinf')
            this.formData = data
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