<template>
  <div class="p-6 overflow-y-auto bg-white">
    <h3>常用文件夹</h3>
    <div class="flex flex-wrap">
      <div class="w-1/4 p-2">
        <div class="p-4 bg-gray-100 rounded-lg">
          <h4>test文件夹</h4>
          <p>用于写demo</p>
          <a-button type="primary" size="small" @click="openFolder('test')"
            >点击更新</a-button
          >
        </div>
      </div>
      <div class="w-1/4 p-2">
        <div class="p-4 bg-gray-100 rounded-lg">
          <h4>workCode文件夹</h4>
          <p>工作的代码</p>
          <a-button type="primary" size="small" @click="openFolder('test')"
            >点击更新</a-button
          >
        </div>
      </div>
    </div>
    <h3>文件夹详情</h3>
    <div class="flex flex-wrap">
      <div class="w-1/4 p-2" v-for="item in dataJson" :key="item.fileName">
        <div class="p-4 bg-gray-100 rounded-lg">
          <p>{{ item.fileName }}</p>
          <a-space>
            <a-button
              type="primary"
              size="small"
              @click="openFolder(item.fileName)"
              >Code</a-button
            >
            <a-button
              type="primary"
              size="small"
              @click="openFolder(item.fileName)"
              >打开</a-button
            >
          </a-space>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const { ipcRenderer } = require("electron");
import dataJson from "./data.json";
const openFolder = (folderName: string) => {
  ipcRenderer.send("open-folder", { value: "xxxx" });
};
</script>
<style lang="scss" scoped></style>
