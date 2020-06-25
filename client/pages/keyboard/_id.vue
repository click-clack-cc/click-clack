<template>
  <div>
    <b-modal
      id="keyboard-user-preview-modal"
      ref="keyboard-user-preview-modal"
      centered
      hide-header
      ok-only
    >
      <OtherUserDataPreview :inspected-user="keeb.owner" />
    </b-modal>
    <div class="keyboard-preview overflow-hidden">
      <b-col>
        <b-card id="carousel-card" no-body>
          <b-row id="carousel" cols="8">
            <b-carousel
              v-if="keeb.images.length > 1"
              fade
              img-height="500"
              img-width="1000"
              indicators
            >
              <b-carousel-slide
                v-for="(img, index) in keeb.images"
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
                v-for="(img, index) in keeb.images"
                :key="index"
                :img-src="img"
                :img-alt="altDesc"
              />
            </b-carousel>
          </b-row>
        </b-card>
        <b-card>
          <b-row>
            <b-col cols="4">
              <h1 style="font-size: 1.6rem;" class="keyboardcard-title">
                {{ keeb.name }}
              </h1>
            </b-col>

            <b-col cols="4" align="left" class="user-thumbnail">
              <b-avatar
                :src="`https://click-clack.cc:5000/files/images/${keeb.owner._id}.jpg`"
                badge-offset="-0.2rem"
                button
                class="avatar"
                size="2rem"
                variant="light"
                @click="previewUser(keeb.owner.id)"
              >
                <template v-if="keeb.owner.role == 'admin'" v-slot:badge>
                  <b-icon v-b-tooltip.right icon="shield-shaded" title="Administrator" />
                </template>
                <template v-else-if="keeb.owner.role == 'verified'" v-slot:badge>
                  <b-icon v-b-tooltip.right icon="check-circle" title="Verified user" />
                </template>
                <template v-else-if="keeb.owner.role == 'supporter'" v-slot:badge>
                  <b-icon v-b-tooltip.right icon="heart" title="Supporter" />
                </template>
                <template v-else-if="keeb.owner.role == 'betatester'" v-slot:badge>
                  <b-icon
                    v-b-tooltip.right
                    icon="egg"
                    title="I was there when it all started"
                  />
                </template>
                <template v-else-if="keeb.owner.role == 'developer'" v-slot:badge>
                  <b-icon v-b-tooltip.right icon="cup" title="Developer" />
                </template>
              </b-avatar>
              <b-link :href="`/u/${keeb.owner.id}`" class="name">
                {{ keeb.owner.firstname }} {{ keeb.owner.lastname }}
                <span class="text-muted"> @{{ keeb.owner.id }} </span>
              </b-link>
            </b-col>
            <b-col cols="4" align="right">
              <div class="timeago">
                <span class="text-muted">
                  {{ format(keeb.lastModified) }}
                </span>
              </div>
            </b-col>
          </b-row>
          <br>
          <b-row>
            <b-col cols="4" style="margin-left: 1rem">
              <p v-if="keeb.switches">
                <span style="font-weight: bold">Switches</span> {{ keeb.switches }}
              </p>
              <p v-if="keeb.keycaps">
                <span style="font-weight: bold">Keycaps</span> {{ keeb.keycaps }}
              </p>
              <p v-if="keeb.case">
                <span style="font-weight: bold">Case</span> {{ keeb.case }}
              </p>
              <p v-if="keeb.pcb">
                <span style="font-weight: bold">PCB</span> {{ keeb.pcb }}
              </p>
              <div style=" margin-top: 0.5rem">
                <b-icon
                  v-if="!hearted"
                  icon="heart"
                  style="cursor:pointer;"
                  @click="toggleHeart(keeb)"
                />
                <b-icon v-else icon="heart-fill" variant="primary" />
                {{ ' ' + keeb.hearts?keeb.hearts.length:0 }}
                <b-icon icon="chat-square" style="margin-left: 1rem" />
                {{ ' ' + keeb.comments?keeb.comments.length:0 }}
              </div>
            </b-col>
            <b-col>
              <a v-if="keeb.url" style="font-weight: bold" :href="keeb.url">
                {{ `Created by ${keeb.creatorName} - ${truncate(keeb.url, 30, false)}` }}
                <b-icon icon="link45deg" />
              </a>
              <br v-if="keeb.url">
              <br v-if="keeb.url">
              <div v-html="$md.render(keeb.description)" />
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
    <comment-list v-if="keeb.comments" :comments="keeb.comments" :user="user" />
  </div>
