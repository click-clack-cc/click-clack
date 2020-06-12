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
        margin-bottom: -0.4rem;
    }

    #title {
        font-size: 1.6rem;
        line-height: 0.9;
        /*position: absolute;*/
        margin-left: 1rem;
        /*color: #ff7700;*/
        /*color: #000;*/
        /*top: 1rem;*/
    }

    #beta {
        font-size: 1rem;
    }

    #mini-avatar {
        margin-top: 0.2rem;
        margin-left: 0.5rem;
    }

    #nav {
        margin-top: -0.5rem;
    }

    .active {
        font-weight: bold;
    }

    #search {
        margin-top: -0.4rem;
        height: 2.1rem;
        width: 100%;
    }
</style>
