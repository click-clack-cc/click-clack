<template>
  <div>
    <b-col>
      <br>
      <b-row>
        <b-col class="d-none d-lg-block" lg="4">
          <b-row>
            <b-col>
              <div align="right" style="margin: auto; width: 100%; margin-top: 4rem">
                <b-button
                  v-if="user"
                  block
                  pill
                  style="padding-left: 2rem; padding-right: 2rem;  margin-bottom: 2rem"
                  to="/editlisting"
                  variant="primary"
                >
                  <b-icon icon="file-plus" />
                  Add new listing
                </b-button>
                <b-button
                  v-else
                  block
                  style="padding-left: 2rem; padding-right: 2rem; margin-bottom: 2rem"
                  pill
                  to="/profile"
                  variant="primary"
                >
                  <b-icon icon="file-plus" />
                  Add new listing
                </b-button>
              </div>
            </b-col>
          </b-row>
          <b-card style="max-width: 600px">
            <b-form-input v-model="keywords" placeholder="Keywords" />
            <br>
            <b-input-group>
              <b-input-group-prepend is-text>
                <b-form-checkbox v-model="priceRangeEnabled" switch class="mr-n2">
                  <span class="sr-only">Switch for following text input</span>
                </b-form-checkbox>
              </b-input-group-prepend>
              <b-form-input v-model="minPrice" placeholder="Min. price" />
              <b-form-input v-model="maxPrice" placeholder="Max. price" />
            </b-input-group>
            <br>
            <b-button-toolbar id="toolbar">
              <b-dropdown
                class="m-2"
                variant="outline-primary"
                left
                :text="searchType?searchType.text:'Looking for'"
              >
                <b-dropdown-item
                  v-for="(type, index) in searchTypeOptions"
                  :key="index"
                  @click="setSearchType(type)"
                >
                  {{ index }}
                  {{ type.text }}
                </b-dropdown-item>
              </b-dropdown>
              <b-dropdown
                class="m-2"
                variant="outline-primary"
                left
                :text="location?location.text:'Location'"
              >
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
              <b-dropdown
                class="m-2"
                variant="outline-primary"
                left
                :text="cat1?cat1.text:'Category'"
              >
                <b-dropdown-item @click="setCat1(null)">
                  Any
                </b-dropdown-item>
                <b-dropdown-divider />
                <b-dropdown-item
                  v-for="(cat, index) in cat1options1"
                  :key="index"
                  @click="setCat1(cat)"
                >
                  {{ cat.text }}
                </b-dropdown-item>
                <b-dropdown-divider />
                <b-dropdown-item
                  v-for="(cat, index) in cat1options2"
                  :key="index + (cat1options1.length)"
                  @click="setCat1(cat)"
                >
                  {{ cat.text }}
                </b-dropdown-item>
              </b-dropdown>
              <b-dropdown
                :disabled="!(cat1 && subcats[cat1.value])"
                class="m-2"
                variant="outline-primary"
                left
                :text="cat2?cat2.text:'Subcategory'"
              >
                <span v-if="cat1 && subcats[cat1.value]">
                  <b-dropdown-item @click="setCat2(null)">
                    Any
                  </b-dropdown-item>
                  <b-dropdown-divider />
                  <b-dropdown-item
                    v-for="(subcat, index) in subcats[cat1.value]"
                    :key="index"
                    @click="setCat2(subcat)"
                  >
                    {{ subcat.text }}
                  </b-dropdown-item>
                </span>
              </b-dropdown>
            </b-button-toolbar>
            <br>

            <b-form-checkbox v-model="newOnly" name="check-button" switch>
              New items only
            </b-form-checkbox>
            <br>
            <b-form-checkbox v-model="freeShipping" name="check-button" switch>
              Free shipping
            </b-form-checkbox>
            <br>
            <br>
            <b-row>
              <b-col>
                <b-button-group style="width: 100%; margin-bottom: 1rem">
                  <b-button block variant="outline-primary" @click="filter">
                    <b-icon icon="search" />
                    Search
                  </b-button>
                </b-button-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-button-group style="width: 100%">
                  <b-button block variant="outline-primary" @click="$nuxt.$router.go()">
                    <b-icon icon="arrow-repeat" />
                    Reset
                  </b-button>
                </b-button-group>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
        <b-col lg="8" sm="12">
          <b-row align="center">
            <b-breadcrumb id="breadcrumb">
              <b-breadcrumb-item>
                <b-icon
                  style="margin-right: 0.5rem"
                  icon="shop-window"
                  scale="1.25"
                  shift-v="1.25"
                  aria-hidden="true"
                />
                Market
              </b-breadcrumb-item>
              <b-breadcrumb-item>
                {{ searchType.value===`looking`?`Looking to buy`:`Looking to sell` }}
              </b-breadcrumb-item>
              <b-breadcrumb-item v-if="location">
                {{ location.text }}
              </b-breadcrumb-item>
              <b-breadcrumb-item v-if="cat1">
                {{ cat1.text }}
              </b-breadcrumb-item>
              <b-breadcrumb-item v-if="cat2">
                {{ cat2.text }}
              </b-breadcrumb-item>
              <b-breadcrumb-item v-if="newOnly">
                New items
              </b-breadcrumb-item>
            </b-breadcrumb>
          </b-row>
          <b-card-group v-if="listings" columns style="column-count: 1">
            <ListingSmall
              v-for="(listing, index) in listings"
              :key="index"
              style="display: inline-block; width: 100%"
              :listing="listing"
              :owner="listing.userdata"
              :show-owner="true"
              :token="token"
              :user="user"
            />
          </b-card-group>
          <div v-if="listings && listings.length === 0">
            <br>
            <b-icon icon="x" scale="2" style="width: 100%; margin: auto" />
          </div>
        </b-col>
      </b-row>
    </b-col>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ListingSmall from '../components/ListingSmall'

