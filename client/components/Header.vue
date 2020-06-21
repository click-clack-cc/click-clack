<template>
    <div id="header">
        <b-row
            id="header-inside"
            align="left"
            no-gutters
        >
            <b-col lg="4" sm="12">
                <router-link to="/">
                    <h1 id="title">
                        click-clack
                    </h1>
                </router-link>
            </b-col>
            <b-col id="search-container" lg="4" sm="12">
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
                            <b-icon icon="search"/>
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
                            <b-icon v-b-tooltip.hover.bottom="`Home`" icon="view-stacked"/>
                        </nuxt-link>
                    </b-nav-item>
                    <b-nav-item>
                        <nuxt-link exact-active-class="active" to="/market">
                            <b-icon v-b-tooltip.hover.bottom="`Market`" icon="shop-window"/>
                        </nuxt-link>
                    </b-nav-item>
                    <b-nav-item>
                        <nuxt-link exact-active-class="active" to="/showroom">
                            <b-icon v-b-tooltip.hover.bottom="`Showroom`" icon="star"/>
                        </nuxt-link>
                    </b-nav-item>
                    <b-nav-item>
                        <nuxt-link exact exact-active-class="active" to="/typing">
                            <b-icon v-b-tooltip.hover.bottom="`Typing Test`" icon="lightning"/>
                        </nuxt-link>
                    </b-nav-item>
                    <b-dropdown no-caret right variant="link" style='margin-top: -0.5rem; margin-bottom: -0.5rem' toggle-class="text-decoration-none">
                        <template v-slot:button-content>
                            <b-avatar
                                v-if="user"
                                class="mini-avatar"
                                :src="`https://click-clack.cc:5000/files/images/${user._id}.jpg`"
                                size="2.3rem"
                                variant="light"
                                badge-top
                                badge-variant='danger'
                                badge-offset='-0.23rem'
                            >
                                <template v-if='unseen > 0' v-slot:badge>{{unseen}}</template>
                            </b-avatar>
                                <b-avatar v-else
                                    class="mini-avatar"
                                    size="2.3rem"
                                    variant="light"
                                />
                        </template>
                        <b-dropdown-item @click='$nuxt.$router.push(`/profile`)'>
                            <nuxt-link to="/profile">
                                <b-icon icon='person'></b-icon>
                                <span v-if='this.user'>Profile</span>
                                <span v-else>Sign in</span>
                            </nuxt-link>
                        </b-dropdown-item>
                        <b-dropdown-item v-if='user && (user.role === "admin" || user.role ==="developer")' @click='$nuxt.$router.push(`/admintools`)'>
                            <nuxt-link to="/profile">
                                <b-icon icon='shield'></b-icon>
                                <span>AdminTools</span>
                            </nuxt-link>
                        </b-dropdown-item>
                        <b-dropdown-item v-if='!this.user' @click='$nuxt.$router.push(`/signup`)'>
                            <nuxt-link to="/profile">
                                <b-icon icon='person-plus'></b-icon>
                                <span>Sign up</span>
                            </nuxt-link>
                        </b-dropdown-item>
                        <b-dropdown-item v-if='this.user' @click='$nuxt.$router.push(`/messages`)'>
                            <nuxt-link to="/messages">
                                <b-icon v-if='unseen === 0' icon='envelope-open'></b-icon>
                                <b-icon v-else icon='envelope'></b-icon>
                                Messages
                                <b-badge variant='danger' v-if='unseen > 0'>{{unseen}}</b-badge>
                            </nuxt-link>
                        </b-dropdown-item>
                        <b-dropdown-item  v-if='this.user'  @click='$nuxt.$router.push(`/settings`)'>
                            <nuxt-link exact exact-active-class="active" to="/settings">
                                <b-icon icon='window'></b-icon>
                                Themes
                            </nuxt-link>
                        </b-dropdown-item>
                            <b-form-checkbox
                                :checked="nightmode"
                                name="check-button"
                                style='margin-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem'
                                switch
                                @change="changeTheme"
                                >
                                Night mode
                            </b-form-checkbox>
                        <b-dropdown-item-btn>
                            <a href="https://www.patreon.com/clickclackcc">
                                <b-icon icon='heart'></b-icon>
                                Become a supporter
                            </a>
                        </b-dropdown-item-btn>
                        <b-dropdown-divider></b-dropdown-divider>
                        <b-dropdown-item @click='$nuxt.$router.push(`/wip`)'>
                            <nuxt-link to="/wip">
                                <b-icon icon='question-circle'></b-icon>
                                FAQ
                            </nuxt-link>
                        </b-dropdown-item>
                        <b-dropdown-item @click='$nuxt.$router.push(`/termsandconditions`)'>
                            <nuxt-link to="/termsandconditions">
                                <b-icon icon='justify'></b-icon>
                                T&C
                            </nuxt-link>
                        </b-dropdown-item>
                        <b-dropdown-item-btn>
                            <a href='mailto:support@click-clack.cc'>
                                <b-icon icon='person'></b-icon>
                                Contact support
                            </a>
                        </b-dropdown-item-btn>
                        <b-dropdown-item @click='$nuxt.$router.push(`/bugreport`)'>
                                <b-icon icon='exclamation-square'></b-icon>
                                Report bug
                        </b-dropdown-item>
                        <b-dropdown-divider  v-if='this.user' ></b-dropdown-divider>
                        <b-dropdown-item-btn  v-if='this.user'  @click='signOut'>
                            <b-icon icon='arrow-right-circle'></b-icon>
                            Sign out
                        </b-dropdown-item-btn>
                    </b-dropdown>
                </b-nav>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import messageService from "../services/message-service";
    import {mapState} from "vuex";

    export default {
        name: 'Header',
        props: [
            'user'
        ],
        computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme']),
        data() {
            return {
                searchinput: this.searchinput,
                unseen: 0
            }
        },
        created() {
            if (this.user && this.token) {
                this.getUnseenMessages()
                if(this.messagePollerStarted) return
                if(!this.interval) this.interval = setInterval(this.getUnseenMessages, 5000)
                this.messagePollerStarted = true
            }
        },
        watch: {
            user: {
                immediate: true,
                handler() {
                    if (this.user && this.token) {
                        this.getUnseenMessages()
                        if(this.messagePollerStarted) return
                        if(!this.interval) this.interval = setInterval(this.getUnseenMessages, 5000)
                        this.messagePollerStarted = true
                    }
                }
            }
        },
        methods: {
            search() {
                if (this.searchinput) {
                    this.$store.commit('updateSearch', this.searchinput)
                    this.$router.push('/search')
                    this.searchinput = null
                }
            },
            signOut() {
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
            getUnseenMessages() {
                messageService.getUnseenMessageCount(this.user._id, this.token).then((res) => {
                    this.unseen = res
                }).catch((error) => {
                    // this.$bvToast.toast(error.response.statusText, {
                    //     title: 'Error',
                    //     variant: 'danger',
                    //     toaster: 'b-toaster-top-center'
                    // })
                })
            },
        }
    }
</script>

<style scoped>
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
