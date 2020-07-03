<template>
  <div>
    <b-card v-if="!success" id="container">
      <h4>
        {{ edit?"Update Listing":"New Listing" }}
      </h4>
      <br>
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
      <b-row>
        <b-col>
          <b-button-toolbar id="toolbar">
            <b-dropdown
              style="margin-right: 1rem"
              variant="outline-primary"
              left
              :text="listing.type?listing.type.text:'Looking for'"
            >
              <b-dropdown-item
                v-for="(type, index) in typeOptions"
                :key="index"
                @click="settype(type)"
              >
                {{ type.text }}
              </b-dropdown-item>
            </b-dropdown>
            <b-dropdown
              style="margin-right: 1rem"
              variant="outline-primary"
              left
              :text="listing.category1?listing.category1.text:'Category'"
            >
              <b-dropdown-item @click="setLocation(null)">
                Any
              </b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item
                v-for="(cat, index) in category1options1"
                :key="index"
                @click="setcategory1(cat)"
              >
                {{ cat.text }}
              </b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item
                v-for="(cat, index) in category1options2"
                :key="index"
                @click="setcategory1(cat)"
              >
                {{ cat.text }}
              </b-dropdown-item>
            </b-dropdown>
            <b-dropdown
              :disabled="!(listing.category1 && subcats[listing.category1.value])"
              style="margin-right: 1rem"
              variant="outline-primary"
              left
              :text="listing.category2?listing.category2.text:'Subcategory'"
            >
              <span v-if="listing.category1 && subcats[listing.category1.value]">
                <b-dropdown-item @click="setcategory2(null)">
                  Any
                </b-dropdown-item>
                <b-dropdown-divider />
                <b-dropdown-item
                  v-for="(subcat, index) in subcats[listing.category1.value]"
                  :key="index"
                  @click="setcategory2(subcat)"
                >
                  {{ subcat.text }}
                </b-dropdown-item>
              </span>
            </b-dropdown>
            <b-dropdown variant="outline-primary" left :text="listing.location?listing.location.text:'Region'">
              <b-dropdown-item @click="setLocation(null)">
                Globally
              </b-dropdown-item>
              <b-dropdown-divider />
              <b-dropdown-item
                v-for="(loc, index) in locationOptions"
                :key="index"
                @click="setLocation(loc)"
              >
                {{ loc.text }}
              </b-dropdown-item>
            </b-dropdown>
          </b-button-toolbar>
        </b-col>
        <b-col>
          <b-form-input
            v-model="listing.location2"
            :disabled="!listing.location"
            placeholder="Country, town (optional)"
          />
        </b-col>
      </b-row>

      <br>
      <br>
      <b-form-input v-model="listing.name" :disabled="edit" placeholder="Name" />
      <br>
      <b-textarea v-model="listing.description" placeholder="Description" />
      <br>
      <b-row class="text-muted">
        <b-col cols="1" align="middle">
          <b-icon scale="2" shift-v="-12" icon="info-circle" />
        </b-col>
        <b-col>
          <p>
            Please include a photo that shows all your items and your name on a written note next to them.
            This photo can be the last one, it is for us to validate your listing. If your item has a serial
            number, please include a photo of that too.
          </p>
        </b-col>
      </b-row>
      <card
        v-for="(img, index) in listing.images"
        :key="index"
        style="max-width: 10rem; max-height: 10rem; margin: 0.5rem"
      >
        <b-card-img
          style="max-width: 10rem; max-height: 10rem"
          :src="'https://media.click-clack.cc/images/'+img"
        />
        <b-button
          size="sm"
          variant="outline-danger"
          @click="listing.images.splice(index,1)"
        >
          <b-icon icon="trash" />
        </b-button>
      </card>
      <br v-if="listing.images && listing.images.length > 0">
      <br>
      <b-input-group>
        <b-input-group-prepend is-text>
          <!-- <b-form-checkbox
            v-model="listing.price === 0"
            :disabled="listing.price === 0"
            name="check-button"
            switch
            @change="freeCheck"
          >
            <b-icon v-if="listing.price !== 0" icon="gift" />
            <b-icon v-else icon="gift-fill" />
            Free
          </b-form-checkbox> -->
        </b-input-group-prepend>
        <b-input-group-prepend is-text>
          <b>US $</b>
        </b-input-group-prepend>
        <b-form-input v-model="listing.price" number placeholder="Price" />
      </b-input-group>
      <br>
      <b-form-checkbox v-model="listing.newItem" name="check-button" switch>
        New item
      </b-form-checkbox>
      <br>
      <b-form-checkbox v-model="listing.freeShipping" name="check-button" switch>
        Free shipping
      </b-form-checkbox>
      <br>
      <br>
      <b-button-group style="width: 100%">
        <b-button :disabled="loading" variant="primary" @click="submit">
          <span v-if="!loading">
            <b-icon icon="file-earmark-check" />
            Submit Listing
          </span>
          <b-spinner v-else />
        </b-button>
      </b-button-group>
    </b-card>
    <div v-else>
      <b-card style="max-width: 40rem; margin: auto; margin-top: 10rem">
        <h4>
          Listing submitted
          <b-icon icon="check-circle" variant="success" />
        </h4>
        {{ listing.name }} has been successfully submitted!
        It will remain invisible until our moderators verify your listing.
        <br>
        <br>
        <b-row class="text-muted">
          <b-col cols="2" align="middle">
            <b-icon scale="2" shift-v="-40" icon="info-circle" />
          </b-col>
          <b-col>
            <p>
              You can make changes to your listing while it is pending. Changes made
              after your listing has been approved will have to be approved again.
              Please note that if your listing is not appropriate, for example
              if you did not include a photo of your item with a written note of your name
              on it, it might be rejected.
            </p>
          </b-col>
        </b-row>
        <br>
      </b-card>
      <b-row style="max-width: 40rem; margin: auto; margin-top: 2rem">
        <b-col align="middle">
          <b-button to="/" variant="primary" style="margin: auto; ">
            Thank you
          </b-button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name: 'Showroom',
	layout: 'index',
	components: {},
	props: [],
	async asyncData ({ params, app }) {
		if (params.id) {
			return {
				listing: await app.$services.listingService.getListing(params.id),
				loaded: true,
				edit: true
			}
		}
		return {
			loaded: true,
			edit: false
		}
	},
	data () {
		return {
			success: false,
			photos: null,
			listing: {
				category1: null,
				name: null,
				category2: null,
				location: null,
				description: null,
				priceRangeEnabled: false,
				price: null,
				newItem: false,
				freeShipping: false,
				location2: null,
				type: {
					value: 'offering',
					text: 'Offering'
				}
			},
			typeOptions: [
				{
					value: 'looking',
					text: 'Looking for'
				}, {
					value: 'offering',
					text: 'Offering'
				}
			],
			category1options1: [
				{
					value: 'accessory',
					text: 'Accessory'
				}, {
					value: 'artisan',
					text: 'Artisan keycap'
				}, {
					value: 'cable',
					text: 'Cable'
				}, {
					value: 'case',
					text: 'Case'
				}, {
					value: 'keeb',
					text: 'Keyboard build'
				}, {
					value: 'keycaps',
					text: 'Keycap set'
				}, {
					value: 'pcb',
					text: 'PCB'
				}, {
					value: 'switches',
					text: 'Switches'
				}, {
					value: 'other',
					text: 'Other'
				}
			],
			category1options2: [
				{
					value: 'building',
					text: 'Building service'
				}, {
					value: 'modding',
					text: 'Modding/tuning service'
				}, {
					value: 'maintenance',
					text: 'Maintenance service'
				}
			],
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
			subcats: {
				accessory: [{
					value: 'carrycase',
					text: 'Carrying case'
				}, {
					value: 'deskmat',
					text: 'Deskmat'
				}, {
					value: 'puller',
					text: 'Keycap and switch puller'
				}, {
					value: 'other',
					text: 'Other accessory'
				}],
				case: [{
					value: 'sub40',
					text: 'Sub 40%'
				}, {
					value: '40',
					text: '40%'
				}, {
					value: '50',
					text: '50%'
				}, {
					value: '60',
					text: '60%'
				}, {
					value: '65',
					text: '65%'
				}, {
					value: '75',
					text: '75%'
				}, {
					value: '87',
					text: 'TKL'
				}, {
					value: '1800',
					text: '1800'
				}, {
					value: 'full',
					text: 'Full'
				}, {
					value: 'battlecruiser',
					text: 'Battlecruiser'
				}, {
					value: 'Battleship',
					text: 'Battleship'
				}, {
					value: 'other',
					text: 'Other'
				}],
				keeb: [{
					value: 'sub40',
					text: 'Sub 40%'
				}, {
					value: '40',
					text: '40%'
				}, {
					value: '50',
					text: '50%'
				}, {
					value: '60',
					text: '60%'
				}, {
					value: '65',
					text: '65%'
				}, {
					value: '75',
					text: '75%'
				}, {
					value: '87',
					text: 'TKL'
				}, {
					value: '1800',
					text: '1800'
				}, {
					value: 'full',
					text: 'Full'
				}, {
					value: 'battlecruiser',
					text: 'Battlecruiser'
				}, {
					value: 'Battleship',
					text: 'Battleship'
				}, {
					value: 'other',
					text: 'Other'
				}],
				pcb: [{
					value: 'sub40',
					text: 'Sub 40%'
				}, {
					value: '40',
					text: '40%'
				}, {
					value: '50',
					text: '50%'
				}, {
					value: '60',
					text: '60%'
				}, {
					value: '65',
					text: '65%'
				}, {
					value: '75',
					text: '75%'
				}, {
					value: '87',
					text: 'TKL'
				}, {
					value: '1800',
					text: '1800'
				}, {
					value: 'full',
					text: 'Full'
				}, {
					value: 'battlecruiser',
					text: 'Battlecruiser'
				}, {
					value: 'Battleship',
					text: 'Battleship'
				}, {
					value: 'other',
					text: 'Other'
				}],
				switches: [{
					value: 'clicky',
					text: 'Clicky'
				}, {
					value: 'linear',
					text: 'Linear'
				}, {
					value: 'tactile',
					text: 'Tactile'
				}]
			},
			sortMethod: 'new',
			loading: false
		}
	},
	computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
	created () {
		if (!this.listing.category1) { return }
		this.listing.category1 = this.getCategory1(this.listing.category1)
		this.listing.category2 = this.getCategory2(this.listing.category1.value, this.listing.category2)
		this.listing.location = this.getLocation(this.listing.location)
		this.listing.type = this.getType(this.listing.type)
		this.listing.newItem = this.listing.condition === 'new'
		this.listing.freeShipping = this.listing.shipping === 'seller'
	},
	methods: {
		freeCheck () {
			this.listing.price = 0
		},
		setcategory1 (cat) {
			this.listing.category1 = cat
		},
		setcategory2 (cat) {
			this.listing.category2 = cat
		},
		setLocation (loc) {
			this.listing.location = loc
			if (!loc) { this.location2 = loc }
		},
		settype (type) {
			this.listing.type = type
		},
		getLocation (loc) {
			for (let i = 0; i < this.locationOptions.length; i++) {
				if (this.locationOptions[i].value === loc) { return this.locationOptions[i] }
			}
			return null
		},
		getCategory1 (cat) {
			for (let i = 0; i < this.category1options1.length; i++) {
				if (this.category1options1[i].value === cat) { return this.category1options1[i] }
			}
			for (let i = 0; i < this.category1options2.length; i++) {
				if (this.category1options2[i].value === cat) { return this.category1options2[i] }
			}
			return cat
		},
		getCategory2 (cat1, cat2) {
			if (!this.subcats[cat1]) { return null }
			for (let i = 0; i < this.subcats[cat1].length; i++) {
				if (this.subcats[cat1][i].value === cat2) { return this.subcats[cat1][i] }
			}
			return null
		},
		getType (type) {
			for (let i = 0; i < this.typeOptions.length; i++) {
				if (this.typeOptions[i].value === type) { return this.typeOptions[i] }
			}
		},
		submit () {
			this.loading = true
			if (!this.listing.name) {
				this.$bvToast.toast('Please enter a name', {
					variant: 'danger',
					title: 'Error',
					toaster: 'b-toaster-top-center'
				})
				this.loading = false
				return
			} else if (!this.listing.category1) {
				this.$bvToast.toast('Please select a category', {
					variant: 'danger',
					title: 'Error',
					toaster: 'b-toaster-top-center'
				})
				this.loading = false
				return
			} else if (this.subcats[this.listing.category1.value] && !this.listing.category2) {
				this.$bvToast.toast('Please select a subcategory', {
					variant: 'danger',
					title: 'Error',
					toaster: 'b-toaster-top-center'
				})
				this.loading = false
				return
			} else if (!this.listing.description) {
				this.$bvToast.toast('Please enter a description for your listing', {
					variant: 'danger',
					title: 'Error',
					toaster: 'b-toaster-top-center'
				})
				this.loading = false
				return
			} else if ((this.listing.price === null) || (this.listing.price < 0 || this.listing.price > 1000000)) {
				this.$bvToast.toast('Please set a price', {
					variant: 'danger',
					title: 'Error',
					toaster: 'b-toaster-top-center'
				})
				this.loading = false
				return
			}
			if (this.photos) {
				if (this.photos.length > 0) {
					if (!this.listing.images) {
						this.listing.images = []
					}
					for (let i = 0; i < this.photos.length; i++) {
						this.listing.images.push(`${this.listing.name.replace(' ', '-').replace(/[^a-z0-9d-]/ig, '').toLowerCase()}_${i + this.listing.images.length}.${this.photos[i].name.split('.')[1]}`)
					}
				}
			}

			this.$services.listingService.newListing(this.user._id, this.edit, {
				_id: this.listing._id,
				name: this.listing.name,
				description: this.listing.description,
				category1: this.listing.category1.value,
				category2: this.listing.category2 ? this.listing.category2.value : null,
				location: this.listing.location ? this.listing.location.value : null,
				location2: this.listing.location2 ? this.listing.location2 : null,
				condition: this.listing.newItem ? 'new' : 'used',
				shipping: this.listing.freeShipping ? 'seller' : 'buyer',
				price: this.listing.price,
				type: this.listing.type === 'offering' ? 'sell' : 'buy',
				images: this.listing.images
			}, this.token).then(() => {
				if (this.photos) {
					if (this.photos.length > 0) {
						this.$services.fileService.uploadListingImages(
							this.user._id,
							this.listing.name.replace(' ', '-').replace(/[^a-z0-9d-]/ig, '').toLowerCase(),
							this.listing.images.splice(this.listing.images.length - this.photos.length),
							this.photos,
							this.token
						).then(() => {
							this.$bvToast.toast('Listing submitted successfully', {
								title: 'Success',
								toaster: 'b-toaster-top-center',
								variant: 'success'
							})
							this.success = true
							this.loading = false
						}).catch(() => {
							this.$bvToast.toast('Failed to submit listing', {
								title: 'Error',
								toaster: 'b-toaster-top-center',
								variant: 'danger'
							})
							this.loading = false
						})
					}
				} else {
					this.$bvToast.toast('Listing submitted successfully', {
						title: 'Success',
						toaster: 'b-toaster-top-center',
						variant: 'success'
					})
					this.success = true
					this.loading = false
				}
			}).catch((error) => {
				this.$bvToast.toast(error.response.statusText, {
					title: 'Error',
					toaster: 'b-toaster-top-center'
				})
				this.loading = false
			})
			this.loaded = true
		}
	},
	head () {
		const description = 'List your items and services, buy mechanical keyboards from fellow enthusiasts!'
		const title = 'Click-Clack - ' + this.edit ? 'Update Listing' : 'New Listing'
		const image = 'https://media.click-clack.cc/images/indeximage.JPG'
		const url = 'https://click-clack.cc/newlisting'
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
    #container {
        margin-top: 3rem;
    }
</style>