export default {
	name: 'Market',
	layout: 'index',
	components: {
		ListingSmall
	},
	props: [],
	async asyncData ({ app }) {
		return {
			listings: await app.$services.listingService.getNewListings('new'),
			loaded: true
		}
	},
	data () {
		return {
			filtersVisible: true,
			cat1: null,
			cat2: null,
			location: null,
			keywords: null,
			priceRangeEnabled: false,
			minPrice: null,
			maxPrice: null,
			newOnly: false,
			freeShipping: false,
			searchType: {
				value: 'offering',
				text: 'Offering'
			},
			searchTypeOptions: [
				{
					value: 'looking',
					text: 'Looking for'
				}, {
					value: 'offering',
					text: 'Offering'
				}
			],
			cat1options1: [
				{
					value: 'accessory',
					text: 'Accessories'
				}, {
					value: 'artisan',
					text: 'Artisan keycaps'
				}, {
					value: 'cable',
					text: 'Cables'
				}, {
					value: 'case',
					text: 'Cases'
				}, {
					value: 'keeb',
					text: 'Keyboard builds'
				}, {
					value: 'keycaps',
					text: 'Keycap sets'
				}, {
					value: 'pcb',
					text: 'PCBs'
				}, {
					value: 'switches',
					text: 'Switches'
				}, {
					value: 'other',
					text: 'Other'
				}
			],
			cat1options2: [
				{
					value: 'building',
					text: 'Building services'
				}, {
					value: 'modding',
					text: 'Modding/tuning services'
				}, {
					value: 'maintenance',
					text: 'Maintenance services'
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
					text: 'Carrying cases'
				}, {
					value: 'deskmat',
					text: 'Deskmats'
				}, {
					value: 'puller',
					text: 'Keycap and switch pullers'
				}, {
					value: 'other',
					text: 'Other accessories'
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
			sortMethod: 'new'
		}
	},
	computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
	methods: {
		async sortBy (method) {
			this.sortMethod = method
			this.loaded = false
			this.listings = await this.$services.listingService.getNewListings(this.sortMethod)
			this.loaded = true
		},
		setCat1 (cat) {
			this.cat1 = cat
		},
		setCat2 (cat) {
			this.cat2 = cat
		},
		setLocation (loc) {
			this.location = loc
		},
		setSearchType (searchType) {
			this.searchType = searchType
		},
		async filter () {
			this.loaded = false
			this.minPrice = parseInt(this.minPrice)
			this.maxPrice = parseInt(this.maxPrice)
			if (isNaN(this.minPrice)) { this.minPrice = null }
			if (isNaN(this.maxPrice)) { this.maxPrice = null }
			this.listings = await this.$services.listingService.getFilteredListings({
				keywords: this.keywords,
				cat1: this.cat1 ? this.cat1.value : null,
				cat2: this.cat2 ? this.cat2.value : null,
				location: this.location ? this.location.value : null,
				minPrice: this.minPrice ? this.minPrice : 0,
				maxPrice: this.maxPrice ? this.maxPrice : 9999999,
				newOnly: this.newOnly,
				freeShipping: this.freeShipping,
				type: this.searchType.value
			})
			this.loaded = true
		}
	},
	head () {
		const description = 'List your items and services, buy used mechanical keyboards from fellow enthusiasts' +
                ' and browse their keyboard building and maintenance services!'
		const title = 'Click-Clack - Market - Used mechanical keyboards, accessories and services'
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
    #toolbar {
    }

    #breadcrumb {
        /*margin-left: auto;*/
        /*margin-right: auto;*/
        /*margin-top: 1rem;*/
        background-color: unset;
    }

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
        /*margin-top: 2rem;*/
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
