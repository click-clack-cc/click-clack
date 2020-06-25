<template>
  <div id="self-user-data-container">
    <b-modal
      id="message-modal"
      ref="message-modal"
      centered
      hide-header
      ok-title="Send"
      @ok="sendMessage"
    >
      <h5>
        Messaging user
      </h5>
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
            After sending the first message to {{ inspectedUser.firstname }} you can continue the conversation in your messages.
          </p>
        </b-col>
      </b-row>
      <b-form-input v-model="messageInput" :placeholder="`Say hi to ${inspectedUser.firstname}`" />
    </b-modal>
    <b-overlay :show="loading" blur="0.5rem" opacity="1" variant="transparent">
      <b-list-group style="margin-bottom: 1rem">
        <b-list-group-item>
          <b-row>
            <b-col align="left" cols="2">
              <b-avatar id="avatar" :src="img" size="4rem" variant="light">
                <template v-if="role == 'admin'" v-slot:badge>
                  <b-icon v-b-tooltip.right icon="shield-shaded" title="Administrator" />
                </template>
                <template v-else-if="role == 'verified'" v-slot:badge>
                  <b-icon v-b-tooltip.right icon="check-circle" title="Verified user" />
                </template>
                <template v-else-if="role == 'supporter'" v-slot:badge>
                  <b-icon v-b-tooltip.right icon="heart" title="Supporter" />
                </template>
                <template v-else-if="role == 'betatester'" v-slot:badge>
                  <b-icon
                    v-b-tooltip.right
                    icon="egg"
                    title="I was there when it all started"
                  />
                </template>
                <template v-else-if="role == 'developer'" v-slot:badge>
                  <b-icon v-b-tooltip.right icon="cup" title="Developer" />
                </template>
              </b-avatar>
            </b-col>
            <b-col id="name" align="left" cols="6">
              <h3>
                {{ userName }} <span v-if="showStarCount" style="font-size: 1.2rem; color: #ff7700">{{ recommendations.length }}<b-icon
                  icon="star-fill"
                  scale="0.8"
                /> </span>
                <p class="text-muted" style="font-size: 1.2rem">
                  {{ publicUserName }}
                </p>
              </h3>
            </b-col>
            <b-col v-if="showStarReportButtons" id="star-report-button-group" align="right" cols="4">
              <b-button-group>
                <b-button
                  variant="outline-primary"
                  size="sm"
                  @click="messageUser"
                >
                  <b-icon icon="envelope" /> Message
                </b-button>
              </b-button-group>
              <b-button-group>
                <b-button
                  id="star-button"
                  v-b-modal.recommendation-modal
                  :disabled="!canGiveStar"
                  size="sm"
                  variant="outline-primary"
                >
                  <b-icon icon="star-fill" />
                  Give Star
                </b-button>
                <b-button
                  id="report-button"
                  v-b-modal.report-modal
                  size="sm"
                  variant="outline-primary"
                >
                  <b-icon icon="flag" />
                </b-button>
              </b-button-group>
            </b-col>
            <b-modal
              v-if="user"
              id="recommendation-modal"
              ref="recommendation-modal"
              centered
              title="Recommendation"
              @ok="handleRecommendationOk"
            >
              <form ref="form" @submit.stop.prevent="handleRecommendationSubmit">
                You are giving 1
                <b-icon icon="star-fill" />
                to {{ inspectedUser.firstname }} for being a good person
                <br>
                <br>
                <b-form-group
                  label-for="recommendation-input"
                >
                  <b-form-textarea
                    id="recommendation-input"
                    v-model="editRecommendation"
                    max-rows="6"
                    placeholder="Say something nice about them, or leave this empty to just give them a star"
                    required
                    rows="4"
                  />
                </b-form-group>
              </form>
            </b-modal>
            <b-modal
              v-if="user"
              id="report-modal"
              ref="report-modal"
              centered
              title="Submit report"
              @ok="handleReportOk"
            >
              <form ref="form" @submit.stop.prevent="handleReportSubmit">
                <br>
                <b-form-group
                  label-for="report-input"
                >
                  <b-form-textarea
                    id="recommendation-input"
                    v-model="editReport"
                    max-rows="6"
                    placeholder="Please explain your reason for reporting this user"
                    required
                    rows="4"
                  />
                </b-form-group>
              </form>
            </b-modal>
          </b-row>
        </b-list-group-item>
        <b-list-group-item id="bio-container">
          <b-row>
            <b-col cols="10">
              <h5>
                Bio
              </h5>
            </b-col>
          </b-row>
          <b-row>
            <div id="bio" v-html="$md.render(bio)" />
          </b-row>
        </b-list-group-item>
      </b-list-group>

      <h5 v-if="inspectedUser.recommendations">
        Recommendations
      </h5>
      <recommendation-list v-if="inspectedUser" style="margin-bottom: 1rem" :inspected-user="inspectedUser" />

      <b-card v-if="keyboards && keyboards.length > 0" no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button v-b-toggle.keyboards-accordion block variant="light">
            {{ keyboards.length }} keyboard{{ keyboards.length>1?"s":"" }}
          </b-button>
        </b-card-header>
        <b-collapse id="keyboards-accordion" visible accordion="profile-accordion" role="tabpanel">
          <div id="keyboards" style="padding: 1rem">
            <b-row>
              <b-col cols="10">
                <h5>
                  Keyboards
                </h5>
              </b-col>
              <b-col align="right">
                <b-button
                  size="sm"
                  variant="outline-primary"
                  @click="$nuxt.$router.push('editkeyboard')"
                >
                  <b-icon icon="plus" />
                </b-button>
              </b-col>
            </b-row>
            <b-row>
              <b-col v-for="(keeb, index) in keyboards" :key="index" cols="6">
                <Keyboard
                  style="margin-bottom: 1rem"
                  :keeb="keeb"
                  :owner="inspectedUser"
                  :show-edit="false"
                  :show-owner="false"
                  :token="token"
                  :user="user"
                />
              </b-col>
            </b-row>
          </div>
        </b-collapse>
      </b-card>
      <b-card v-if="listings && listings.length > 0" no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button v-b-toggle.listings-accordion block variant="light">
            {{ listings.length }} market listing{{ listings.length>1?"s":"" }}
          </b-button>
        </b-card-header>
        <b-collapse id="listings-accordion" accordion="profile-accordion" role="tabpanel">
          <div id="listings" style="padding: 1rem">
            <b-row>
              <b-col cols="10">
                <h5>
                  Listings
                </h5>
              </b-col>
              <b-col align="right">
                <b-button
                  size="sm"
                  variant="outline-primary"
                  @click="$nuxt.$router.push('editlisting')"
                >
                  <b-icon icon="plus" />
                </b-button>
              </b-col>
            </b-row>
            <b-row>
              <b-col v-for="(listing, index) in listings" :key="index" cols="6">
                <ListingSmall
                  style="margin-bottom: 1rem"
                  :listing="listing"
                  :owner="inspectedUser"
                  :show-owner="true"
                  :token="token"
                  :user="user"
                  :show-edit="false"
                />
              </b-col>
            </b-row>
          </div>
        </b-collapse>
      </b-card>
      <b-card v-if="posts && posts.length > 0" no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button v-b-toggle.posts-accordion block variant="light">
            {{ posts.length }} post{{ posts.length>1?"s":"" }}
          </b-button>
        </b-card-header>
        <b-collapse id="posts-accordion" accordion="profile-accordion" role="tabpanel">
          <div id="posts" style="padding: 1rem">
            <b-row>
              <b-col cols="10">
                <h5>
                  Posts
                </h5>
              </b-col>
              <b-col align="right">
                <b-button
                  size="sm"
                  variant="outline-primary"
                  @click="$nuxt.$router.push('editpost')"
                >
                  <b-icon icon="plus" />
                </b-button>
              </b-col>
            </b-row>
            <b-row>
              <b-col v-for="(post, index) in posts" :key="index" cols="6">
                <PostSmall
                  style="margin-bottom: 1rem"
                  :post="post"
                  :author="inspectedUser"
                  :show-author="false"
                  :token="token"
                  :user="user"
                />
              </b-col>
            </b-row>
          </div>
        </b-collapse>
      </b-card>
    </b-overlay>
  </div>
