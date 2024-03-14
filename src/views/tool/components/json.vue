<template>
  <div>
    <Back />
    <div class="px-4 pt-6">
        <a-textarea v-model:value="jsonCode"  :rows="4"/>
      <a-button @click="format" type="primary" class="mt-4 mb-4">格式化</a-button>
      <pre><code class="json" ref="typescriptRef" >{{ formatCode }}</code></pre>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Back from "../../../components/back.vue";
import json5 from "json5";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/json";
import "highlight.js/styles/atom-one-dark.css";
import { nextTick, onMounted, ref } from "vue";
const jsonCode = ref(`{
  sss: "2021-03-07 10:21 增加转换yaml功能",
  "v2.1": "2016-11-19 01:17 增加java类生成",
  "v2.0": "2016-11-16 14:13 增加php, go类生成",
  "v1.0": "2014-07-02 22:05 工具上线",
  "name": "json在线编辑器",
  "!!warning!!": "由于该工具使用的前端js实现json的encode和decode，所以会存在大数精度丢失的问题，你可以手动将大数用字符串双引号括起来，避免精度丢失。"
}`);
const formatCode = ref("");
const typescriptRef = ref(null);
onMounted(() => {
  hljs.registerLanguage("json", javascript);
  highlight();
  formatCode.value = formatJSON(jsonCode.value);
});
function formatJSON(jsonString: string) {
  try {
    const jsonObject = json5.parse(jsonString);
    return JSON.stringify(jsonObject, null, 2);
  } catch (error) {
    console.error("Invalid JSON");
    return "null";
  }
}
const format = () => {
    formatCode.value = formatJSON(jsonCode.value);
  nextTick(() => {
    highlight();
  });
};
const highlight = () => {
  const codeElements: any = typescriptRef.value as any;
  if (codeElements) {
    delete codeElements.dataset.highlighted;
    // 应用 highlight.js 样式
    hljs.highlightBlock(codeElements);
  }
};
</script>
<style lang="scss" scoped></style>
