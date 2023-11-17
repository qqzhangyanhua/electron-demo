<template>
  <div class="min-h-screen pb-20 bg-white">
    <Back />
    <a-form
      :model="formState"
      name="basic"
      class="pt-6"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 10 }"
      autocomplete="off"
    >
    <a-form-item label="生成图片">
       <img :src="linkImgUrl" class="max-w-full max-h-full"/>
      <a-space>
        <a-button type="link" @click="handelCopy" class="pt-2">复制链接</a-button>
        <a-button type="link" @click="handelOpen" class="pt-2">浏览器打开</a-button>
      </a-space>
      </a-form-item>
      <a-form-item label="图片宽度" name="username">
        <a-input v-model:value="formState.width" placeholder="宽度" />
      </a-form-item>
      <a-form-item label="图片高度" name="username">
        <a-input v-model:value="formState.height" placeholder="高度" />
      </a-form-item>
      <a-form-item label="显示文字" name="text">
        <a-input v-model:value="formState.text" placeholder="高度" />
      </a-form-item>
      <a-form-item label="文字颜色">
        <a-popover title="" trigger="hover" placement="topLeft">
          <template #content>
            <ColorPicker  @changeColor="(e)=>changeColor(e,'textColor')"/>
          </template>
         <div class="flex items-center">
          <a-button type="primary">选择颜色</a-button>
          <div class="w-5 h-5 ml-2 " :style="{backgroundColor:formState.textColor}"></div>
        </div>

        </a-popover>
      </a-form-item>
      <a-form-item label="背景颜色">
        <a-popover title="" trigger="hover" placement="topLeft">
          <template #content>
            <ColorPicker   @changeColor="(e)=>changeColor(e,'bgColor')"/>
          </template>
          <div class="flex items-center">
          <a-button type="primary">选择颜色</a-button>
          <div class="w-5 h-5 ml-2 " :style="{backgroundColor:formState.bgColor}"></div>
        </div>
        </a-popover>
      </a-form-item>

    </a-form>
  </div>
</template>
<script lang="ts" setup>
import Back from "../../../components/back.vue";
const { shell } = require("electron");
import { computed, reactive } from "vue";
import ColorPicker from "@/components/colorPicker.vue";
import useClipboard from "vue-clipboard3";
import { message } from "ant-design-vue";
const { toClipboard } = useClipboard();
interface FormState {
  width: string;
  height: string;
  text: string;
  textColor: string;
  bgColor: string;
}

const formState = reactive<FormState>({
  width: "600",
  height: "300",
  text: "600*300",
  textColor: "#847CC2",
  bgColor: "#FF80C0",
});
const linkImgUrl = computed(()=>{
  let text:string = formState.text;
  if(!text){
    text = `${formState.width}x${formState.height}`
  }
  return `https://via.placeholder.com/${formState.width}x${formState.height}/${formState.bgColor.replace('#','')}/${formState.textColor.replace('#','')}.png&text=${encodeURIComponent(text)}`
})

const changeColor =(e:string,type:keyof FormState)=>{
    console.log(e,type);
    formState[type ] = e;
}
const handelCopy = async () => {
  await toClipboard(linkImgUrl.value);
  message.success("复制成功");
};
const handelOpen = ()=>{
  shell.openExternal(linkImgUrl.value);
}
</script>
<style lang="scss" scoped></style>
