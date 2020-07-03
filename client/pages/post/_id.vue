<template>
  <div>
    <b-modal
      id="post-user-preview-modal"
      ref="post-user-preview-modal"
      centered
      hide-header
      ok-only
    >
      <OtherUserDataPreview :inspected-user="post.author" />
    </b-modal>
    <div class="post-preview overflow-hidden">
      <b-col>
        <b-card v-if="post.images && post.images.length > 0" id="carousel-card" no-body>
          <b-row id="carousel" cols="8">
            <b-carousel
              v-if="post.images.length > 1"
              fade
              img-height="500"
              img-width="1000"
              indicators
            >
              <b-carousel-slide
                v-for="(img, index) in post.images"
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
                v-for="(img, index) in post.images"
                :key="index"
                :img-src="img"
                :img-alt="altDesc"
              />
            </b-carousel>
          </b-row>
        </b-card>
        <b-card>
          <b-row>
            <b-col cols="3">
              <h1 style="font-size: 1.6rem;" class="postcard-title">
                {{ post.title }}
              </h1>
            </b-col>

            <b-col cols="3" align="left" class="user-thumbnail">
              <b-avatar
                :src="`https://media.click-clack.cc/images/${post.author._id}.jpg`"
                badge-offset="-0.2rem"
                button
                class="avatar"
                size="2rem"
                variant="light"
                @click="previewUser(post.author.id)"
              >
                <template v-if="post.author.role.includes(`admin`)" v-slot:badge>
                  <b-icon v-b-tooltip.right icon="shield-shaded" title="Administrator" />
                </template>
              </b-avatar>
              <b-link :href="`/u/${post.author.id}`" class="name">
                {{ post.author.firstname }}
                <span class="text-muted"> @{{ post.author.id }} </span>
              </b-link>
            </b-col>
            <b-col cols="6" align="right">
              <div class="timeago">
                <span class="text-muted">
                  {{ format(post.lastModified) }}
                </span>
              </div>
            </b-col>
          </b-row>
          <br>
          <b-row>
            <b-col cols="3" style="margin-left: 1rem">
              <p v-if="post.switches">
                <span style="font-weight: bold">Switches</span> {{ post.switches }}
              </p>
              <p v-if="post.keycaps">
                <span style="font-weight: bold">Keycaps</span> {{ post.keycaps }}
              </p>
              <p v-if="post.case">
                <span style="font-weight: bold">Case</span> {{ post.case }}
              </p>
              <p v-if="post.pcb">
                <span style="font-weight: bold">PCB</span> {{ post.pcb }}
              </p>
              <div style=" margin-top: 0.5rem">
                <svg
                  v-if="!hearted"
                  v-b-tooltip.top="Like"
                  style="cursor:pointer;"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 1024 1024"
                  @click="toggleHeart(post)"
                >
                  <path
                    fill="none"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-miterlimit="4"
                    stroke-width="36"
                    stroke="currentColor"
                    d="M204.502 512.298v-22.598l22.598-13.085 28.548-34.49 34.49-16.649 55.903-103.477 128.461-35.683-2.378-60.659 9.514-7.135 2.378-14.27 23.791-7.135 24.977 15.463 36.876-10.706 17.841 16.649-1.193 52.339 191.499 98.721 24.977 95.157 28.548 17.841 16.649 40.44 28.548 17.841-3.571 30.926-36.876 11.892v30.926l-15.463 82.072-21.413 8.328-13.085-7.135-52.339 22.598-7.135 11.892-3.571 48.767 2.378-52.339-53.524 20.22-21.412 15.463h-23.791l-91.586 27.355-30.926-5.949-15.463 8.328-5.949 26.169-13.085-2.378-19.034-5.949-15.463-2.378-7.135-14.27-134.404-110.62-14.27-2.378-5.949-14.27-17.841-17.841-13.085-109.427z"
                  />
                  <path
                    fill="none"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-miterlimit="4"
                    stroke-width="36"
                    stroke="currentColor"
                    d="M264.174 546.657l190.082 140.459 24.39 10.936 27.751-4.206 329.697-110.176"
                  />
                  <path
                    fill="none"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-miterlimit="4"
                    stroke-width="36"
                    stroke="currentColor"
                    d="M422.292 382.645l110.176 68.963 140.459-41.212"
                  />
                  <path
                    fill="none"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-miterlimit="4"
                    stroke-width="36"
                    stroke="currentColor"
                    d="M562.751 391.9l-2.525-106.814"
                  />
                  <path
                    fill="none"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-miterlimit="4"
                    stroke-width="36"
                    stroke="currentColor"
                    d="M498.83 391.056l34.482-12.617-1.681-54.666"
                  />
                  <path
                    fill="none"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-miterlimit="4"
                    stroke-width="36"
                    stroke="currentColor"
                    d="M460.142 615.62l35.326 21.865c0 0 93.36-23.553 91.672-26.914s-23.553-118.587-23.553-118.587"
                  />
                  <path
                    fill="none"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-miterlimit="4"
                    stroke-width="36"
                    stroke="currentColor"
                    d="M730.117 454.141l24.39 103.452 57.191-14.298"
                  />
                  <path
                    fill="none"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-miterlimit="4"
                    stroke-width="36"
                    stroke="currentColor"
                    d="M314.634 514.693l113.544 77.375"
                  />
                </svg>
                <!--                                <b-icon-->
                <!--                                    v-if="!hearted"-->
                <!--                                    icon="heart"-->
                <!--                                    style="cursor:pointer;"-->
                <!--                                    @click="toggleHeart(keeb)"-->
                <!--                                />-->
                <span v-else class="text-primary">
                  <svg
                    v-b-tooltip.top="Like"
                    stroke="currentColor"
                    fill="currentColor"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 1024 1024"
                  >
                    <path
                      fill="none"
                      stroke-linejoin="round"
                      stroke-linecap="round"
                      stroke-miterlimit="4"
                      stroke-width="42"
                      d="M204.502 512.298v-22.598l22.598-13.085 28.548-34.49 34.49-16.649 55.903-103.477 128.461-35.683-2.378-60.659 9.514-7.135 2.378-14.27 23.791-7.135 24.977 15.463 36.876-10.706 17.841 16.649-1.193 52.339 191.499 98.721 24.977 95.157 28.548 17.841 16.649 40.44 28.548 17.841-3.571 30.926-36.876 11.892v30.926l-15.463 82.072-21.413 8.328-13.085-7.135-52.339 22.598-7.135 11.892-3.571 48.767 2.378-52.339-53.524 20.22-21.412 15.463h-23.791l-91.586 27.355-30.926-5.949-15.463 8.328-5.949 26.169-13.085-2.378-19.034-5.949-15.463-2.378-7.135-14.27-134.404-110.62-14.27-2.378-5.949-14.27-17.841-17.841-13.085-109.427z"
                    />
                    <path
                      fill="none"
                      stroke-linejoin="round"
                      stroke-linecap="round"
                      stroke-miterlimit="4"
                      stroke-width="42"
                      d="M264.174 546.657l190.082 140.459 24.39 10.936 27.751-4.206 329.697-110.176"
                    />
                    <path
                      fill="none"
                      stroke-linejoin="round"
                      stroke-linecap="round"
                      stroke-miterlimit="4"
                      stroke-width="42"
                      d="M422.292 382.645l110.176 68.963 140.459-41.212"
                    />
                    <path
                      fill="none"
                      stroke-linejoin="round"
                      stroke-linecap="round"
                      stroke-miterlimit="4"
                      stroke-width="42"
                      d="M562.751 391.9l-2.525-106.814"
                    />
                    <path
                      fill="none"
                      stroke-linejoin="round"
                      stroke-linecap="round"
                      stroke-miterlimit="4"
                      stroke-width="42"
                      d="M498.83 391.056l34.482-12.617-1.681-54.666"
                    />
                    <path
                      fill="none"
                      stroke-linejoin="round"
                      stroke-linecap="round"
                      stroke-miterlimit="4"
                      stroke-width="42"
                      d="M460.142 615.62l35.326 21.865c0 0 93.36-23.553 91.672-26.914s-23.553-118.587-23.553-118.587"
                    />
                    <path
                      fill="none"
                      stroke-linejoin="round"
                      stroke-linecap="round"
                      stroke-miterlimit="4"
                      stroke-width="42"
                      d="M730.117 454.141l24.39 103.452 57.191-14.298"
                    />
                    <path
                      fill="none"
                      stroke-linejoin="round"
                      stroke-linecap="round"
                      stroke-miterlimit="4"
                      stroke-width="42"
                      d="M314.634 514.693l113.544 77.375"
                    />
                  </svg>
                </span>
                <!--                                <b-icon v-else icon="heart-fill" variant="primary"/>-->
                {{ ' ' + post.hearts?post.hearts.length:0 }}
                <a>
                  <b-icon
                    icon="chat-square"
                    scale="1.2"
                    style="margin-left: 1rem; margin-top: 0.2rem; margin-bottom: -0.1rem; margin-right: 0.2rem"
                  />
                  {{ ' ' + post.comments?post.comments.length:0 }}
                </a>
              </div>
            </b-col>
            <b-col>
              <a v-if="post.url" style="font-weight: bold" :href="post.url">
                {{ truncate(post.url, 30, false) }}
                <b-icon icon="link45deg" />
              </a>
              <br v-if="post.url">
              <br v-if="post.url">
              <div v-html="$md.render(post.content)" />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </div>
    <b-input-group v-if="user" id="comment-input">
      <b-form-input v-model="commentInput" placeholder="Say something nice" />
      <template v-slot:append>
        <b-button append @click="sendComment">
          Send
        </b-button>
      </template>
    </b-input-group>
    <comment-list v-if="post.comments" id="comments" :comments="post.comments" :user="user" />
  </div>
