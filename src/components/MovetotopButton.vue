<script>
export default {
  name: 'MovetotopButton',
  props: {
    pixelDepth: {
      type: Number,
      default: 200
    },
  },
  data() {
    return {
      showScrollButton: false,
    }
  },
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    handleScroll() {
      this.showScrollButton = window.scrollY > this.pixelDepth;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
}
</script>

<template>
  <v-fab-transition>
    <v-btn
        v-if="showScrollButton"
        fab
        fixed
        bottom
        right
        color="primary"
        @click="scrollToTop"
    >
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>
  </v-fab-transition>
</template>
