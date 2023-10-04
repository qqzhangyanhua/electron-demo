<template>
    <div class="pt-1 pb-1 text-center">
      <a-tag color="#32b061">空间登陆</a-tag>
    </div>
    <a-form
      class="text-center"
      :model="formState"
      name="basic"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 12 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item>
        <a-radio-group
          v-model:value="formState.belong"
          button-style="solid"
          @change="radioChange"
        >
          <a-radio-button value="smzy">个人</a-radio-button>
          <a-radio-button value="qykj">企业</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="">
        <a-space>
          <a-upload
            :beforeUpload="beforeUpload"
            :max-count="1"
            accept=".json"
            :showUploadList="false"
          >
            <a-button type="primary">导入</a-button>
          </a-upload>
          <a-button type="primary" ghost @click="handelExport">导出示例</a-button>
        </a-space>
      </a-form-item>
      <a-form-item label="选择空间">
        <a-select
          v-model:value="formState.spaceName"
          :options="spaceOptions"
          :fieldNames="{ label: 'name', value: 'path' }"
          placeholder="请选择"
        />
      </a-form-item>
      <a-form-item label="用户">
        <a-select
        placeholder="请选择"
          v-model:value="formState.username"
          :options="userOptions"
          :fieldNames="{ label: 'name', value: 'userid' }"
        />
      </a-form-item>
      <a-form-item label="环境">
        <a-select
        placeholder="请选择"
          v-model:value="formState.environment"
          :options="environmentOptions"
          @change="handelChange"
          :fieldNames="{ label: 'name', value: 'url' }"
        />
      </a-form-item>
      <a-form-item
        label="自定义环境或者端口"
        v-if="['22', '33'].includes(formState.environment)"
      >
        <a-input
          v-model="formState.environmentInput"
          :placeholder="environmentPlaceholder"
        />
      </a-form-item>
      <a-form-item label="所属空间">
        <a-select
          v-model:value="formState.spaceId"
          :options="spaceIdOptions"
          show-search
        />
      </a-form-item>
      <a-form-item label="临时用户">
        <a-input
          v-model:value="formState.userId"
          placeholder="输入临时用户id"
        />
      </a-form-item>
  
      <a-form-item :wrapper-col="{ offset: 4, span: 12 }">
        <a-space>
          <a-button type="primary" html-type="submit">打开</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </template>
  <script lang="ts" setup>
  import { onMounted, reactive, ref } from "vue";
  import { message } from "ant-design-vue";
  import { spaceIdOptions } from "./space";
  const { shell } = require("electron");
  import axios from "axios";
  interface FormState {
    username: string;
    password: string;
    spaceName: string;
    environment: string;
    spaceId: string;
    environmentInput: string;
    belong: string;
    userId?: string;
  }
  interface Environment {
    name: string;
    url: string;
  }
  interface User {
    name: string;
    userid: string;
  }
  interface Space {
    name: string;
    path: string;
  }
  const spaceOptions: Array<Space> = reactive([]);
  const userOptions: Array<User> = reactive([]);
  const environmentOptions: Array<Environment> = reactive([
    {
      name: "本地端口",
      url: "22",
    },
    {
      name: "其他环境",
      url: "33",
    },
  ]);
  const radioChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    console.log(target.value);
    for(const key in formState){
      formState[key as keyof FormState] = '';
    }
    formState.belong = target.value;
    const jsonData: string = window.localStorage.getItem(`${formState.belong}JsonData`) || "";
    if (jsonData) {
      const jsonValue = JSON.parse(jsonData);
      withJson(jsonValue);
    }
   
  };
  const beforeUpload = (file: any) => {
    if (file.type !== "application/json") {
      message.error("只能上传 JSON 文件");
      return false;
    }
    const reader: any = new FileReader();
    reader.onload = () => {
      try {
        const jsonData = JSON.parse(reader.result);
        console.log("Uploaded JSON Data:", jsonData);
        withJson(jsonData);
        if (formState.belong === "smzy") {
          window.localStorage.setItem("smzyJsonData", JSON.stringify(jsonData));
        } else {
          window.localStorage.setItem("qykjJsonData", JSON.stringify(jsonData));
        }
  
        // 在这里可以处理上传的 JSON 数据
      } catch (error) {
        console.error("Error parsing JSON file:", error);
      }
    };
    console.log("22222222", reader.readAsText(file));
  
    reader.readAsText(file);
    return false; // 阻止文件上传
  };
  onMounted(() => {
    const jsonData: string = window.localStorage.getItem("smzyJsonData") || "";
    if (jsonData) {
      const jsonValue = JSON.parse(jsonData);
      withJson(jsonValue);
    }
  });
  const withJson = (jsonValue: any) => {
    userOptions.length = 0;
    spaceOptions.length = 0;
    environmentOptions.length = 0;
    console.log("获取====", jsonValue);
    const { envs = [], users = [], spaces = [] } = jsonValue;
    environmentOptions.unshift(...envs);
    userOptions.push(...users);
    spaceOptions.push(...spaces);
    formState.environment = envs[0].url;
    formState.username = users[0].userid;
    formState.spaceName = spaces[0].path;
    formState.spaceId = spaceIdOptions[0].value;
  };
  function exportJSON(jsonData:any, fileName:string) {
    const jsonString = JSON.stringify(jsonData);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
  
    URL.revokeObjectURL(url);
  }
  const handelExport = () => {
    const name = formState.belong === "smzy" ? "smzyJsonData" : "qykjJsonData";
    const jsonData: string = window.localStorage.getItem(name)!||'{}';
    console.log("获取====", JSON.parse(jsonData));
    exportJSON(JSON.parse(jsonData), 'data.json');
  };
  const environmentPlaceholder = ref("输入端口如 8080");
  const handelChange = (value: string) => {
    console.log(value);
    if (value == "33") {
      environmentPlaceholder.value = "输入环境如 http://localhost:8080";
    } else {
      environmentPlaceholder.value = "输入端口如 8080";
    }
  };
  const formState = reactive<FormState>({
    username: "",
    password: "",
    spaceName: "",
    environment: "",
    spaceId: "",
    environmentInput: "",
    belong: "smzy",
    userId: "",
  });
  const onFinish = async () => {
    console.log("Success:", formState);
    let environment ;
    //如果是localhost直接用测试环境整
    if (formState.environment.includes("localhost")) {
      environment = "https://zwdtuser.sh.gov.cn";
    } else {
      environment = formState.environment;
    }
    // console.log("environment=====", environment);
  
    const userId = formState.userId ? formState.userId : formState.username;
    const tokenUrl = `${'https://zwdtuser.sh.gov.cn'}/uc/oauth2.0/authorize.do?zwdtsw_user_id=${userId}`;
    const data = await axios.get(tokenUrl);
    if (data.status !== 200) {
      message.error("获取token失败");
      return;
    }
    console.log(userId,"tokenUrl=====", data);
    let spaceName =formState.spaceName;
    if(formState.belong==='qykj'&&formState.spaceId!=='sh'){
      spaceName = `/qykj/shell_oc_${formState.spaceId}/enterprise/eindex`
    }else{
  
    }
    const token = data.data;
    const locationUrl = `${environment}/${formState.belong}/shspace/loginsso/in?access_token=${token}&&callback=${formState.environment}${spaceName}`;
    shell.openExternal(locationUrl);
    console.log("tokenUrl=====", locationUrl);
  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  </script>
  