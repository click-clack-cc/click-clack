<template>
    <div>
        <b-button
            variant="outline-primary"
            style="margin-right: 1rem"
            @click="sortBy('best')">
            <b-icon v-if="sortMethod === 'best'" icon="star-fill" />
            <b-icon v-else icon="star" />
            Best
        </b-button>
        <b-button
            variant="outline-primary"
            style="margin-right: 1rem"
            @click="sortBy('rising')">
            <b-icon v-if="sortMethod === 'rising'" icon="brightness-alt-high-fill" />
            <b-icon v-else icon="brightness-alt-high" />
            Rising
        </b-button>
        <b-button
            variant="outline-primary"
            @click="sortBy('new')">
            <b-icon v-if="sortMethod === 'new'" icon="egg-fill" />
            <b-icon v-else icon="egg" />
            New
        </b-button>
        <div v-if="listings">
            <ListingSmall
                v-for="(listing, index) in listings"
                :key="index"
                :keeb="listing"
                :owner="listing.userdata"
                :show-owner="true"
                :token="token"
                :user="user"
            >
                {{ keeb }}
            </ListingSmall>
        </div>
    </div>
</template>

<script>

    import { mapState } from 'vuex'
    import listingService from '../services/listing-service'
    import ListingSmall from '../components/ListingSmall'

    export default {
        name: 'Showroom',
        layout: 'index',
        components: {
            ListingSmall
        },
        props: [],
        data () {
            return {
                listings: null,
                sortMethod: 'best'
            }
        },
        computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
        created () {
            listingService.getNewListings(this.sortMethod).then((listings) => {
                this.listings = listings
                this.loaded = true
            })
        },
        methods: {
            sortBy (method) {
                this.sortMethod = method
                this.loaded = false
                // listingService.getNewListings(this.sortMethod).then((listings) => {
                //     this.listings = listings
                //     this.loaded = true
                // })
            }
        },
        head () {
            const description = 'List your items and services, buy mechanical keyboards from fellow enthusiasts!'
            const title = 'Click-Clack - Market'
            const image = 'https://click-clack.cc:5000/files/images/indeximage.JPG'
            const url = 'https://click-clack.cc/market'
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
    .listingcard {
        max-width: 50%;
    }

    .image {
        float: left;
        background-size: cover;
        background-repeat: no-repeat;
        margin: 1px;
        background-position: center center;
    }

    .listingcard-title {
        margin: 1rem;
        margin-bottom: 0rem;
    }

    .listing-preview {
        margin-top: 2rem;
        margin-bottom: 6rem;
    }

    .user-thumbnail {
        margin-top: 0.5rem;
    }

    .avatar {
        margin-left: 1rem;
    }

    .name {
        margin-left: 1rem;
        margin-top: 0.3rem;
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

</style>
