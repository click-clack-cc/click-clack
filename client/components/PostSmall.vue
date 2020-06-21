<template>
    <div id="container">
<!--        {{post}}-->
        <b-card
            id="card"
            footer-tag="footer"
            header-tag="header"
            no-body
        >
            <template v-slot:header>
                <b-row>
                    <a id="posttitle" style="cursor: pointer" @click="goToPost(post._id)">{{ post.title }}</a>
                    <div v-if="showAuthor === true" id="postauthor">
                        <span class="text-muted">   </span>
                        <a :href="`/u/${author.id}`"> {{ author.firstname }}
                            <span class="text-muted"> @{{ author.id }} </span></a>
                    </div>
                    <div v-if="user &&(post.user === user._id)" id="post-edit-button">
                        <b-button
                            size="sm"
                            style="margin-left: 1rem; margin-right: 1rem; border: none; margin-top: -.3rem"
                            variant="outline-primary"
                            @click="editPost(post._id)"
                        >
                            <b-icon icon="pencil-square"/>
                        </b-button>

                        <b-button
                            size="sm"
                            style='border: none; margin-top: -.3rem'
                            variant="outline-danger"
                            @click="removePost(post._id)"
                        >
                            <b-icon icon="trash"/>
                        </b-button>
                    </div>
                    <b-col align="right">
                        <span class="text-muted timeago">
                          {{ format(post.createdAt) }}
                        </span>
                    </b-col>
                </b-row>
            </template>
            <b-carousel
                v-if="post.images && post.images.length > 1"
                id="carousel"
                v-model="post.slide"
                :interval="999999"
                controls
            >
                <a style="cursor: pointer" @click="goToPost(post._id)">
                    <b-carousel-slide
                        v-for="(img, index) in post.images"
                        :key="index"
                        :img-src="`https://click-clack.cc:5000/files/images/${img}`"
                    />
                </a>
            </b-carousel>
            <b-carousel
                v-else-if='post.images'
                id="carousel"
                v-model="post.slide"
                :interval="999999"
            >
                <a style="cursor: pointer" @click="goToPost(post._id)">
                    <b-carousel-slide
                        v-for="(img, index) in post.images"
                        :key="index"
                        :img-src="`https://click-clack.cc:5000/files/images/${img}`"
                    />
                </a>
            </b-carousel>
            <b-row>
                <b-col no-gutters>
                    <div  id="no-img-parts-list-container">
                        <b-col class="post-info">
                            <a style='font-weight: bold' v-if='post.url' :href='post.url'> {{truncate(post.url, 30, false)}} <b-icon icon='link45deg'></b-icon> </a>
                            <br v-if='post.url'>
                            <br v-if='post.url'>
                            <a :href='`/post/${[post._id]}`'>
                            <div v-html='$md.render(truncate(post.content,350,true))'>
                            </div>
                            </a>
                            <div style=" margin-top: 0.5rem">
                                <b-icon
                                    v-if="!hearted"
                                    icon="heart"
                                    style="cursor:pointer;"
                                    @click="toggleHeart(post)"
                                />
                                <b-icon v-else icon="heart-fill" variant="primary"/>
                                {{ ' ' + post.hearts?post.hearts.length:0 }}
                                <a :href='`/post/${[post._id]}`'>
                                <b-icon icon="chat-square" style="margin-left: 1rem"/>
                                {{ ' ' + post.comments?post.comments.length:0 }}
                                </a>
                            </div>
                        </b-col>
                    </div>
                </b-col>
            </b-row>
        </b-card>
    </div>
</template>

<script>
    import { format } from 'timeago.js'
    import postService from '../services/post-service'

    export default {
        name: 'PostSmall',
        components: {},
        props: [
            'user',
            'post',
            'token',
            'showAuthor',
            'author'
        ],
        data() {
            return {
                hearted: false
            }
        },
        computed: {},
        watch: {
        },
        created () {
            this.checkIsHearted()
        },
        methods: {
            goToPost (id) {
                this.$router.push(`/post/${id}`)
            },
            editPost (id) {
                this.$router.push(`/editpost/${id}`)
            },
            removePost () {
                this.$bvModal.msgBoxConfirm('Are you sure you want to remove this post?', {
                    title: 'Removing post',
                    size: 'sm',
                    buttonSize: 'sm',
                    okVariant: 'danger',
                    okTitle: 'Yes',
                    cancelTitle: 'No, thank you',
                    cancelVariant: 'success',
                    footerClass: 'p-2',
                    hideHeaderClose: false,
                    centered: true
                }).then((result) => {
                    if (result) {
                        postService.deletePost(this.post.user, this.post._id, this.token).then(() => {
                            this.$bvToast.toast('Post deleted successfully', {
                                title: 'Success',
                                toaster: 'b-toaster-top-center',
                                variant: 'success'
                            })
                        }).catch(() => {
                            this.$bvToast.toast('Failed to delete post', {
                                title: 'Error',
                                toaster: 'b-toaster-top-center',
                                variant: 'danger'
                            })
                        })
                    }
                })
            },
            toggleHeart(post) {
                if (!this.user) {
                    this.$router.push('/profile')
                }
                postService.heart(this.user._id, post._id, this.token).then(() => {
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
                    this.$bvToast.toast('Failed heart post :(', {
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
            truncate (str, n, useWordBoundary) {
                if(!str) return ''
                if (str.length <= n) {
                    return str
                }
                const subString = str.substr(0, n - 1)
                return (useWordBoundary
                    ? subString.substr(0, subString.lastIndexOf(' '))
                    : subString) + '...'
            },
            format
        }
    }
</script>

<style scoped>
    .post-info {
        margin: 0rem;
    }

    #container {
        margin-bottom: 0.5rem;
    }

    #carousel {
        margin: auto;
        margin-bottom: 1rem;

    }

    #no-img-parts-list-container {
        margin: 1rem;
    }

    #post-edit-button {
        margin-right: 1rem;
    }

    .post-info {
        margin: 0rem;
    }

    #container {
        margin-top: 0rem;
    }
    #carousel {
        margin: auto;
        margin-bottom: 0.5rem;
    }

    #no-img-parts-list-container {
        margin: 0.5rem;
    }

    #posttitle {
        font-weight: bold;
        margin-left: 1rem;
        margin-right: 0.5rem;
    }

    .timeago {
        margin-top: 0rem;
    }
</style>
