<template>
  <div id="header">
    <b-row
      id="header-inside"
      align="left"
      no-gutters
    >
      <b-col lg="4" sm="4">
        <router-link to="/">
          <h1 id="title">
            click-clack
          </h1>
        </router-link>
      </b-col>

      <b-col id="search-container" lg="4" sm="8">
        <b-input-group id="search">
          <b-form-input
            v-model="searchinput"
            autocomplete="off"
            placeholder="Search for anything"
            variant="light"
            @keydown.enter="search"
            @submit.prevent
          />
          <b-input-group-append>
            <b-button variant="outline" @click="search">
              <b-icon icon="search" />
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
      <b-col lg="4" sm="12">
        <b-nav
          id="nav"
          align="right"
          card-header
          no-gutters
          pill
        >
          <b-nav-item>
            <nuxt-link exact-active-class="active" to="/">
              <b-icon v-b-tooltip.hover.bottom="`Home`" icon="view-stacked" />
            </nuxt-link>
          </b-nav-item>
          <b-nav-item>
            <nuxt-link exact-active-class="active" to="/market">
              <b-icon v-b-tooltip.hover.bottom="`Market`" icon="shop-window" />
            </nuxt-link>
          </b-nav-item>
          <b-nav-item>
            <nuxt-link exact-active-class="active" to="/showroom">
              <b-icon v-b-tooltip.hover.bottom="`Showroom`" icon="star" />
            </nuxt-link>
          </b-nav-item>
          <b-nav-item>
            <nuxt-link exact exact-active-class="active" to="/typing">
              <b-icon v-b-tooltip.hover.bottom="`Typing Test`" icon="lightning" />
            </nuxt-link>
          </b-nav-item>
          <b-dropdown no-caret right variant="link" style="margin-top: -0.5rem; margin-bottom: -0.5rem" toggle-class="text-decoration-none">
            <template v-slot:button-content>
              <b-avatar
                v-if="user"
                class="mini-avatar"
                :src="`https://media.click-clack.cc/images/${user._id}.jpg`"
                size="2.3rem"
                variant="light"
                badge-top
                badge-variant="danger"
                badge-offset="-0.23rem"
              >
                <template v-if="unseen > 0" v-slot:badge>
                  {{ unseen }}
                </template>
              </b-avatar>
              <b-avatar
                v-else
                class="mini-avatar"
                size="2.3rem"
                variant="light"
              />
            </template>
            <b-dropdown-item @click="$nuxt.$router.push(`/profile`)">
              <nuxt-link to="/profile">
                <b-icon icon="person" />
                <span v-if="user">Profile</span>
                <span v-else>Sign in</span>
              </nuxt-link>
            </b-dropdown-item>
            <b-dropdown-item v-if="user && (user.role.includes('admin') || user.role.includes('developer'))" @click=" $nuxt.$router.push(`/admintools`)">
              <nuxt-link to="/profile">
                <b-icon icon="shield" />
                <span>AdminTools</span>
              </nuxt-link>
            </b-dropdown-item>
            <b-dropdown-item v-if="!user" @click="$nuxt.$router.push(`/signup`)">
              <nuxt-link to="/profile">
                <b-icon icon="person-plus" />
                <span>Sign up</span>
              </nuxt-link>
            </b-dropdown-item>
            <b-dropdown-item v-if="user" @click="$nuxt.$router.push(`/messages`)">
              <nuxt-link to="/messages">
                <b-icon v-if="unseen === 0" icon="envelope-open" />
                <b-icon v-else icon="envelope" />
                Messages
                <b-badge v-if="unseen > 0" variant="danger">
                  {{ unseen }}
                </b-badge>
              </nuxt-link>
            </b-dropdown-item>
            <b-dropdown-item v-if="user" @click="$nuxt.$router.push(`/settings`)">
              <nuxt-link exact exact-active-class="active" to="/settings">
                <b-icon icon="window" />
                Themes
              </nuxt-link>
            </b-dropdown-item>
            <b-form-checkbox
              :checked="nightmode"
              name="check-button"
              style="margin-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem"
              switch
              @change="changeTheme"
            >
              Night mode
            </b-form-checkbox>
            <b-dropdown-item-btn>
              <a href="https://www.patreon.com/clickclackcc">
                <b-icon icon="heart" />
                Become a supporter
              </a>
            </b-dropdown-item-btn>
            <b-dropdown-divider />
            <b-dropdown-item @click="$nuxt.$router.push(`/wip`)">
              <nuxt-link to="/wip">
                <b-icon icon="question-circle" />
                FAQ
              </nuxt-link>
            </b-dropdown-item>
            <b-dropdown-item @click="$nuxt.$router.push(`/termsandconditions`)">
              <nuxt-link to="/termsandconditions">
                <b-icon icon="justify" />
                T&C
              </nuxt-link>
            </b-dropdown-item>
            <b-dropdown-item-btn>
              <a href="mailto:support@click-clack.cc">
                <b-icon icon="person" />
                Contact support
              </a>
            </b-dropdown-item-btn>
            <b-dropdown-item @click="$nuxt.$router.push(`/bugreport`)">
              <b-icon icon="exclamation-square" />
              Report bug
            </b-dropdown-item>
            <b-dropdown-divider v-if="user" />
            <b-dropdown-item-btn v-if="user" @click="signOut">
              <b-icon icon="arrow-right-circle" />
              Sign out
            </b-dropdown-item-btn>
          </b-dropdown>
        </b-nav>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name: 'Header',
	props: [
	],
	data () {
		return {
			searchinput: this.searchinput,
			unseen: 0
		}
	},
	computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme']),
	watch: {
		user: {
			immediate: true,
			handler () {
				if (this.user && this.token) {
					this.getUnseenMessages()
					if (this.messagePollerStarted) { return }
					if (!this.interval) { this.interval = setInterval(this.getUnseenMessages, 60000) }
					this.messagePollerStarted = true
				}
			}
		}
	},
	created () {
		if (this.user && this.token) {
			this.getUnseenMessages()
			if (this.messagePollerStarted) { return }
			if (!this.interval) { this.interval = setInterval(this.getUnseenMessages, 60000) }
			this.messagePollerStarted = true
		}
	},
	methods: {
		search () {
			if (this.searchinput) {
				this.$store.commit('updateSearch', this.searchinput)
				this.$router.push('/search')
				this.searchinput = null
			}
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
		changeTheme () {
			this.setTheme(!this.nightmode)
		},
		setTheme (nightmode) {
			this.$cookies.set('darkmode', nightmode, '7d')
			this.$router.go()
		},
		getUnseenMessages () {
			this.$services.messageService.getUnseenMessageCount(this.user._id).then((res) => {
				this.unseen = res
			})
		}
	}
}
</script>

<style scoped>

	@media only screen and (max-width: 990px) {
		#title {
			display: none;
		}

		#search-container {
			margin-right: 0.2rem;
			margin-top: 0.5rem;
		}

		#nav {
			margin-right: 1rem;
		}
	}

	#header {

	}

	#header-inside {
		margin-top: -0.9rem;
		margin-bottom: -1rem;
	}

	#title {
		font-size: 1.6rem;
		line-height: 1.6;
		margin-left: 1rem;
		margin-top: 1rem;
		margin: 0.5rem;
	}

	#beta {
		font-size: 1rem;
	}

	.mini-avatar {
		margin-top: 0.2rem;
		margin-left: 0rem;
	}

	#nav {
		width: 100%;
		margin: 0.5rem;
		margin-top: 0.45rem;
	}

	.active {
		font-weight: bold;
	}

	#search {
		margin: 0.5rem;
		height: 2.1rem;
		margin-top: 0.55rem;
		width: 100%;
	}
</style>
