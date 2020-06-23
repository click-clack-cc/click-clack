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
                <b-card id='carousel-card' no-body>
                    <b-row id="carousel" cols="8">
                        <b-carousel
                            v-if='this.keeb.images.length > 1'
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
                        <b-carousel
                            v-else
                            fade
                            img-height="500"
                            img-width="1000"
                        >
                            <b-carousel-slide
                                v-for="(img, index) in this.keeb.images"
                                :key="index"
                                :img-src="img"
                                :img-alt="altDesc"
                            />
                        </b-carousel>
                    </b-row>
                </b-card>
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
                            <p v-if='this.keeb.switches'>
                                <span style="font-weight: bold">Switches</span> {{ this.keeb.switches }}
                            </p>
                            <p v-if='this.keeb.keycaps'>
                                <span style="font-weight: bold">Keycaps</span> {{ this.keeb.keycaps }}
                            </p>
                            <p v-if='this.keeb.case'>
                                <span style="font-weight: bold">Case</span> {{ this.keeb.case }}
                            </p>
                            <p v-if='this.keeb.pcb'>
                                <span style="font-weight: bold">PCB</span> {{ this.keeb.pcb }}
                            </p>
                            <div style=" margin-top: 0.5rem">
                                <svg  v-if="!hearted"
                                      icon="heart"
                                      style="cursor:pointer;"
                                      @click="toggleHeart(keeb)"
                                      v-b-tooltip.top='"Like"'
                                      version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1024 1024">
                                    <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" stroke-width="36" stroke="currentColor" d="M204.502 512.298v-22.598l22.598-13.085 28.548-34.49 34.49-16.649 55.903-103.477 128.461-35.683-2.378-60.659 9.514-7.135 2.378-14.27 23.791-7.135 24.977 15.463 36.876-10.706 17.841 16.649-1.193 52.339 191.499 98.721 24.977 95.157 28.548 17.841 16.649 40.44 28.548 17.841-3.571 30.926-36.876 11.892v30.926l-15.463 82.072-21.413 8.328-13.085-7.135-52.339 22.598-7.135 11.892-3.571 48.767 2.378-52.339-53.524 20.22-21.412 15.463h-23.791l-91.586 27.355-30.926-5.949-15.463 8.328-5.949 26.169-13.085-2.378-19.034-5.949-15.463-2.378-7.135-14.27-134.404-110.62-14.27-2.378-5.949-14.27-17.841-17.841-13.085-109.427z"></path>
                                    <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" stroke-width="36" stroke="currentColor" d="M264.174 546.657l190.082 140.459 24.39 10.936 27.751-4.206 329.697-110.176"></path>
                                    <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" stroke-width="36" stroke="currentColor" d="M422.292 382.645l110.176 68.963 140.459-41.212"></path>
                                    <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" stroke-width="36" stroke="currentColor" d="M562.751 391.9l-2.525-106.814"></path>
                                    <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" stroke-width="36" stroke="currentColor" d="M498.83 391.056l34.482-12.617-1.681-54.666"></path>
                                    <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" stroke-width="36" stroke="currentColor" d="M460.142 615.62l35.326 21.865c0 0 93.36-23.553 91.672-26.914s-23.553-118.587-23.553-118.587"></path>
                                    <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" stroke-width="36" stroke="currentColor" d="M730.117 454.141l24.39 103.452 57.191-14.298"></path>
                                    <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" stroke-width="36" stroke="currentColor" d="M314.634 514.693l113.544 77.375"></path>
                                </svg>
                                <!--                                <b-icon-->
                                <!--                                    v-if="!hearted"-->
                                <!--                                    icon="heart"-->
                                <!--                                    style="cursor:pointer;"-->
                                <!--                                    @click="toggleHeart(keeb)"-->
                                <!--                                />-->
                                <span class='text-primary' v-else>
                                    <svg
                                        stroke="currentColor"
                                        fill='currentColor'
                                        v-b-tooltip.top='"Like"'
                                        version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1024 1024">
                                        <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" stroke-width="42" d="M204.502 512.298v-22.598l22.598-13.085 28.548-34.49 34.49-16.649 55.903-103.477 128.461-35.683-2.378-60.659 9.514-7.135 2.378-14.27 23.791-7.135 24.977 15.463 36.876-10.706 17.841 16.649-1.193 52.339 191.499 98.721 24.977 95.157 28.548 17.841 16.649 40.44 28.548 17.841-3.571 30.926-36.876 11.892v30.926l-15.463 82.072-21.413 8.328-13.085-7.135-52.339 22.598-7.135 11.892-3.571 48.767 2.378-52.339-53.524 20.22-21.412 15.463h-23.791l-91.586 27.355-30.926-5.949-15.463 8.328-5.949 26.169-13.085-2.378-19.034-5.949-15.463-2.378-7.135-14.27-134.404-110.62-14.27-2.378-5.949-14.27-17.841-17.841-13.085-109.427z"></path>
                                        <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" stroke-width="42" d="M264.174 546.657l190.082 140.459 24.39 10.936 27.751-4.206 329.697-110.176"></path>
                                        <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" stroke-width="42" d="M422.292 382.645l110.176 68.963 140.459-41.212"></path>
                                        <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" stroke-width="42" d="M562.751 391.9l-2.525-106.814"></path>
                                        <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" stroke-width="42" d="M498.83 391.056l34.482-12.617-1.681-54.666"></path>
                                        <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" stroke-width="42" d="M460.142 615.62l35.326 21.865c0 0 93.36-23.553 91.672-26.914s-23.553-118.587-23.553-118.587"></path>
                                        <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" stroke-width="42" d="M730.117 454.141l24.39 103.452 57.191-14.298"></path>
                                        <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" stroke-width="42" d="M314.634 514.693l113.544 77.375"></path>
                                    </svg>
                                </span>
                                <!--                                <b-icon v-else icon="heart-fill" variant="primary"/>-->
                                {{ ' ' + keeb.hearts?keeb.hearts.length:0 }}
                                <a>
                                    <b-icon icon="chat-square" scale='1.2' style="margin-left: 1rem; margin-top: 0.2rem; margin-bottom: -0.1rem; margin-right: 0.2rem"/>
                                    {{ ' ' + keeb.comments?keeb.comments.length:0 }}
                                </a>
                            </div>
                        </b-col>
                        <b-col>
                            <a style='font-weight: bold' v-if='this.keeb.url' :href='this.keeb.url'>
                                {{`Created by ${this.keeb.creatorName} - ${truncate(this.keeb.url, 30, false)}`}}
                                <b-icon icon='link45deg'></b-icon>
                            </a>
                            <br v-if='this.keeb.url'>
                            <br v-if='this.keeb.url'>
                            <div v-html='$md.render(this.keeb.description)'></div>
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
                commentInput: '',
                hearted: false
            }
        },
        computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
        created() {
            this.checkIsHearted()
        },
        watch: {
            user: {
                immediate: true,
                handler() {
                    this.checkIsHearted()
                }
            }
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
            truncate(str, n, useWordBoundary) {
                if (str.length <= n) {
                    return str
                }
                const subString = str.substr(0, n - 1)
                return (useWordBoundary
                    ? subString.substr(0, subString.lastIndexOf(' '))
                    : subString) + '...'
            },
            toggleHeart(keeb) {
                if (!this.user) {
                    this.$router.push('/profile')
                }
                keyboardService.heart(this.user._id, this.keeb._id, this.token).then(() => {
                    this.hearted = true
                    this.keeb.hearts.push({
                        submitter: this.user._id,
                        createdAt: new Date()
                    })
                    this.$bvToast.toast(`Gave a ❤️ to ${this.owner.firstname} @${this.owner.id} `, {
                        title: 'Success',
                        toaster: 'b-toaster-top-center',
                        variant: 'success'
                    })
                }).catch(() => {
                    this.$bvToast.toast('Failed to update keyboard', {
                        title: 'Error',
                        toaster: 'b-toaster-top-center',
                        variant: 'danger'
                    })
                })
            },
            checkIsHearted() {
                if (this.user && this.keeb.hearts) {
                    for (let i = 0; i < this.keeb.hearts.length; i++) {
                        if (this.keeb.hearts[i].submitter === this.user._id) {
                            this.hearted = true
                            return;
                        }
                    }
                }
                this.hearted = false;
            },
            format
        },
        head() {
            const k = this.keeb
            const description = k.name + ' built by ' + k.creatorName ? k.creatorName : k.owner.firstname + ' ' +
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

    .keyboardcard-title {
        margin: 1rem;
        margin-left: 1rem;
        margin-top: 0;
    }

    .keyboard-preview {
        margin-top: 2rem;
        margin-bottom: 1rem;
    }

    .user-thumbnail {
        padding-left: 2rem;
    }

    .avatar {
        margin-top: -0.2rem;
        margin-right: 1rem;
    }

    .name {
    }

    .timeago {

    }

    #comment-input {
        width: 80%;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 1rem;
    }

    #carousel {
        overflow: hidden;
        margin: 0;
    }

    #carousel-card {
        margin-bottom: 1rem;
    }

</style>
