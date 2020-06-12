<template>
    <div id="index">
        <b-card
            v-show="loaded"
            id="container"
            :class="{ zen: (zenmode && $nuxt.$route.name === 'index') }"
            border-variant="light"
            footer-tag="footer"
            header-tag="header"
        >
            <template v-if="!(zenmode && $nuxt.$route.name === 'index')" id="header" v-slot:header>
                <Header :user="user" @event="eventHandler" />
            </template>

            <nuxt
                id="routerview"
                :nightmode="nightmode"
                :search="search"
                :token="token"
                :user="user"
                @event="eventHandler"
            />

            <template
                v-if="!(zenmode && $nuxt.$route.name === 'index')"
                v-slot:footer
            >
                <div id="footer">
                    <Footer />
                    <b-form-checkbox
                        :checked="nightmode"
                        align="right"
                        name="check-button"
                        style="margin-top: -0.5rem"
                        switch
                        @change="changeTheme"
                    >
                        <p style="font-size: 0.7rem; margin-top: 0.2rem; font-weight: lighter">
                            Night mode
                        </p>
                    </b-form-checkbox>
                </div>
            </template>
        </b-card>
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
    import Footer from '../components/Footer'
    import userService from '../services/user-service'
    import keyboardService from '../services/keyboard-service'

    Vue.use(VueCookies)
    Vue.use(BootstrapVue)
    Vue.use(IconsPlugin)
    Vue.use(VueRouter)
    Vue.use(PortalVue)

    export default {
        name: 'Index',
        components: {
            Header,
            Footer
        },
        data () {
            return {
                loaded: false
            }
        },
        mounted () {
            this.$store.commit('updateZenmode', false)
        },
        computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
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

            // console.log(1)
            // await import('../node_modules/bootstrap/scss/bootstrap.scss')
            // await import('../node_modules/bootstrap-vue/src/index.scss')
            // console.log(2)

            if (this.$cookies.get('darkmode') === 'true') {
                await import(`../bootstrap-themes/${this.darkTheme}.css`)
                this.nightmode = true
                this.$store.commit('updateNightmode', true)
            } else {
                await import(`../bootstrap-themes/${this.lightTheme}.css`)
                this.nightmode = false
                this.$store.commit('updateNightmode', false)
            }

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
                    userService.getUser(this.$cookies.get('id')).then((u) => {
                        keyboardService.getKeyboards(u._id).then((keebs) => {
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
            changeTheme () {
                this.setTheme(!this.nightmode)
            },
            setTheme (nightmode) {
                this.$cookies.set('darkmode', nightmode, '7d')
                this.$router.go()
            },
            eventHandler (event) {
                if (event.name === 'zen') {
                    this.$store.commit('updateZenmode', event.value)
                    this.zenMode = event.value
                } else if (event.name === 'search') {
                    this.search = event.value
                    this.$router.push('/search')
                }
            }
        }
    }
</script>

<style scoped>

    #routerview {
        max-width: 1000px;
        margin: auto;
        margin-bottom: 6rem;
    }

    #header {
        max-width: 1000px;
        margin: auto;
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

    @media only screen and (max-width: 900px) {
        body, #routerview, #header, #footer {
            max-width: unset;
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
