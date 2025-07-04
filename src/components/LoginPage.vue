<template>
  <div class="gradient">
    <v-container fluid fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="mx-auto rounded-lg" elevation="8">
            <v-card-title class="d-flex justify-center pt-8">
              <span class="text-h4 font-weight-bold">LOGIN</span>
            </v-card-title>
            <form @submit.prevent="handleLogin">
              <v-card-text class="px-8 pt-8">
                <v-text-field
                  v-model="email"
                  clearable
                  label="Email"
                  prepend-icon="mdi-email"
                  variant="underlined"
                  hide-details
                  class="mb-6"
                  :disabled="isLoading"
                  @keyup.enter="handleLogin"
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  label="Password"
                  prepend-icon="mdi-lock"
                  variant="underlined"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  hide-details
                  class="mb-6"
                  :disabled="isLoading"
                  @keyup.enter="handleLogin"
                ></v-text-field>
                <v-row no-gutters class="mb-6" justify="space-between" align="center">
                  <v-checkbox 
                    dense 
                    label="Remember me" 
                    hide-details
                    :disabled="isLoading"
                  ></v-checkbox>
                  <v-btn 
                    text 
                    color="primary" 
                    class="text-none"
                    :disabled="isLoading"
                  >
                    Forgot password?
                  </v-btn>
                </v-row>
             
                <v-btn 
                  type="submit" 
                  block 
                  color="primary" 
                  height="44" 
                  rounded 
                  elevation="2" 
                  class="text-h6 mb-8"
                  :loading="isLoading"
                >
                  <template v-if="!isLoading">
                    LOGIN
                  </template>
                  <template v-else>
                    <v-progress-circular
                      indeterminate
                      size="20"
                      width="2"
                      color="white"
                      class="mr-2"
                    ></v-progress-circular>
                    Logging in...
                  </template>
                </v-btn>
                
                <div class="text-center">
                  <router-link 
                    to="/signup" 
                    class="text-decoration-none"
                    :class="{ 'disabled-link': isLoading }"
                  >
                    Don't have an account? Sign up
                  </router-link>
                </div>
              </v-card-text>
            </form>
            
            <v-overlay 
              v-if="isLoading" 
              absolute 
              opacity="0.1"
            >
              <v-progress-circular
                indeterminate
                size="64"
                color="primary"
              ></v-progress-circular>
            </v-overlay>
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
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'LoginPage',
  data: () => ({
    email: "",
    username: '',
    password: '',
    showPassword: false,
    isLoading: false, // Loading state
    snackbar: false,
    snackbarText: '',
    snackbarColor: 'success',
  }),
  computed: {
    ...mapGetters(["islogin"])
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      if (!this.email || !this.password) {
        this.showSnackbar('Please enter email and password', 'error');
        return;
      }
      
      this.isLoading = true;
      
      try {
        const [loginResult] = await Promise.all([
          this.login({
            email: this.email,
            password: this.password,
          }),
          new Promise(resolve => setTimeout(resolve, 1000))
        ]);
        
        if (loginResult) {
          this.showSnackbar('Login successful!', 'success');
          setTimeout(() => {
            this.$router.push('/dashboard/today').catch(() => {});
          }, 500);
        } else {
          this.showSnackbar('Login failed. Please check your credentials.', 'error');
        }
      } catch (error) {
        console.error('Login error:', error);
        this.showSnackbar('An error occurred during login. Please try again.', 'error');
      } finally {
        this.isLoading = false;
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
  background: cornsilk;
  height: 100%;
}

.disabled-link {
  pointer-events: none;
  opacity: 0.6;
}

.v-btn--loading {
  pointer-events: none;
}

.v-overlay {
  border-radius: 8px;
}
</style>
