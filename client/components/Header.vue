<template>
  <div id="header">
    <b-row>
      <b-col lg="4" cols="12" class="d-flex align-items-center">
        <div class="d-flex align-items-center justify-content-between w-100">
          <nuxt-link to="/" class="title-container mr-3" :class="{'shrink': isFocusSearch}">
            <h1 id="title">
              click-clack
            </h1>
          </nuxt-link>
          <b-input-group class="d-lg-none d-flex search-container">
            <b-form-input
              v-model="searchinput"
              autocomplete="off"
              placeholder="Search for anything"
              variant="light"
              @focus="isFocusSearch = true"
              @blur="isFocusSearch = false"
              @keydown.enter="search"
              @submit.prevent
            />
            <b-input-group-append>
              <b-button variant="outline" @click="search">
                <b-icon icon="search" />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </b-col>
      <b-col lg="4" cols="0" class="d-flex align-items-center">
        <b-input-group class="d-lg-flex d-none">
          <b-form-input
            v-model="searchinput"
            autocomplete="off"
            placeholder="Search for anything"
            variant="light"
            @focus="isFocusSearch = true"
            @blur="isFocusSearch = false"
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
      <b-col lg="4" cols="0" class="d-flex justify-content-end align-items-center">
        <NavMenu :nav-items="navItems" :user="user" @change-theme="changeTheme" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import NavMenu from './NavMenu'

export default {
	name: 'Header',
	components: {
		NavMenu
	},
	props: [
	],
	data () {
		return {
			searchinput: this.searchinput,
			isFocusSearch: false,
			navItems: [
				{
					link: '/',
					name: 'Home',
					icon: 'view-stacked'
				},
				{
					link: '/market',
					name: 'Market',
					icon: 'shop-window'
				},
				{
					link: '/showroom',
					name: 'Showroom',
					icon: 'star'
				},
				{
					link: '/typing',
					name: 'Typing Test',
					icon: 'lightning'
				}
			],
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
@media (max-width: 991px) {
	.title-container {
		max-width: 150px;
	}

	.title-container.shrink {
		max-width: 0;
		overflow: hidden;
		transform: scaleX(0);
		transition: max-width ease-in-out 0.2s;
		white-space: nowrap;
	}
}

#header {
	padding: 0 15px;
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

.active {
	font-weight: bold;
}

.search-container {
	flex: 1;
}

#search {
	margin: 0.5rem;
	height: 2.1rem;
	margin-top: 0.55rem;
	flex: 1;
}
</style>
