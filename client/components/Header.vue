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
                        placeholder="Search"
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
                        <nuxt-link exact exact-active-class="active" to="/typing">
                            <b-icon v-b-tooltip.hover.bottom="`Typing Test`" icon="lightning" />
                        </nuxt-link>
                    </b-nav-item>
                    <b-nav-item>
                        <nuxt-link exact-active-class="active" to="/">
                            <b-icon v-b-tooltip.hover.bottom="`Keyboard Showroom`" icon="view-stacked" />
                        </nuxt-link>
                    </b-nav-item>
<!--                    <b-nav-item>-->
<!--                        <nuxt-link exact-active-class="active" to="/market">-->
<!--                            <b-icon v-b-tooltip.hover.bottom="`Market`" icon="shop-window" />-->
<!--                        </nuxt-link>-->
<!--                    </b-nav-item>-->
                    <b-nav-item>
                        <nuxt-link exact-active-class="active" to="/community">
                            <b-icon v-b-tooltip.hover.bottom="`Community`" icon="people" />
                        </nuxt-link>
                    </b-nav-item>
                    <!--                    <b-nav-item>-->
                    <!--                        <nuxt-link to="/profile" exact exact-active-class="active">-->
                    <!--                            Profile-->
                    <!--                        </nuxt-link>-->
                    <!--                    </b-nav-item>-->
                    <b-avatar
                        v-if="this.user"
                        id="mini-avatar"
                        v-b-tooltip.hover.bottom="`Profile`"
                        :src="`https://click-clack.cc:5000/files/images/${this.user._id}.jpg`"
                        size="2.3rem"
                        to="/profile"
                        variant="light"
                    />
                    <b-nav-item v-else>
                        <nuxt-link exact-active-class="active" to="/profile">
                            Sign in
                        </nuxt-link>
                    </b-nav-item>
                    <b-nav-item>
                        <nuxt-link exact exact-active-class="active" to="/settings">
                            <b-icon v-b-tooltip.hover.bottom="`Settings`" icon="three-dots-vertical" />
                        </nuxt-link>
                    </b-nav-item>
                </b-nav>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    export default {
        name: 'Header',
        props: [
            'user'
        ],
        data () {
            return {
                searchinput: this.searchinput
            }
        },
        methods: {
            search () {
                if (this.searchinput) {
                    this.$store.commit('updateSearch', this.searchinput)
                    this.$router.push('/search')
                    this.searchinput = null
                }
            }
        }
    }
</script>

<style scoped>
    #header {

    }

    #header-inside {
        margin-top: -1rem;
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

    #mini-avatar {
        margin-top: 0.2rem;
        margin-left: 0.5rem;
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
