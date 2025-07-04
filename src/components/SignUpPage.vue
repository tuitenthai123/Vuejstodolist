<template>
  <div class="gradient">
    <v-container fluid fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="5">
          <v-card class="mx-auto rounded-lg" elevation="8">
            <v-card-title class="d-flex justify-center pt-8">
              <span class="text-h4 font-weight-bold">SIGN UP</span>
            </v-card-title>

            <v-form ref="signupForm" v-model="formValid" @submit.prevent="handleSignUp">
              <v-card-text class="px-8 pt-8">
                <!-- Email Field -->
                <v-text-field 
                  v-model="email" 
                  :rules="emailRules" 
                  required 
                  label="Email" 
                  prepend-icon="mdi-account"
                  outlined
                  class="mb-4"
                ></v-text-field>

                <!-- Password Field -->
                <v-text-field 
                  v-model="password" 
                  label="Password" 
                  :type="showPassword ? 'text' : 'password'"
                  prepend-icon="mdi-lock" 
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword" 
                  :rules="passwordRules"
                  outlined
                  required 
                  class="mb-4"
                ></v-text-field>

                <!-- Confirm Password Field -->
                <v-text-field 
                  v-model="confirmPassword" 
                  label="Confirm Password" 
                  :type="showConfirmPassword ? 'text' : 'password'"
                  prepend-icon="mdi-lock-check" 
                  :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showConfirmPassword = !showConfirmPassword" 
                  :rules="confirmPasswordRules"
                  outlined
                  required 
                  class="mb-4"
                ></v-text-field>

                <!-- Password Strength Indicator -->
                <div v-if="password" class="mb-4">
                  <div class="d-flex align-center mb-2">
                    <span class="text-caption grey--text mr-2">Password Strength:</span>
                    <span class="text-caption" :class="passwordStrengthColor">
                      {{ passwordStrengthText }}
                    </span>
                  </div>
                  <v-progress-linear 
                    :value="passwordStrengthValue" 
                    :color="passwordStrengthColor.replace('--text', '')"
                    height="4" 
                    rounded
                  ></v-progress-linear>
                </div>

                <!-- Password Requirements -->
                <v-card v-if="password" outlined class="mb-6">
                  <v-card-text class="pa-3">
                    <div class="d-flex align-center mb-2">
                      <v-icon small color="primary" class="mr-2">mdi-information</v-icon>
                      <span class="text-subtitle-2">Password Requirements</span>
                    </div>
                    <div class="d-flex flex-wrap">
                      <v-chip 
                        class="ma-1" 
                        small 
                        :color="hasMinLength ? 'success' : 'grey lighten-1'"
                        :text-color="hasMinLength ? 'white' : ''"
                      >
                        <v-icon left x-small>{{ hasMinLength ? 'mdi-check' : 'mdi-close' }}</v-icon>
                        8+ characters
                      </v-chip>
                      <v-chip 
                        class="ma-1" 
                        small 
                        :color="hasUppercase ? 'success' : 'grey lighten-1'"
                        :text-color="hasUppercase ? 'white' : ''"
                      >
                        <v-icon left x-small>{{ hasUppercase ? 'mdi-check' : 'mdi-close' }}</v-icon>
                        Uppercase
                      </v-chip>
                      <v-chip 
                        class="ma-1" 
                        small 
                        :color="hasLowercase ? 'success' : 'grey lighten-1'"
                        :text-color="hasLowercase ? 'white' : ''"
                      >
                        <v-icon left x-small>{{ hasLowercase ? 'mdi-check' : 'mdi-close' }}</v-icon>
                        Lowercase
                      </v-chip>
                      <v-chip 
                        class="ma-1" 
                        small 
                        :color="hasNumber ? 'success' : 'grey lighten-1'"
                        :text-color="hasNumber ? 'white' : ''"
                      >
                        <v-icon left x-small>{{ hasNumber ? 'mdi-check' : 'mdi-close' }}</v-icon>
                        Number
                      </v-chip>
                      <v-chip 
                        class="ma-1" 
                        small 
                        :color="hasSpecialChar ? 'success' : 'grey lighten-1'"
                        :text-color="hasSpecialChar ? 'white' : ''"
                      >
                        <v-icon left x-small>{{ hasSpecialChar ? 'mdi-check' : 'mdi-close' }}</v-icon>
                        Special character
                      </v-chip>
                    </div>
                  </v-card-text>
                </v-card>

                <!-- Sign Up Button -->
                <v-btn 
                  block 
                  color="primary" 
                  height="44" 
                  rounded 
                  elevation="2" 
                  class="mb-8" 
                  type="submit"
                  :disabled="!formValid"
                  :loading="loading"
                >
                  SIGN UP
                </v-btn>

                <!-- Login Link -->
                <div class="text-center">
                  <router-link to="/" class="text-decoration-none">
                    Already have an account? Login
                  </router-link>
                </div>
              </v-card-text>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Snackbar -->
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
import { mapActions } from 'vuex';
import sleep from '@/lib/sleep';
import generateRandomName from "@/lib/Randomname";

