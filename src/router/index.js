import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import index from '@/views/index';
import login from '@/views/login';

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'index',
            component: () => import( /* webpackChunkName: "index" */ '@/views/index')
        },
        {
            path: '/index',
            name: 'index',
            component: index
        },
        {
            path: '/addUser',
            name: 'addUser',
            component: () => import( /* webpackChunkName: "addUser" */ '@/views/addUser')
        },
        {
            path: '/login',
            name: 'login',
            component: login
        }, {
            path: '/:name',
            name: ':name',
            component: HelloWorld
        }
    ]
})
