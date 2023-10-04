import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home/index.vue'
import About from './views/About/index.vue'

const routes = [
    { path: '/', component: Home,name:'Home' },
    { path: '/about', component: About ,name:'about'},
    { path: '/space-login', component: ()=>import('./views/space-login/index.vue') ,name:'SpaceLogin'},
    { path: '/management', component: ()=>import('./views/management/index.vue') ,name:'Management'},
    { path: '/today-list', component: ()=>import('./views/today-todo/index.vue') ,name:'TodayTodo'},
    { path: '/personal-center', component: ()=>import('./views/personal-center/index.vue') ,name:'PersonalCenter'},
    { path: '/script-exe', component: ()=>import('./views/script-exe/index.vue') ,name:'ScriptExe'},


  ]

const router = createRouter({
    history: createWebHistory(),
    routes, // `routes: routes` 的缩写
  })
  export default router