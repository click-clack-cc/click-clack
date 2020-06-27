<template>
  <div id="index">
    <div
      v-show="loaded"
      id="container"
      :class="{ zen: (zenmode && $nuxt.$route.name === 'Typing') }"
      border-variant="light"
    >
      <b-card v-if="!(zenmode && $nuxt.$route.name === 'Typing')" id="header-container">
        <template id="header">
          <Header :user="user" @event="eventHandler" />
        </template>
      </b-card>

      <!--            <b-modal-->
      <!--                ref='welcome-modal'-->
      <!--                id='welcome-modal'-->
      <!--                size='lg'-->
      <!--                title="Welcome to Click-Clack ❤️"-->
      <!--                ok-only-->
      <!--                centered-->
      <!--                no-close-on-backdrop-->
      <!--                hide-backdrop-->
      <!--                no-close-on-esc-->
      <!--                content-class="shadow"-->
      <!--                ok-variant='outline-primary'-->
      <!--                ok-title='Cool, thanks'-->
      <!--                @hidden='welcomeModalClosed'-->
      <!--            >-->
      <!--                <b-card-text>-->
      <!--                    Click-Clack is a platform tailored specifically for mechanical keyboard enthusiasts.-->
      <!--                    We offer a customizable and clean typing test with performance tracking, a powerful-->
      <!--                    and neat keyboard gallery, a marketplace where you can list your items and services-->
      <!--                    and several other community features so you can talk to fellow-->
      <!--                    clackers and show off or even sell your builds and services. <br><br>-->
      <!--                    You will find the navigation on the top right corner.<br> <b-icon v-b-tooltip.hover.bottom="`Typing Test`" icon="lightning" /> will take you-->
      <!--                    to the typing test,<br> <b-icon v-b-tooltip.hover.bottom="`Keyboard Showroom`" icon="view-stacked" /> will-->
      <!--                    redirect you to the showroom-->
      <!--                    <br> <b-icon v-b-tooltip.hover.bottom="`Market`" icon="shop-window" /> is the market where you can trade items and services,-->
      <!--                    <br> and <b-icon v-b-tooltip.hover.bottom="`Community`" icon="people" /> is-->
      <!--                    where you can hang out and talk to fellow Click-Clack members.<br><br>-->
      <!--                    Please also note that we are using basic cookies to save your settings and for google analytics.<br><br>-->
      <!--                    Now go and explore the website, have fun!-->
      <!--                </b-card-text>-->

      <!--            </b-modal>-->
      <nuxt
        id="routerview"
        :nightmode="nightmode"
        :search="search"
        :token="token"
        :user="user"
        @event="eventHandler"
      />
    </div>

    <b-alert
      v-model="showCookies"
      class="position-fixed fixed-bottom m-0 rounded-0"
      style="z-index: 2000; "
      variant="info"
      dismissible
      @dismissed="cookiesClosed"
    >
      <div style="max-width: 960px; margin: auto;">
        <b-row no-gutters>
          <b-col cols="1" align="left">
            <b-icon class="align-middle" icon="info-circle" style="margin-right: 1rem" scale="1.4" />
          </b-col>
          <b-col align="left">
            We use a few cookies to save your settings and for basic analytics. We hope you're okay with
            that.
          </b-col>
          <b-col style="margin: 0" cols="2" align="right">
            <b-button
              style="margin-top: -0.5rem; margin-bottom: -0.5rem"
              variant="primary"
              @click="cookiesClosed"
            >
              Okay, thank you
            </b-button>
          </b-col>
        </b-row>
      </div>
    </b-alert>

    <div v-show="!loaded" class="loading-page">
      <div class="loader" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueRouter from 'vue-router'
import PortalVue from 'portal-vue'
import { mapState } from 'vuex'
import VueCookies from 'vue-cookies'
import Header from '../components/Header'

Vue.use(VueCookies)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueRouter)
Vue.use(PortalVue)

