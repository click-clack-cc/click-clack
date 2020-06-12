<template>
    <div>
        <div v-if="keyboards">
            <KeyboardSmall
                v-for="(keeb, index) in keyboards"
                :key="index"
                :keeb="keeb"
                :owner="keeb.userdata"
                :show-owner="true"
                :token="token"
                :user="user"
            >
                {{ keeb }}
            </KeyboardSmall>
        </div>
    </div>
</template>

<script>

    import { mapState } from 'vuex'
    import keyboardService from '../services/keyboard-service'
    import KeyboardSmall from '../components/KeyboardSmall'

    export default {
        name: 'Showroom',
        layout: 'index',
        components: {
            KeyboardSmall
        },
        props: [],
        data () {
            return {
                keyboards: null
            }
        },
        computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
        created () {
            keyboardService.getNewKeyboards().then((keebs) => {
                this.keyboards = keebs
                this.loaded = true
            })
        },
        methods: {},
        head () {
            const description = ' Newest custom mechanical keyboard builds on click-clack. Check out the nicest custom mech keebs uploaded by our members!'
            const title = 'Showroom - Newest Mechanical Keyboard Builds'
            const image = 'https://click-clack.cc:5000/files/images/indeximage.jpg'
            const url = 'https://click-clack.cc/showroom'
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
    .keyboardcard {
        max-width: 50%;
    }

    .image {
        float: left;
        background-size: cover;
        background-repeat: no-repeat;
        margin: 1px;
        background-position: center center;
    }

    .keyboardcard-text {
        margin: 1rem;
        margin-bottom: 0rem;
    }

    .keyboard-preview {
        margin-top: 2rem;
        margin-bottom: 6rem;
    }

    .user-thumbnail {
        margin-top: 0.5rem;
    }

    .avatar {
        margin-left: 1rem;
    }

    .name {
        margin-left: 1rem;
        margin-top: 0.3rem;
    }

    #search-bar {
        margin-bottom: 2rem;
    }

    .gallery-item-title {
        padding: 0.2rem;
        background: rgba(255, 255, 255, 0.7);
        font-weight: bold;
        color: #000000;
    }

</style>
