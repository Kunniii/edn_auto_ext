<script setup lang="ts">
import Button from "./Button.vue";

const props = defineProps({
  onBtnClick: {
    required: true,
  },
  state: {
    type: String,
    default: "static",
  },
});
</script>
<template>
  <div class="bg-sky-50 dark:bg-slate-800 rounded-xl my-2 mx-2 p-5 pl-8 flex justify-between">
    <p class="text-lg select-none font-medium">
      <slot />
    </p>
    <Button
      @click="props.onBtnClick"
      :state="state"
    >
      GRADE
    </Button>
  </div>
</template>