</template>

<script>

import VueMeta from 'vue-meta'
import Vue from 'vue'
import Keyboard from './KeyboardSmall'
import ListingSmall from './ListingSmall'
import PostSmall from './PostSmall'
import RecommendationList from './RecommendationList'

Vue.use(VueMeta, {
	refreshOnceOnNavigation: true
})
export default {
	name: 'OtherUserData',
	components: {
		Keyboard,
		ListingSmall,
		PostSmall,
		RecommendationList
	},
	props: [
		'inspectedUser',
		'user',
		'token'
	],
	data () {
		return {
			img: this.img,
			userName: this.userName,
			email: this.email,
			bio: this.bio,
			role: this.role,
			keyboards: null,
			listings: null,
			posts: null,
			editBio: this.editBio,
			editKeebs: this.editKeebs,
			editBioState: null,
			loading: true,
			publicUserName: this.publicUserName,
			editRecommendation: this.editRecommendation,
			editReport: this.editReport,
			recommendations: null,
			showStarCount: false,
			canGiveStar: true,
			showStarReportButtons: false,
			messageInput: null
		}
	},
	watch: {
		inspectedUser: {
			immediate: true,
			handler () {
				this.loadUserData()
			}
		},
		user: {
			immediate: true,
			handler () {
				this.loadUserData()
			}
		}
	},
	created () {
		this.loadUserData()
	},
	methods: {
		loadUserData () {
			if (this.inspectedUser) {
				this.img = `https://click-clack.cc:5000/files/images/${this.inspectedUser._id}.jpg`
				this.userName = this.inspectedUser.firstname + (this.inspectedUser.lastname == null ? '' : (' ' + this.inspectedUser.lastname))
				this.publicUserName = `@${this.inspectedUser.id}`
				this.bio = this.inspectedUser.bio
				this.editBio = this.inspectedUser.bio
				this.role = this.inspectedUser.role
				if (this.inspectedUser.keyboards === null) {
					this.keyboards = []
				} else {
					this.keyboards = this.inspectedUser.keyboards
				}
				this.posts = this.inspectedUser.posts
				this.listings = this.inspectedUser.listings
				this.loading = false
				this.recommendations = this.inspectedUser.recommendations
				if (this.user) {
					if (this.user._id === this.inspectedUser._id) {
						this.canGiveStar = false
						this.showStarReportButtons = false
						this.canReport = false
					} else {
						this.showStarReportButtons = true
					}
				}

				if (!this.recommendations) {
					this.recommendations = []
				}
				if (this.recommendations.length > 0) {
					this.showStarCount = true
					if (this.user) {
						for (let i = 0; i < this.recommendations.length; i++) {
							if (this.recommendations[i].submitter === this.user._id) {
								this.canGiveStar = false
							}
						}
					}
				}
			}
		},
		handleRecommendationOk (bvModalEvt) {
			bvModalEvt.preventDefault()
			this.handleRecommendationSubmit()
		},
		checkRecommendationValidity () {
			if (this.editRecommendation) {
				if (this.editRecommendation.length > 200) {
					this.$bvToast.toast('Please make the recommendation less than 200 letters', {
						title: 'Error',
						toaster: 'b-toaster-top-center',
						variant: 'danger'
					})
					return false
				}
			}
			return true
		},
		handleRecommendationSubmit () {
			if (!this.checkRecommendationValidity()) {
				return
			}
			this.$services.userService.recommend(this.user._id, this.inspectedUser.id, this.editRecommendation, this.token).then(() => {
				this.$bvToast.toast('Thank you for your recommendation', {
					title: 'Success',
					toaster: 'b-toaster-top-center',
					variant: 'success'
				})
				this.$router.go()
			})

			this.$nextTick(() => {
				this.$bvModal.hide('bio-edit-modal')
			})
		},
		handleReportOk (bvModalEvt) {
			bvModalEvt.preventDefault()
			this.handleReportSubmit()
		},
		checkReportValidity () {
			if (this.editReport) {
				if (this.editReport.length > 500 || this.editReport.length < 50) {
					this.$bvToast.toast('Please make the recommendation 50 - 500 letters', {
						title: 'Error',
						toaster: 'b-toaster-top-center',
						variant: 'danger'
					})
					return false
				}
				return true
			} else {
				this.$bvToast.toast('Please make the recommendation 50 - 500 letters', {
					title: 'Error',
					toaster: 'b-toaster-top-center',
					variant: 'danger'
				})
				return false
			}
		},
		handleReportSubmit () {
			if (!this.checkReportValidity()) {
				return
			}
			this.$services.userService.report(this.user._id, this.inspectedUser.id, this.editReport, this.token).then(() => {
				this.$bvToast.toast('Thank you for your report', {
					title: 'Success',
					toaster: 'b-toaster-top-center',
					variant: 'success'
				})
				this.$router.go()
			})

			this.$nextTick(() => {
				this.$bvModal.hide('bio-edit-modal')
			})
		},
		messageUser () {
			if (this.user) { this.$bvModal.show('message-modal') } else { this.$router.push('/profile') }
		},
		sendMessage () {
			this.$services.messageService.sendMessage(this.user._id, this.inspectedUser._id, this.messageInput, this.token).then(() => {
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
		}
	},
	metaInfo () {
		if (!this.inspectedUser) {
			return {}
		} else {
			return {
				title: this.inspectedUser.firstname + ' ' + ((this.inspectedUser.lastname == null) ? '' : this.inspectedUser.lastname) + ' @' + this.inspectedUser.id,
				titleTemplate: '%s',
				htmlAttrs: {
					lang: 'en'
				},
				meta: [
					{
						name: 'description',
						content: this.inspectedUser.firstname + ' ' + ((this.inspectedUser.lastname == null) ? '' : this.inspectedUser.lastname) + ' @' + this.inspectedUser.id + ' - ' + this.inspectedUser.bio
					},
					{ name: 'robots', content: 'index,follow' },
					{ property: 'og:title', content: this.inspectedUser.userName + ' @' + this.inspectedUser.id },
					{ property: 'og:site_name', content: 'click-clack' },
					{ property: 'og:type', content: 'website' },
					{
						property: 'og:description',
						content: this.inspectedUser.userName + ' @' + this.inspectedUser.publicUserName + ' - ' + this.inspectedUser.bio
					},
					{ itemprop: 'name', content: this.inspectedUser.userName + ' @' + this.inspectedUser.id },
					{
						itemprop: 'description',
						content: this.inspectedUser.userName + ' @' + this.inspectedUser.publicUserName + ' - ' + this.inspectedUser.bio
					}
				]
			}
		}
	}
}
</script>

<style scoped>
    #self-user-data-container {
        width: 100%;
    }

    #avatar {
        margin-bottom: 1rem;
        margin-top: 0.5rem;
        position: absolute;
    }

    #name {
        margin-top: 0.5rem;
    }

    #bio-card {

    }

    #bio {
        margin: 1rem;
        margin-top: 0rem;
    }

    #edit-bio-button {
    }

    #keyboards {

    }

    #keeblist {
        margin-top: 1rem;
    }

    #star-report-button-group {
        margin-top: 0.5rem;
    }
</style>
