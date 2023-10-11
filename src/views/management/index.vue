<template>
  <div class="px-2 pt-2 bg-gray-200">
    <a-alert message="我正在做的项目" type="info" class="mb-2" />
    <a-button type="primary" class="mt-4 mb-4" @click="handelAdd"
      >新建需求记录</a-button
    >
    <AddManage v-model:visible="openModal" @saveSuccess="saveSuccess" />
    <a-table :dataSource="dataSource" :columns="columns">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <a-space>
            <a-button type="text" class="text-[#4cc086]">编辑</a-button>
            <a-popconfirm
              title="是否删除该提醒？"
              ok-text="是"
              cancel-text="否"
              @confirm="confirm(record)"
              @cancel="cancel"
            >
              <a-button type="text" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import AddManage from "./components/add-manage.vue";
import axios from "axios";
const dataSource: any = reactive([]);
const columns = reactive([
  {
    title: "禅道编号",
    dataIndex: "id",
  },
  {
    title: "需求描述",
    dataIndex: "remark",
  },
  {
    title: "相关产品",
    dataIndex: "relatedProduct",
  },
  {
    title: "jira地址",
    dataIndex: "jiraUrl",
  },
  {
    title: "设计图地址",
    dataIndex: "designUrl",
  },
  {
    title: "文档地址",
    dataIndex: "apiDocUrl",
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 100,
  },
]);
const manageString = localStorage.getItem("manageList") || "[]";
const manageList = JSON.parse(manageString);
Object.assign(dataSource, manageList);
const openModal = ref<boolean>(false);
const saveSuccess = (item: any) => {
  console.log("保存成功", item);
  dataSource.push(item);
  localStorage.setItem("manageList", JSON.stringify(dataSource));
  openModal.value = false;
};
const confirm = (record: any) => {
  console.log("删除", record);
  const index = dataSource.findIndex((item: any) => item.id === record.id);
  dataSource.splice(index, 1);
  localStorage.setItem("manageList", JSON.stringify(dataSource));
};
const cancel = () => {};

const handelAdd = () => {
  console.log("新建需求记录");
  axios({
    method: "get",
    url: "http://192.168.2.22:9000/api/v4/users/182/projects",
    headers: {
      Authorization: `Bearer 3Ase9dwtm5HyED9Y2_nx`,
    },
  }).then((res: any) => {
    console.log("11111111111", res);
  });

  openModal.value = true;
};
</script>
<style lang="scss" scoped></style>
