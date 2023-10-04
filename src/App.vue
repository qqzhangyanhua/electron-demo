<script setup lang="ts">
// import HelloWorld from "./components/HelloWorld.vue";
import LeftMenu from "@/layout/leftMenu.vue";
import TopHeader from "@/layout/topHeader.vue";
import type { CSSProperties } from "vue";
import zhCN from 'ant-design-vue/es/locale/zh_CN';
const headerStyle: CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 50,
  lineHeight: "64px",
  backgroundColor: "#32b061",
};



const siderStyle: CSSProperties = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#32b061",
};
</script>

<template>
  <a-config-provider
  :locale="zhCN"
    :theme="{
      token: {
        colorPrimary: '#32b061',
      },
    }"
  >
  <!-- <HelloWorld/> -->

    <a-layout class="h-full">
      <a-layout-sider :style="siderStyle">
        <LeftMenu />
      </a-layout-sider>
      <a-layout>
        <a-layout-header :style="headerStyle">
        <TopHeader/>
        </a-layout-header>
        <a-layout-content class="app-content" >
          <RouterView class="h-full" />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>

<style scoped>
.app-content{
  overflow: auto;

  height: calc(100vh - 64px);
}

</style>
