<template>
  <div class="gradient">
    <v-container fluid fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="mx-auto rounded-lg" elevation="8">
            <v-card-title class="d-flex justify-center pt-8">
              <span class="text-h4 font-weight-bold">SIGN UP</span>
            </v-card-title>

            <v-card-text class="px-8 pt-8">
              <v-text-field v-model="username" label="Username" prepend-icon="mdi-account" hide-details
                            class="mb-6"></v-text-field>

              <v-text-field v-model="password" label="Password" :type="showPassword ? 'text' : 'password'"
                            prepend-icon="mdi-lock" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="showPassword = !showPassword" hide-details class="mb-6"></v-text-field>

              <v-btn block color="primary" height="44" rounded elevation="2" class="mb-8"
                     @click="handleSignUp">
                SIGN UP
              </v-btn>

              <div class="text-center">
                <router-link to="/" class="text-decoration-none">
                  Already have an account? Login
                </router-link>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import {mapActions} from 'vuex';
import sleep from '@/lib/sleep';

export default {
  name: 'SignUpPage',
  data: () => ({
    username: '',
    password: '',
    showPassword: false,
    snackbar: false,
    snackbarText: '',
    snackbarColor: 'success',

  }),
  methods: {
    ...mapActions(["_Signup"]),
    async handleSignUp() {
      if (!this.username || !this.password) {
        this.showSnackbar('Please enter username and password', 'error');
        return;
      }

      const response = await this._Signup(
          {
            username: this.username,
            password: this.password
          }
      )
      if (response) {
        this.showSnackbar('Now you can use your account', 'success');
        await sleep(2000);
        this.$router.push('/');
      } else {
        this.showSnackbar('Create failed. Please check your credentials.', 'error');
      }
    },
    showSnackbar(text, color) {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.snackbar = true;
    }
  }

}

</script>

<style scoped>
.gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 100%;
}
</style>