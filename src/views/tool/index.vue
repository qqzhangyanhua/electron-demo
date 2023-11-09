<template>
    <a-list :grid="{ gutter: 10, xs: 1, sm: 2, md: 3, lg: 3, xl: 6, xxl: 3 }" :data-source="data" class="pt-6" >
      <template #renderItem="{ item }"  >
        <a-list-item  @click="handelItem(item)" class="cursor-pointer">
          <a-card :title="item.title">虚拟身份证</a-card>
        </a-list-item>
      </template>
    </a-list>
  </template>
  <script lang="ts" setup>
  interface DataItem {
    title: string;
    route?: string;
  }
  import { useRouter } from 'vue-router';
    const router = useRouter();
  const data: DataItem[] = [
    {
      title: '虚拟身份证',
      route: 'ToolIdCard',
    },
    {
      title: '随机银行卡',
      route: 'ToolBackCard',
    },
    {
      title: 'Title 3',
    },
    {
      title: 'Title 4',
    },
    {
      title: 'Title 5',
    },
    {
      title: 'Title 6',
    },
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
  
  