<template>
    <div>
        <v-text-field @keyup="searchFunc" label="Search" placeholder="Search" v-model="SearchVal" >Search</v-text-field>
        
    </div>
</template>

<script>
export default{
    data() {
        return{
            SearchVal:'', 
            
        }
    },
    methods:{
        async searchFunc() {
            console.log('search is being called')
            this.$emit('searchEmitPop', this.SearchVal)
    
        
        },
    },
}
</script>