<script setup>
import loading from "../assets/loading.svg";
import check from "../assets/check.svg";
import failed from "../assets/failed.svg";

const props = defineProps({
  state: {
    type: String,
    default: "static",
  },
});

const dynamicClass = {
  static: "bg-blue-500 dark:bg-blue-400 hover:scale-110 shadow-lg",
  disable: "bg-slate-400 dark:bg-slate-600 shadow-inner cursor-not-allowed",
  ok: "bg-lime-500 dark:bg-lime-400 shadow-inner cursor-not-allowed",
  failed: "bg-rose-500 dark:bg-rose-400 shadow-inner cursor-not-allowed",
  pending: "bg-gray-400 dark:bg-gray-600 shadow-inner cursor-not-allowed",
};
</script>

<template>
  <button
    class="duration-200 font-bold text-white text-lg w-36 rounded-lg px-10 ease-in-out select-none"
    :class="dynamicClass[state]"
    :disabled="state != 'static'"
  >
    <slot v-if="state == 'static' || state == 'disable'" />
    <img
      v-else-if="state == 'pending'"
      :src="loading"
      class="animate-spin mx-auto"
    />
    <img
      v-else-if="state == 'ok'"
      :src="check"
      class="mx-auto"
    />
    <img
      v-else-if="state == 'failed'"
      :src="failed"
      class="mx-auto"
    />
  </button>
</template>
