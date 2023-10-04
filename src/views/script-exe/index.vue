<template>
  <div class="px-2 pt-2 bg-gray-200">
    <!-- <a-button danger @click="handelClick"> 按扭</a-button> -->
    <a-button danger @click="handelClick2" disabled>
      选取文件夹获取项目列表</a-button
    >
  <div class="py-2">
    <a-radio-group v-model:value="radioValue" button-style="solid">
      <a-radio-button value="a">工作文件夹</a-radio-button>
      <a-radio-button value="b">练习文件夹</a-radio-button>
    </a-radio-group>
  </div>
    <a-table :dataSource="radioValue==='a'?sourceJson:testSourceJson" :columns="columns" class="pt-2">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'filePath'">
          <a-button type="text" danger>复制路径</a-button>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <a-button
            size="small"
            type="primary"
            class="mb-1"
            @click="handelBtn('vscode', record)"
            >vscode</a-button
          >
          <a-button size="small" type="primary" class="mb-1"   @click="handelBtn('iterm', record)">命令行</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
const { ipcRenderer } = require("electron");
import { onMounted, onBeforeUnmount, reactive, ref } from "vue";
import sourceJson from "./data.json";
import testSourceJson from "./source.json";
const dataSource = reactive([]);
const radioValue = ref<string>("a");
const columns = [
  {
    title: "项目名称",
    dataIndex: "fileName",
    width:140
  },
  {
    title: "项目路径",
    dataIndex: "filePath",
    width:100
  },
  {
    title: "启动命令",
    dataIndex: "startCommand",
  },
  {
    title: "项目备注",
    dataIndex: "remark",
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 150,
  },
];


const handelClick2 = () => {
  ipcRenderer.send("open-folder", { value: "xxxx" });
};
onMounted(() => {
  console.log(sourceJson);
  Object.assign(dataSource, sourceJson);

  ipcRenderer.on("directoryList", (event:any, list:any) => {
    console.log("监听========alarmTriggered", list,event);
    Object.assign(dataSource, list);
  });
});
onBeforeUnmount(() => {
  ipcRenderer.removeAllListeners("directoryList");
});

const handelBtn = (type:string, record:any) => {
  console.log("handelBtn", type, record);
  ipcRenderer.send("scriptExe", { type, filePath: record.filePath });

  //   ipcRenderer.send("scriptExe",{length:2,type:type,record:record});
};
</script>
<style lang="scss" scoped></style>
