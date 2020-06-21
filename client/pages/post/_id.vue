<template>
    <div>
        <b-modal
            id="post-user-preview-modal"
            ref="post-user-preview-modal"
            centered
            hide-header
            ok-only
        >
            <OtherUserDataPreview :inspected-user="this.post.author"/>
        </b-modal>
        <div class="post-preview overflow-hidden">
            <b-col>
                <b-card id='carousel-card' no-body v-if='this.post.images && post.images.length > 0'>
                    <b-row id="carousel" cols="8">
                        <b-carousel
                            v-if='this.post.images.length > 1'
                            fade
                            img-height="500"
                            img-width="1000"
                            indicators
                        >
                            <b-carousel-slide
                                v-for="(img, index) in this.post.images"
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
                                v-for="(img, index) in this.post.images"
                                :key="index"
                                :img-src="img"
                                :img-alt="altDesc"
                            />
                        </b-carousel>
                    </b-row>
                </b-card>
                <b-card>
                    <b-row>
                        <b-col cols='3'>
                            <h1 style='font-size: 1.6rem;' class="postcard-title">
                                {{ this.post.title }}
                            </h1>
                        </b-col>

                        <b-col cols='3' align='left' class="user-thumbnail">
                            <b-avatar
                                :src="`https://click-clack.cc:5000/files/images/${this.post.author._id}.jpg`"
                                badge-offset="-0.2rem"
                                button
                                class="avatar"
                                size="2rem"
                                variant="light"
                                @click="previewUser(this.post.author.id)"
                            >
                                <template v-if="this.post.author.role == 'admin'" v-slot:badge>
                                    <b-icon v-b-tooltip.right icon="shield-shaded" title="Administrator"/>
                                </template>
                                <template v-else-if="this.post.author.role == 'verified'" v-slot:badge>
                                    <b-icon v-b-tooltip.right icon="check-circle" title="Verified user"/>
                                </template>
                                <template v-else-if="this.post.author.role == 'supporter'" v-slot:badge>
                                    <b-icon v-b-tooltip.right icon="heart" title="Supporter"/>
                                </template>
                                <template v-else-if="this.post.author.role == 'betatester'" v-slot:badge>
                                    <b-icon
                                        v-b-tooltip.right
                                        icon="egg"
                                        title="I was there when it all started"
                                    />
                                </template>
                                <template v-else-if="this.post.author.role == 'developer'" v-slot:badge>
                                    <b-icon v-b-tooltip.right icon="cup" title="Developer"/>
                                </template>
                            </b-avatar>
                            <b-link :href="`/u/${this.post.author.id}`" class="name">
                                {{ this.post.author.firstname }}
                                <span class="text-muted"> @{{ this.post.author.id }} </span>
                            </b-link>
                        </b-col>
                        <b-col cols='6' align='right'>
                            <div class="timeago">
                            <span class="text-muted">
                                {{ format(this.post.lastModified) }}
                            </span>
                            </div>
                        </b-col>
                    </b-row>
                    <br>
                    <b-row>
                        <b-col cols='3' style='margin-left: 1rem'>
                            <p v-if='this.post.switches'>
                                <span style="font-weight: bold">Switches</span> {{ this.post.switches }}
                            </p>
                            <p v-if='this.post.keycaps'>
                                <span style="font-weight: bold">Keycaps</span> {{ this.post.keycaps }}
                            </p>
                            <p v-if='this.post.case'>
                                <span style="font-weight: bold">Case</span> {{ this.post.case }}
                            </p>
                            <p v-if='this.post.pcb'>
                                <span style="font-weight: bold">PCB</span> {{ this.post.pcb }}
                            </p>
                            <div style=" margin-top: 0.5rem">
                                <b-icon
                                    v-if="!hearted"
                                    icon="heart"
                                    style="cursor:pointer;"
                                    @click="toggleHeart(post)"
                                />
                                <b-icon v-else icon="heart-fill" variant="primary"/>
                                {{ ' ' + post.hearts?post.hearts.length:0 }}
                                <b-icon icon="chat-square" style="margin-left: 1rem"/>
                                {{ ' ' + post.comments?post.comments.length:0 }}
                            </div>
                        </b-col>
                        <b-col>
                            <a style='font-weight: bold' v-if='this.post.url' :href='this.post.url'>
                                {{truncate(this.post.url, 30, false)}}
                                <b-icon icon='link45deg'></b-icon>
                            </a>
                            <br v-if='this.post.url'>
                            <br v-if='this.post.url'>
                            <div v-html='$md.render(this.post.content)'></div>
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
        <comment-list id='comments' v-if="this.post.comments" :comments="this.post.comments" :user="user"/>
    </div>
</template>

<script>
    import {format} from 'timeago.js'
    import Vue from 'vue'
    import {mapState} from 'vuex'
    import CommentList from '../../components/CommentList'
    import userService from '../../services/user-service'
    import postService from '../../services/post-service'
    import OtherUserDataPreview from '../../components/OtherUserDataPreview'

    export default {
        name: 'Post',
        layout: 'index',
        components: {
            CommentList,
            OtherUserDataPreview
        },
        props: [],
        async asyncData({params}) {
            const post = await postService.getPost(params.id)

            if(post.images){
                for (let j = 0; j < post.images.length; j++) {
                    post.images[j] = `https://click-clack.cc:5000/files/images/${post.images[j]}`
                }
            } else post.images = []

            if (post.comments) {
                post.comments = post.comments.reverse()
                for (let i = 0; i < post.comments.length; i++) {
                    const res = await userService.getUser(post.comments[i].submitter)
                    post.comments[i].submitter = res
                }
            } else post.comments = []

            if(!post.hearts) post.hearts = []

            post.author = await userService.getUser(post.user)

            const description = post.title + ' by ' + post.author.firstname + ' @' + post.author.id + ' - ' +
                post.content

            return {
                altDesc: description,
                post
            }
        },
        watch: {
            user: {
                immediate: true,
                handler() {
                    this.checkIsHearted()
                }
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
        methods: {
            previewUser() {
                this.$bvModal.show('post-user-preview-modal')
                Vue.prototype.$forceUpdate()
            },
            sendComment() {
                if (this.commentInput.length > 0) {
                    postService.comment(this.user._id, this.post._id, this.commentInput, this.token).then(() => {
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
            toggleHeart(post) {
                if (!this.user) {
                    this.$router.push('/profile')
                }
                postService.heart(this.user._id, this.post._id, this.token).then(() => {
                    this.hearted = true
                    this.post.hearts.push({
                        submitter: this.user._id,
                        createdAt: new Date()
                    })
                    this.$bvToast.toast(`Gave a ❤️ to ${this.author.firstname} @${this.author.id} `, {
                        title: 'Success',
                        toaster: 'b-toaster-top-center',
                        variant: 'success'
                    })
                }).catch(() => {
                    this.$bvToast.toast('Failed to update post', {
                        title: 'Error',
                        toaster: 'b-toaster-top-center',
                        variant: 'danger'
                    })
                })
            },
            checkIsHearted() {
                if (this.user && this.post.hearts) {
                    for (let i = 0; i < this.post.hearts.length; i++) {
                        if (this.post.hearts[i].submitter === this.user._id) {
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
            const k = this.post
            const description = k.title + ' by ' + k.author.firstname + ' @' + k.author.id + ' - ' +
                k.content
            const title = `${k.title} - Click-Clack`
            const image = k.images[0]
            const url = `https://click-clack.cc/post/${k._id}`
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

    .postcard-title {
        margin: 1rem;
        margin-left: 1rem;
        margin-top: 0;
    }

    .post-preview {
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
