<template>
    <a-list :grid="{ gutter: 10, xs: 1, sm: 2, md: 3, lg: 3, xl: 6, xxl: 3 }" :data-source="data" class="pt-6" >
      <template #renderItem="{ item }"  >
        <a-list-item  @click="handelItem(item)" class="cursor-pointer">
          <a-card :title="item.title">{{ item.desc }}</a-card>
        </a-list-item>
      </template>
    </a-list>
  </template>
  <script lang="ts" setup>
  interface DataItem {
    title: string;
    route?: string;
    desc:string;
  }
  import { useRouter } from 'vue-router';
    const router = useRouter();
  const data: DataItem[] = [
    {
      title: '虚拟身份证',
      route: 'ToolIdCard',
      desc:'随机生成身份证号码，可以用于测试'
    },
    {
      title: '随机银行卡',
      route: 'ToolBackCard',
      desc:'随机生成银行卡号码，可以用于测试'
    },
    {
      title:'时间转换',
      route:'ToolTime',
      desc:'时间戳转换，时间格式转换'
    },
    {
      title:'占位图片',
      route:'ToolImgs',
      desc:'用于占位图片显示'
    }

  ];
  const handelItem = (item: DataItem) => {
    console.log(item);
    if (item.route) {
      router.push({
        name: item.route,
      });
    }
  };
  </script>
  
  