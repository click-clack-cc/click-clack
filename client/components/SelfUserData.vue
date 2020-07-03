<template>
  <div id="self-user-data-container">
    <b-overlay :show="loading" blur="0.5rem" opacity="1" variant="transparent">
      <b-card style="margin-bottom: 1rem">
        <b-row no-gutters>
          <b-col align="middle" lg="3" md="12" sm="12">
            <b-card style="border-left: none; border-top: none; border-bottom: none; border-radius: 0; padding-right: 1rem">
              <b-row>
                <b-col>
                  <b-row>
                    <b-col>
                      <b-avatar
                        :src="img"
                        badge-offset="-0.4rem"
                        class="avatar"
                        size="8rem"
                        variant="light"
                      />
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col align="middle" style="margin-left: 2rem; margin-right: 2.75rem; margin-top: 2rem">
                      <b-row>
                        <b-col
                          v-if="user.role.includes('admin')"
                          align="middle"
                          cols="3"
                          style="margin-bottom: 1rem"
                        >
                          <b-icon
                            v-b-tooltip.bottom
                            scale="1.4"
                            icon="shield-shaded"
                            title="Administrator"
                          />
                        </b-col>
                        <b-col
                          v-if="user.role.includes('developer')"
                          cols="3"
                          style="margin-bottom: 1rem"
                        >
                          <b-icon
                            v-b-tooltip.bottom
                            scale="1.4"
                            icon="cup"
                            title="Developer"
                          />
                        </b-col>
                        <b-col
                          v-if="user.role.includes('verified')"
                          align="middle"
                          cols="3"
                          style="margin-bottom: 1rem"
                        >
                          <b-icon
                            v-b-tooltip.bottom
                            scale="1.4"
                            icon="check-circle"
                            title="Verified user"
                          />
                        </b-col>
                        <b-col
                          v-if="user.role.includes('partner')"
                          align="middle"
                          cols="3"
                          style="margin-bottom: 1rem"
                        >
                          <b-icon
                            v-b-tooltip.bottom
                            scale="1.4"
                            icon="people"
                            title="Click-Clack Partner"
                          />
                        </b-col>
                        <b-col
                          v-if="user.role.includes('supporter')"
                          align="middle"
                          cols="3"
                          style="margin-bottom: 1rem"
                        >
                          <b-icon
                            v-b-tooltip.bottom
                            scale="1.4"
                            icon="heart"
                            title="Supporter"
                          />
                        </b-col>
                        <b-col
                          v-if="user.role.includes('betatester')"
                          align="middle"
                          cols="3"
                          style="margin-bottom: 1rem"
                        >
                          <b-icon
                            v-b-tooltip.bottom
                            scale="1.4"
                            icon="egg"
                            title="Beta tester - I was there when it all started"
                          />
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-card>
          </b-col>

          <b-col
            id="name"
            style="padding-left: 1rem"
            align="left"
            lg="9"
            md="12"
            sm="12"
          >
            <b-row>
              <b-col>
                <a v-b-modal.recommendationsModal>
                  <h3>
                    {{ userName }} <span
                      v-if="showStarCount"
                      style="font-size: 1.2rem; color: #ff7700"
                    >{{ recommendations.length }}<b-icon
                      icon="star-fill"
                      scale="0.8"
                    /> </span>
                    <p class="text-muted" style="font-size: 1.2rem">
                      @{{ publicUserName }}
                    </p>
                  </h3>
                </a>
              </b-col>
              <b-col align="right">
                <b-button
                  id="edit-username-button"
                  v-b-modal.username-edit-modal
                  style="border: none"
                  size="sm"
                  variant="outline-primary"
                >
                  <b-icon icon="pencil-square" />
                </b-button>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-row>
                  <b-col lg="10" md="12">
                    <h5>
                      About me
                    </h5>
                  </b-col>
                  <b-col align="right">
                    <b-button
                      id="edit-bio-button"
                      v-b-modal.bio-edit-modal
                      style="border: none"
                      size="sm"
                      variant="outline-primary"
                    >
                      <b-icon icon="pencil-square" />
                    </b-button>
                  </b-col>
                </b-row>
                <b-row id="bio">
                  <div v-html="$md.render(bio)" />
                </b-row>
                <b-row no-gutters class="text-muted" style="font-size: x-small">
                  <b-col>
                    <p>
                      Member since {{ dateformat(user.createdAt, "mmmm dS, yyyy") }}<br>
                      Last active {{ dateformat(user.lastLogIn, "mmmm dS, yyyy") }}
                    </p>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-col>
        </b-row>

        <b-modal
          id="recommendationsModal"
          ref="recommendationsModal"
          centered
          title="Recommendations"
          ok-only
        >
          <div v-if="user.recommendations && user.recommendations.length > 0">
            Other members have said these about {{ user.firstname }}
            <br>
            <br>
            <recommendation-list v-if="user" style="margin-bottom: 1rem" :inspected-user="user" />
          </div>
          <div v-else>
            No recommendations yet
          </div>
        </b-modal>
        <b-modal
          id="bio-edit-modal"
          ref="bio-edit-modal"
          centered
          title="Bio"
          @hidden="resetModal"
          @ok="handleOk"
          @show="resetModal"
        >
          <form ref="form" @submit.stop.prevent="handleSubmit">
            <b-form-group
              :state="editBioState"
              label-for="bio-input"
            >
              <b-form-textarea
                id="name-input"
                v-model="editBio"
                :state="editBioState"
                max-rows="6"
                required
                rows="4"
              />
            </b-form-group>
          </form>
        </b-modal>
        <b-modal
          id="username-edit-modal"
          ref="username-edit-modal"
          centered
          title="User info"
          @hidden="resetUsernameEditModal"
          @ok="handleUsernameOk"
          @show="resetUsernameEditModal"
        >
          <form ref="form" @submit.stop.prevent="handleUsernameSubmit">
            <h5>
              Profile picture
            </h5>

            <b-col align="middle">
              <b-avatar
                :src="img"
                variant="light"
                badge-offset="-0.5rem"
                size="6rem"
              />
            </b-col>
            <br>
            <b-form>
              <b-row>
                <b-col align="left" cols="9">
                  <b-form-file
                    v-model="file"
                    accept=".jpg"
                    drop-placeholder="Drop file here..."
                    placeholder="Choose a file or drop it here..."
                  />
                </b-col>
                <b-col align="middle">
                  <b-button :disabled="!Boolean(file)" variant="outline-primary" @click="uploadImage">
                    Upload
                  </b-button>
                </b-col>
              </b-row>
            </b-form>
            <br>
            <b-form-group
              label-for="username-input"
            >
              <h5>
                User ID
              </h5>
              <b-input-group id="username-input" prepend="@">
                <b-form-input
                  v-model="editUsername"
                  required
                />
              </b-input-group>
              <h5>
                Display name
              </h5>
              <b-input-group id="firstname-input">
                <b-form-input
                  v-model="editFirstname"
                  required
                />
              </b-input-group>
            </b-form-group>
          </form>
        </b-modal>
      </b-card>
      <b-card v-if="keyboards && keyboards.length > 0" no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button v-b-toggle.keyboards-accordion block variant="light">
            {{ keyboards.length }}
            keyboard{{ keyboards.length>1?"s":"" }}
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
                  @click="$nuxt.$router.push(`editkeyboard`)"
                >
                  <b-icon icon="plus" />
                </b-button>
              </b-col>
            </b-row>
            <b-row>
              <b-col v-for="(keeb, index) in keyboards" :key="index" lg="6" md="12">
                <Keyboard
                  style="margin-bottom: 1rem"
                  :keeb="keeb"
                  :owner="user"
                  :show-edit="true"
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
            {{ listings.length }} market
            listing{{ listings.length>1?"s":"" }}
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
                  @click="$nuxt.$router.push(`editlisting`)"
                >
                  <b-icon icon="plus" />
                </b-button>
              </b-col>
            </b-row>
            <b-row>
              <b-col v-for="(listing, index) in listings" :key="index" lg="6" md="12">
                <ListingSmall
                  style="margin-bottom: 1rem"
                  :listing="listing"
                  :owner="user"
                  :show-owner="true"
                  :token="token"
                  :user="user"
                  :show-edit="true"
                />
              </b-col>
            </b-row>
          </div>
        </b-collapse>
      </b-card>
      <b-card v-if="posts && posts.length > 0" no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button v-b-toggle.posts-accordion block variant="light">
            {{ posts.length }}
            post{{ posts.length>1?"s":"" }}
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
                  @click="$nuxt.$router.push(`editpost`)"
                >
                  <b-icon icon="plus" />
                </b-button>
              </b-col>
            </b-row>
            <b-row>
              <b-col v-for="(post, index) in posts" :key="index" lg="6" md="12">
                <PostSmall
                  style="margin-bottom: 1rem"
                  :post="post"
                  :author="user"
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
import dateformat from 'dateformat'
import Keyboard from './KeyboardSmall'
import ListingSmall from './ListingSmall'
import PostSmall from './PostSmall'
import RecommendationList from './RecommendationList'

