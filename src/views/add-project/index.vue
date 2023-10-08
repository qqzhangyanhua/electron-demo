<template>
  <a-form
    class="px-2 pt-4"
    :model="formState"
    name="basic"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 14 }"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item
      label="项目名称"
      name="projectName"
      :rules="[{ required: true, message: '请输入项目名称' }]"
    >
      <a-input
        v-model:value="formState.projectName"
        placeholder="请输入项目名称不要包含中文"
      />
    </a-form-item>
    <a-form-item
      label="选择路径"
      name="filePath"
      :rules="[{ required: true, message: '请选择路径' }]"
    >
      <a-row :gutter="16">
        <a-col :span="18">
          <a-input v-model:value="formState.filePath" disabled />
        </a-col>
        <a-col :span="6">
          <a-button type="primary"  @click="handelChoose"
            >{{formState.filePath?'重新选择':'选择'}}</a-button
          >
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="项目技术框架" name="technical">
      <a-radio-group v-model:value="formState.technical" name="radioGroup">
        <a-radio value="v">Vue</a-radio>
        <a-radio value="r">React</a-radio>
        <a-radio value="o">其他</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="是否TS" name="isTs">
      <a-radio-group v-model:value="formState.isTs" name="radioGroup">
        <a-radio value="1">是</a-radio>
        <a-radio value="0">否</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item
      label="项目模板"
      name="template"
      :rules="[{ required: true, message: '请选择项目模板' }]"
    >
      <a-select
        v-model:value="formState.template"
        style="width: 100%"
        :options="options"
        placeholder="请选择项目模板"
      ></a-select>
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" html-type="submit">拉取项目</a-button>
    </a-form-item>
  </a-form>
  <a-space class="pl-10" v-if="isSuccess">
    <a-button type="primary" >打开vscode</a-button>
    <a-button type="primary" >打开命令行</a-button>
    <a-button type="primary" >打开所在目录</a-button>

  </a-space>
</template>
<script lang="ts" setup>
import {message} from 'ant-design-vue'
const { ipcRenderer } = require("electron");
import { templateJson } from "./data";
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
interface FormState {
  projectName: string;
  filePath: string;
  template: string | null;
  technical: string;
  isTs: string;
}

const isSuccess =ref(false)
const options = computed(() => {
  const data = templateJson
    .filter((item) => item.technical === formState.technical)
    .filter((item) => item.isTs === formState.isTs);
  return data;
});

const formState = reactive<FormState>({
  projectName: "",
  filePath: "",
  template: null,
  technical: "v",
  isTs: "1",
});
const handelChoose = () => {
  ipcRenderer.send("open-file-dialog");
};
const onFinish = (values: any) => {
  console.log("Success:", values);
  ipcRenderer.send("git-clone", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};
onMounted(() => {
  ipcRenderer.on("directoryList", (event: any, filePath: string) => {
    console.log("监听========alarmTriggered", filePath, event);
    formState.filePath = filePath;
  });
  ipcRenderer.on("clone-success", () => {
    console.log("clone-success===========");
    message.success("拉取成功");
    isSuccess.value=true
  });
});
onBeforeUnmount(() => {
  ipcRenderer.removeAllListeners("directoryList");
  ipcRenderer.removeAllListeners("clone-success");
});
</script>
