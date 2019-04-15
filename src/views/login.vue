<template>
    <div>
        <div class="item-list">
            <label for="">User：</label>
            <input type="text" v-model="param.user" name="user">
        </div>
        <div class="item-list">
            <label for="">PassWord：</label>
            <input type="password" v-model="param.psw" name="psw">
        </div>
        <div class="item-list">
            <button class="login" v-on:click="login">登录</button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'login',
    data () {
        return {
            msg: 'Welcome to Your Vue.js App',
            param:{
                user:'',
                psw:''
            }
        }
    },
    methods:{
        login(){
            let {psw,user} = this.param;
            this.$api.login({param:{user:user,psw:psw},method:'post'},(data)=>{
                console.log(data);
                this.$store.dispatch('userId',{id:data.id});
                this.$router.push({path:this.$route.query.to || '/index'})
            });
        }
    }
}
</script>

<style lang="scss">
    .item-list{
        display: flex;
        padding-top: 10px;
        label{
            width: 100px;
            text-align: right;
        }
    }
</style>
