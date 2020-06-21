<template>
    <div id="container">
        <b-card
            id="card"
            footer-tag="footer"
            header-tag="header"
            no-body
        >
            <template v-slot:header>
                <b-row>
                    <b-col cols='8'>
                        <b-row>
                            <b-col>
                                <a id="keebtitle" style="cursor: pointer" @click="goToKeyboard(keeb._id)">{{ keeb.name
                                    }}</a>

                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>

                                <div v-if="showOwner === true" id="keebowner">
                                    <div v-if='keeb.creatorName'>
                                        <span class="text-muted"> made by </span>
                                        <a :href="keeb.url"> {{ keeb.creatorName }} </a>
                                        <span class="text-muted"> submitted by </span>
                                        <a :href="`/u/${owner.id}`"> {{ owner.firstname }} {{ owner.lastname }}
                                            <span class="text-muted"> @{{ owner.id }} </span></a>
                                    </div>
                                    <div v-else>
                                        <span class="text-muted">  by </span>
                                        <a :href="`/u/${owner.id}`"> {{ owner.firstname }} {{ owner.lastname }}
                                            <span class="text-muted"> @{{ owner.id }} </span></a>
                                    </div>
                                </div>
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col cols='1'>
                        <div v-if="user && (user._id === keeb.owner)" id="keeb-edit-button">
                            <b-button
                                size="sm"
                                style=" margin-right: 1rem; border: none; margin-top: -.3rem"
                                variant="outline-primary"
                                @click="editExistingKeyboard(keeb._id)"
                            >
                                <b-icon icon="pencil-square"/>
                            </b-button>

                            <b-button
                                size="sm"
                                style='border: none; margin-top: -.3rem'
                                variant="outline-danger"
                                @click="removeExistingKeyboard()"
                            >
                                <b-icon icon="trash"/>
                            </b-button>
                        </div>
                    </b-col>
                    <b-col cols='3' align="right">
                        <span class="text-muted timeago">
                          {{ format(keeb.createdAt) }}
                        </span>
                    </b-col>
                </b-row>
            </template>
            <b-carousel
                v-if="keeb.images && keeb.images.length > 1"
                id="carousel"
                v-model="keeb.slide"
                :interval="999999"
                controls
            >
                <a style="cursor: pointer" @click="goToKeyboard(keeb._id)">
                    <b-carousel-slide
                        v-for="(img, index) in keeb.images"
                        :key="index"
                        :img-src="`https://click-clack.cc:5000/files/images/${img}`"
                    />
                </a>
            </b-carousel>
            <b-carousel
                v-else-if='keeb.images'
                id="carousel"
                v-model="keeb.slide"
                :interval="999999"
            >
                <a style="cursor: pointer" @click="goToKeyboard(keeb._id)">
                    <b-carousel-slide
                        v-for="(img, index) in keeb.images"
                        :key="index"
                        :img-src="`https://click-clack.cc:5000/files/images/${img}`"
                    />
                </a>
            </b-carousel>
            <b-row>
                <b-col no-gutters>
                    <div id="no-img-parts-list-container">
                        <b-col class="keeb-info">
                            <a style='font-weight: bold' v-if='keeb.url' :href='keeb.url'> {{truncate(keeb.url, 30,
                                false)}}
                                <b-icon icon='link45deg'></b-icon>
                            </a>
                            <br v-if='keeb.url'>
                            <br v-if='keeb.url'>
                            <a :href='`/keyboard/${[keeb._id]}`'>
                                <div v-html='$md.render(truncate(keeb.description,350,true))'></div>
                            </a>
                            <a style="cursor: pointer" @click="goToKeyboard(keeb._id)">
                                <div style="">
                                    <span style="font-weight: bold; margin-right: 1rem">
                                      Switches
                                    </span>
                                    {{ keeb.switches }} <br>
                                    <span style="font-weight: bold; margin-right: 1rem">
                                      Keycaps
                                    </span>
                                    {{ keeb.keycaps }} <br>
                                    <span style="font-weight: bold; margin-right: 1rem">
                                      PCB
                                    </span>
                                    {{ keeb.pcb }} <br>
                                    <span style="font-weight: bold; margin-right: 1rem">
                                      Case
                                    </span>
                                    {{ keeb.case }} <br>
                                </div>
                            </a>
                            <div style=" margin-top: 0.5rem">
                                <b-icon
                                    v-if="!hearted"
                                    icon="heart"
                                    style="cursor:pointer;"
                                    @click="toggleHeart(keeb)"
                                />
                                <b-icon v-else icon="heart-fill" variant="primary"/>
                                {{ ' ' + keeb.hearts?keeb.hearts.length:0 }}
                                <a :href='`/keyboard/${[keeb._id]}`'>
                                <b-icon icon="chat-square" style="margin-left: 1rem"/>
                                {{ ' ' + keeb.comments?keeb.comments.length:0 }}
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
    import {format} from 'timeago.js'
    import keyboardService from '../services/keyboard-service'

    export default {
        name: 'Keyboard',
        components: {},
        props: [
            'user',
            'token',
            'keeb',
            'showOwner',
            'showEdit',
            'owner'
        ],
        data() {
            return {
                editKeyboard: this.keeb,
                photos: this.photos,
                uploading: false,
                hearted: false
            }
        },
        computed: {},
        watch: {
            user: {
                immediate: true,
                handler() {
                    this.checkIsHearted()
                }
            },
            keeb: {
                immediate: true,
                handler() {
                    this.checkIsHearted()
                }
            }
        },
        created() {

        },
        methods: {
            goToKeyboard(id) {
                this.$router.push(`/keyboard/${id}`)
            },
            editExistingKeyboard(id) {
                this.$router.push(`/editkeyboard/${id}`)
            },
            removeExistingKeyboard() {
                this.$bvModal.msgBoxConfirm('Are you sure you want to remove this keyboard?', {
                    title: 'Removing keyboard',
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
                        keyboardService.deleteKeyboard(this.owner._id, this.editKeyboard._id, this.token).then(() => {
                            this.$bvToast.toast('Keyboard deleted successfully', {
                                title: 'Success',
                                toaster: 'b-toaster-top-center',
                                variant: 'success'
                            })
                        }).catch(() => {
                            this.$bvToast.toast('Failed to delete keyboard', {
                                title: 'Error',
                                toaster: 'b-toaster-top-center',
                                variant: 'danger'
                            })
                        })
                    }
                })
            },
            toggleHeart(keeb) {
                if (!this.user) {
                    this.$router.push('/profile')
                }
                keyboardService.heart(this.user._id, keeb._id, this.token).then(() => {
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
            truncate(str, n, useWordBoundary) {
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

    .keeb-info {
        margin: 0rem;
    }

    #container {
        margin-top: 0rem;
    }

    #carousel {
        margin: auto;
        margin-bottom: 0.5rem;
        /*max-width: 40rem;*/
    }

    #no-img-parts-list-container {
        margin: 0.5rem;
    }

    #keebtitle {
        font-weight: bold;
        margin-left: 0rem;
        margin-right: 0.5rem;
    }

    #keebowner, .timeago {
        margin-top: 0rem;
    }

</style>
