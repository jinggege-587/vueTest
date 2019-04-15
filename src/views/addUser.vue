<template>
    <div>
        <el-input v-model="param.name" placeholder="请输入姓名"></el-input>
        <el-input v-model="param.image" placeholder="图片路径"></el-input>
        <el-input v-model="param.describes" placeholder="描述"></el-input>
        <el-input v-model="param.remark" placeholder="请输入备注"></el-input>
        <el-button type="primary" v-on:click="submit">提交</el-button>
    </div>
</template>
<script>
export default {
    name: 'addUser',
    data () {
        return {
            msg: '',
            datas:[],
            param:{
                name:'',

            }
        }
    },
    methods:{
        submit(){
            let param = this.param;
            this.$api.update({param:param,method:'post'},(data)=>{
                console.log(data);
                this.$router.push({path:'/index'})
            });
        }
    },
    created(){

    },
}
</script>

