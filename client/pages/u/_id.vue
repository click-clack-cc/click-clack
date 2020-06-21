<template>
    <div id="stats">
        <div id="accountInfo">
            <b-row id="selfUserDataCard">
                <OtherUserData v-if="inspectedUser" :inspected-user="inspectedUser" :token="token" :user="user" />
            </b-row>
        </div>
        <br>
        <h5>Latest results</h5>
        <StatsList v-if="inspectedUser" :user="inspectedUser" />
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import StatsList from '../../components/StatsList'
    import OtherUserData from '../../components/OtherUserData'
    import userService from '../../services/user-service'
    import RecommendationList from '../../components/RecommendationList'
    import keyboardService from '../../services/keyboard-service'
    import listingService from "../../services/listing-service";
    import postService from "../../services/post-service";

    const signedIn = false

    export default {
        name: 'Profile',
        layout: 'index',
        components: {
            OtherUserData,
            StatsList,
            RecommendationList
        },
        props: [],
        async asyncData({params}) {
            const u = await userService.getUser(params.id)
            u.listings = await listingService.getListings(u._id)
            u.keyboards = await keyboardService.getKeyboards(u._id)
            u.posts = await postService.getPosts(u._id)
            return { inspectedUser: u }
        },
        data () {
            return {
                userName: '',
                firstName: '',
                inspectedUser: null,
                signedIn,
                loaded: false
            }
        },
        computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
        created () {
        },
        methods: {},
        head () {
            const u = this.inspectedUser
            const description = (u.firstname + ' @' + u.id + ' on click-clack.cc: ' + u.bio)
            const title = (u.firstname + ' @' + u.id + ' on Click-Clack')
            const image = `https://click-clack.cc:5000/files/images/${u._id}.jpg`
            const url = `https://click-clack.cc/u/${u.id}`
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
        max-width: 75%;
        margin: auto;
        text-align: center;
    }

    #selfUserDataCard {
        margin-left: 0;
        width: 100%;
        margin-right: 0;
    }

    #loading {
        margin: 5rem;
    }
</style>