export default {
  name: 'SignUpPage',
  data: () => ({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    formValid: false,
    loading: false,
    snackbar: false,
    snackbarText: '',
    snackbarColor: 'success',
    
    // Validation Rules
    emailRules: [
      v => !!v || 'Email is required',
      v => /.+@.+\..+/.test(v) || 'Email must be valid',
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 8) || 'Password must be at least 8 characters',
      v => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
      v => /[a-z]/.test(v) || 'Password must contain at least one lowercase letter',
      v => /\d/.test(v) || 'Password must contain at least one number',
      v => /[!@#$%^&*(),.?":{}|<>]/.test(v) || 'Password must contain at least one special character'
    ]
  }),

  computed: {
    // Confirm Password Rules
    confirmPasswordRules() {
      return [
        v => !!v || 'Please confirm your password',
        v => v === this.password || 'Passwords do not match'
      ]
    },

    // Password Strength Calculation
    passwordStrengthValue() {
      if (!this.password) return 0

      let score = 0
      if (this.hasMinLength) score += 20
      if (this.hasUppercase) score += 20
      if (this.hasLowercase) score += 20
      if (this.hasNumber) score += 20
      if (this.hasSpecialChar) score += 20

      return score
    },

    passwordStrengthText() {
      const value = this.passwordStrengthValue
      if (value === 0) return 'No password'
      if (value <= 40) return 'Weak'
      if (value <= 60) return 'Fair'
      if (value <= 80) return 'Good'
      return 'Strong'
    },

    passwordStrengthColor() {
      const value = this.passwordStrengthValue
      if (value === 0) return 'grey--text'
      if (value <= 40) return 'error--text'
      if (value <= 60) return 'warning--text'
      if (value <= 80) return 'info--text'
      return 'success--text'
    },

    // Password Requirements Checks
    hasMinLength() {
      return this.password && this.password.length >= 8
    },

    hasUppercase() {
      return this.password && /[A-Z]/.test(this.password)
    },

    hasLowercase() {
      return this.password && /[a-z]/.test(this.password)
    },

    hasNumber() {
      return this.password && /\d/.test(this.password)
    },

    hasSpecialChar() {
      return this.password && /[!@#$%^&*(),.?":{}|<>]/.test(this.password)
    },

    // Check if password meets all requirements
    isPasswordStrong() {
      return this.hasMinLength && this.hasUppercase && this.hasLowercase && this.hasNumber && this.hasSpecialChar
    }
  },

  methods: {
    ...mapActions(["_Signup"]),

    async handleSignUp() {
      // Validate form
      if (!this.$refs.signupForm.validate()) {
        this.showSnackbar('Please fix the errors above', 'error');
        return;
      }

      // Check if passwords match
      if (this.password !== this.confirmPassword) {
        this.showSnackbar('Passwords do not match', 'error');
        return;
      }

      // Check password strength
      if (!this.isPasswordStrong) {
        this.showSnackbar('Password does not meet all requirements', 'error');
        return;
      }

      this.loading = true;

      try {
        const response = await this._Signup({
          email: this.email,
          id: generateRandomName(10),
          username: `user_${generateRandomName(10)}`,
          password: this.password,
        });

        if (response?.status == "success") {
          this.showSnackbar(response?.noti, response?.status);
          await sleep(2000);
          this.$router.push('/').catch(() => { });
        } else {
          this.showSnackbar(response?.noti, response?.status);
        }
      } catch (error) {
        this.showSnackbar('An error occurred during signup', 'error');
      } finally {
        this.loading = false;
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
  min-height: 100vh;
}

.v-card {
  border-radius: 12px;
}

.v-btn {
  border-radius: 8px;
}

.v-text-field {
  border-radius: 8px;
}

/* Custom styling for password requirements */
.v-chip.v-size--small {
  font-size: 0.75rem;
}

/* Ensure proper spacing on mobile */
@media (max-width: 600px) {
  .v-card-text {
    padding: 16px !important;
  }
  
  .v-chip.ma-1 {
    margin: 2px !important;
  }
}
</style>