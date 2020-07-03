<template>
  <div>
    <b-card id="container">
      <h4>
        {{ edit?"Update Keyboard":"New Keyboard" }}
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
      <b-card
        v-for="(img, index) in keyboard.images"
        :key="index"
        class="photoPreview"
        style="max-width: 10rem; max-height: 10rem; margin: 0.5rem"
      >
        <img
          style="border-radius: 0.25rem; max-width: 10rem; max-height: 10rem; margin-bottom: 1rem"
          :src="$config.imageBaseUrl + img"
        >
        <b-button
          size="sm"
          variant="outline-danger"
          @click="keyboard.images.splice(index,1)"
        >
          <b-icon icon="trash" />
        </b-button>
      </b-card>
      <br>
      <b-row>
        <b-col cols="6">
          <b-row>
            <b-col>
              <b-form-group>
                <b-form-input
                  v-model="keyboard.name"
                  placeholder="Title of build"
                />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group>
                <b-form-select
                  v-model="keyboard.layout"
                  :options="[{value: null, text: 'Layout'}, 'sub 40', '40', '50', '60', '65', '75', '87', '1800', 'Full', 'Battlecruiser', 'Battleship', 'Other']"
                  required
                />
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col>
          <b-row>
            <b-col cols="1" />
            <b-col align="right" cols="5">
              <p style="font-size: small; margin-top: 1rem">
                If you are submitting someone else's keyboard, please credit them.
              </p>
            </b-col>
            <b-col>
              <b-form-group>
                <b-form-input
                  v-model="keyboard.creatorName"
                  placeholder="Name of creator"
                />
              </b-form-group>
              <b-form-group>
                <b-form-input
                  v-model="keyboard.url"
                  placeholder="Source URL"
                />
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group label="Description">
            <b-textarea v-model="keyboard.description" rows="4" placeholder="Description of the keyboard" />
          </b-form-group>

          <b-form-checkbox v-model="preview" name="check-button" switch>
            Show Preview <p style="font-size: small">
              You can format your description using markdown. Learn about it <a
                style="font-size: small"
                href="/markdown"
              >here</a>.
            </p>
          </b-form-checkbox>
        </b-col>
        <b-col v-if="preview">
          Preview
          <div v-html="$md.render( keyboard.description?keyboard.description:``)" />
        </b-col>
      </b-row>
      <br>
      <p>
        Parts (optional)
      </p><p />
      <b-row id="extradetails">
        <b-col cols="4">
          <b-row>
            <b-col cols="2">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 1024 1024"
                fill="none"
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-miterlimit="4"
                stroke-width="36"
                stroke="currentColor"
              >
                <path d="M204.502 512.298v-22.598l22.598-13.085 28.548-34.49 34.49-16.649 55.903-103.477 128.461-35.683-2.378-60.659 9.514-7.135 2.378-14.27 23.791-7.135 24.977 15.463 36.876-10.706 17.841 16.649-1.193 52.339 191.499 98.721 24.977 95.157 28.548 17.841 16.649 40.44 28.548 17.841-3.571 30.926-36.876 11.892v30.926l-15.463 82.072-21.413 8.328-13.085-7.135-52.339 22.598-7.135 11.892-3.571 48.767 2.378-52.339-53.524 20.22-21.412 15.463h-23.791l-91.586 27.355-30.926-5.949-15.463 8.328-5.949 26.169-13.085-2.378-19.034-5.949-15.463-2.378-7.135-14.27-134.404-110.62-14.27-2.378-5.949-14.27-17.841-17.841-13.085-109.427z" />
                <path d="M264.174 546.657l190.082 140.459 24.39 10.936 27.751-4.206 329.697-110.176" />
                <path d="M422.292 382.645l110.176 68.963 140.459-41.212" />
                <path d="M562.751 391.9l-2.525-106.814" />
                <path d="M498.83 391.056l34.482-12.617-1.681-54.666" />
                <path d="M460.142 615.62l35.326 21.865c0 0 93.36-23.553 91.672-26.914s-23.553-118.587-23.553-118.587" />
                <path d="M730.117 454.141l24.39 103.452 57.191-14.298" />
                <path d="M314.634 514.693l113.544 77.375" />
              </svg>
            </b-col>
            <b-col>
              <b-form-group>
                <b-form-input
                  v-model="keyboard.switches"
                  autocomplete="off"
                  placeholder="Switches"
                  required
                />
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="4">
          <b-row>
            <b-col cols="2">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 1024 1024"
                fill="none"
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-miterlimit="4"
                stroke-width="36"
                stroke="currentColor"
              >
                <path d="M284.991 354.558l227.242 119.907c0 0 178.891-8.704 220.472-102.499l-221.439-114.104c0 0-109.269 65.754-226.275 96.699z" />
                <path d="M284.991 354.558l-79.293 222.406 277.524 174.058 29.009 6.77 26.109-2.901 291.062-135.378 2.901-29.009-99.6-218.538" />
                <path d="M519.001 515.079l-6.77 180.826" />
              </svg>
            </b-col>
            <b-col>
              <b-form-group>
                <b-form-input
                  v-model="keyboard.keycaps"
                  autocomplete="off"
                  placeholder="Keycaps"
                  required
                />
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="4">
          <b-row>
            <b-col cols="2">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 1024 1024"
                fill="none"
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-miterlimit="4"
                stroke-width="36"
                stroke="currentColor"
              >
                <path d="M36.864 499.961l171.757 179.785 788.155-245.593-197.439-150.887z" />
                <path d="M36.864 499.961l-9.632 104.337 36.918 25.682 16.049-4.812 125.207 115.574 783.336-252.017 8.028-54.578" />
                <path d="M147.618 535.275l643.685-192.626 8.028-59.391" />
                <path d="M791.303 342.649l89.892 60.995" />
                <path d="M221.462 527.247l43.342 51.362 468.72-150.887" />
              </svg>
            </b-col>
            <b-col>
              <b-form-group>
                <b-form-input
                  v-model="keyboard.case"
                  autocomplete="off"
                  placeholder="Case"
                  required
                />
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="4">
          <b-row>
            <b-col cols="2">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 1024 1024"
                fill="none"
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-miterlimit="4"
                stroke-width="36"
                stroke="currentColor"
              >
                <path
                  d="M57.946 357.789h911.669v297.811h-911.669v-297.811z"
                />
                <path d="M240.28 412.49l-127.633 189.93" />
                <path d="M347.585 412.868l-126.872 188.792" />
                <path d="M450.713 412.868l-126.683 188.792" />
                <path d="M561.443 412.49l-128.015 189.17" />
                <path d="M678.064 411.73l-127.633 189.93" />
                <path d="M795.063 411.73l-127.633 189.93" />
                <path d="M907.313 411.73l-127.633 189.93" />
                <path d="M60.984 603.937l718.697-2.277" />
                <path d="M240.28 412.49l727.814-1.521" />
              </svg>
            </b-col>
            <b-col>
              <b-form-group>
                <b-form-input
                  v-model="keyboard.pcb"
                  autocomplete="off"
                  placeholder="PCB"
                  required
                />
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="4">
          <b-row>
            <b-col cols="2">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 1024 1024"
                fill="none"
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-miterlimit="4"
                stroke-width="36"
                stroke="currentColor"
              >
                <path d="M756.85 306.398l-723.246 264.063 222.437 169.104 742.757-290.079z" />
                <path d="M93.442 579.566l165.202 123.577 517.719-201.623-162.6-109.267z" />
                <path d="M637.503 379.241l79.349 50.732 124.878-45.529-87.804-50.081z" />
                <path d="M811.484 487.858l-35.446-23.090 45.529-18.212-23.74-13.985 37.722-13.657 22.764 14.635 35.446-13.332 37.072 20.163z" />
              </svg>
            </b-col>
            <b-col>
              <b-form-group>
                <b-form-input
                  v-model="keyboard.plate"
                  autocomplete="off"
                  placeholder="Plate"
                  required
                />
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="4">
          <b-row>
            <b-col cols="2">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 1024 1024"
                fill="none"
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-miterlimit="4"
                stroke-width="36"
                stroke="currentColor"
              >
                <rect
                  y="369.70535"
                  x="165.25999"
                  height="282.8161"
                  width="132.88948"
                  style="fill:none;fill-opacity:1;stroke:#000000;stroke-width:44.9;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers;stroke-miterlimit:4;stroke-dasharray:none"
                />
                <rect
                  style="fill:none;fill-opacity:1;stroke:#000000;stroke-width:44.9;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill markers;stroke-miterlimit:4;stroke-dasharray:none"
                  width="132.88948"
                  height="282.8161"
                  x="701.92908"
                  y="369.70535"
                />
                <path d="M 231.70475,456.59465 V 214.66763 h 540.0765 v 240.2233" />
                <path d="m 165.64706,460.19764 h 134.3247" />
                <path d="M 163.23764,566.21176 H 299.97176" />
                <path d="m 702.94588,460.19764 h 134.3247" />
                <path d="M 700.53646,566.21176 H 837.27058" />
              </svg>
            </b-col>
            <b-col>
              <b-form-group>
                <b-form-input
                  v-model="keyboard.stabs"
                  autocomplete="off"
                  placeholder="Stabilizers"
                  required
                />
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-button-group style="width: 100%">
        <b-button :disabled="loading" variant="primary" @click="submit">
          <span v-if="!loading">
            <b-icon icon="check-circle" />
            Submit Keyboard
          </span>
          <b-spinner v-else />
        </b-button>
      </b-button-group>
    </b-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
	name: 'EditKeyboard',
	layout: 'index',
	components: {},
	props: [],
	async asyncData ({ params, app }) {
		if (params.id) {
			return {
				keyboard: await app.$services.keyboardService.getKeyboard(params.id),
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
			photos: null,
			preview: false,
			creditSwitch: true,
			creditName: null,
			creditUrl: null,
			keyboard: {
				name: null,
				description: null,
				layout: null,
				switches: null,
				keycaps: null,
				pcb: null,
				case: null,
				creatorName: null,
				images: [],
				plate: null,
				stabs: null,
				url: null
			},
			loading: false
		}
	},
	computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
	created () {
	},
	methods: {
		submit () {
			this.loading = true

			if (!this.keyboard.name) {
				this.$bvToast.toast('Please title your keyboard', {
					variant: 'danger',
					title: 'Error',
					toaster: 'b-toaster-top-center'
				})
				this.loading = false
				return
			}

			if (!this.keyboard.layout) {
				this.$bvToast.toast('Please select the layout of your keyboard', {
					variant: 'danger',
					title: 'Error',
					toaster: 'b-toaster-top-center'
				})
				this.loading = false
				return
			}

			if ((this.keyboard.creatorName === null) !== (this.keyboard.url === null)) {
				this.$bvToast.toast('Make sure to fill out both the creator name and source fields.', {
					title: 'Warning',
					toaster: 'b-toaster-top-center',
					variant: 'danger'
				})
			}

			if (this.photos) {
				if (this.photos.length > 0) {
					if (!this.keyboard.images) {
						this.keyboard.images = []
					}
					for (let i = 0; i < this.photos.length; i++) {
						this.keyboard.images.push(`${this.keyboard.name.replace(' ', '-').replace(/[^a-z0-9d-]/ig, '').toLowerCase()}_${i + this.keyboard.images.length}.${this.photos[i].name.split('.')[1]}`)
					}
				}
			}

			this.$services.keyboardService.updateKeyboard(this.user._id, this.edit, this.keyboard).then(() => {
				if (this.photos) {
					if (this.photos.length > 0) {
						this.$services.fileService.uploadKeyboardImages(
							this.user._id,
							this.keyboard.name.replace(' ', '-').replace(/[^a-z0-9d-]/ig, '').toLowerCase(),
							this.keyboard.images.splice(this.keyboard.images.length - this.photos.length),
							this.photos
						).then(() => {
							this.loading = false
							this.$bvToast.toast('Keyboard updated successfully', {
								title: 'Success',
								toaster: 'b-toaster-top-center',
								variant: 'success'
							})
							this.$nextTick(() => {
								this.$bvModal.hide(`keeb-edit-modal${this.keyboard._id}`)
							})
						}).catch((e) => {
							this.loading = false
							this.$bvToast.toast('Failed to update keyboard: ' + e, {
								title: 'Error',
								toaster: 'b-toaster-top-center',
								variant: 'danger'
							})
							this.$nextTick(() => {
								this.$bvModal.hide(`keeb-edit-modal${this.keyboard._id}`)
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
			}).catch(() => {
				this.$bvToast.toast('Failed to update keyboard', {
					title: 'Error',
					toaster: 'b-toaster-top-center',
					variant: 'danger'
				})
			})
			this.loading = false
			this.loaded = true
		}
	},
	head () {
		const description = 'Submit a new keyboard to click-clack!'
		const title = 'Click-Clack - ' + this.edit ? 'Update Keyboard' : 'New Keyboard'
		const image = this.$config.imageBaseUrl + 'indeximage.JPG'
		const url = 'https://click-clack.cc/editkeyboard'
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
	.photoPreview {
		margin-bottom: 1rem;
	}

	#container {
		margin-top: 3rem;
	}

	#extradetails {
		margin-top: 1rem;
		margin-bottom: 1rem;
	}
</style>
