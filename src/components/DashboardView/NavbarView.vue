<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: 'NavbarView',
  computed:{
    ...mapGetters(["drawer"])
  },
  methods:{
    ...mapActions(["_setDraw"]),
    handlesetDraw(){
      this._setDraw()
    }
  }
 }
</script>

<template>
  <v-app-bar color="white" elevate-on-scroll>
    <v-app-bar-nav-icon @click="handlesetDraw"></v-app-bar-nav-icon>
    <v-toolbar-title class="text-h5 font-weight-bold primary--text">TaskFlow</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-icon>mdi-magnify</v-icon>
  </v-app-bar>
</template>

<style>

</style>