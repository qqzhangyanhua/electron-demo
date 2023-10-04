<template>
  <div class="pt-2 text-center bg-gray-200">
    <a-alert message="欢迎您,张艳华" type="success" class="mx-2 " />
    <a-row :gutter="16" class="px-2 mt-2">
      <a-col :span="8" v-for="item in state" :key="item.id" class="mb-2">
        <a-card :title="item.title" :bordered="false" class="cursor-pointer" @click="handelClick(item)">
          <img :src="item.icon" class="w-16 h-14"/>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { reactive,  } from "vue";
const { shell } = require("electron");
import chandao from '../../assets/chandao.jpg';
import jiraImg from '@/assets/jira.jpeg';
import gitLab from '@/assets/gitlab.webp';
import email from '@/assets/email.webp';
const state = reactive([{
    title:'jira',
    url:'http://www.tongbaninfo.com:10029/secure/Dashboard.jspa',
    icon:jiraImg,
    id:1
},{
    title:'禅道',
    url:'http://www.tongbaninfo.com:8765/my.html',
    icon:chandao,
    id:2
},{
    title:'gitlab',
    url:'http://192.168.2.22:9000/',
    icon:gitLab,
    id:3
},{
    title:'邮箱',
    url:'http://mail.tongbaninfo.com/',
    icon:email,
    id:4
}
]);
    const handelClick =(item:any)=>{
        shell.openExternal(item.url);
    
    }
</script>
<style lang="scss" scoped></style>
