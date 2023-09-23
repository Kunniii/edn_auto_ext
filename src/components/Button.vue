<script setup lang="ts">
const props = defineProps({
  state: {
    type: String,
    default: "static",
  },
});

const dynamicClass = {
  static: "bg-blue-500 dark:bg-blue-400 hover:scale-110 shadow-lg",
  disable: "bg-slate-400 dark:bg-slate-600 shadow-inner",
  ok: "bg-lime-500 dark:bg-lime-400 shadow-inner",
  failed: "bg-rose-500 dark:bg-rose-400 shadow-inner",
  pending: "bg-gray-400 dark:bg-gray-600 shadow-inner",
};
</script>

<template>
  <button
    class="duration-200 font-bold text-white text-lg w-fit rounded-full px-10 ease-in-out select-none"
    :disabled="state !== 'static'"
    :class="dynamicClass[state]"
  >
    <slot />
  </button>
</template>
