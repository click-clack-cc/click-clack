<template>
    <div>
        <b-modal
            id="keyboard-user-preview-modal"
            ref="keyboard-user-preview-modal"
            centered
            hide-header
            ok-only
        >
            <OtherUserDataPreview :inspected-user="this.keeb.owner"/>
        </b-modal>
        <div class="keyboard-preview overflow-hidden">
            <b-col>
                <b-row id="carousel" cols="8">
                    <b-carousel

                        fade
                        img-height="500"
                        img-width="1000"
                        indicators
                    >
                        <b-carousel-slide
                            v-for="(img, index) in this.keeb.images"
                            :key="index"
                            :img-src="img"
                            :img-alt="altDesc"
                        />
                    </b-carousel>
                </b-row>
                    <b-card>
                        <b-row>
                            <b-col cols='4'>
                                <h1 style='font-size: 1.6rem;' class="keyboardcard-title">
                                    {{ this.keeb.name }}
                                </h1>
                            </b-col>

                            <b-col cols='4' align='left' class="user-thumbnail">
                                <b-avatar
                                    :src="`https://click-clack.cc:5000/files/images/${this.keeb.owner._id}.jpg`"
                                    badge-offset="-0.2rem"
                                    button
                                    class="avatar"
                                    size="2rem"
                                    variant="light"
                                    @click="previewUser(this.keeb.owner.id)"
                                >
                                    <template v-if="this.keeb.owner.role == 'admin'" v-slot:badge>
                                        <b-icon v-b-tooltip.right icon="shield-shaded" title="Administrator"/>
                                    </template>
                                    <template v-else-if="this.keeb.owner.role == 'verified'" v-slot:badge>
                                        <b-icon v-b-tooltip.right icon="check-circle" title="Verified user"/>
                                    </template>
                                    <template v-else-if="this.keeb.owner.role == 'supporter'" v-slot:badge>
                                        <b-icon v-b-tooltip.right icon="heart" title="Supporter"/>
                                    </template>
                                    <template v-else-if="this.keeb.owner.role == 'betatester'" v-slot:badge>
                                        <b-icon
                                            v-b-tooltip.right
                                            icon="egg"
                                            title="I was there when it all started"
                                        />
                                    </template>
                                    <template v-else-if="this.keeb.owner.role == 'developer'" v-slot:badge>
                                        <b-icon v-b-tooltip.right icon="cup" title="Developer"/>
                                    </template>
                                </b-avatar>
                                <b-link :href="`/u/${this.keeb.owner.id}`" class="name">
                                    {{ this.keeb.owner.firstname }} {{ this.keeb.owner.lastname }}
                                    <span class="text-muted"> @{{ this.keeb.owner.id }} </span>
                                </b-link>
                            </b-col>
                            <b-col cols='4' align='right'>
                                <div class="timeago">
                            <span class="text-muted">
                                {{ format(this.keeb.lastModified) }}
                            </span>
                                </div>
                            </b-col>
                        </b-row>
                        <br>
                        <b-row>
                            <b-col cols='4' style='margin-left: 1rem'>
                                <p>
                                    <span style="font-weight: bold">Switches</span> {{ this.keeb.switches }}
                                </p>
                                <p>
                                    <span style="font-weight: bold">Keycaps</span> {{ this.keeb.keycaps }}
                                </p>
                                <p>
                                    <span style="font-weight: bold">Case</span> {{ this.keeb.case }}
                                </p>
                                <p>
                                    <span style="font-weight: bold">PCB</span> {{ this.keeb.pcb }}
                                </p>
                            </b-col>
                            <b-col>
                                <p >
                                    {{ this.keeb.description }}
                                </p>
                            </b-col>
                        </b-row>
                    </b-card>
            </b-col>
        </div>
        <b-input-group v-if="user" id="comment-input">
            <b-form-input v-model="commentInput" placeholder="Say something nice"/>
            <template v-slot:append>
                <b-button append @click="sendComment">
                    Send
                </b-button>
            </template>
        </b-input-group>
        <br>
        <comment-list v-if="this.keeb.comments" :comments="this.keeb.comments" :user="user"/>
    </div>
</template>

<script>
    import {format} from 'timeago.js'
    import Vue from 'vue'
    import {mapState} from 'vuex'
    import CommentList from '../../components/CommentList'
    import userService from '../../services/user-service'
    import keyboardService from '../../services/keyboard-service'
    import OtherUserDataPreview from '../../components/OtherUserDataPreview'

    export default {
        name: 'Keyboard',
        layout: 'index',
        components: {
            CommentList,
            OtherUserDataPreview
        },
        props: [],
        async asyncData({params}) {
            const keeb = await keyboardService.getKeyboard(params.id)

            for (let j = 0; j < keeb.images.length; j++) {
                keeb.images[j] = `https://click-clack.cc:5000/files/images/${keeb.images[j]}`
            }
            if (keeb.comments) {
                keeb.comments = keeb.comments.reverse()
                for (let i = 0; i < keeb.comments.length; i++) {
                    const res = await userService.getUser(keeb.comments[i].submitter)
                    keeb.comments[i].submitter = res
                }
            }
            const res = await userService.getUser(keeb.owner)
            keeb.owner = res

            const description = keeb.name + ' built by ' + keeb.owner.firstname + ' ' +
                ((keeb.owner.lastname === null) ? ('') : (keeb.owner.lastname)) + ' @' + keeb.owner.id + ' Built with ' +
                keeb.switches + ', ' + keeb.keycaps + ', ' + keeb.pcb + ' and ' + keeb.case

            return {
                altDesc: description,
                keeb
            }
        },
        data() {
            return {
                // loaded: false,
                userSelected: null,
                commentInput: ''
            }
        },
        computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
        created() {

        },
        methods: {
            previewUser() {
                this.$bvModal.show('keyboard-user-preview-modal')
                Vue.prototype.$forceUpdate()
            },
            sendComment() {
                if (this.commentInput.length > 0) {
                    keyboardService.comment(this.user._id, this.keeb._id, this.commentInput, this.token).then(() => {
                        this.$router.go()
                    })
                } else {
                    this.$bvToast.toast('Please enter some nice words.', {
                        title: 'No empty comments',
                        toaster: 'b-toaster-top-center'
                    })
                }
            },
            format
        },
        head() {
            const k = this.keeb
            const description = k.name + ' built by ' + k.owner.firstname + ' ' +
                ((k.owner.lastname === null) ? ('') : (k.owner.lastname)) + ' @' + k.owner.id + ' Built with ' +
                k.switches + ', ' + k.keycaps + ', ' + k.pcb + ' and ' + k.case
            const title = `${k.name} - Click-Clack`
            const image = k.images[0]
            const url = `https://click-clack.cc/keyboard/${k._id}`
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

    .keyboardcard-title {
        margin: 1rem;
        margin-left: 1rem;
        margin-top: 0;
    }

    .keyboard-preview {
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

    .user-thumbnail {

    }

    .avatar {
        margin-top: -0.2rem;
        margin-right: 1rem;
    }

    .name {
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

    .timeago {

    }

    .tag {
        margin-right: 1rem;
    }

    #comment-input {
        width: 100%;
        margin-left: auto;
        margin-right: auto;
    }

    #carousel {
        margin-bottom: 2rem;
    }

</style>
