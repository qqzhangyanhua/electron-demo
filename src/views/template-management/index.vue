<template>
  <div class="px-2 pt-2 bg-gray-200">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane v-for="item in tabsList" :key="item.key" :tab="item.name">
        <a-row :gutter="16">
          <a-col v-for="(item,index) in templateList" :key="index" :span="8" class="pb-6 cursor-pointer">
            <a-card :title="item.name" :bordered="false" @click="handelClick">
              <p>{{ item.remark }}</p>
            </a-card>
          </a-col>
        </a-row>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref ,reactive } from "vue";
import { useRouter} from "vue-router";
const activeKey = ref("1");
const router = useRouter();
const tabsList = [
  {
    name: "Vue2模板",
    key: "1",
  },
  {
    name: "Vue3模板",
    key: "2",
  },
  {
    name: "React模板",
    key: "3",
  },
];
const templateList = reactive([{
    name:'基础模板',
    remark:'基础模板',
},
{
    name:'dialog模板',
    remark:'dialog模板',
},
{
    name:'卡片模板',
    remark:'卡片模板',
},
{
    name:'表格模板',
    remark:'表格模板',
},
{
    name:'表单模板',
    remark:'表单模板',
}
])
const handelClick = (item:any) => {
    router.push({
        path: '/template-code',
        query: {
            name: item.name,
            remark: item.remark
        }
    })
}
</script>
