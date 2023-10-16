<template>
  <div class="px-2 pt-2 bg-gray-200">
    <a-button type="primary" class="mb-2" @click="handelClick"> 返回 </a-button>

    <a-button type="link" :icon="h(CopyOutlined)" @click="copyText"
      >复制 {{ getTabsName() }}</a-button
    >
    <div class="pb-4">
      <a-tabs v-model:activeKey="activeKey" @change="handelChange">
        <a-tab-pane key="1" tab="template">
          <pre><code class="html" ref="codeRef">{{ code }}</code></pre>
        </a-tab-pane>
        <a-tab-pane key="2" tab="script" forceRender>
          <pre><code class="javascript" ref="typescriptRef">{{ jsCode }}</code></pre>
        </a-tab-pane>
        <a-tab-pane key="3" tab="style">Content of Tab Pane 3</a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script lang="ts" setup>
import useClipboard from "vue-clipboard3";
import hljs from "highlight.js/lib/core";
import html from "highlight.js/lib/languages/xml";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/atom-one-dark.css";
import { onMounted, ref, h } from "vue";
import { CopyOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
const codeRef = ref(null);
const typescriptRef = ref(null);
const htmlCode = `<template>
  <a-form
    :model="formState"
    name="basic"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item
      label="Username"
      name="username"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <a-input v-model:value="formState.username" />
    </a-form-item>

    <a-form-item
      label="Password"s
      name="password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
    >
      <a-input-password v-model:value="formState.password" />
    </a-form-item>

    <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
      <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>`;
const code = ref(htmlCode);

const jsCode = `import { reactive } from 'vue';

interface FormState {
  username: string;
  password: string;
  remember: boolean;
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
});
const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
}`;
const activeKey = ref("1");
onMounted(() => {
  console.log(codeRef.value);

  hljs.registerLanguage("html", html);
  hljs.highlightBlock(codeRef.value as any);
  console.log("typescriptRef=====", typescriptRef.value);

  hljs.registerLanguage("javascript", javascript);
  hljs.highlightBlock(typescriptRef.value as any);
});
const handelClick = () => {
  console.log("handelClick");
  window.history.back();
};
const handelChange = () => {
  if (activeKey.value === "1") {
  }
};
const getTabsName = () => {
  if (activeKey.value === "1") {
    return "template";
  } else if (activeKey.value === "2") {
    return "script";
  } else if (activeKey.value === "3") {
    return "style";
  }
};
const { toClipboard } = useClipboard();
const copyText = async () => {
  let copyValue:string
  if(activeKey.value==='1'){
    copyValue =htmlCode
  }else{
    copyValue = jsCode
  }
  await toClipboard(copyValue);
  message.success("复制成功"+getTabsName());
};
</script>
<style lang="scss" scoped></style>
