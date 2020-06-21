<template>
    <div>
        <b-row class='posts'>
            <b-col cols='12'>
                <b-row id='postbuttons' >
                    <b-col align='middle'>
                        <b-button style='width: 13rem' block pill  @click='$nuxt.$router.push(user?"/editkeyboard":"/profile")'>
                            <b-icon icon='file-plus'></b-icon>
                            Submit a keyboard
                        </b-button>
                    </b-col>
                </b-row>
                <b-row id='sortbuttons'>
                    <b-col align='middle'>
                        <b-button-group size="sm">
                            <b-button
                                variant="outline-primary"
                                :pressed="this.sortMethod === 'best'"
                                @click="sortBy('best')">
                                <b-icon v-if="sortMethod === 'best'" icon="star-fill"/>
                                <b-icon v-else icon="star"/>
                                Best
                            </b-button>
                            <b-button
                                variant="outline-primary"
                                :pressed="this.sortMethod === 'rising'"
                                @click="sortBy('rising')">
                                <b-icon v-if="sortMethod === 'rising'" icon="brightness-alt-high-fill"/>
                                <b-icon v-else icon="brightness-alt-high"/>
                                Rising
                            </b-button>
                            <b-button
                                variant="outline-primary"
                                :pressed="this.sortMethod === 'new'"
                                @click="sortBy('new')">
                                <b-icon v-if="sortMethod === 'new'" icon="egg-fill"/>
                                <b-icon v-else icon="egg"/>
                                New
                            </b-button>
                        </b-button-group>
                    </b-col>
                </b-row>

                <div id="loading"  v-if='!this.loaded' class="text-center">
                    <b-spinner :variant="'primary'" type="grow" />
                </div>

                <div v-if="allContent">
                    <b-card-group columns style='column-count: 1'
                                  v-for="(content, index) in allContent">
                        <KeyboardSmall
                            style='display: inline-block; width: 100%; margin-bottom: 2rem; margin-top: 2rem'
                            v-if='keyboards.includes(content)'
                            :key="index"
                            :keeb="content"
                            :owner="content.userdata"
                            :show-owner="true"
                            :token="token"
                            :user="user"
                        >
                        </KeyboardSmall>
                    </b-card-group>
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<script>

    import {mapState} from 'vuex'
    import keyboardService from '../services/keyboard-service'
    import KeyboardSmall from '../components/KeyboardSmall'
    import NewUsers from '../components/NewestMembers'
    import Announcements from '../components/Announcements'
    import Leaderboard from '../components/LeaderboardSmall'
    import Footer from "../components/Footer";
    import postService from "../services/post-service";

    export default {
        name: 'Showroom',
        layout: 'index',
        components: {
            KeyboardSmall,
            NewUsers,
            Announcements,
            Leaderboard,
            Footer
        },
        props: [],
        data() {
            return {
                keyboards: null,
                posts: null,
                loaded: false,
                allContent: null,
                sortMethod: 'best'
            }
        },
        computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
        created() {
            this.sortBy('best')
        },
        methods: {
            async sortBy(method) {
                this.sortMethod = method
                this.loaded = false
                let allContent = [];
                let keebs = await keyboardService.getNewKeyboards(this.sortMethod)
                this.keyboards = keebs

                allContent = allContent.concat(keebs)
                let posts = await postService.getNewPosts(this.sortMethod)
                this.posts = posts

                allContent = allContent.concat(posts)
                if(method===("new") || method===("rising")){
                    allContent.sort((b,a) => a.createdAt - b.createdAt)
                }
                if(method===("best")) {
                    allContent.sort((b, a) => a.heartsNum - b.heartsNum)
                }
                this.allContent = allContent
                this.loaded = true
            }
        },
        head() {
            const description = 'The Click-Clack mechanical keyboard showroom has the prettiest custom mechanical keyboards. Come and share your own build as well!'
            const title = 'Click-Clack - Showroom'
            const image = 'https://click-clack.cc:5000/files/images/indeximage.JPG'
            const url = 'https://click-clack.cc/showroom'
            return {
                title,
                htmlAttrs: {
                    lang: 'en'
                },
                meta: [
                    {charset: 'utf-8'},
                    {name: 'viewport', content: 'width=device-width, initial-scale=1'},

                    {name: 'title', property: 'title', hid: 'title', content: title},
                    {name: 'og:title', property: 'og:title', hid: 'og:title', content: title},
                    {name: 'twitter:title', property: 'twitter:title', hid: 'twitter:title', content: title},

                    {name: 'description', property: 'description', hid: 'description', content: description},
                    {name: 'og:description', property: 'og:description', hid: 'og:description', content: description},
                    {
                        name: 'twitter:description',
                        property: 'twitter:description',
                        hid: 'twitter:description',
                        content: description
                    },

                    {name: 'twitter:image', hid: 'twitter:image', property: 'twitter:image', content: image},
                    {name: 'og:image', hid: 'og:image', property: 'og:image', content: image},
                    {name: 'image', hid: 'image', property: 'image', content: image},

                    {name: 'og:site_name', property: 'og:site_name', hid: 'og:site_name', content: 'click-clack'},
                    {name: 'og:type', property: 'og:type', hid: 'og:type', content: 'website'},
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

    #postbuttons {
        margin-bottom: 1rem;
    }

    #sortbuttons {
        margin-bottom: 1rem;
    }

    .posts {
        margin-top: 1rem;
    }

    #new-users, #leaderboard, #announcements {
        margin-bottom: 1.25rem;
    }

    #topcards {
        margin-bottom: 1rem;
    }

    #loading {
        margin: 5rem;
    }

</style>
