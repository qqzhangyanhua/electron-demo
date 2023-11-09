<template>
  <div>
    <Back/>
    <a-alert message="生成虚拟身份证号" type="success" class="mx-4 mt-4" />
    <a-form
      class="pt-10"
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 10 }"
      autocomplete="off"
      @finish="onFinish"
    >
      <a-form-item
        label="出生地"
        name="address"
        :rules="[{ required: true, message: '请选择出生地' }]"
      >
        <a-cascader
          v-model:value="formState.address"
          :options="dataJson"
          expand-trigger="hover"
          placeholder="选择出生地"
        />
      </a-form-item>

      <a-form-item
        label="出生日期"
        name="date"
        :rules="[{ required: true, message: '请选择出生日期' }]"
      >
        <a-date-picker v-model:value="formState.date" style="width: 100%" />
      </a-form-item>
      <a-form-item label="性别" name="gender">
        <a-radio-group v-model:value="formState.gender">
          <a-radio value="male">男</a-radio>
          <a-radio value="female">女</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-space>
          <a-button type="primary" html-type="submit">开始生成</a-button>
          <a-button type="primary" @click="handelRandom">随机生成</a-button>
        </a-space>
      </a-form-item>
      <a-form-item label="生成结果" name="content">
        <a-textarea v-model:value="formState.content" />
        <a-button
          type="primary"
          class="mt-5"
          @click="handelCopy"
          :disabled="!formState.content"
          >复制</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { message } from "ant-design-vue";
import { reactive, ref } from "vue";
import useClipboard from "vue-clipboard3";
import Back from '../../../components/back.vue'
const { toClipboard } = useClipboard();
import dataJson from "./dataJson.json";
interface FormState {
  date: string;
  address: string;
  content: string;
  gender: string;
}

const formState = reactive<FormState>({
  date: "",
  address: "",
  content: "",
  gender: "male",
});

const handelCopy = async () => {
  await toClipboard(formState.content);
  message.success("复制成功");
};
const onFinish = (values: any) => {
  formState.content = '';
  const addressCode = values.address[values.address.length - 1];
  const birthday = values.date.format("YYYYMMDD");
  const idCard = generateIDNumber(formState.gender, addressCode, birthday);
  formState.content = idCard;

};
const randomAreaList: any = ref([]);
function getRandomNumber() {
  return Math.floor(Math.random() * 301); // 生成 0 到 300 之间的随机整数
}
const handelRandom = () => {
  if (randomAreaList.value.length === 0) {
    for (let i = 0; i < dataJson.length; i++) {
      const children = dataJson[i].children;
      randomAreaList.value.push(...children);
    }
  }
  const areaCode = randomAreaList.value[getRandomNumber()].value;
  const birthday = getRandomBirthday();
  const idCard = generateIDNumber("male", areaCode, birthday);
  formState.content = idCard;
};
function generateIDNumber(gender: string, areaCode: string, birthday: string) {
  let idNumber = areaCode + birthday;

  for (let i = 0; i < 2; i++) {
    idNumber += Math.floor(Math.random() * 10); // 生成顺序号的两位数字
  }

  // 根据指定的性别设置倒数第二位数字
  if (gender === "male") {
    idNumber += Math.floor(Math.random() * 5) * 2 + 1; // 男性，奇数
  } else if (gender === "female") {
    idNumber += Math.floor(Math.random() * 5) * 2; // 女性，偶数
  } else {
    // 默认为男性
    idNumber += Math.floor(Math.random() * 5) * 2 + 1;
  }

  // 计算校验位...
  const weightFactors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(idNumber[i]) * weightFactors[i];
  }
  const remainder = sum % 11;
  const checkCodes = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
  const checkCode = checkCodes[remainder];

  idNumber += checkCode; // 添加校验位

  return idNumber;
}
/** 生成一个随机的出生年月 */
function getRandomBirthday() {
  const start = new Date(1950, 0, 1); // 设置起始日期为1950年1月1日
  const end = new Date(2005, 11, 31); // 设置结束日期为2005年12月31日
  const randomDate = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );

  const year = randomDate.getFullYear();
  const month = (randomDate.getMonth() + 1).toString().padStart(2, "0"); // 月份需要补零
  const day = randomDate.getDate().toString().padStart(2, "0"); // 日需要补零

  return `${year}${month}${day}`;
}
</script>
