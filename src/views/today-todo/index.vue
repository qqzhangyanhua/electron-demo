<template>
  <div class="px-2 pt-2 bg-gray-200">
    <a-alert
      message="今日需要处理的事项,如在时间内未提醒,请查看电脑是否对客户端关闭了通知功能"
      type="info"
      class="mb-2"
    />
    <a-alert
      message="最多只能设置三个提醒事项"
      type="error"
      class="mb-2"
      v-if="dataSource.length >= 3"
    />

    <a-row>
      <a-col :span="12">
        <a-button
          type="primary"
          class="mt-4 mb-4"
          @click="addRemind"
          :disabled="dataSource.length >= 3"
          >新添提醒</a-button
        ></a-col
      >
      <a-col>
        <a-space>
          <a-button type="primary" class="mt-4 mb-4" @click="sendMsg"
            >测试发送提醒</a-button
          >
        </a-space>
      </a-col>
    </a-row>
    <AddSign
      v-if="openModal"
      v-model:visible="openModal"
      :isEdit="isEdit"
      @saveSuccess="saveSuccess"
    />
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :pagination="{ hideOnSinglePage: true }"
    >
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
import AddSign from "./components/addSign.vue";
import { onMounted, reactive, ref } from "vue";
import dayjs from "dayjs";
const { ipcRenderer } = require("electron");
interface FormState {
  sendTime: string;
  remark: string;
  title: string;
  key?: string;
}
const dataSource: Array<FormState> = reactive([]);
const columns = reactive([
  {
    title: "提醒标题",
    dataIndex: "title",
  },
  {
    title: "提醒时间",
    dataIndex: "sendTime",
  },
  {
    title: "提醒说明",
    dataIndex: "remark",
  },

  {
    title: "操作",
    dataIndex: "action",
    width: 100,
  },
]);
onMounted(() => {
  const pendingProcess =
    window.localStorage.getItem("pendingProcess") || "[]";
  console.log(JSON.parse(pendingProcess));
  Object.assign(dataSource, JSON.parse(pendingProcess));
  console.log("mounted");
});
const openModal = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const addRemind = () => {
  openModal.value = true;
  // window.localStorage.setItem('pendingProcess',JSON.stringify(dataSource))
};
const sendMsg = () => {
  const option = {
    title: "温馨提示",
    body: "你已经干活很久了，休息一下吧！",
  };
  var myNotification = new Notification(option.title, option);
  console.log(myNotification);
  myNotification.onclick = () => {
    console.log("通知被点击");
  };
  // const time = "2023-10-03 10:46:52";
  // ipcRenderer.send("setAlarm", { time, title: "测试标题", body: "测试内容" });
  // ipcRenderer.on("alarmTriggered", () => {
  //   console.log("监听========alarmTriggered");
  // });
};
const confirm = (val: FormState) => {
  console.log("确认删除", val);
  const index = dataSource.findIndex((item) => item.key === val.key);
  dataSource.splice(index, 1);

  window.localStorage.setItem("pendingProcess", JSON.stringify(dataSource));
};
const cancel = () => {
  console.log("取消删除");
};
const saveSuccess = (item: FormState) => {
  const keys = ["reminderEvent", "reminderEvent1", "reminderEvent2"];
  const dataKeys = dataSource.map((item) => item.key);
  const key = keys.find((item) => !dataKeys.includes(item));
  const now = dayjs();
  const datetime = now.format("YYYY-MM-DD") + " " + item.sendTime;
  item.key = key;
  dataSource.push(item);
  // 发送事件!
  ipcRenderer.send(key, {
    time: datetime,
    title: item.title,
    body: item.remark,
    action: "add",
    eventKey: key,
  });
  console.log(item);

  window.localStorage.setItem("pendingProcess", JSON.stringify(dataSource));
};
</script>
<style lang="scss" scoped></style>
