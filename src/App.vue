<script setup lang="ts">
import Card from "./components/Card.vue";
import { useStore } from "./store";

const store = useStore();
store.callGetUrl();
store.callGetToken();

const handleShortCut = (event: KeyboardEvent) => {
  if (event.key === "1") {
    store.gradeTeammatesState == "static" && store.gradeTeammates();
  }
  if (event.key === "2") {
    store.gradeGroupsState == "static" && store.gradeGroups();
  }
  if (event.key === "3") {
    store.gradeCommentsState == "static" && store.gradeComments();
  }
};

window.addEventListener("keydown", handleShortCut);
</script>

<template>
  <div
    v-if="store.appReady"
    class="w-80 text-slate-800 dark:bg-slate-900 dark:text-white py-4"
  >
    <img
      src="/icon.png"
      class="mx-auto w-20 drop-shadow-lg animate-wiggle"
    />
    <h1 class="text-center text-base pt-2 font-bold">{{ store.user?.name }}</h1>
    <div>
      <Card
        :on-btn-click="store.gradeTeammates"
        :state="store.gradeTeammatesState"
      >
        Teammates
      </Card>
      <Card
        :on-btn-click="store.gradeGroups"
        :state="store.gradeGroupsState"
      >
        Groups
      </Card>
      <Card
        :on-btn-click="store.gradeComments"
        :state="store.gradeCommentsState"
      >
        Comments
      </Card>
    </div>
    <p class="text-center text-md dark:text-white">{{ store.version }}</p>
  </div>
  <div
    v-else
    class="text-center w-80 text-slate-800 dark:bg-slate-900 dark:text-white py-4"
  >
    <h1 class="font-bold text-md">Please go to Edunext to use this Extension</h1>
    <a
      href="https://fu-edunext.fpt.edu.vn"
      class="underline font-bold text-blue-500"
      >Go to Edunext</a
    >
  </div>
</template>
