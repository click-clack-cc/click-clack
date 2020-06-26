<template>
  <div>
    <b-card id="container">
      <h4>
        {{ edit?"Update Post":"New Post" }}
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
      <b-card v-for="(img, index) in post.images" :key="index" class="photoPreview" style="max-width: 10rem; max-height: 10rem; margin: 0.5rem">
        <img style="border-radius: 0.25rem; max-width: 10rem; max-height: 10rem; margin-bottom: 1rem" :src="'https://click-clack.cc:5000/files/images/'+img">
        <b-button
          size="sm"
          variant="outline-danger"
          @click="post.images.splice(index,1)"
        >
          <b-icon icon="trash" />
        </b-button>
      </b-card>
      <br>
      <b-row>
        <b-col>
          <b-form-group label="Title">
            <b-form-input
              v-model="post.title"
              :disabled="edit"
              placeholder="Title of your post"
            />
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label="Source">
            <b-form-input
              v-model="post.url"
              placeholder="URL to link external content"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group label="Text">
            <b-textarea v-model="post.content" rows="4" placeholder="The content of your post" />
          </b-form-group>
          <b-form-checkbox v-model="preview" name="check-button" switch>
            Show Preview <p style="font-size: small">
              You can format your post using markdown. Learn about it <a
                style="font-size: small"
                href="/markdown"
              >here</a>.
            </p>
          </b-form-checkbox>
        </b-col>
        <b-col v-if="preview">
          Preview
          <div v-html="$md.render( post.content?post.content:``)" />
        </b-col>
      </b-row>
      <br>
      <b-button-group style="width: 100%">
        <b-button :disabled="loading" variant="primary" @click="submit">
          <span v-if="!loading">
            <b-icon icon="check-circle" />
            Submit
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
	name: 'EditPost',
	layout: 'index',
	components: {},
	props: [],
	async asyncData ({ params, app }) {
		if (params.id) {
			return {
				post: await app.$services.postService.getPost(params.id),
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
			post: {
				title: null,
				content: null,
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
			if (!this.post.content) {
				this.$bvToast.toast('Please enter some content for your post', {
					variant: 'danger',
					title: 'Error',
					toaster: 'b-toaster-top-center'
				})
				this.loading = false
				return
			} else if (!this.post.title) {
				this.$bvToast.toast('Please title your post', {
					variant: 'danger',
					title: 'Error',
					toaster: 'b-toaster-top-center'
				})
				this.loading = false
				return
			}
			if (this.photos) {
				if (this.photos.length > 0) {
					if (!this.post.images) {
						this.post.images = []
					}
					for (let i = 0; i < this.photos.length; i++) {
						this.post.images.push(`${this.post.title.replace(/ /g, '-').replace(/[^a-z0-9d-]/ig, '').toLowerCase()}_${i + this.post.images.length}.${this.photos[i].name.split('.')[1]}`)
					}
				}
			}

			this.$services.postService.updatePost(this.user._id, this.edit, {
				_id: this.post._id,
				title: this.post.title,
				url: this.post.url,
				content: this.post.content,
				images: this.post.images
			}, this.token).then(() => {
				if (this.photos) {
					if (this.photos.length > 0) {
						this.$services.fileService.uploadPostImages(
							this.user._id,
							this.post.title.replace(/ /g, '-').replace(/[^a-z0-9d-]/ig, '').toLowerCase(),
							this.post.images.splice(this.post.images.length - this.photos.length),
							this.photos,
							this.token
						).then(() => {
							this.$bvToast.toast('Post submitted successfully', {
								title: 'Success',
								toaster: 'b-toaster-top-center',
								variant: 'success'
							})
							this.loading = false
						}).catch((e) => {
							this.$bvToast.toast('Failed to submit post - ' + e, {
								title: 'Error',
								toaster: 'b-toaster-top-center',
								variant: 'danger'
							})
							this.loading = false
						})
					}
				} else {
					this.$bvToast.toast('Post submitted successfully', {
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
		const description = 'Submit a new post to click-clack!'
		const title = 'Click-Clack - ' + this.edit ? 'Update Post' : 'New Post'
		const image = 'https://click-clack.cc:5000/files/images/indeximage.JPG'
		const url = 'https://click-clack.cc/editpost'
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
    .photoPreview{
        margin-bottom: 1rem;
    }

    #container {
        margin-top: 3rem;
    }

</style>
