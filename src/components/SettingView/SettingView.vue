<template>
  <div class="pa-4">
    <v-overlay :value="loading" absolute opacity="0.7">
      <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay>

    <v-container max-width="800px">
      <!-- Header -->
      <div class="mb-6 d-flex align-center">
        <div>
          <!-- Back Button -->
          <div class="back-button-container mb-6">
            <v-btn class="back-button" color="primary" text @click="goBack" elevation="0">
              <v-icon left>mdi-arrow-left</v-icon>
              Quay lại
            </v-btn>
          </div>
          <h1 class="text-h4 font-weight-medium mb-2">Settings</h1>
          <p class="grey--text text-subtitle-1 mb-0">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <v-card class="mb-6" elevation="2">
        <v-card-title class="d-flex align-center">
          <v-icon color="primary" class="mr-3">mdi-account-circle</v-icon>
          <span class="text-h6">Profile Information</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
          <div class="d-flex align-center mb-6">
            <v-avatar size="80" class="mr-4">
              <v-img v-if="userInfo.avatar || avata" :src="userInfo.avatar || avata" alt="User Avatar"></v-img>
              <v-icon v-else size="60" color="grey lighten-1">mdi-account</v-icon>
            </v-avatar>
            <div>
              <v-btn color="primary" outlined small @click="$refs.avatarInput.click()" :loading="uploadingAvatar">
                <v-icon left small>mdi-camera</v-icon>
                Change Avatar
              </v-btn>
              <input ref="avatarInput" type="file" accept="image/*" style="display: none"
                @change="handleAvatarUpload" />
              <p class="text-caption grey--text mt-2 mb-0">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          <v-form ref="profileForm" v-model="profileFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="profileForm.username" label="Username" :rules="usernameRules" outlined
                  prepend-inner-icon="mdi-account" disabled required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="profileForm.userId" label="User ID" outlined prepend-inner-icon="mdi-identifier"
                  disabled hint="User ID cannot be changed" persistent-hint></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="profileForm.email" label="Email Address" :rules="emailRules" outlined
                  prepend-inner-icon="mdi-email" :disabled="!editingProfile" required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="profileForm.firstName" label="First Name" :rules="nameRules" outlined
                  prepend-inner-icon="mdi-account-outline" :disabled="!editingProfile"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="profileForm.lastName" label="Last Name" :rules="nameRules" outlined
                  prepend-inner-icon="mdi-account-outline" :disabled="!editingProfile"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="profileForm.bio" label="Bio (Optional)" outlined rows="3"
                  prepend-inner-icon="mdi-text" :disabled="!editingProfile" counter="200"
                  :rules="bioRules"></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn v-if="!editingProfile" color="primary" @click="startEditingProfile">
            <v-icon left>mdi-pencil</v-icon>
            Edit Profile
          </v-btn>
          <template v-else>
            <v-btn text @click="cancelEditingProfile">
              Cancel
            </v-btn>
            <v-btn color="primary" @click="saveProfile" :disabled="!hasProfileChanges || !isProfileValid"
              :loading="savingProfile">
              <v-icon left>mdi-content-save</v-icon>
              Save Changes
            </v-btn>
          </template>
        </v-card-actions>
      </v-card>

      <v-card class="mb-6" elevation="2">
        <v-card-title class="d-flex align-center">
          <v-icon color="primary" class="mr-3">mdi-lock</v-icon>
          <span class="text-h6">Password</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
          <div class="d-flex justify-space-between align-center">
            <div>
              <h4 class="text-subtitle-1 mb-1">Change Password</h4>
              <p class="text-caption grey--text mb-0">
                It's a good idea to use a strong password that you don't use elsewhere
              </p>
            </div>
            <v-btn color="primary" @click="openPasswordDialog">
              <v-icon left>mdi-lock-reset</v-icon>
              Change Password
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <v-card elevation="2" class="border-error">
        <v-card-title class="d-flex align-center error--text">
          <v-icon color="error" class="mr-3">mdi-alert-circle</v-icon>
          <span class="text-h6">Danger Zone</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
          <div class="d-flex justify-space-between align-center">
            <div>
              <h4 class="text-subtitle-1 mb-1">Delete Account</h4>
              <p class="text-caption grey--text mb-0">
                Once you delete your account, there is no going back. Please be certain.
              </p>
            </div>
            <v-btn color="error" outlined @click="showDeleteDialog = true">
              <v-icon left>mdi-delete</v-icon>
              Delete Account
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- Password Dialog -->
    <v-dialog v-model="showPasswordDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon color="primary" class="mr-3">mdi-lock-reset</v-icon>
          <span class="text-h6">Change Password</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="closePasswordDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>

        <div v-if="!passwordVerified">
          <v-card-text class="pa-6">
            <v-alert type="info" text dense class="mb-4">
              <v-icon left>mdi-shield-lock</v-icon>
              Please enter your current password to verify your identity
            </v-alert>

            <v-form ref="verificationForm" v-model="verificationFormValid" @submit.prevent="verifyPassword">
              <v-text-field v-model="currentPassword" label="Current Password"
                :type="showCurrentPassword ? 'text' : 'password'" :rules="currentPasswordRules" outlined
                prepend-inner-icon="mdi-lock" :append-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showCurrentPassword = !showCurrentPassword" :error-messages="passwordError" required
                autocomplete="current-password" @keyup.enter="verifyPassword" autofocus></v-text-field>
            </v-form>
          </v-card-text>

          <v-divider></v-divider>
          <v-card-actions class="pa-4">
            <v-btn text @click="closePasswordDialog">
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="verifyPassword" :disabled="!verificationFormValid" :loading="verifying">
              <v-icon left>mdi-shield-check</v-icon>
              Verify
            </v-btn>
          </v-card-actions>
        </div>

        <div v-else>
          <v-card-text class="pa-6">
            <v-alert type="success" text dense class="mb-4">
              <v-icon left>mdi-check-circle</v-icon>
              Identity verified successfully. You can now set a new password.
            </v-alert>

            <v-form ref="passwordForm" v-model="passwordFormValid" @submit.prevent="changePassword">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="passwordForm.newPassword" label="New Password"
                    :type="showNewPassword ? 'text' : 'password'" :rules="newPasswordRules" outlined
                    prepend-inner-icon="mdi-lock-plus" :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showNewPassword = !showNewPassword" required
                    autocomplete="new-password"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="passwordForm.confirmPassword" label="Confirm New Password"
                    :type="showConfirmPassword ? 'text' : 'password'" :rules="confirmPasswordRules" outlined
                    prepend-inner-icon="mdi-lock-check" :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showConfirmPassword = !showConfirmPassword" required autocomplete="new-password"
                    @keyup.enter="changePassword"></v-text-field>
                </v-col>
              </v-row>

              <div class="mb-4">
                <div class="d-flex align-center mb-2">
                  <span class="text-caption grey--text mr-2">Password Strength:</span>
                  <span class="text-caption" :class="passwordStrengthColor">
                    {{ passwordStrengthText }}
                  </span>
                </div>
                <v-progress-linear :value="passwordStrengthValue" :color="passwordStrengthColor.replace('--text', '')"
                  height="4" rounded></v-progress-linear>
              </div>

              <v-card outlined class="mb-4">
                <v-card-text class="pa-3">
                  <div class="d-flex align-center mb-2">
                    <v-icon small color="primary" class="mr-2">mdi-information</v-icon>
                    <span class="text-subtitle-2">Password Requirements</span>
                  </div>
                  <div class="d-flex flex-wrap">
                    <v-chip class="ma-1" small :color="hasMinLength ? 'success' : 'grey lighten-1'"
                      :text-color="hasMinLength ? 'white' : ''">
                      <v-icon left x-small>{{ hasMinLength ? 'mdi-check' : 'mdi-close' }}</v-icon>
                      8+ characters
                    </v-chip>
                    <v-chip class="ma-1" small :color="hasUppercase ? 'success' : 'grey lighten-1'"
                      :text-color="hasUppercase ? 'white' : ''">
                      <v-icon left x-small>{{ hasUppercase ? 'mdi-check' : 'mdi-close' }}</v-icon>
                      Uppercase
                    </v-chip>
                    <v-chip class="ma-1" small :color="hasLowercase ? 'success' : 'grey lighten-1'"
                      :text-color="hasLowercase ? 'white' : ''">
                      <v-icon left x-small>{{ hasLowercase ? 'mdi-check' : 'mdi-close' }}</v-icon>
                      Lowercase
                    </v-chip>
                    <v-chip class="ma-1" small :color="hasNumber ? 'success' : 'grey lighten-1'"
                      :text-color="hasNumber ? 'white' : ''">
                      <v-icon left x-small>{{ hasNumber ? 'mdi-check' : 'mdi-close' }}</v-icon>
                      Number
                    </v-chip>
                    <v-chip class="ma-1" small :color="hasSpecialChar ? 'success' : 'grey lighten-1'"
                      :text-color="hasSpecialChar ? 'white' : ''">
                      <v-icon left x-small>{{ hasSpecialChar ? 'mdi-check' : 'mdi-close' }}</v-icon>
                      Special character
                    </v-chip>
                  </div>
                </v-card-text>
              </v-card>
            </v-form>
          </v-card-text>

          <v-divider></v-divider>
          <v-card-actions class="pa-4">
            <v-btn text @click="resetPasswordVerification">
              <v-icon left>mdi-arrow-left</v-icon>
              Back
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="changePassword" :disabled="!passwordFormValid" :loading="changingPassword">
              <v-icon left>mdi-lock-reset</v-icon>
              Change Password
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>

    <!-- Snackbars -->
    <v-snackbar v-model="showSuccessSnackbar" color="success" timeout="3000" bottom>
      <v-icon left>mdi-check-circle</v-icon>
      {{ successMessage }}
    </v-snackbar>

    <v-snackbar v-model="showErrorSnackbar" color="error" timeout="5000" bottom>
      <v-icon left>mdi-alert-circle</v-icon>
      {{ errorMessage }}
    </v-snackbar>

    <!-- Delete Account Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="error--text">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          Delete Account
        </v-card-title>
        <v-card-text>
          <p class="mb-3">
            Are you sure you want to delete your account? This action cannot be undone.
          </p>
          <v-text-field v-model="deleteConfirmation" label="Type 'DELETE' to confirm" outlined
            :rules="deleteConfirmationRules"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showDeleteDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="deleteAccount" :disabled="deleteConfirmation !== 'DELETE'"
            :loading="deletingAccount">
            Delete Account
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: 'SettingsPage',
  data() {
    return {
      loading: false,
      userInfo: {
        username: 'john_doe',
        userId: 'USR_123456789',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Software developer passionate about creating amazing user experiences.',
        avatar: ""
      },
      profileForm: {},
      originalProfileForm: {},
      profileFormValid: false,
      editingProfile: false,
      savingProfile: false,
      uploadingAvatar: false,

      // Password dialog
      showPasswordDialog: false,
      passwordVerified: false,
      verifying: false,
      verificationFormValid: false,
      currentPassword: '',
      passwordError: '',
      showCurrentPassword: false,
      passwordForm: {
        newPassword: '',
        confirmPassword: ''
      },
      passwordFormValid: false,
      changingPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,

      savingSettings: false,

      // Snackbars
      showSuccessSnackbar: false,
      showErrorSnackbar: false,
      successMessage: '',
      errorMessage: '',

      // Delete account
      showDeleteDialog: false,
      deleteConfirmation: '',
      deletingAccount: false,

      usernameRules: [
        v => !!v || 'Username is required',
        v => (v && v.length >= 3) || 'Username must be at least 3 characters'
      ],
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid'
      ],
      nameRules: [
        v => !v || (v && v.length <= 50) || 'Name must be less than 50 characters'
      ],
      bioRules: [
        v => !v || (v && v.length <= 200) || 'Bio must be less than 200 characters'
      ],
      currentPasswordRules: [
        v => !!v || 'Current password is required'
      ],
      newPasswordRules: [
        v => !!v || 'New password is required',
        v => (v && v.length >= 8) || 'Password must be at least 8 characters'
      ],
      deleteConfirmationRules: [
        v => v === 'DELETE' || 'Type DELETE to confirm'
      ]
    }
  },

  computed: {
    ...mapGetters(["user_id", "avata", "username", "email"]),

    hasProfileChanges() {
      if (!this.originalProfileForm || !this.profileForm) return false;

      return JSON.stringify(this.originalProfileForm) !== JSON.stringify(this.profileForm);
    },

    isProfileValid() {
      const email = this.profileForm.email;
      const username = this.profileForm.username;

      const emailValid = email && /.+@.+\..+/.test(email);
      const usernameValid = username && username.length >= 3;

      return emailValid && usernameValid;
    },

    confirmPasswordRules() {
      return [
        v => !!v || 'Please confirm your password',
        v => v === this.passwordForm.newPassword || 'Passwords do not match'
      ]
    },

    passwordStrengthValue() {
      const password = this.passwordForm.newPassword
      if (!password) return 0

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

    hasMinLength() {
      return this.passwordForm && this.passwordForm.newPassword && this.passwordForm.newPassword.length >= 8
    },
    hasUppercase() {
      return this.passwordForm && /[A-Z]/.test(this.passwordForm.newPassword || '')
    },
    hasLowercase() {
      return this.passwordForm && /[a-z]/.test(this.passwordForm.newPassword || '')
    },
    hasNumber() {
      return this.passwordForm && /\d/.test(this.passwordForm.newPassword || '')
    },
    hasSpecialChar() {
      return this.passwordForm && /[!@#$%^&*(),.?":{}|<>]/.test(this.passwordForm.newPassword || '')
    }
  },

  created() {
    this.userInfo.userId = this.user_id;
    this.userInfo.email = this.email;
    this.userInfo.username = this.username;
    this.userInfo.avatar = this.avata;

    let name = this.userInfo.username.split('_');
    this.userInfo.firstName = name[0] || '';
    this.userInfo.lastName = name[1] || '';

    this.initializeProfileForm()
  },

  watch: {
    'profileForm.firstName': function () {
      this.updateUsername();
    },
    'profileForm.lastName': function () {
      this.updateUsername();
    },
    currentPassword() {
      this.passwordError = '';
      if (this.$refs.verificationForm) {
        this.$refs.verificationForm.validate();
      }
    }
  },

  methods: {
    ...mapActions(["_uploadAvatar", "_verifyPassword", "_changePassword","_deleteAccount","_Logout"]),

    handleLogout() {
      this._Logout()
      this.$router.push("/")
    },

    updateUsername() {
      const first = (this.profileForm.firstName || '').trim().replace(/\s+/g, '');
      const last = (this.profileForm.lastName || '').trim().replace(/\s+/g, '');
      this.profileForm.username = first && last ? `${first}_${last}` : first || last;
    },

    goBack() {
      if (this.$router) {
        this.$router.back()
      } else {
        window.history.back()
      }
    },

    initializeProfileForm() {
      this.profileForm = { ...this.userInfo };
      this.originalProfileForm = { ...this.userInfo };
    },

    startEditingProfile() {
      this.editingProfile = true;
      this.originalProfileForm = { ...this.profileForm };
    },

    cancelEditingProfile() {
      this.editingProfile = false;
      this.profileForm = { ...this.originalProfileForm };
    },

    async saveProfile() {
      if (!this.hasProfileChanges || !this.isProfileValid) return

      this.savingProfile = true
      try {
        Object.assign(this.userInfo, this.profileForm)
        this.originalProfileForm = { ...this.profileForm };
        console.log(this.userInfo)
        this.editingProfile = false
        this.showSuccess('Profile updated successfully!')
      } catch (error) {
        this.showError('Failed to update profile. Please try again.')
      } finally {
        this.savingProfile = false
      }
    },

    async handleAvatarUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      if (file.size > 2 * 1024 * 1024) {
        this.showError('File size must be less than 2MB')
        return
      }

      if (!file.type.startsWith('image/')) {
        this.showError('Please select an image file')
        return
      }

      this.loading = true
      this.uploadingAvatar = true

      try {
        const reader = new FileReader()
        reader.onload = async (e) => {
          const base64 = e.target.result
          this.userInfo.avatar = base64
          this.profileForm.avatar = base64

          const infoavata = {
            avataurl: base64,
            userid: this.user_id
          }

          await this._uploadAvatar(infoavata)
          this.showSuccess('Avatar updated successfully!')
          this.uploadingAvatar = false
          this.loading = false
        }
        reader.readAsDataURL(file)
      } catch (error) {
        this.showError('Failed to upload avatar. Please try again.')
      } finally {
        this.uploadingAvatar = false
        this.loading = false
      }
    },

    openPasswordDialog() {
      this.showPasswordDialog = true
    },

    closePasswordDialog() {
      this.showPasswordDialog = false
      this.resetPasswordVerification()
    },

    resetPasswordVerification() {
      this.passwordVerified = false
      this.currentPassword = ''
      this.passwordError = ''
      this.passwordForm = {
        newPassword: '',
        confirmPassword: ''
      }

      if (this.$refs.verificationForm) {
        this.$refs.verificationForm.reset()
      }
      if (this.$refs.passwordForm) {
        this.$refs.passwordForm.reset()
      }
    },

    async verifyPassword() {
      if (!this.verificationFormValid) return

      this.verifying = true
      this.passwordError = ''

      try {
        const verifyinfo = {
          pass: this.currentPassword,
          email: this.email
        }
        const verify_status = await this._verifyPassword(verifyinfo)
        if (verify_status) {
          this.passwordVerified = true
        } else {
          this.showError('Incorrect password. Please try again.')
          this.passwordError = 'Incorrect password. Please try again.'
        }
      } catch (error) {
        this.showError('An error occurred during verification. Please try again.')
      } finally {
        this.verifying = false
      }
    },

    async changePassword() {
      if (!this.passwordFormValid) return

      const changepassinfo = {
        userid: this.user_id,
        newpassword: this.passwordForm.newPassword
      }

      this.changingPassword = true
      try {
        this._changePassword(changepassinfo)
        this.showSuccess('Password changed successfully!')
        this.closePasswordDialog()
      } catch (error) {
        this.showError('Failed to change password. Please try again.')
      } finally {
        this.changingPassword = false
      }
    },

    async deleteAccount() {
      if (this.deleteConfirmation !== 'DELETE') return
      this.deletingAccount = true
      try {
        this._deleteAccount(this.user_id)
        this.showSuccess('Account deleted successfully!')
        await new Promise(resolve => setTimeout(resolve, 2000))
        
      } catch (error) {
        this.showError('Failed to delete account. Please try again.')
      } finally {
        this.deletingAccount = false
        this.showDeleteDialog = false
        this.deleteConfirmation = ''
        this.handleLogout();
      }
    },

    showSuccess(message) {
      this.successMessage = message
      this.showSuccessSnackbar = true
    },

    showError(message) {
      this.errorMessage = message
      this.showErrorSnackbar = true
    }
  },
}
</script>

<style scoped>
.border-error {
  border: 1px solid #f44336 !important;
}

.v-card {
  border-radius: 12px;
}

.v-btn {
  border-radius: 8px;
}

.v-text-field,
.v-textarea,
.v-select {
  border-radius: 8px;
}

.back-button-container {
  top: 16px;
}

.back-button {
  font-weight: 500;
  transition: transform 0.2s ease;
}

@media (max-width: 600px) {
  .back-button-container {
    margin-bottom: 12px;
  }
}
</style>