</template>

<script>
import { format } from 'timeago.js'
import Vue from 'vue'
import { mapState } from 'vuex'
import CommentList from '../../components/CommentList'
import OtherUserDataPreview from '../../components/OtherUserDataPreview'

export default {
	name: 'Keyboard',
	layout: 'index',
	components: {
		CommentList,
		OtherUserDataPreview
	},
	props: [],
	async asyncData ({ params, app }) {
		const keeb = await app.$services.keyboardService.getKeyboard(params.id)

		for (let j = 0; j < keeb.images.length; j++) {
			keeb.images[j] = `https://click-clack.cc:5000/files/images/${keeb.images[j]}`
		}
		if (keeb.comments) {
			keeb.comments = keeb.comments.reverse()
			for (let i = 0; i < keeb.comments.length; i++) {
				const res = await app.$services.userService.getUser(keeb.comments[i].submitter)
				keeb.comments[i].submitter = res
			}
		}
		const res = await app.$services.userService.getUser(keeb.owner)
		keeb.owner = res

		const description = keeb.name + ' built by ' + keeb.owner.firstname + ' ' +
                ((keeb.owner.lastname === null) ? ('') : (keeb.owner.lastname)) + ' @' + keeb.owner.id + ' Built with ' +
                keeb.switches + ', ' + keeb.keycaps + ', ' + keeb.pcb + ' and ' + keeb.case

		return {
			altDesc: description,
			keeb
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
			this.$bvModal.show('keyboard-user-preview-modal')
			Vue.prototype.$forceUpdate()
		},
		sendComment () {
			if (this.commentInput.length > 0) {
				this.$services.keyboardService.comment(this.user._id, this.keeb._id, this.commentInput, this.token).then(() => {
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
		toggleHeart (keeb) {
			if (!this.user) {
				this.$router.push('/profile')
			}
			this.$services.keyboardService.heart(this.user._id, this.keeb._id, this.token).then(() => {
				this.hearted = true
				this.keeb.hearts.push({
					submitter: this.user._id,
					createdAt: new Date()
				})
				this.$bvToast.toast(`Gave a ❤️ to ${this.owner.firstname} @${this.owner.id} `, {
					title: 'Success',
					toaster: 'b-toaster-top-center',
					variant: 'success'
				})
			}).catch(() => {
				this.$bvToast.toast('Failed to update keyboard', {
					title: 'Error',
					toaster: 'b-toaster-top-center',
					variant: 'danger'
				})
			})
		},
		checkIsHearted () {
			if (this.user && this.keeb.hearts) {
				for (let i = 0; i < this.keeb.hearts.length; i++) {
					if (this.keeb.hearts[i].submitter === this.user._id) {
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
		const k = this.keeb
		const description = k.name + ' built by ' + k.creatorName ? k.creatorName : k.owner.firstname + ' ' +
                ((k.owner.lastname === null) ? ('') : (k.owner.lastname)) + ' @' + k.owner.id + ' Built with ' +
                k.switches + ', ' + k.keycaps + ', ' + k.pcb + ' and ' + k.case
		const title = `${k.name} - Click-Clack`
		const image = k.images[0]
		const url = `https://click-clack.cc/keyboard/${k._id}`
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

    .keyboardcard-title {
        margin: 1rem;
        margin-left: 1rem;
        margin-top: 0;
    }

    .keyboard-preview {
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
