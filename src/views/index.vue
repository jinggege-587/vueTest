<template>
    <div class="item-con">
        <div id="main" style="width: 1000px;height:400px;"></div>
    </div>
</template>
<script>
var echarts = require('echarts');
export default {
    name: 'index',
    data () {
        return {
            msg: 'Welcome to Your Vue.js App',
            item: [],
            parentId: 0,
        }
    },
    created(){
        this.list(0);
    },
    methods:{
        list(parentId,cb){
            let newData;
            this.$api.list({param:{parentId:parentId},method:'post'},(data)=>{
                console.log(data);
                
                this.dataMachining(data).then(e=>{
                    console.log('this.item',e);
                    this.item = e;
                });
                console.log('this.item',this.item);
                this.myChart();
                // this.item = data;
            });
        },
        dataMachining(data){
            let newData=[], param;
            data.map(e=>{
                if(e.id == this.parentId){
                    newData.push(e);
                    param = e;
                }
            });
            return function (param) {
                data.map(e=>{
                    if(e.id == param.parentId){
                        param.children = e;
                        this.dataMachining(e);
                    }
                });
            };
            // this.myChart(list);
        },
        myChart(){
            let data = this.item
            console.log('myChart',data);
            var myChart = echarts.init(document.getElementById('main'));

            myChart.setOption({
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove'
                },
                series:[
                    {
                        type: 'tree',

                        data: [data],

                        left: '2%',
                        right: '2%',
                        top: '8%',
                        bottom: '20%',

                        symbol: 'emptyCircle',

                        orient: 'vertical',

                        expandAndCollapse: true,

                        label: {
                            normal: {
                                position: 'top',
                                rotate: 0,
                                verticalAlign: 'middle',
                                align: 'middle',
                                fontSize: 9
                            }
                        },

                        leaves: {
                            label: {
                                normal: {
                                    position: 'bottom',
                                    rotate: 0,
                                    verticalAlign: 'middle',
                                    align: 'middle'
                                }
                            }
                        },

                        animationDurationUpdate: 750
                    }
                ]
            });
        }
    }
}
</script>

<style lang="scss">
    .item-con{
        .list{
            line-height: 40px;
            .name{
                padding:5px 10px;
                margin: 5px;
                border:1px solid #999;
            }
        }
        
    }
</style>


