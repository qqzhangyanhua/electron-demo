<template>
  <div class="px-2 pt-2 bg-gray-200">
    <a-alert message="我正在做的项目" type="info" class="mb-2" />
    <a-button type="primary" class="mt-4 mb-4" @click="handelAdd"
      >新建需求记录</a-button
    >
    <AddManage v-model:visible="openModal" />
    <a-table :dataSource="dataSource" :columns="columns" />
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import AddManage from "./components/add-manage.vue";
const dataSource = reactive([
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
]);
const columns = reactive([
  {
    title: "禅道编号",
    dataIndex: "name",
  },
  {
    title: "需求描述",
    dataIndex: "age",
  },
  {
    title: "相关产品",
    dataIndex: "address",
  },
  {
    title: "jira地址",
    dataIndex: "address",
  },
  {
    title: "设计图地址",
    dataIndex: "address",
  },
]);
const openModal = ref<boolean>(false);

const handelAdd = () => {
  console.log("新建需求记录");
  openModal.value = true;
};
</script>
<style lang="scss" scoped></style>
