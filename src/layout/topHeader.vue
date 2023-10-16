<template>
  <div class="flex items-center justify-between drop-shadow-2xl">
    <h3>我的主页</h3>
   <a-button type="primary" @click="handelClick">桌面</a-button>
    <a-dropdown>
    <a class="ant-dropdown-link" @click.prevent>
        <a-avatar :size="44">
      <template #icon><UserOutlined class="cursor-pointer" /></template>
    </a-avatar>
    </a>
    <template #overlay>
      <a-menu>
        <a-menu-item>
          <a href="javascript:;">注销</a>
        </a-menu-item>
        <a-menu-item>
          <a href="javascript:;">退出</a>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
   
  </div>
</template>
<script lang="ts" setup>
import { UserOutlined ,} from '@ant-design/icons-vue';
const { ipcRenderer } = require("electron");

const handelClick = ()=>{
  console.log('1111111');
  ipcRenderer.send("make-window");
}
</script>
<style lang="scss" scoped></style>
