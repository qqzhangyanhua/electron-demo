<template>
      <a-button type="primary" @click="goBack" class="mx-4 mt-2">返回</a-button>

</template>
<script lang='ts' setup>
import { useRouter } from "vue-router";
const router = useRouter();
const goBack = () => {
  router.go(-1);
};
</script>

