<script setup lang="ts">
import Card from "./components/Card.vue";

import { ref } from "vue";
import { useStore } from "./store";

const store = useStore();
store.callGetUrl();
store.callGetToken();

const handleShortCut = (event) => {
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
  <div class="w-80 text-slate-800 dark:bg-slate-900 dark:text-white py-4">
    <img
      src="/icon.png"
      class="mx-auto w-20 drop-shadow-lg"
    />
    <h1 class="text-center text-base pt-4 dark:text-white font-bold">{{ store.user?.name }}</h1>
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
</template>
