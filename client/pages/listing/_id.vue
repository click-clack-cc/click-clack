<template>
  <client-only>
    <div>
      <b-modal
        id="keyboard-user-preview-modal"
        ref="keyboard-user-preview-modal"
        centered
        hide-header
      >
        <OtherUserDataPreview :inspected-user="listing.userdata" />
      </b-modal>

      <b-modal
        id="message-modal"
        ref="message-modal"
        centered
        hide-header
        ok-title="Send"
        @ok="sendMessage"
      >
        <h4>
          Messaging advertiser
        </h4>
        <br>
        <b-row class="text-muted" style="margin-left: auto; margin-right:auto; margin-bottom: 1rem; max-width: 80%">
          <b-col cols="2" align="middle">
            <b-icon scale="1.4" shift-v="-45" icon="info-circle" />
          </b-col>
          <b-col style="font-size: small">
            <p>
              When contacting other users please make sure to follow our community guidelines - be respectful and kind.
            </p>
            <p>
              After sending the first message to {{ listing.userdata.firstname }} you can continue the conversation in your messages.
            </p>
          </b-col>
        </b-row>
        <b-form-input v-model="messageInput" :placeholder="`Say hi to ${listing.userdata.firstname}`" />
      </b-modal>

      <div class="keyboard-preview overflow-hidden">
        <b-col>
          <b-row v-if="listing.images" id="carousel" cols="8">
            <b-carousel
              v-if="listing.length > 1"
              fade
              img-height="500"
              img-width="1000"
              indicators
            >
              <b-carousel-slide
                v-for="(img, index) in listing.images"
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
                v-for="(img, index) in listing.images"
                :key="index"
                :img-src="img"
                :img-alt="altDesc"
              />
            </b-carousel>
          </b-row>
          <b-card>
            <b-row>
              <b-col cols="6">
                <b-row>
                  <div style="margin-right: 1rem; margin-left: 1rem">
                    <div v-if="listing.type === 'sell'">
                      <span class="text-muted">
                        <b-icon v-b-tooltip.hover shift-v="-3" title="Selling" icon="box-arrow-up-right" />
                      </span>
                    </div>
                    <div v-else>
                      <span class="text-muted">
                        <b-icon v-b-tooltip.hover shift-v="-3" title="Buying" icon="box-arrow-in-down-right" />
                      </span>
                    </div>
                  </div>
                  <a><h4 id="listingtitle">
                    {{ listing.name }}</h4>
                  </a>
                </b-row>
              </b-col>
              <b-col cols="4" align="right" class="user-thumbnail">
                <b-avatar
                  :src="`https://media.click-clack.cc/images/${listing.userdata._id}.jpg`"
                  badge-offset="-0.2rem"
                  button
                  class="avatar"
                  size="2rem"
                  variant="light"
                  @click="previewUser(listing.userdata.id)"
                >
                  <template v-if="listing.userdata.role == 'admin'" v-slot:badge>
                    <b-icon v-b-tooltip.right icon="shield-shaded" title="Administrator" />
                  </template>
                  <template v-else-if="listing.userdata.role == 'verified'" v-slot:badge>
                    <b-icon v-b-tooltip.right icon="check-circle" title="Verified user" />
                  </template>
                  <template v-else-if="listing.userdata.role == 'supporter'" v-slot:badge>
                    <b-icon v-b-tooltip.right icon="heart" title="Supporter" />
                  </template>
                  <template v-else-if="listing.userdata.role == 'betatester'" v-slot:badge>
                    <b-icon
                      v-b-tooltip.right
                      icon="egg"
                      title="I was there when it all started"
                    />
                  </template>
                  <template v-else-if="listing.userdata.role == 'developer'" v-slot:badge>
                    <b-icon v-b-tooltip.right icon="cup" title="Developer" />
                  </template>
                </b-avatar>
                <b-link :href="`/u/${listing.userdata.id}`" class="name">
                  {{ listing.userdata.firstname }} {{ listing.userdata.lastname }}
                  <span class="text-muted"> @{{ listing.userdata.id }} </span>
                </b-link>
              </b-col>
              <b-col cols="2" align="right">
                <div class="timeago">
                  <span class="text-muted">
                    {{ format(listing.createdAt) }}
                  </span>
                </div>
              </b-col>
            </b-row>
            <br>
            <b-row>
              <b-col style="margin-left: 1rem">
                <b-icon icon="geo-alt" /> {{ (listing.location?getLocationName(listing.location):"International")+ (listing.location2?` - ${listing.location2}`:``) }}
              </b-col>
            </b-row>
            <br>
            <b-row>
              <b-col no-gutters>
                <div id="no-img-parts-list-container">
                  <b-col class="listing-info">
                    <div v-html="$md.render(listing.description)" />
                  </b-col>
                </div>
              </b-col>
            </b-row>

            <template v-slot:footer>
              <b-row>
                <b-col cols="4" align="left" class="listing-info">
                  <span v-if="listing.shipping === 'seller'">
                    <b-icon v-b-tooltip.top title="Shipping is paid for by the seller or service provider" icon="box-seam" /> Free shipping
                  </span>
                </b-col>
                <b-col cols="4" align="middle" class="listing-info">
                  <span v-if="listing.state === 'new'">
                    <b-icon v-b-tooltip.top title="This item has never been used" icon="gem" /> New
                  </span>
                </b-col>
                <b-col cols="4" align="right" style="font-weight: bold" class="listing-info">
                  <span v-if="listing.price>0">
                    {{ `$ ${listing.price}` }}
                  </span>
                  <span v-else>
                    <b-icon icon="gift" /> Free
                  </span>
                </b-col>
              </b-row>
            </template>
          </b-card>
        </b-col>
      </div>
      <b-row>
        <b-col align="middle">
          <b-button @click="messageUser">
            <b-icon icon="envelope" /> Message {{ listing.userdata.firstname }}
          </b-button>
        </b-col>
      </b-row>
    </div>
  </client-only>
