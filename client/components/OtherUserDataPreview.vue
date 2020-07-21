<template>
  <div id="self-user-data-container">
    <b-overlay :show="loading" blur="0.5rem" opacity="1" variant="transparent">
      <b-list-group v-if="inspectedUser">
        <b-list-group-item>
          <b-row>
            <b-col align="left" cols="3">
              <b-avatar id="avatar" :src="img" size="4rem" variant="light">
                <template v-if="role.includes('admin')" v-slot:badge>
                  <b-icon v-b-tooltip.right icon="shield-shaded" title="Administrator" />
                </template>
              </b-avatar>
            </b-col>
            <b-col id="name" align="left">
              <h2>
                {{ userName }} <span v-if="showStarCount" style="font-size: 1.2rem; color: #ff7700">{{ recommendations.length }}<b-icon
                  icon="star-fill"
                  scale="0.8"
                /> </span>
                <p class="text-muted" style="font-size: 1.2rem">
                  {{ publicUserName }}
                </p>
              </h2>
            </b-col>
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
        <b-list-group-item v-if="inspectedUser.role && inspectedUser.role.length > 0">
          <b-row>
            <b-col
              v-if="inspectedUser.role.includes('admin')"
              align="middle"
              cols="3"
              style="margin-bottom: 0rem"
            >
              <b-icon
                v-b-tooltip.bottom
                scale="1.4"
                icon="shield-shaded"
                title="Administrator"
              />
            </b-col>
            <b-col
              v-if="inspectedUser.role.includes('developer')"
              align="middle"
              cols="3"
              style="margin-bottom: 0rem"
            >
              <b-icon
                v-b-tooltip.bottom
                scale="1.4"
                icon="cup"
                title="Developer"
              />
            </b-col>
            <b-col
              v-if="inspectedUser.role.includes('verified')"
              align="middle"
              cols="3"
              style="margin-bottom: 0rem"
            >
              <b-icon
                v-b-tooltip.bottom
                scale="1.4"
                icon="check-circle"
                title="Verified user"
              />
            </b-col>
            <b-col
              v-if="inspectedUser.role.includes('partner')"
              align="middle"
              cols="3"
              style="margin-bottom: 0rem"
            >
              <b-icon
                v-b-tooltip.bottom
                scale="1.4"
                icon="people"
                title="Click-Clack Partner"
              />
            </b-col>
            <b-col
              v-if="inspectedUser.role.includes('supporter')"
              align="middle"
              cols="3"
              style="margin-bottom: 0rem"
            >
              <b-icon
                v-b-tooltip.bottom
                scale="1.4"
                icon="heart"
                title="Supporter"
              />
            </b-col>
            <b-col
              v-if="inspectedUser.role.includes('betatester')"
              align="middle"
              cols="3"
              style="margin-bottom: 0rem"
            >
              <b-icon
                v-b-tooltip.bottom
                scale="1.4"
                icon="egg"
                title="Beta tester - I was there when it all started"
              />
            </b-col>
          </b-row>
        </b-list-group-item>
        <b-list-group-item>
          <b-row>
            <b-col align="middle">
              <span>{{ (inspectedUser.postHearts + inspectedUser.keyboardHearts) }} <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
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
              </svg></span>
            </b-col>
            <b-col align="middle">
              <span> {{ inspectedUser.postsNum }} Posts</span>
            </b-col>
            <b-col align="middle">
              <span>  {{ inspectedUser.keyboardsNum }} Keebs</span>
            </b-col>
          </b-row>
        </b-list-group-item>
        <b-list-group-item v-if="inspectedUser.id !== user.id">
          <b-row no-gutters class="text-muted" style="font-size: x-small">
            <b-col>
              <span>
                Member since {{ dateformat(inspectedUser.createdAt, "mmmm dS, yyyy") }}<br>
                Last active {{ dateformat(inspectedUser.lastLogIn, "mmmm dS, yyyy") }}
              </span>
            </b-col>
          </b-row>
        </b-list-group-item>
        <b-list-group-item v-if="inspectedUser.id === user.id">
          <b-button size="sm" @click="$nuxt.$router.push(`profile`)">
            My Profile
          </b-button>
          <b-button size="sm" @click="$nuxt.$router.push(`messages`)">
            Messages
          </b-button>
          <b-button size="sm" style="margin-left: 1px" variant="danger" @click="signOut">
            Sign Out
          </b-button>
        </b-list-group-item>
        <b-list-group-item v-if="inspectedUser.id !== user.id" id="bio-container">
          <b-row>
            <b-col cols="10">
              <h4>
                Bio
              </h4>
            </b-col>
          </b-row>
          <b-row>
            <p id="bio">
              {{ bio }}
            </p>
          </b-row>
        </b-list-group-item>
        <!--                <b-list-group-item id="keyboards">-->
        <!--                    <b-row>-->
        <!--                        <b-col cols="10">-->
        <!--                            <h4>-->
        <!--                                Keyboards-->
        <!--                            </h4>-->
        <!--                        </b-col>-->
        <!--                    </b-row>-->
        <!--                    <div v-if="keyboards && keyboards.length > 0">-->
        <!--                        &lt;!&ndash;                        <b-list-group id="keeblist">&ndash;&gt;-->
        <!--                        &lt;!&ndash;                            <b-list-group-item v-bind:key="keeb" v-for="keeb in keyboards">{{keeb}}</b-list-group-item>&ndash;&gt;-->
        <!--                        &lt;!&ndash;                        </b-list-group>&ndash;&gt;-->
        <!--                        <Keyboard :showOwner="false" :keeb="keeb" :owner="inspectedUser" v-for="(keeb, index) in keyboards" v-bind:key="index"></Keyboard>-->
        <!--                    </div>-->
        <!--                </b-list-group-item>-->
      </b-list-group>
    </b-overlay>
  </div>