export default {
	name: 'SelfUserData',
	components: {
		Keyboard,
		ListingSmall,
		PostSmall,
		RecommendationList
	},
	props: [
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
			keyboards: this.keyboards,
			listings: this.listings,
			posts: this.posts,
			editBio: this.editBio,
			editKeyboard: { layout: null },
			editBioState: this.editBioState,
			loading: true,
			publicUserName: this.publicUserName,
			editUsername: this.editUsername,
			editUsernameState: this.editUsernameState,
			editFirstname: this.editFirstname,
			editFirstnameState: this.editFirstnameState,
			file: this.file,
			photos: this.photos,
			showStarCount: false,
			recommendations: this.recommendations
		}
	},
	created () {
		this.img = `https://media.click-clack.cc/images/${this.user._id}.jpg`
		this.userName = this.user.firstname + (this.user.lastname == null ? '' : (' ' + this.user.lastname))
		this.publicUserName = this.user.id
		this.bio = this.user.bio
		this.editBio = this.user.bio

		this.role = this.user.role

		this.keyboards = []
		if (this.user.keyboards === null) {
			this.keyboards = []
		}
		this.$services.keyboardService.getKeyboards(this.user._id).then((keebs) => {
			this.keyboards = keebs
		})

		this.$services.listingService.getOwn(this.user._id, this.token).then((listings) => {
			this.listings = listings
		})

		this.$services.postService.getOwn(this.user._id).then((posts) => {
			this.posts = posts
		})

		this.loading = false
		this.recommendations = this.user.recommendations
		if (!this.recommendations) {
			this.recommendations = []
		}
		if (this.recommendations.length > 0) {
			this.showStarCount = true
		}
	},
	methods: {
		checkFormValidity () {
			const valid = this.$refs.form.checkValidity()
			this.editBioState = valid
			return valid
		},
		async checkUsernameValidity () {
			let usernameValid = true
			let firstnameValid = true
			if (this.editUsername === this.publicUserName) {
				usernameValid = true
			} else {
				usernameValid = await this.$services.userService.validateUsername(this.editUsername)
			}
			const allowedUsernameCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.'.split('')
			if (this.editUsername.length < 4 || this.editUsername.length > 16) {
				usernameValid = false
			}
			for (let i = 0; i < this.editUsername.length; i++) {
				if (!allowedUsernameCharacters.includes(this.editUsername.charAt(i))) {
					usernameValid = false
				}
			}
			firstnameValid = firstnameValid && this.editFirstname.length > 0
			firstnameValid = firstnameValid && this.editFirstname.length < 50
			const allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
			for (let i = 0; i < this.editFirstname.length; i++) {
				if (!allowedCharacters.includes(this.editFirstname.charAt(i))) {
					firstnameValid = false
				}
			}
			this.editUsernameState = usernameValid
			this.editFirstnameState = firstnameValid

			return usernameValid && firstnameValid
		},
		resetModal () {
			this.editBio = this.bio
			this.editBioState = null
		},
		resetUsernameEditModal () {
			this.editUsername = this.publicUserName
			this.editUsernameState = null
			this.editFirstname = this.user.firstname
			this.editFirstnameState = null
		},
		handleOk (bvModalEvt) {
			bvModalEvt.preventDefault()
			this.handleSubmit()
		},
		handleKeebOk (bvModalEvt) {
			bvModalEvt.preventDefault()
			this.handleKeebSubmit()
		},
		handleUsernameOk (bvModalEvt) {
			bvModalEvt.preventDefault()
			this.handleUsernameSubmit()
		},
		handleSubmit () {
			if (!this.checkFormValidity()) {
				return
			}

			this.$services.userService.changeUserBio(this.user._id, this.editBio, this.token).then(() => {
				this.$bvToast.toast('Successfully updated your bio', {
					title: 'Success',
					toaster: 'b-toaster-top-center',
					variant: 'success'
				})
				this.bio = this.editBio
				this.$router.go()
			})

			this.$nextTick(() => {
				this.$bvModal.hide('bio-edit-modal')
			})
		},
		async handleUsernameSubmit () {
			let changed = false
			if (this.editUsername !== this.publicUserName) {
				if (!await this.checkUsernameValidity()) {
					return
				}
				this.$services.userService.changeId(this.user._id, this.editUsername, this.token).then(() => {
					this.publicUserName = this.editUsername
					this.$cookies.set('id', this.editUsername, '7d')
					changed = true
				})
				this.$router.go()
			}
			if (this.editFirstname !== this.user.firstname && this.token) {
				if (!await this.checkUsernameValidity()) {
					return
				}
				this.$services.userService.changeFirstname(this.user._id, this.editFirstname, this.token).then(() => {
					this.user.firstname = this.editFirstname
					this.userName = this.user.firstname + ' ' + this.user.lastname
					changed = true
				})
				this.$router.go()
			}

			if (changed) {
				this.$bvToast.toast('Successfully updated user info', {
					title: 'Success',
					toaster: 'b-toaster-top-center',
					variant: 'success'
				})
				this.$router.go()
			}
			this.$nextTick(() => {
				this.$bvModal.hide('username-edit-modal')
			})
		},
		uploadImage () {
			this.loading = true
			this.$services.fileService.uploadProfileImage(
				this.user._id,
				this.file,
				this.token
			).then((res) => {
				this.loading = false
				this.$nuxt.$forceUpdate()
				this.$bvToast.toast('Successfully updated profile picture', {
					title: 'Success',
					toaster: 'b-toaster-top-center',
					variant: 'success'
				})
			}).catch((e) => {
				this.loading = false
				this.$bvToast.toast('Failed to update profile picture', {
					title: 'Error',
					toaster: 'b-toaster-top-center',
					variant: 'danger'
				})
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

    .avatar {
        /*margin-top: 1rem;*/
    }

    #name {
        /*margin-top: 1rem;*/
    }

    #bio-card {

    }

    #bio {
        margin: 0;
        /*margin: 1rem;*/
    }

    #edit-bio-button {
    }

    #edit-username-button {
        /*margin: 1rem;*/
    }

    #keyboards {

    }

    #keeblist {
        margin-top: 1rem;
    }

    #username-input, #firstname-input {
        margin-bottom: 2rem;
    }
</style>
