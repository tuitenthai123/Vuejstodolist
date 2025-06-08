<script>

import {mapGetters, mapActions, mapMutations} from "vuex";

export default {
  name: "DashboardView",
  data() {
    return {
      group: null,
      itemsmenu: [
        {title: 'Today', icon: 'mdi-calendar-badge',tasknum:5,color:"green",route:"today"},
        {title: 'Coming Up', icon: 'mdi-calendar-arrow-right',route:"comingup"},
        {title: 'All Tasks', icon: 'mdi-format-list-bulleted',route:"all-tasks"},
      ],

    }
  },
  computed: {
    ...mapGetters(["drawer"]),
    drawerSync: {
      get() {
        return this.drawer;
      },
      set(value) {
        this.SET_DRAWER_STATUS(value)
      }
    }
  },
  methods: {
    ...mapActions(["_Logout"]),
    ...mapMutations(["SET_DRAWER_STATUS"]),
    handleLogout() {
      this._Logout()
      this.$router.push("/")
    }
  },
}

</script>

<template>
  <v-navigation-drawer
      v-model="drawerSync"
      app
      temporary
      width="auto"
  >
    <v-list
        nav
        dense
    >

      <v-list-item class="my-4">
        <v-avatar
            size="36px"
            class="mr-4"
        >
          <img
              alt="Avatar"
              src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
          >
        </v-avatar>
        <div class="d-flex flex-column justify-start">
            <span class="font-weight-medium text-h5">Thái Nguyên</span>
            <span class="text-caption grey--text">thainguyen240303@gmail.com</span>
        </div>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-item-group
          v-model="group"
          active-class="blue--text text--accent-4">
        <v-list-item v-for="(item,index) in itemsmenu" :key="index" @click="()=>{$router.push(`/dashboard/${item.route}`).catch(()=>{})}">
          <v-list-item-icon>
            <v-icon>{{item?.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{item?.title}}</v-list-item-title>
          <v-chip
              v-if="item.tasknum"
              small
              pill
              :color="item.color"
              text-color="white"
              class="ml-2 d-flex align-center justify-center text-center rounded-pill"
              style="width: 36px; height: 26px;"
          >
            {{ item.tasknum }}
          </v-chip>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn text block class="d-flex mb-2" @click="()=>{$router.push(`/setting/123`).catch(()=>{})}">
          <v-icon>mdi-cog</v-icon>
          <span class="ml-2">
            Setting
          </span>
        </v-btn>
        <v-btn text block @click="handleLogout" class="d-flex ga-3">
          <v-icon>mdi-logout</v-icon>
          <span class="ml-2">
            Logout
          </span>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>