</template>

<script>
// import Keyboard from "./KeyboardSmall"

import { mapState } from 'vuex'
import dateformat from 'dateformat'

export default {
	name: 'OtherUserDataPreview',
	components: {
		// Keyboard
	},
	props: [
		'inspectedUser'
	],
	data () {
		return {
			img: this.img,
			userName: this.userName,
			email: this.email,
			bio: this.bio,
			role: this.role,
			keyboards: this.keyboards,
			loading: true,
			publicUserName: this.publicUserName,
			editRecommendation: this.editRecommendation,
			editReport: this.editReport,
			recommendations: [],
			showStarCount: false,
			canGiveStar: true,
			showStarReportButtons: false
		}
	},
	computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
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
				this.img = this.$config.imageBaseUrl + this.inspectedUser._id + '.jpg'
				this.userName = this.inspectedUser.firstname + (this.inspectedUser.lastname == null ? '' : (' ' + this.inspectedUser.lastname))
				this.publicUserName = `@${this.inspectedUser.id}`
				this.bio = this.inspectedUser.bio
				this.editBio = this.inspectedUser.bio
				this.keyboards = this.inspectedUser.keyboards
				this.role = this.inspectedUser.role
				this.keyboards = []
				if (this.inspectedUser.keyboards === null) {
					this.keyboards = []
				}
				this.$services.keyboardService.getKeyboards(this.inspectedUser._id).then((keebs) => {
					this.keyboards = keebs
					for (let i = 0; i < this.keyboards.length; i++) {
						for (let j = 0; j < this.keyboards[i].images.length; j++) {
							this.keyboards[i].images[j] = this.$config.imageBaseUrl + this.keyboards[i].images[j]
						}
					}
				})
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
		signOut () {
			this.$bvModal.msgBoxConfirm('Are you sure you want to sign out?', {
				title: 'Signing Out',
				size: 'sm',
				buttonSize: 'sm',
				okVariant: 'danger',
				okTitle: 'Yes please',
				cancelTitle: 'No',
				footerClass: 'p-2',
				hideHeaderClose: false,
				centered: true
			}).then((value) => {
				if (value) {
					this.$cookies.remove('token')
					this.$cookies.remove('id')
					this.$bvToast.toast('Stay safe and see you soon! You will be redirected in 5 seconds', {
						title: 'Bye bye',
						toaster: 'b-toaster-top-center'
					})
					setTimeout(() => {
						this.$router.go()
					}, 5000)
				}
			})
		},
		dateformat
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
