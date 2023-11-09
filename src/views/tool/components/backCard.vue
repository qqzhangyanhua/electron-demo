<template>
  <div>
    <Back />
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
        label="选择银行"
        name="backName"
        :rules="[{ required: true, message: '请选择银行' }]"
      >
        <a-select
          placeholder="选择所属银行"
          v-model:value="formState.backName"
          style="width: 100%"
          :options="options"
        />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-space>
          <a-button type="primary" html-type="submit">开始生成</a-button>
          <a-button type="primary" @click="handelRandom">随机生成</a-button>
        </a-space>
      </a-form-item>
      <a-form-item label="生成结果" name="content">
        {{ myBankName }}
        <p v-if="chooseBank">随机结果:{{ chooseBank }}</p>
        <a-textarea v-model:value="formState.content" placeholder="输出结果" />
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
import { computed, reactive, ref } from "vue";
import Back from "../../../components/back.vue";
import useClipboard from "vue-clipboard3";
import { message } from "ant-design-vue";

const { toClipboard } = useClipboard();
interface FormState {
  backName: number | null;
  content: string;
}
const formState = reactive<FormState>({
  backName: 1,
  content: "",
});

const options = [
  {
    label: "工商银行(ICBC)",
    value: 1,
    children: [
      "6213",
      "6220",
      "6221",
      "6222",
      "6223",
      "6224",
      "6225",
      "6226",
      "6227",
      "6228",
      "6229",
      "623",
      "624",
      "625",
      "626",
      "627",
      "628",
      "629",
      "9558",
    ],
  },
  { label: "农业银行(ABC)", value: 2, children: ["6228", "95599"] },
  { label: "建设银行(CCB)", value: 3, children: ["621001", "621002"] },
  { label: "中国银行(BOC)", value: 4, children: ["621660", "621661"] },
  { label: "交通银行(BCM)", value: 5, children: ["621717"] },
  {
    label: "招商银行(CMB)",
    value: 6,
    children: [
      "621483",
      "621485",
      "621486",
      "621487",
      "621488",
      "621492",
      "621493",
      "621498",
      "621499",
    ],
  },
  { label: "光大银行(CEB)", value: 7, children: ["621462", "622675"] },
  {
    label: "中信银行(CITIC)",
    value: 8,
    children: ["622696", "622698", "622699"],
  },
  { label: "华夏银行(HXB)", value: 9, children: ["622630", "622631"] },
  {
    label: "平安银行(PAB)",
    value: 10,
    children: ["622155", "622156", "622157"],
  },
  { label: "兴业银行(CIB)", value: 11, children: ["622902", "622901"] },
  {
    label: "浦发银行(SPDB)",
    value: 12,
    children: ["621283", "621284", "621082", "622298"],
  },
  {
    label: "广发银行(GDB)",
    value: 13,
    children: [
      "621462",
      "621488",
      "900000",
      "900010",
      "900030",
      "900031",
      "900032",
      "626301",
      "622556",
      "623502",
      "623803",
    ],
  },
  {
    label: "民生银行(CMBC)",
    value: 14,
    children: ["622600", "623516", "621691", "622622", "625498"],
  },
  {
    label: "恒丰银行(EGB)",
    value: 15,
    children: ["622707", "622709", "622708"],
  },
  { label: "北京银行(BCCB)", value: 16, children: ["621661", "603506"] },
  {
    label: "渤海银行(BOB)",
    value: 17,
    children: ["622884", "622885", "622886", "622887"],
  },
  { label: "上海银行(BOS)", value: 18, children: ["623086"] },
];
const myBankName = computed(() => {
  const bankName = options.find((item) => item.value === formState.backName);
  return bankName?.label;
});
const handelCopy = async () => {
  await toClipboard(formState.content);
  message.success("复制成功");
};
const chooseBank = ref("");
const onFinish = () => {
  chooseBank.value = "";
  formState.content = "";
  const item: any = options.find((item) => item.value === formState.backName);
  const cardNumber = generateBankCardNumber(item.children);
  formState.content = cardNumber;
};
const handelRandom = () => {
  const randomNum = Math.floor(Math.random() * 16) + 1;
  const item: any = options.find((item) => item.value === randomNum);
  const cardNumber = generateBankCardNumber(item.children);
  console.log("生成的银行卡号：" + cardNumber);
  chooseBank.value = item.label;
  formState.content = cardNumber;
};
function generateRandomNumber(length: number) {
  var randomNumber = "";
  for (var i = 0; i < length; i++) {
    randomNumber += Math.floor(Math.random() * 10);
  }
  return randomNumber;
}

function generateBankCardNumber(prefixes: string) {
  var prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  var cardNumber = prefix.toString();

  // 根据不同银行的规则生成不同长度的银行卡号
  if (prefix.length === 2) {
    cardNumber += generateRandomNumber(16 - prefix.length);
  } else if (prefix.length === 4) {
    cardNumber += generateRandomNumber(18 - prefix.length);
  } else if (prefix.length === 6) {
    cardNumber += generateRandomNumber(19 - prefix.length);
  }

  // Luhn算法生成校验位
  var oddSum = 0;
  var evenSum = 0;
  var allSum = 0;
  var cardDigits = cardNumber.split("");
  var cardLength = cardDigits.length;
  var parity = cardLength % 2;

  for (var i = cardLength - 1; i >= 0; i--) {
    var digit = parseInt(cardDigits[i]);

    if (i % 2 === parity) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
      oddSum += digit;
    } else {
      evenSum += digit;
    }
    allSum += digit;
  }

  var checksum = allSum % 10 === 0 ? 0 : 10 - (allSum % 10);
  cardNumber += checksum;

  return cardNumber;
}
</script>
