<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'AppMain'
}
</script>

<style>

::-webkit-scrollbar {
  width: 8px;
  opacity: 0;
  transition: opacity 0.5s ease;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}


::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}


::-webkit-scrollbar-thumb:hover {
  background: #555;
  opacity: 1;
}

</style>
