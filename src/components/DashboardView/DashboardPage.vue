<template>
  <div>
    <div>
      <navbar-view/>
      <sidebar-view/>
    </div>
    <v-main>
      <router-view/>
    </v-main>
    <movetotop-button pixel-depth="50"/>
  </div>
</template>

<script>
import sidebarView from "@/components/DashboardView/SidebarView.vue";
import navbarView from "@/components/DashboardView/NavbarView.vue";
import movetotopButton from "@/components/MovetotopButton.vue";

export default {
  name: 'DashboardPage',
  components: {
    sidebarView,
    navbarView,
    movetotopButton,
  },
}
</script>