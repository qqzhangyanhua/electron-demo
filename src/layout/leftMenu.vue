<template>
  <img src="@/assets/logo.png" class="w-14 h-14" />
  <a-menu
    id="dddddd"
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    mode="inline"
    :items="items"
    style="background: rgb(50, 176, 97, 0.3); color: #fff"
    @click="handleClick"
  ></a-menu>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, h } from "vue";

import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  LoginOutlined,
  FileAddOutlined
} from "@ant-design/icons-vue";
import type { MenuProps, ItemType } from "ant-design-vue";
import { useRouter } from "vue-router";
const selectedKeys = ref<string[]>(["1"]);
const openKeys = ref<string[]>(["sub1"]);

const router = useRouter();

const items: ItemType[] = reactive([
  {
    key: "1",
    icon: () => h(MailOutlined),
    label: "我的主页",
    title: "Option 1",
    route: "Home",
  },
  {
    key: "2",
    icon: () => h(AppstoreOutlined),
    label: "项目管理",
    title: "Option 2",
    route: "Management",
  },
  {
    key: "4",
    icon: () => h(LoginOutlined),
    label: "空间登陆",
    title: "Option 4",
    route: "SpaceLogin",
  },
  {
    key: "5",
    icon: () => h(FileAddOutlined),
    label: "今日待做",
    title: "Option 5",
    route: "TodayTodo",
  },
  {
    key: "3",
    icon: () => h(SettingOutlined),
    label: "个人中心",
    title: "Option 3",
    route: "PersonalCenter",
  },
  {
    key: "6",
    icon: () => h(SettingOutlined),
    label: "本地项目",
    title: "Option 3",
    route: "ScriptExe",
  },
]);

const handleClick: MenuProps["onClick"] = (e) => {
  console.log("click=====", e.item);
  router.push({ name: e.item.route });
};

watch(openKeys, (val) => {
  console.log("openKeys", val);
});
</script>
<style lang="scss" scoped></style>
