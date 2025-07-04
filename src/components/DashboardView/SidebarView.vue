<script>

import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "DashboardView",
  data() {
    return {
      group: null,
      userid: ""
    }
  },
  mounted() {
    this.userid = this.user_id;
  },
  computed: {
    ...mapGetters(["drawer", "email", "username", "tasks", "avata", "user_id"]),
    drawerSync: {
      get() {
        return this.drawer;
      },
      set(value) {
        this.SET_DRAWER_STATUS(value)
      }
    },
    today() {
      const tzOffset = new Date().getTimezoneOffset() * 60000;
      return new Date(Date.now() - tzOffset).toISOString().substr(0, 10);
    },
    tasktoday() {
      const tasksArr = Array.isArray(this.tasks) ? this.tasks : [];
      return tasksArr.filter(task => task && task.dueDate === this.today);
    },
    tasksnum() {
      return this.tasktoday.length;
    },
    itemsmenu() {
      return [
        { title: 'Today', icon: 'mdi-calendar-badge', tasknum: this.tasksnum, color: "green", route: "today" },
        { title: 'Coming Up', icon: 'mdi-calendar-arrow-right', route: "comingup" },
        { title: 'All Tasks', icon: 'mdi-format-list-bulleted', route: "all-tasks" },
      ];
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
  <v-navigation-drawer v-model="drawerSync" app temporary width="auto">
    <v-list nav dense>

      <v-list-item class="my-4">
        <v-avatar size="36px" class="mr-4">
          <img alt="Avatar" :src=this.avata>
        </v-avatar>
        <div class="d-flex flex-column justify-start">
          <span class="font-weight-medium text-h5 ellipsis-15">{{ username.length > 15 ? username.slice(0, 15) + '...' : username }}</span>
          <span class="text-caption grey--text">{{ this.email }}</span>
        </div>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-item-group v-model="group" active-class="blue--text text--accent-4">
        <v-list-item v-for="(item, index) in itemsmenu" :key="index"
          @click="() => { $router.push(`/dashboard/${item.route}`).catch(() => { }) }">
          <v-list-item-icon>
            <v-icon>{{ item?.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item?.title }}</v-list-item-title>
          <v-chip v-if="item.tasknum" small pill :color="item.color" text-color="white"
            class="ml-2 d-flex align-center justify-center text-center rounded-pill" style="width: 36px; height: 26px;">
            {{ item.tasknum }}
          </v-chip>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn text block class="d-flex mb-2" @click="() => { $router.push(`/setting/${userid}`).catch(() => { }) }">
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

<style>
.ellipsis-15 {
  max-width: 190px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
}
</style>