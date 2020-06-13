<template>
    <div id="container">
        <b-modal
            :id="`keeb-edit-modal${keeb._id}`"
            :ref="`keeb-edit-modal${keeb._id}`"
            centered
            title="Edit keyboard"
            @ok="handleKeebOk"
        >
            <b-overlay :show="uploading" blur="0.2rem" opacity="1" variant="transparent">
                <form ref="form" @submit.stop.prevent="handleKeebSubmit">
                    <b-form @submit="handleKeebOk">
                        <b-form-group label="Build title">
                            <b-form-input
                                v-model="editKeyboard.name"
                                disabled
                                placeholder="Enter name of this build"
                            />
                        </b-form-group>
                        <b-form-group label="Description">
                            <b-form-textarea
                                v-model="editKeyboard.description"
                                max-rows="4"
                                placeholder="What makes your build special?"
                                required
                                rows="2"
                            />
                        </b-form-group>
                        <b-form-group label="Layout">
                            <b-form-select
                                v-model="editKeyboard.layout"
                                :options="[{value: null, text: 'Please select a layout'}, 'sub 40', '40', '50', '60', '65', '75', '87', '1800', 'Full', 'Battlecruiser', 'Battleship', 'Other']"
                                required
                            />
                        </b-form-group>
                        <b-form-group label="Switches">
                            <b-form-input
                                v-model="editKeyboard.switches"
                                placeholder="Enter switch type/model"
                                required
                            />
                        </b-form-group>
                        <b-form-group label="Keycap set">
                            <b-form-input
                                v-model="editKeyboard.keycaps"
                                placeholder="Enter keycap set name"
                                required
                            />
                        </b-form-group>
                        <b-form-group label="Case">
                            <b-form-input
                                v-model="editKeyboard.case"
                                placeholder="Enter case name"
                                required
                            />
                        </b-form-group>
                        <b-form-group label="PCB">
                            <b-form-input
                                v-model="editKeyboard.pcb"
                                placeholder="Enter PCB type"
                                required
                            />
                        </b-form-group>
                        <b-form-group label="Photos">
                            <b-form-file
                                v-model="photos"
                                accept=".jpg, .jpeg, .png"
                                multiple
                            >
                                <template slot="file-name" slot-scope="{ names }">
                                    <b-badge variant="dark">
                                        {{ names[0] }}
                                    </b-badge>
                                    <b-badge v-if="names.length > 1" class="ml-1" variant="dark">
                                        + {{ names.length - 1 }} More files
                                    </b-badge>
                                </template>
                            </b-form-file>
                        </b-form-group>
                        <div v-for="(img, index) in keeb.images" :key="index" align="right">
                            <b-img
                                :src="`https://click-clack.cc:5000/files/images/${img}`"
                                style="width: 100%"
                            />
                            <b-button
                                style="width: 3rem; margin-top: -4rem; margin-right: 1rem; margin-bottom: 1rem"
                                variant="danger"
                                @click="removeKeyboardImage(index)"
                            >
                                <b-icon icon="trash" />
                            </b-button>
                        </div>
                    </b-form>
                </form>
            </b-overlay>
        </b-modal>
        <b-card
            id="card"
            footer-tag="footer"
            header-tag="header"
            no-body
        >
            <template v-slot:header>
                <b-row>
                    <a><h4 id="keebtitle" style="cursor: pointer" @click="goToKeyboard(keeb._id)">{{ keeb.name }}</h4>
                    </a>
                    <div v-if="showOwner === true" id="keebowner">
                        <span class="text-muted">  by </span>
                        <a :href="`/u/${owner.id}`"> {{ owner.firstname }} {{ owner.lastname }}
                            <span class="text-muted"> @{{ owner.id }} </span></a>
                    </div>
                    <div v-if="showEdit === true" id="keeb-edit-button">
                        <b-button
                            size="sm"
                            style="margin-left: 1rem; margin-right: 1rem"
                            variant="outline-primary"
                            @click="editExistingKeyboard(keeb)"
                        >
                            <b-icon icon="pencil-square" />
                        </b-button>

                        <b-button
                            size="sm"
                            variant="outline-danger"
                            @click="removeExistingKeyboard(keeb)"
                        >
                            <b-icon icon="trash" />
                        </b-button>
                    </div>
                    <b-col align="right">
            <span class="text-muted timeago">
              {{ format(keeb.createdAt) }}
            </span>
                    </b-col>
                </b-row>
            </template>
            <b-carousel
                v-if="keeb.images.length > 0"
                id="carousel"
                v-model="keeb.slide"
                :interval="999999"
                background="#ababab"
                controls
                img-height="480"
                img-width="1024"
            >
                <b-carousel-slide
                    v-for="(img, index) in keeb.images"
                    :key="index"
                    :img-src="`https://click-clack.cc:5000/files/images/${img}`"
                />
            </b-carousel>
            <b-row>
                <b-col no-gutters>
                    <div id="no-img-parts-list-container">
                        <b-col class="keeb-info">
                            {{ truncate(keeb.description,350,true) }}
                            <br>
                            <br>
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
                            <br>
                            <div style="">
                                <b-icon
                                    v-if="!hearted"
                                    icon="heart"
                                    style="cursor:pointer;"
                                    @click="toggleHeart(keeb)"
                                />
                                <b-icon v-else icon="heart-fill" variant="primary" />
                                {{ ' ' + keeb.hearts?keeb.hearts.length:0 }}
                                <b-icon icon="chat-square" style="margin-left: 1rem" />
                                {{ ' ' + keeb.comments?keeb.comments.length:0 }}
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
    import keyboardService from '../services/keyboard-service'
    import fileService from '../services/file-service'

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
        data () {
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
                handler () {
                    this.checkIsHearted()
                }
            }
        },
        created () {

        },
        methods: {
            goToKeyboard (id) {
                this.$router.push(`/keyboard/${id}`)
            },
            editExistingKeyboard () {
                this.$bvModal.show(`keeb-edit-modal${this.keeb._id}`)
                // this.editKeyboard = keeb
            },
            removeExistingKeyboard () {
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
            handleKeebOk (bvModalEvt) {
                bvModalEvt.preventDefault()
                this.handleKeebSubmit()
            },
            handleKeebSubmit () {
                if (!this.editKeyboard.name ||
                    !this.editKeyboard.description ||
                    !this.editKeyboard.layout ||
                    !this.editKeyboard.switches ||
                    !this.editKeyboard.keycaps ||
                    !this.editKeyboard.pcb ||
                    !this.editKeyboard.case) {
                    this.$bvToast.toast('Please fill in every field to submit keyboard', {
                        title: 'Warning',
                        toaster: 'b-toaster-top-center',
                        variant: 'danger'
                    })
                    return
                }
                if (this.editKeyboard.name.length < 1 ||
                    this.editKeyboard.description.length < 1 ||
                    this.editKeyboard.layout.length < 1 ||
                    this.editKeyboard.switches.length < 1 ||
                    this.editKeyboard.keycaps.length < 1 ||
                    this.editKeyboard.pcb.length < 1 ||
                    this.editKeyboard.case.length < 1) {
                    this.$bvToast.toast('Please fill in every field to submit keyboard', {
                        title: 'Warning',
                        toaster: 'b-toaster-top-center',
                        variant: 'danger'
                    })
                    return
                }
                if (this.editKeyboard.name.length > 100 ||
                    this.editKeyboard.description.length > 500 ||
                    this.editKeyboard.layout.length > 100 ||
                    this.editKeyboard.switches.length > 100 ||
                    this.editKeyboard.keycaps.length > 100 ||
                    this.editKeyboard.pcb.length > 100 ||
                    this.editKeyboard.case.length > 100) {
                    this.$bvToast.toast('One of your fields is too long', {
                        title: 'Warning',
                        toaster: 'b-toaster-top-center',
                        variant: 'danger'
                    })
                    return
                }

                if (this.photos) {
                    if (this.photos.length > 0) {
                        if (!this.editKeyboard.images) {
                            this.editKeyboard.images = []
                        }
                        for (let i = 0; i < this.photos.length; i++) {
                            this.editKeyboard.images.push(`${this.editKeyboard.name.replace(' ', '-').replace(/[^a-z0-9d-]/ig, '').toLowerCase()}_${i + this.editKeyboard.images.length}.${this.photos[i].name.split('.')[1]}`)
                        }
                    }
                }

                keyboardService.updateKeyboard(this.owner._id, this.editKeyboard, this.token).then(() => {
                    if (this.photos) {
                        if (this.photos.length > 0) {
                            this.uploading = true
                            console.log(this.editKeyboard)
                            console.log(this.photos)
                            console.log(this.token)
                            fileService.uploadKeyboardImages(
                                this.owner._id,
                                this.editKeyboard.name.replace(' ', '-').replace(/[^a-z0-9d-]/ig, '').toLowerCase(),
                                this.editKeyboard.images.splice(this.editKeyboard.images.length - this.photos.length),
                                this.photos,
                                this.token
                            ).then(() => {
                                this.uploading = false
                                this.$bvToast.toast('Keyboard updated successfully', {
                                    title: 'Success',
                                    toaster: 'b-toaster-top-center',
                                    variant: 'success'
                                })
                                this.$nextTick(() => {
                                    this.$bvModal.hide(`keeb-edit-modal${this.keeb._id}`)
                                })
                            }).catch(() => {
                                this.uploading = false
                                this.$bvToast.toast('Failed to update keyboard', {
                                    title: 'Error',
                                    toaster: 'b-toaster-top-center',
                                    variant: 'danger'
                                })
                                this.$nextTick(() => {
                                    this.$bvModal.hide(`keeb-edit-modal${this.keeb._id}`)
                                })
                            })
                        }
                    } else {
                        this.$bvToast.toast('Keyboard updated successfully', {
                            title: 'Success',
                            toaster: 'b-toaster-top-center',
                            variant: 'success'
                        })
                    }
                }).catch((error) => {
                    console.log(error)
                    this.$bvToast.toast('Failed to update keyboard', {
                        title: 'Error',
                        toaster: 'b-toaster-top-center',
                        variant: 'danger'
                    })
                })
            },
            removeKeyboardImage (img) {
                // console.log(img)
                // keyboardService.remove(this.user._id, img, token)
                this.editKeyboard.images.splice(img, 1)
            },
            toggleHeart (keeb) {
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
            checkIsHearted () {
                if (this.user && this.keeb.hearts) {
                    for (let i = 0; i < this.keeb.hearts.length; i++) {
                        if (this.keeb.hearts[i].submitter === this.user._id) {
                            this.hearted = true
                        }
                    }
                }
            },
            truncate (str, n, useWordBoundary) {
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

    #card {
        /*min-height: 25rem;*/
    }

    .name {
        margin-left: 1.2rem;
        margin-top: 0.5rem;
    }

    .user-thumbnail {
        margin-top: 0;
    }

    .keyboard-owner-thumbnal {
        margin-top: -1rem
    }

    .keeb-info {
        margin: 0rem;
    }

    #container {
        margin-top: 1rem;
    }

    #carousel {
        margin: auto;
        margin-top: 2rem;
        margin-bottom: 1rem;
        max-width: 40rem;
    }

    #no-img-parts-list-container {
        margin: 1rem;
    }

    #keebtitle {
        margin: 0.5rem;
        margin-top: 0;
        margin-bottom: 0;
    }

    #keebowner {
        margin-top: 0.2rem;
    }

    #keeb-eddit-button {
        margin-left: 1rem;
    }

    .timeago {
    }
</style>
