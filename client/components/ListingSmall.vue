<template>
    <div id="container">
        <b-modal
            :id="`listing-edit-modal${listing._id}`"
            :ref="`listing-edit-modal${listing._id}`"
            centered
            title="Edit listing"
            @ok="handleListingOk"
        >
            <b-overlay :show="uploading" blur="0.2rem" opacity="1" variant="transparent">
                <form ref="form" @submit.stop.prevent="handleListingSubmit">
                    <b-form @submit="handleListingOk">
                        <b-form-group label="Build title">
                            <b-form-input
                                v-model="editListing.name"
                                disabled
                                placeholder="Enter name of this build"
                            />
                        </b-form-group>
                        <b-form-group label="Description">
                            <b-form-textarea
                                v-model="editListing.description"
                                max-rows="4"
                                placeholder="What makes your build special?"
                                required
                                rows="2"
                            />
                        </b-form-group>
                        <b-form-group label="Layout">
                            <b-form-select
                                v-model="editListing.layout"
                                :options="[{value: null, text: 'Please select a layout'}, 'sub 40', '40', '50', '60', '65', '75', '87', '1800', 'Full', 'Battlecruiser', 'Battleship', 'Other']"
                                required
                            />
                        </b-form-group>
                        <b-form-group label="Switches">
                            <b-form-input
                                v-model="editListing.switches"
                                placeholder="Enter switch type/model"
                                required
                            />
                        </b-form-group>
                        <b-form-group label="Keycap set">
                            <b-form-input
                                v-model="editListing.keycaps"
                                placeholder="Enter keycap set name"
                                required
                            />
                        </b-form-group>
                        <b-form-group label="Case">
                            <b-form-input
                                v-model="editListing.case"
                                placeholder="Enter case name"
                                required
                            />
                        </b-form-group>
                        <b-form-group label="PCB">
                            <b-form-input
                                v-model="editListing.pcb"
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
                        <div v-for="(img, index) in listing.images" :key="index" align="right">
                            <b-img
                                :src="`https://click-clack.cc:5000/files/images/${img}`"
                                style="width: 100%"
                            />
                            <b-button
                                style="width: 3rem; margin-top: -4rem; margin-right: 1rem; margin-bottom: 1rem"
                                variant="danger"
                                @click="removeListingImage(index)"
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
                    <a><h4 id="listingtitle" style="cursor: pointer" @click="goToListing(listing._id)">{{ listing.name }}</h4>
                    </a>
                    <div v-if="showOwner === true" id="listingowner">
                        <span class="text-muted">  by </span>
                        <a :href="`/u/${owner.id}`"> {{ owner.firstname }} {{ owner.lastname }}
                            <span class="text-muted"> @{{ owner.id }} </span></a>
                    </div>
                    <div v-if="showEdit === true" id="listing-edit-button">
                        <b-button
                            size="sm"
                            style="margin-left: 1rem; margin-right: 1rem"
                            variant="outline-primary"
                            @click="editExistingListing(listing)"
                        >
                            <b-icon icon="pencil-square" />
                        </b-button>

                        <b-button
                            size="sm"
                            variant="outline-danger"
                            @click="removeExistingListing(listing)"
                        >
                            <b-icon icon="trash" />
                        </b-button>
                    </div>
                    <b-col align="right">
            <span class="text-muted timeago">
              {{ format(listing.createdAt) }}
            </span>
                    </b-col>
                </b-row>
            </template>
            <b-carousel
                v-if="listing.images.length > 0"
                id="carousel"
                v-model="listing.slide"
                :interval="999999"
                background="#ababab"
                controls
                img-height="480"
                img-width="1024"
            >
                <b-carousel-slide
                    v-for="(img, index) in listing.images"
                    :key="index"
                    :img-src="`https://click-clack.cc:5000/files/images/${img}`"
                />
            </b-carousel>
            <b-row>
                <b-col no-gutters>
                    <div id="no-img-parts-list-container">
                        <b-col class="listing-info">
                            {{ truncate(listing.description,350,true) }}
                            <br>
                            <br>
                            <div style="">
                                    <span style="font-weight: bold; margin-right: 1rem">
                                      Switches
                                    </span>
                                    {{ listing.switches }} <br>
                                    <span style="font-weight: bold; margin-right: 1rem">
                                      Keycaps
                                    </span>
                                    {{ listing.keycaps }} <br>
                                    <span style="font-weight: bold; margin-right: 1rem">
                                      PCB
                                    </span>
                                    {{ listing.pcb }} <br>
                                    <span style="font-weight: bold; margin-right: 1rem">
                                      Case
                                    </span>
                                    {{ listing.case }} <br>
                            </div>
                            <br>
                            <div style="">
                                <b-icon
                                    v-if="!hearted"
                                    icon="heart"
                                    style="cursor:pointer;"
                                    @click="toggleHeart(listing)"
                                />
                                <b-icon v-else icon="heart-fill" variant="primary" />
                                {{ ' ' + listing.hearts?listing.hearts.length:0 }}
                                <b-icon icon="chat-square" style="margin-left: 1rem" />
                                {{ ' ' + listing.comments?listing.comments.length:0 }}
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
    import listingService from '../services/listing-service'
    import fileService from '../services/file-service'

    export default {
        name: 'Listing',
        components: {},
        props: [
            'user',
            'token',
            'listing',
            'showOwner',
            'showEdit',
            'owner'
        ],
        data () {
            return {
                editListing: this.listing,
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
            goToListing (id) {
                this.$router.push(`/listing/${id}`)
            },
            editExistingListing () {
                this.$bvModal.show(`listing-edit-modal${this.listing._id}`)
                // this.editListing = listing
            },
            removeExistingListing () {
                this.$bvModal.msgBoxConfirm('Are you sure you want to remove this listing?', {
                    title: 'Removing listing',
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
                        listingService.deleteListing(this.owner._id, this.editListing._id, this.token).then(() => {
                            this.$bvToast.toast('Listing deleted successfully', {
                                title: 'Success',
                                toaster: 'b-toaster-top-center',
                                variant: 'success'
                            })
                        }).catch(() => {
                            this.$bvToast.toast('Failed to delete listing', {
                                title: 'Error',
                                toaster: 'b-toaster-top-center',
                                variant: 'danger'
                            })
                        })
                    }
                })
            },
            handleListingOk (bvModalEvt) {
                bvModalEvt.preventDefault()
                this.handleListingSubmit()
            },
            handleListingSubmit () {
                if (!this.editListing.name ||
                    !this.editListing.description ||
                    !this.editListing.layout ||
                    !this.editListing.switches ||
                    !this.editListing.keycaps ||
                    !this.editListing.pcb ||
                    !this.editListing.case) {
                    this.$bvToast.toast('Please fill in every field to submit listing', {
                        title: 'Warning',
                        toaster: 'b-toaster-top-center',
                        variant: 'danger'
                    })
                    return
                }
                if (this.editListing.name.length < 1 ||
                    this.editListing.description.length < 1 ||
                    this.editListing.layout.length < 1 ||
                    this.editListing.switches.length < 1 ||
                    this.editListing.keycaps.length < 1 ||
                    this.editListing.pcb.length < 1 ||
                    this.editListing.case.length < 1) {
                    this.$bvToast.toast('Please fill in every field to submit listing', {
                        title: 'Warning',
                        toaster: 'b-toaster-top-center',
                        variant: 'danger'
                    })
                    return
                }
                if (this.editListing.name.length > 100 ||
                    this.editListing.description.length > 500 ||
                    this.editListing.layout.length > 100 ||
                    this.editListing.switches.length > 100 ||
                    this.editListing.keycaps.length > 100 ||
                    this.editListing.pcb.length > 100 ||
                    this.editListing.case.length > 100) {
                    this.$bvToast.toast('One of your fields is too long', {
                        title: 'Warning',
                        toaster: 'b-toaster-top-center',
                        variant: 'danger'
                    })
                    return
                }

                if (this.photos) {
                    if (this.photos.length > 0) {
                        if (!this.editListing.images) {
                            this.editListing.images = []
                        }
                        for (let i = 0; i < this.photos.length; i++) {
                            this.editListing.images.push(`${this.editListing.name.replace(' ', '-').replace(/[^a-z0-9d-]/ig, '').toLowerCase()}_${i + this.editListing.images.length}.${this.photos[i].name.split('.')[1]}`)
                        }
                    }
                }

                listingService.updateListing(this.owner._id, this.editListing, this.token).then(() => {
                    if (this.photos) {
                        if (this.photos.length > 0) {
                            this.uploading = true
                            console.log(this.editListing)
                            console.log(this.photos)
                            console.log(this.token)
                            fileService.uploadListingImages(
                                this.owner._id,
                                this.editListing.name.replace(' ', '-').replace(/[^a-z0-9d-]/ig, '').toLowerCase(),
                                this.editListing.images.splice(this.editListing.images.length - this.photos.length),
                                this.photos,
                                this.token
                            ).then(() => {
                                this.uploading = false
                                this.$bvToast.toast('Listing updated successfully', {
                                    title: 'Success',
                                    toaster: 'b-toaster-top-center',
                                    variant: 'success'
                                })
                                this.$nextTick(() => {
                                    this.$bvModal.hide(`listing-edit-modal${this.listing._id}`)
                                })
                            }).catch(() => {
                                this.uploading = false
                                this.$bvToast.toast('Failed to update listing', {
                                    title: 'Error',
                                    toaster: 'b-toaster-top-center',
                                    variant: 'danger'
                                })
                                this.$nextTick(() => {
                                    this.$bvModal.hide(`listing-edit-modal${this.listing._id}`)
                                })
                            })
                        }
                    } else {
                        this.$bvToast.toast('Listing updated successfully', {
                            title: 'Success',
                            toaster: 'b-toaster-top-center',
                            variant: 'success'
                        })
                    }
                }).catch((error) => {
                    console.log(error)
                    this.$bvToast.toast('Failed to update listing', {
                        title: 'Error',
                        toaster: 'b-toaster-top-center',
                        variant: 'danger'
                    })
                })
            },
            removeListingImage (img) {
                // console.log(img)
                // listingService.remove(this.user._id, img, token)
                this.editListing.images.splice(img, 1)
            },
            toggleHeart (listing) {
                if (!this.user) {
                    this.$router.push('/profile')
                }
                listingService.heart(this.user._id, listing._id, this.token).then(() => {
                    this.hearted = true
                    this.listing.hearts.push({
                        submitter: this.user._id,
                        createdAt: new Date()
                    })
                    this.$bvToast.toast(`Gave a ❤️ to ${this.owner.firstname} @${this.owner.id} `, {
                        title: 'Success',
                        toaster: 'b-toaster-top-center',
                        variant: 'success'
                    })
                }).catch(() => {
                    this.$bvToast.toast('Failed to update listing', {
                        title: 'Error',
                        toaster: 'b-toaster-top-center',
                        variant: 'danger'
                    })
                })
            },
            checkIsHearted () {
                if (this.user && this.listing.hearts) {
                    for (let i = 0; i < this.listing.hearts.length; i++) {
                        if (this.listing.hearts[i].submitter === this.user._id) {
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

    .listing-owner-thumbnal {
        margin-top: -1rem
    }

    .listing-info {
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

    #listingtitle {
        margin: 0.5rem;
        margin-top: 0;
        margin-bottom: 0;
    }

    #listingowner {
        margin-top: 0.2rem;
    }

    #listing-eddit-button {
        margin-left: 1rem;
    }

    .timeago {
    }
</style>