</template>

<script>
import { format } from 'timeago.js'
import Vue from 'vue'
import { mapState } from 'vuex'
import OtherUserDataPreview from '../../components/OtherUserDataPreview'

export default {
	name: 'Keyboard',
	layout: 'index',
	components: {
		OtherUserDataPreview
	},
	props: [],
	async asyncData ({ params, app }) {
		const listing = await app.$services.listingService.getListing(params.id)
		if (listing.images) {
			for (let j = 0; j < listing.images.length; j++) {
				listing.images[j] = `https://media.click-clack.cc/images/${listing.images[j]}`
			}
		}
		const userdata = await app.$services.userService.getUser(listing.user)
		listing.userdata = userdata
		const description = ''
		return {
			altDesc: description,
			listing
		}
	},
	data () {
		return {
			userSelected: null,
			commentInput: '',
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
			]
		}
	},
	computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
	created () {
	},
	methods: {
		previewUser () {
			this.$bvModal.show('keyboard-user-preview-modal')
			Vue.prototype.$forceUpdate()
		},
		getLocationName (locationID) {
			for (let i = 0; i < this.locationOptions.length; i++) {
				if (this.locationOptions[i].value === locationID) { return this.locationOptions[i].text }
			}
			return ''
		},
		messageUser () {
			if (this.user) { this.$bvModal.show('message-modal') } else { this.$router.push('/profile') }
		},
		sendMessage () {
			this.$services.messageService.sendMessage(this.user._id, this.listing.user, this.messageInput, this.token).then(() => {
				this.$bvToast.toast('Message sent', {
					title: 'Success',
					variant: 'success',
					toaster: 'b-toaster-top-center'
				})
			}).catch((error) => {
				this.$bvToast.toast(error.response.statusText, {
					title: 'Error',
					variant: 'danger',
					toaster: 'b-toaster-top-center'
				})
			})
		},
		format
	},
	head () {
		const k = this.listing
		const description = ''
		const title = `${k.name} - Click-Clack`
		let image = 'https://media.click-clack.cc/images/indeximage.JPG'
		if (k.images) {
			image = k.images[0]
		}
		const url = `https://click-clack.cc/listing/${k._id}`
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
        margin-left: 1rem;
        margin-right: 1rem;
    }

    #carousel {
        margin-bottom: 2rem;
    }

</style>
