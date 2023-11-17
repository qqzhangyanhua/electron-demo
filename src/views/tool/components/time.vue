<template>
  <div class="bg-white">
    <Back />
    <div class="px-4 pt-4">
      <h3 class="text-xl font-bold text-transparent-black">
        当前时间
        <a-button class="pl-8" size="small" type="primary" @click="handelFresh">刷新时间</a-button>
      </h3>
      <p class="mt-2 text-gray-500">
        {{ nowDate }}
        <a-button @click="handelCopy(nowDate)" type="link"
          >复制当前时间</a-button
        >
      </p>
      <p class="mt-2 text-gray-500">
        时间戳毫秒:{{ timeNumber }}
        <a-button @click="handelCopy(timeNumber)" type="link"
          >复制时间戳毫秒</a-button
        >
      </p>
      <h3 class="text-xl font-bold text-transparent-black">时间戳转换</h3>
     <a-col :span="12">
        <a-input-group compact>
      <a-input v-model:value="inputNumber" style="width: calc(100% - 200px)" />
      <a-button type="primary" @click="handelInput">转换</a-button>
    </a-input-group>
     </a-col>
      <p class="mt-2 text-gray-500">
        时间戳转化:{{ formatTime }}
        <a-button @click="handelCopy(formatTime)" type="link"
          >复制当前时间</a-button
        >
      </p>
      <h3 class="text-xl font-bold text-transparent-black">转时间戳</h3>
      <a-col span="12">
        <p class="mt-2 text-gray-500">
            <a-input-group compact>
            <a-input v-model:value="timeDate" style="width: calc(100% - 200px)" />
            <a-button type="primary" @click="handelInputTimestamp">转换</a-button>
            </a-input-group>
        </p>
      </a-col>
      <p class="mt-2 text-gray-500">
        时间转化:{{ timeStamp }}
        <a-button @click="handelCopy(timeStamp)" type="link"
          >复制当前时间戳</a-button
        >
      </p>

    </div>
  </div>
</template>
<script lang="ts" setup>
import { message } from "ant-design-vue";
import Back from "../../../components/back.vue";
import dayjs from "dayjs";
const nowDate = ref(dayjs().format("YYYY-MM-DD HH:mm:ss"));
const { toClipboard } = useClipboard();
import useClipboard from "vue-clipboard3";
import { ref } from "vue";
const inputNumber = ref();
const formatTime = ref("")
const timeStamp = ref()
const timeDate =ref('')
//时间戳毫秒
const timeNumber = ref(dayjs().valueOf());
const handelCopy = async (value: string | number) => {
  await toClipboard(String(value));
  message.success("复制成功");
};
//刷新当前时间
const handelFresh = () => {
    nowDate.value = dayjs().format("YYYY-MM-DD HH:mm:ss");
    timeNumber.value = dayjs().valueOf();
};
const handelInput = () => {
  if (inputNumber.value) {
    formatTime.value = dayjs(Number(inputNumber.value)).format(
      "YYYY-MM-DD HH:mm:ss"
    );
  } else {
    message.error("请输入时间戳");
  }
};
const handelInputTimestamp =()=>{
  if(timeDate.value){
    timeStamp.value = dayjs(timeDate.value).valueOf()
  }else{
    message.error('请输入需要转换的时间日期')
  }
}
</script>
