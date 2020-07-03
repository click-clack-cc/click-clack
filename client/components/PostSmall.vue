<template>
  <div id="container">
    <!--        {{post}}-->
    <b-card
      id="card"
      footer-tag="footer"
      header-tag="header"
      no-body
    >
      <template v-slot:header>
        <b-row>
          <a id="posttitle" style="cursor: pointer" @click="goToPost(post._id)">{{ post.title }}</a>
          <div v-if="showAuthor === true" id="postauthor">
            <span class="text-muted" />
            <a :href="`/u/${author.id}`"> {{ author.firstname }}
              <span class="text-muted"> @{{ author.id }} </span></a>
          </div>
          <div v-if="user &&(post.user === user._id)" id="post-edit-button">
            <b-button
              size="sm"
              style="margin-left: 1rem; margin-right: 1rem; border: none; margin-top: -.3rem"
              variant="outline-primary"
              @click="editPost(post._id)"
            >
              <b-icon icon="pencil-square" />
            </b-button>

            <b-button
              size="sm"
              style="border: none; margin-top: -.3rem"
              variant="outline-danger"
              @click="removePost(post._id)"
            >
              <b-icon icon="trash" />
            </b-button>
          </div>
          <b-col align="right">
            <span class="text-muted timeago">
              {{ format(post.createdAt) }}
            </span>
          </b-col>
        </b-row>
      </template>
      <b-carousel
        v-if="post.images && post.images.length > 1"
        id="carousel"
        v-model="post.slide"
        :interval="999999"
        controls
      >
        <a style="cursor: pointer" @click="goToPost(post._id)">
          <b-carousel-slide
            v-for="(img, index) in post.images"
            :key="index"
            :img-src="`https://media.click-clack.cc/images/${img}`"
          />
        </a>
      </b-carousel>
      <b-carousel
        v-else-if="post.images"
        id="carousel"
        v-model="post.slide"
        :interval="999999"
      >
        <a style="cursor: pointer" @click="goToPost(post._id)">
          <b-carousel-slide
            v-for="(img, index) in post.images"
            :key="index"
            :img-src="`https://media.click-clack.cc/images/${img}`"
          />
        </a>
      </b-carousel>
      <b-row>
        <b-col no-gutters>
          <div id="no-img-parts-list-container">
            <b-col class="post-info">
              <a v-if="post.url" style="font-weight: bold" :href="post.url"> {{ truncate(post.url, 30, false) }} <b-icon icon="link45deg" /> </a>
              <br v-if="post.url">
              <br v-if="post.url">
              <a :href="`/post/${[post._id]}`">
                <div v-html="$md.render(truncate(post.content,350,true))" />
              </a>
              <div style=" margin-top: 0.5rem">
                <svg
                  v-if="!hearted"
                  v-b-tooltip.top="`Like`"
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
                    v-b-tooltip.top="`Like`"
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
                <a :href="`/post/${[post._id]}`">
                  <b-icon icon="chat-square" scale="1.2" style="margin-left: 1rem; margin-top: 0.2rem; margin-bottom: -0.1rem; margin-right: 0.2rem" />
                  {{ ' ' + post.comments?post.comments.length:0 }}
                </a>
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

export default {
	name: 'PostSmall',
	components: {},
	props: [
		'user',
		'post',
		'token',
		'showAuthor',
		'author'
	],
	data () {
		return {
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
		},
		post: {
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
		goToPost (id) {
			this.$router.push(`/post/${id}`)
		},
		editPost (id) {
			this.$router.push(`/editpost/${id}`)
		},
		removePost () {
			this.$bvModal.msgBoxConfirm('Are you sure you want to remove this post?', {
				title: 'Removing post',
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
					this.$services.postService.deletePost(this.post.user, this.post._id).then(() => {
						this.$bvToast.toast('Post deleted successfully', {
							title: 'Success',
							toaster: 'b-toaster-top-center',
							variant: 'success'
						})
					}).catch(() => {
						this.$bvToast.toast('Failed to delete post', {
							title: 'Error',
							toaster: 'b-toaster-top-center',
							variant: 'danger'
						})
					})
				}
			})
		},
		toggleHeart (post) {
			if (!this.user) {
				this.$router.push('/profile')
			}
			this.$services.postService.heart(this.user._id, post._id, this.token).then(() => {
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
				this.$bvToast.toast('Failed heart post :(', {
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
		truncate (str, n, useWordBoundary) {
			if (!str) { return '' }
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
    .post-info {
        margin: 0;
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

    #post-edit-button {
        margin-right: 1rem;
    }

    .post-info {
        margin: 0;
    }

    #container {
        margin-top: 0;
    }
    #carousel {
        margin: auto;
        margin-bottom: 0.5rem;
    }

    #no-img-parts-list-container {
        margin: 0.5rem;
    }

    #posttitle {
        font-weight: bold;
        margin-left: 1rem;
        margin-right: 0.5rem;
    }

    .timeago {
        margin-top: 0;
    }
</style>