export default {
	name: 'Index',
	components: {
		Header
	},
	data () {
		return {
			loaded: false,
			showCookies: false
		}
	},
	computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
	mounted () {
		this.$store.commit('updateZenmode', false)
	},
	async created () {
		this.$store.commit('updateZenmode', false)
		if (process.server) {
			return
		}
		this.lightTheme = this.$cookies.get('lighttheme')
		this.darkTheme = this.$cookies.get('darktheme')

		if (this.lightTheme === null) {
			this.lightTheme = 'light'
			this.$cookies.set('lighttheme', 'light', '7d')
		}
		if (this.darkTheme === null) {
			this.darkTheme = 'fekete'
			this.$cookies.set('darktheme', 'fekete', '7d')
		}

		this.$store.commit('updateLighttheme', this.lightTheme)
		this.$store.commit('updateDarktheme', this.darkTheme)

		if (this.$cookies.get('darkmode') === 'true') {
			await import(`../bootstrap-themes/${this.darkTheme}.css`)
			this.$store.commit('updateNightmode', true)
		} else {
			await import(`../bootstrap-themes/${this.lightTheme}.css`)
			this.$store.commit('updateNightmode', false)
		}

		if (this.$cookies.get('welcomeDone') === 'true') {

		} else {
			this.$bvModal.show('welcome-modal')
		}

		if (this.$cookies.get('cookiesDone') === 'true') {

		} else {
			this.showCookies = true
		}

		// eslint-disable-next-line no-console
		console.log(`
░█████╗░██╗░░░░░██╗░█████╗░██╗░░██╗░░░░░░░█████╗░██╗░░░░░░█████╗░░█████╗░██╗░░██╗
██╔══██╗██║░░░░░██║██╔══██╗██║░██╔╝░░░░░░██╔══██╗██║░░░░░██╔══██╗██╔══██╗██║░██╔╝
██║░░╚═╝██║░░░░░██║██║░░╚═╝█████═╝░█████╗██║░░╚═╝██║░░░░░███████║██║░░╚═╝█████═╝░
██║░░██╗██║░░░░░██║██║░░██╗██╔═██╗░╚════╝██║░░██╗██║░░░░░██╔══██║██║░░██╗██╔═██╗░
╚█████╔╝███████╗██║╚█████╔╝██║░╚██╗░░░░░░╚█████╔╝███████╗██║░░██║╚█████╔╝██║░╚██╗
░╚════╝░╚══════╝╚═╝░╚════╝░╚═╝░░╚═╝░░░░░░░╚════╝░╚══════╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚═╝`)
		await this.loadUserData()

		this.loaded = true
	},
	methods: {
		loadUserData () {
			if (process.server) {
				return
			}
			if (this.$cookies.get('id') && this.$cookies.get('token')) {
				this.$services.userService.getUser(this.$cookies.get('id')).then((u) => {
					this.$services.keyboardService.getKeyboards(u._id).then((keebs) => {
						u.keyboards = keebs
						if (u.keyboards) {
							for (let i = 0; i < u.keyboards.length; i++) {
								if (u.keyboards[i].images) {
									for (let j = 0; j < u.keyboards[i].images.length; j++) {
										u.keyboards[i].images[j] = `https://click-clack.cc:5000/files/images/${u.keyboards[i].images[j]}`
									}
								}
							}
						}
						this.$store.commit('updateUser', u)
					})
				})
				this.$store.commit('updateToken', this.$cookies.get('token'))
			}
		},
		eventHandler (event) {
			if (event.name === 'zen') {
				this.$store.commit('updateZenmode', event.value)
				this.zenMode = event.value
			} else if (event.name === 'search') {
				this.search = event.value
				this.$router.push('/search')
			}
		},
		// welcomeModalClosed (){
		//     this.$cookies.set('welcomeDone', true, '7d')
		// }
		cookiesClosed () {
			this.showCookies = false
			this.$cookies.set('cookiesDone', true, '7d')
		}
	}
}
</script>

<style scoped>

	#routerview {
		max-width: 1000px;
		margin: auto;
		margin-bottom: 6rem;
		padding-top: 4rem;
	}

	#welcome-modal {
		max-width: 1000px;
		margin: auto;
		margin-bottom: 1rem;
	}

	#header {
		max-width: 1000px;
		margin: auto;
		margin-top: -1.55rem;
		margin-bottom: -1.55rem;
	}

	#header-container {
		width: 100%;
		position: fixed;
		margin-top: -1px;
		z-index: 2;
		padding: 0;
	}

	#footer {
		max-width: 1000px;
		margin: auto;
	}

	#container {
		min-height: 100vh;
		margin: 0;
		border: none;
	}

	@media only screen and (max-width: 990px) {
		body, #welcome-modal, #routerview, #header, #footer {
			max-width: unset;
		}

		#title {
			display: none;
		}

		#routerview {
			padding-top: 10rem;
		}
	}

	.zen {
		padding-top: 6rem;
	}

	.loading-page {
		z-index: 10000;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 1);
		text-align: center;
		padding-top: 43vh;
		font-size: 30px;
		font-family: sans-serif;
	}

	.loader,
	.loader:before,
	.loader:after {
		border-radius: 50%;
		width: 2.5em;
		height: 2.5em;
		-webkit-animation-fill-mode: both;
		animation-fill-mode: both;
		-webkit-animation: load7 1.8s infinite ease-in-out;
		animation: load7 1.8s infinite ease-in-out;
	}

	.loader {
		color: #000000;
		font-size: 10px;
		margin: 80px auto;
		position: relative;
		text-indent: -9999em;
		-webkit-transform: translateZ(0);
		-ms-transform: translateZ(0);
		transform: translateZ(0);
		-webkit-animation-delay: -0.16s;
		animation-delay: -0.16s;
	}

	.loader:before,
	.loader:after {
		content: '';
		position: absolute;
		top: 0;
	}

	.loader:before {
		left: -3.5em;
		-webkit-animation-delay: -0.32s;
		animation-delay: -0.32s;
	}

	.loader:after {
		left: 3.5em;
	}

	@-webkit-keyframes load7 {
		0%,
		80%,
		100% {
			box-shadow: 0 2.5em 0 -1.3em;
		}
		40% {
			box-shadow: 0 2.5em 0 0;
		}
	}

	@keyframes load7 {
		0%,
		80%,
		100% {
			box-shadow: 0 2.5em 0 -1.3em;
		}
		40% {
			box-shadow: 0 2.5em 0 0;
		}
	}

</style>
