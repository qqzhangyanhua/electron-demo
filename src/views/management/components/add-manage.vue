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
        name="title"
        :rules="[{ required: true, message: '请输入提醒标题' }]"
      >
        <a-input v-model:value="formState.title" placeholder="请输入提醒标题" />
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
        name="title"
        :rules="[{ required: true, message: '请输入提醒标题' }]"
      >
        <a-input v-model:value="formState.title" placeholder="请输入提醒标题" />
      </a-form-item>
      <a-form-item
        label="jira地址"
        name="title"
      >
        <a-input v-model:value="formState.title" placeholder="请输入提醒标题" />
      </a-form-item>
      <a-form-item
        label="设计图地址"
        name="title"
      >
        <a-input v-model:value="formState.title" placeholder="请输入提醒标题" />
      </a-form-item>
      <a-form-item
        label="接口文档地址"
        name="title"
      >
        <a-input v-model:value="formState.title" placeholder="请输入提醒标题" />
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
import { computed, reactive, ref } from "vue";
import type { RadioGroupProps, SelectProps } from "ant-design-vue";
import dayjs from "dayjs";
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
const plainOptions: RadioGroupProps["options"] = [
  { label: "固定时间", value: "fixedTime" },
  { label: "多久之后", value: "soonTime" },
];
const options = ref<SelectProps["options"]>([
  {
    value: "1",
    label: "1分钟后",
  },
  {
    value: "5",
    label: "5分钟后",
  },
  {
    value: "15",
    label: "15分钟后",
  },
  {
    value: "30",
    label: "30分钟后",
  },
  {
    value: "60",
    label: "1小时后",
  },
  {
    value: "120",
    label: "2小时后",
  },
]);
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
  sendTime: string | null;
  remark: string;
  title: string;
  key?: number;
  radio: string;
}

const formState = reactive<FormState>({
  sendTime: null,
  remark: "",
  title: "",
  radio: "soonTime",
});
const onFinish = (values: FormState) => {
  open.value = false;
  message.success("保存成功");
  if (formState.radio === "soonTime") {
    values.sendTime = dayjs()
      .add(Number(values.sendTime), "minute")
      .format("HH:mm:ss");
  }

  emit("saveSuccess", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};
</script>
