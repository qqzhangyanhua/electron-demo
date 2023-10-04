<template>
    <a-list bordered :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item>
      <p>
        <span>
          {{ item.title}}
        </span>
        <span class="pl-4">
          {{ item.value}}
        </span>
      </p>
      </a-list-item>
    </template>
    <template #header>
      <div>个人中心</div>
    </template>
  </a-list>
</template>
<script lang='ts' setup>
const data = [
  {
    title: '用户姓名',
    value: '张艳华',
  },
  {
    title: '性别',
    value: '男',
  },
  {
    title: '个人简介',
    value: 'xxxxxxxxxxxxxxx',

  },
  {
    title: '开始工作',
    value: '2017-10-01',
  },
  {
    title: '在职时间',
    value: '1天',
  }
];
</script>
<style lang="scss" scoped>

</style>
