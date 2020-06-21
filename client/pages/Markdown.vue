<template>
    <div>
        <br>
        <br>
        <br>
        <h4>Markdown</h4>
        <b-row>
            <b-col>
                <b-row>
                    <b-col>
                        <b-form-group label="Text">
                            <b-textarea v-model='test' rows='24' placeholder='Test'>
                            </b-textarea>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        Preview
                        <div v-html="$md.render( test?test:``)"></div>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <br>
    </div>
</template>

<script>
    import postService from "../services/post-service";
    import userService from "../services/user-service";
    import keyboardService from "../services/keyboard-service";
    import listingService from "../services/listing-service";
    import {format} from "timeago.js"
    import announcementService from "../services/announcement-service";
    import {mapState} from "vuex";

    export default {
        name: 'Markdown',
        layout: 'index',
        data() {
            return {
                test: "#### Welcome to the Markdown Training\n" +
                    "Let's learn how to make fancy text using markdown.\n" +
                    "- - -\n" +
                    "You can use markdown to decorate text in \n" +
                    "- your posts,\n" +
                    "- your messages,\n" +
                    "- your bio,\n" +
                    "- and your keyboard descriptions.\n" +
                    "\n" +
                    "Make your text **emphasized like this** or *like this*, and you can do ~~this~~ as well. whichever you feel like is more appropriate.\n" +
                    "\n" +
                    "1. There are\n" +
                    "2. numbered lists as well\n" +
                    "\n" +
                    "You can also make \n" +
                    "# huge \n" +
                    "text, but please only use it when necessary. You can make your text large, but a bit smaller \n" +
                    "## like this\n" +
                    "### or like this\n" +
                    "#### or like this. This is the best. Please use this."
            }
        },
        watch: {

        },
        async created() {

        },
        methods: {

        }, head() {
            const description = "Click-Clack supports markdown to make your posts and messages fancier. Learn how."
            const title = `Click-Clack Markdown Guide`
            const url = `https://click-clack.cc/markdown`
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

                    // {name: 'twitter:image', hid: 'twitter:image', property: 'twitter:image', content: image},
                    // {name: 'og:image', hid: 'og:image', property: 'og:image', content: image},
                    // {name: 'image', hid: 'image', property: 'image', content: image},

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
</style>
