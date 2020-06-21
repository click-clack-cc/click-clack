<template>
    <div id="container">
        <div v-if="showEdit === true" id="listing-edit-button">
            <b-row>
                <b-col cols='4'>
                    <b-button
                        size="sm"
                        style="margin-left: 1rem; margin-right: 1rem; border: none"
                        variant="outline-primary"
                        @click="editListing(listing._id)"
                    >
                        <b-icon icon="pencil-square" />
                    </b-button>
                    <b-button
                        size="sm"
                        style='border: none'
                        variant="outline-danger"
                        @click="removeListing(listing._id)"
                    >
                        <b-icon icon="trash" />
                    </b-button>
                </b-col
                >
                <b-col  align='right'>
                <p v-b-tooltip.righttop title='Our moderator team is checking your listing' v-if='listing.state === "pending"'>
                    Awaiting approval <b-icon style='margin-left: 0.5rem' scale='1.2' icon='clock' variant='warning' ></b-icon>
                </p>
                <p v-b-tooltip.righttop title='Your listing has been approved and is public' v-if='listing.state === "approved"'>
                    Approved <b-icon style='margin-left: 0.5rem' scale='1.2' icon='check-circle' variant='success' ></b-icon>
                </p>
                <p v-b-tooltip.righttop title='We are sorry but your listing did not meet the listing requirements. If you have any questions feel free to contact our support team.' v-if='listing.state === "declined"'>
                    Declined <b-icon style='margin-left: 0.5rem' scale='1.2' icon='exclamation-triangle' variant='danger' ></b-icon>
                </p>
                </b-col>
            </b-row>
        </div>
        <b-card
            id="card"
            footer-tag="footer"
            header-tag="header"
            no-body
        >
            <template v-slot:header>
                <b-col>
                    <b-row>
                        <div style='margin-right: 1rem'>
                            <div v-if='listing.type === "sell"'>
                        <span class='text-muted'>
                            <b-icon v-b-tooltip.hover title='Selling' shift-v='-3' icon='box-arrow-up-right'></b-icon>
                        </span>
                            </div>
                            <div v-else>
                        <span class='text-muted'>
                            <b-icon v-b-tooltip.hover title='Buying' shift-v='-3' icon='box-arrow-in-down-right'></b-icon>
                        </span>
                            </div>
                        </div>
                        <a><h4 id="listingtitle" style="cursor: pointer" @click="goToListing(listing._id)">{{ listing.name }}</h4>
                        </a>
                    </b-row>
                   <b-col>
                       <div style='margin-left: 0.7rem' v-if="showOwner === true" id="listingowner">
                           <span class="text-muted">   </span>
                           <a :href="`/u/${owner.id}`"> {{ owner.firstname }} {{ owner.lastname }}
                               <span class="text-muted"> @{{ owner.id }} </span></a>
                           <span class="text-muted timeago">
                          {{ format(listing.createdAt) }}
                        </span>
                       </div>
                   </b-col>

                </b-col>
            </template>
            <b-carousel
                v-if="listing.images && listing.images.length > 1"
                id="carousel"
                v-model="listing.slide"
                :interval="999999"
                controls
            >
                <a style="cursor: pointer" @click="goToListing(listing._id)">
                    <b-carousel-slide
                        v-for="(img, index) in listing.images"
                        :key="index"
                        :img-src="`https://click-clack.cc:5000/files/images/${img}`"
                    />
                </a>
            </b-carousel>
            <b-carousel
                v-else-if='listing.images'
                id="carousel"
                v-model="listing.slide"
                :interval="999999"
            >
                <a style="cursor: pointer" @click="goToListing(listing._id)">
                    <b-carousel-slide
                        v-for="(img, index) in listing.images"
                        :key="index"
                        :img-src="`https://click-clack.cc:5000/files/images/${img}`"
                    />
                </a>
            </b-carousel>
            <b-row style='margin-top: 0.5rem'>
                <b-col style='margin-left: 2rem'>
                    <b-icon icon='geo-alt'></b-icon> {{(listing.location?getLocationName(this.listing.location):"International")+ (this.listing.location2?` - ${this.listing.location2}`:``)}}
                </b-col>
            </b-row>
            <b-row>
                <b-col no-gutters>
                    <div id="no-img-parts-list-container">
                        <a style="cursor: pointer" @click="goToListing(listing._id)">
                        <b-col class="listing-info">
                            {{ truncate(listing.description,350,true) }}
                        </b-col>
                        </a>
                    </div>
                </b-col>
            </b-row>

            <template v-slot:footer>
                <b-row>
                    <b-col cols='4' align='left' class="listing-info">
                        <span v-if='listing.shipping === "seller"'>
                            <b-icon v-b-tooltip.top title='Shipping is paid for by the seller or service provider' icon='box-seam'></b-icon> Free shipping
                        </span>
                    </b-col>
                    <b-col cols='4' align='middle' class="listing-info">
                        <span v-if='listing.condition === "new"'>
                            <b-icon v-b-tooltip.top title='This item has never been used' icon='gem'></b-icon> New
                        </span>
                    </b-col>
                    <b-col cols='4' align='right' style='font-weight: bold' class="listing-info">
                        <span v-if='listing.price>0'>
                            {{`$ ${listing.price}`}}
                        </span>
                        <span v-else>
                            <b-icon icon='gift'></b-icon> Free
                        </span>
                    </b-col>
                </b-row>
            </template>
        </b-card>
    </div>
</template>

<script>
    import { format } from 'timeago.js'
    import listingService from '../services/listing-service'

    export default {
        name: 'ListingSmall',
        components: {},
        props: [
            'user',
            'token',
            'listing',
            'showOwner',
            'showEdit',
            'owner'
        ],
        data() {
            return {
                locationOptions: [
                    {
                        value: 'africa',
                        text: 'Africa'
                    }, {
                        value: 'asia',
                        text: 'Asia'
                    }, {
                        value: 'central-america',
                        text: 'Central America'
                    }, {
                        value: 'eastern-europe',
                        text: 'Eastern Europe'
                    }, {
                        value: 'european-union',
                        text: 'European Union'
                    }, {
                        value: 'middle-east',
                        text: 'Middle East'
                    }, {
                        value: 'north-america',
                        text: 'North America'
                    }, {
                        value: 'oceania',
                        text: 'Oceania'
                    }, {
                        value: 'south-america',
                        text: 'South America'
                    }, {
                        value: 'the-caribbean',
                        text: 'The Caribbean'
                    }
                ],
            }
        },
        computed: {},
        watch: {
        },
        created () {
        },
        methods: {
            goToListing (id) {
                this.$router.push(`/listing/${id}`)
            },
            editListing (id) {
                this.$router.push(`/editlisting/${id}`)
            },
            removeListing () {
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
                        listingService.deleteListing(this.owner._id, this.listing._id, this.token).then(() => {
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
            getLocationName(locationID){
                for (let i = 0; i < this.locationOptions.length; i++) {
                    if(this.locationOptions[i].value === locationID) return this.locationOptions[i].text;
                }
                return ""
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
        margin-bottom: 0.5rem;
    }

    #carousel {
        margin: auto;
        margin-bottom: 1rem;
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

    #listing-edit-button {
        margin-right: 1rem;
    }

    .timeago {
    }
</style>