</template>

<script>
import { format } from 'timeago.js'
import Vue from 'vue'
import { mapState } from 'vuex'
import CommentList from '../../components/CommentList'
import OtherUserDataPreview from '../../components/OtherUserDataPreview'

export default {
	name: 'Post',
	layout: 'index',
	components: {
		CommentList,
		OtherUserDataPreview
	},
	props: [],
	async asyncData ({ params, app }) {
		const post = await app.$services.postService.getPost(params.id)

		if (post.images) {
			for (let j = 0; j < post.images.length; j++) {
				post.images[j] = `https://media.click-clack.cc/images/${post.images[j]}`
			}
		} else {
			post.images = []
		}

		if (post.comments) {
			post.comments = post.comments.reverse()
			for (let i = 0; i < post.comments.length; i++) {
				post.comments[i].submitter = await app.$services.userService.getUser(post.comments[i].submitter)
			}
		} else {
			post.comments = []
		}

		if (!post.hearts) {
			post.hearts = []
		}

		post.author = await app.$services.userService.getUser(post.user)

		const description = post.title + ' by ' + post.author.firstname + ' @' + post.author.id + ' - ' +
				post.content

		return {
			altDesc: description,
			post
		}
	},
	data () {
		return {
			// loaded: false,
			userSelected: null,
			commentInput: '',
			hearted: false
		}
	},
	computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
	watch: {
		user: {
			immediate: true,
			handler () {
				this.checkIsHearted()
			}
		}
	},
	created () {
		this.checkIsHearted()
	},
	methods: {
		previewUser () {
			this.$bvModal.show('post-user-preview-modal')
			Vue.prototype.$forceUpdate()
		},
		sendComment () {
			if (this.commentInput.length > 0) {
				this.$services.postService.comment(this.user._id, this.post._id, this.commentInput, this.token).then(() => {
					this.$router.go()
				})
			} else {
				this.$bvToast.toast('Please enter some nice words.', {
					title: 'No empty comments',
					toaster: 'b-toaster-top-center'
				})
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
		toggleHeart (post) {
			if (!this.user) {
				this.$router.push('/profile')
			}
			this.$services.postService.heart(this.user._id, this.post._id, this.token).then(() => {
				this.hearted = true
				this.post.hearts.push({
					submitter: this.user._id,
					createdAt: new Date()
				})
				this.$bvToast.toast(`Gave a ❤️ to ${this.author.firstname} @${this.author.id} `, {
					title: 'Success',
					toaster: 'b-toaster-top-center',
					variant: 'success'
				})
			}).catch(() => {
				this.$bvToast.toast('Failed to update post', {
					title: 'Error',
					toaster: 'b-toaster-top-center',
					variant: 'danger'
				})
			})
		},
		checkIsHearted () {
			if (this.user && this.post.hearts) {
				for (let i = 0; i < this.post.hearts.length; i++) {
					if (this.post.hearts[i].submitter === this.user._id) {
						this.hearted = true
						return
					}
				}
			}
			this.hearted = false
		},
		format
	},
	head () {
		const k = this.post
		const description = k.title + ' by ' + k.author.firstname + ' @' + k.author.id + ' - ' +
				k.content
		const title = `${k.title} - Click-Clack`
		const image = k.images[0]
		const url = `https://click-clack.cc/post/${k._id}`
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

	.postcard-title {
		margin: 0 1rem 1rem;
	}

	.post-preview {
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.user-thumbnail {
		padding-left: 2rem;
	}

	.avatar {
		margin-top: -0.2rem;
		margin-right: 1rem;
	}

	.name {
	}

	.timeago {

	}

	#comment-input {
		width: 80%;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 1rem;
	}

	#carousel {
		overflow: hidden;
		margin: 0;
	}

	#carousel-card {
		margin-bottom: 1rem;
	}

</style>
