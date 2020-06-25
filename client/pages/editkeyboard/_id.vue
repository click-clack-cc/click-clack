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
      <card
        v-for="(img, index) in keyboard.images"
        :key="index"
        class="photoPreview"
        style="max-width: 10rem; max-height: 10rem; margin: 0.5rem"
      >
        <img
          style="border-radius: 0.25rem; max-width: 10rem; max-height: 10rem; margin-bottom: 1rem"
          :src="'https://click-clack.cc:5000/files/images/'+img"
        >
        <b-button
          size="sm"
          variant="outline-danger"
          @click="keyboard.images.splice(index,1)"
        >
          <b-icon icon="trash" />
        </b-button>
      </card>
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
        <b-col>
          <b-form-group>
            <b-form-input
              v-model="keyboard.switches"
              autocomplete="off"
              placeholder="Switch and stab model"
              required
            />
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group>
            <b-form-input
              v-model="keyboard.keycaps"
              autocomplete="off"
              placeholder="Keycap set"
              required
            />
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group>
            <b-form-input
              v-model="keyboard.case"
              autocomplete="off"
              placeholder="Case and plate"
              required
            />
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group>
            <b-form-input

              v-model="keyboard.pcb"
              autocomplete="off"
              placeholder="PCB model"
              required
            />
          </b-form-group>
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

			if (this.keyboard.name.length > 200 ||
                    this.keyboard.description.length > 800 ||
                    this.keyboard.layout.length > 200 ||
                    this.keyboard.switches.length > 200 ||
                    this.keyboard.keycaps.length > 200 ||
                    this.keyboard.pcb.length > 200 ||
                    this.keyboard.case.length > 200) {
				this.$bvToast.toast('One of your fields is too long', {
					title: 'Warning',
					toaster: 'b-toaster-top-center',
					variant: 'danger'
				})
				return
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

			this.$services.keyboardService.newKeyboard(this.user._id, this.edit, this.keyboard, this.token).then(() => {
				if (this.photos) {
					if (this.photos.length > 0) {
						this.$services.fileService.uploadKeyboardImages(
							this.user._id,
							this.keyboard.name.replace(' ', '-').replace(/[^a-z0-9d-]/ig, '').toLowerCase(),
							this.keyboard.images.splice(this.keyboard.images.length - this.photos.length),
							this.photos,
							this.token
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
						}).catch(() => {
							this.loading = false
							this.$bvToast.toast('Failed to update keyboard', {
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
			}).catch((_) => {
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
		const image = 'https://click-clack.cc:5000/files/images/indeximage.JPG'
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
