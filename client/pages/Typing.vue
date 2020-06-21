<template>
    <div id="home">
        <no-ssr>
            <Typer :token="token" :user="user" style="padding-top: 4rem" @event="eventHandler" />
        </no-ssr>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import Typer from '../components/Typer.vue'

    export default {
        name: 'Home',
        layout: 'index',
        components: {
            Typer
        },
        props: [],
        mounted () {
            this.$store.commit('updateZenmode', false)
        },
        computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
        methods: {
            eventHandler (event) {
                this.$emit('event', event)
            }
        },
        head () {
            const description = 'Test your typing speed with our clean and customizable typing test. The click-clack typing speed tester' +
                'is one of the most sophisticated typing tests with lots of options and great performance tracking. You can even compete with' +
                'other members by trying to rank higher on the leaderboard!'
            const title = 'Click-Clack - Typing Test'
            const image = 'https://click-clack.cc:5000/files/images/indeximage.jpg'
            const url = 'https://click-clack.cc/typing'
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

</style>
