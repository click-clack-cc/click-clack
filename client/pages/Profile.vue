<template>
  <div id="stats">
    <b-modal ref="login-modal" centered hide-footer>
      <template v-slot:modal-title>
        Welcome to click-clack 👋
      </template>
      <br>
      <div class="d-block text-center">
        <h5>Signed in as {{ firstname }}</h5>
      </div>
      <br>
      <b-button
        block
        class="mt-2"
        variant="outline-primary"
        @click="hello"
      >
        Hello
      </b-button>
    </b-modal>
    <div id="accountInfo">
      <b-row v-if="user" id="signedIn">
        <b-col>
          <div align="right">
            <b-dropdown
              :logout-button="true"
              right
              split
              text="Sign out"
              variant="outline-danger"
              @click="signOut"
            >
              <b-dropdown-item @click="deleteAccount">
                Delete account
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </b-col>
      </b-row>
      <b-col v-else id="notSignedIn" sm="12" md="6" lg="4">
        <br>
        <h5>Hello 👋</h5>
        <br><br>
        <b-card
          id="login-form-card"
          footer-tag="footer"
        >
          <b-form id="login-form" align="left">
            <b-form-group
              label="Email or username"
            >
              <b-form-input
                id="username"
                v-model="username"
                placeholder="Email or username"
                required
                type="email"
              />
            </b-form-group>
            <b-form-group
              label="Password"
            >
              <b-form-input
                id="password"
                v-model="password"
                placeholder="Password"
                required
                type="password"
              />
            </b-form-group>
            <b-form-checkbox
              id="checkbox-1"
              v-model="stayLoggedIn"
              name="checkbox-1"
              unchecked-value="not_accepted"
              value="accepted"
            >
              Keep me logged in
            </b-form-checkbox>
          </b-form>
          <template v-slot:footer>
            <b-row align="middle">
              <b-col>
                <b-button id="login-button" type="submit" variant="primary" @click="signIn">
                  Log in
                </b-button>
              </b-col>
              <b-col>
                <b-button id="signup-button" to="/signup" variant="secondary">
                  Sign up
                </b-button>
              </b-col>
            </b-row>
          </template>
        </b-card>
        <br>
        <a href="mailto:support@click-clack.cc">
          Trouble signing in?
        </a>
      </b-col>
      <b-row v-if="user" id="selfUserDataCard">
        <SelfUserData v-if="user" :token="token" :user="user" />
      </b-row>
    </div>
    <h5 v-if="user">
      Typing test results
    </h5>
    <StatsList v-if="user" :user="user" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import StatsList from '../components/StatsList'
import SelfUserData from '../components/SelfUserData'

export default {
	name: 'Profile',
	layout: 'index',
	components: {
		SelfUserData,
		StatsList
	},
	props: [
		// 'user',
		// 'token'
	],
	data () {
		return {
			username: this.username,
			password: this.password,
			firstname: this.firstname,
			stayLoggedIn: this.stayLoggedIn
		}
	},
	computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
	methods: {
		signIn () {
			this.$services.userService.logIn(this.username, this.password).then((data) => {
				if (data.user && data.token) {
					if (this.stayLoggedIn) {
						this.$cookies.set('id', data.user.id, '7d')
						this.$cookies.set('token', data.token, '7d')
					} else {
						this.$cookies.set('id', data.user.id, '1h')
						this.$cookies.set('token', data.token, '1h')
					}

					this.firstname = data.user.firstname
					this.$refs['login-modal'].show()
				}
			}).catch((error) => {
				this.$bvToast.toast(error.response.statusText, {
					title: Error,
					toaster: 'b-toaster-top-center'
				})
			})
		},
		signOut () {
			this.$bvModal.msgBoxConfirm('Are you sure you want to sign out?', {
				title: 'Signing Out',
				size: 'sm',
				buttonSize: 'sm',
				okVariant: 'danger',
				okTitle: 'Yes please',
				cancelTitle: 'No',
				footerClass: 'p-2',
				hideHeaderClose: false,
				centered: true
			}).then((value) => {
				if (value) {
					this.$cookies.remove('token')
					this.$cookies.remove('id')
					this.$bvToast.toast('Stay safe and see you soon! You will be redirected in 5 seconds', {
						title: 'Bye bye',
						toaster: 'b-toaster-top-center'
					})
					setTimeout(() => {
						this.$router.go()
					}, 5000)
				}
			})
		},
		hello () {
			this.$router.go()
		},
		deleteAccount () {
			this.$bvModal.msgBoxConfirm('Are you sure you want to delete your account? This action is irreversible.', {
				title: 'Account Deletion',
				size: 'sm',
				buttonSize: 'sm',
				okVariant: 'danger',
				okTitle: 'Yes',
				cancelTitle: 'No, thank you',
				cancelVariant: 'success',
				footerClass: 'p-2',
				hideHeaderClose: false,
				centered: true,
				headerBgVariant: 'danger',
				headerTextVariant: 'light'
			}).then((result) => {
				if (result) {
					this.$services.userService.deleteUser(this.user._id, this.token).then(() => {
						this.$bvToast.toast('Stay safe and see you soon! You will be redirected in 5 seconds', {
							title: 'Bye bye',
							toaster: 'b-toaster-top-center'
						})
						setTimeout(() => {
							this.$router.go()
						}, 5000)
					})
				}
			})
		}
	},
	head () {
		const description = 'Sign up to Click-Clack and check out the newest and nicest custom mechanical keyboard builds.'
		const title = 'Click-Clack - Profile'
		const image = 'https://click-clack.cc:5000/files/images/indeximage.jpg'
		const url = 'https://click-clack.cc/profile'
		return {
			title,
			htmlAttrs: {
				lang: 'en'
			},
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },

				{ name: 'title', property: 'title', hid: 'title', content: title },
				{ name: 'og:title', property: 'og:title', hid: 'og:title', content: title },
				{ name: 'twitter:title', property: 'twitter:title', hid: 'twitter:title', content: title },

				{ name: 'description', property: 'description', hid: 'description', content: description },
				{ name: 'og:description', property: 'og:description', hid: 'og:description', content: description },
				{
					name: 'twitter:description',
					property: 'twitter:description',
					hid: 'twitter:description',
					content: description
				},

				{ name: 'twitter:image', hid: 'twitter:image', property: 'twitter:image', content: image },
				{ name: 'og:image', hid: 'og:image', property: 'og:image', content: image },
				{ name: 'image', hid: 'image', property: 'image', content: image },

				{ name: 'og:site_name', property: 'og:site_name', hid: 'og:site_name', content: 'click-clack' },
				{ name: 'og:type', property: 'og:type', hid: 'og:type', content: 'website' },
				{
					name: 'og:url',
					property: 'og:url',
					hid: 'og:url',
					content: url
				}
			]
		}
	}
}
</script>

<style scoped>

    #accountInfo {
        margin-bottom: 1rem;
    }

    #signedIn {
        margin-bottom: 1rem;
    }

    #notSignedIn {
        margin: auto;
        text-align: center;
    }

    #selfUserDataCard {
        margin-left: 0;
        width: 100%;
        margin-right: 0;
    }

    #login-form {
        margin: auto;
    }

    #login-form-card {
        margin: auto;
    }
</style>
