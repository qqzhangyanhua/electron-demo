<template>
  <a-modal v-model:open="open" :title="title" :footer="null">
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 14 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="禅道编号"
        name="id"
        :rules="[{ required: true, message: '请输入提醒标题' }]"
      >
        <a-input v-model:value="formState.id" placeholder="请输入提醒标题" />
      </a-form-item>
      <a-form-item
        label="需求描述与备注"
        name="remark"
        :rules="[{ required: true, message: '请输入提醒内容' }]"
      >
        <a-textarea
          v-model:value="formState.remark"
          placeholder="请输入提醒内容"
        />
      </a-form-item>
      <a-form-item
        label="相关产品"
        name="relatedProduct"
        :rules="[{ required: true, message: '请输入相关产品' }]"
      >
        <a-input v-model:value="formState.relatedProduct" placeholder="请输入相关产品" />
      </a-form-item>
      <a-form-item
        label="jira地址"
        name="title"
      >
        <a-input v-model:value="formState.jiraUrl" placeholder="请输入jira地址" />
      </a-form-item>
      <a-form-item
        label="设计图地址"
        name="title"
      >
        <a-input v-model:value="formState.designUrl" placeholder="请输入设计图地址" />
      </a-form-item>
      <a-form-item
        label="接口文档地址"
        name="title"
      >
        <a-input v-model:value="formState.apiDocUrl" placeholder="请输入接口文档地址" />
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-space>
          <a-button type="primary" html-type="submit">保存</a-button>
          <a-button type="primary" ghost @click="open = false">取消</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import { message } from "ant-design-vue";
import { computed, reactive,  } from "vue";
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});


const emit = defineEmits(["update:visible", "saveSuccess"]);
const open = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit("update:visible", val);
  },
});
const title = computed(() => {
  return props.isEdit ? "编辑需求记录" : "新建需求记录";
});
interface FormState {
  id: string;
  remark: string;
  relatedProduct: string;
  jiraUrl: string;
  designUrl: string;
  apiDocUrl: string;
}

const formState = reactive<FormState>({
  id: '',
  remark: "",
  relatedProduct: "",
  jiraUrl: "",
  designUrl:'',
  apiDocUrl:''
});
const onFinish = (values: FormState) => {
  open.value = false;
  message.success("保存成功");

  emit("saveSuccess", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};
</script>
