<template>
  <div id="container">
    <b-card
      id="card"
      footer-tag="footer"
      header-tag="header"
      no-body
    >
      <template v-slot:header>
        <b-row>
          <b-col cols="8">
            <b-row>
              <b-col>
                <a id="keebtitle" style="cursor: pointer" @click="goToKeyboard(keeb._id)">{{ keeb.name
                }}</a>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <div v-if="showOwner === true" id="keebowner">
                  <div v-if="keeb.creatorName">
                    <span class="text-muted"> made by </span>
                    <a :href="keeb.url"> {{ keeb.creatorName }} </a>
                    <span class="text-muted"> submitted by </span>
                    <a :href="`/u/${owner.id}`"> {{ owner.firstname }} {{ owner.lastname }}
                      <span class="text-muted"> @{{ owner.id }} </span></a>
                  </div>
                  <div v-else>
                    <span class="text-muted">  by </span>
                    <a :href="`/u/${owner.id}`"> {{ owner.firstname }} {{ owner.lastname }}
                      <span class="text-muted"> @{{ owner.id }} </span></a>
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-col>
          <b-col cols="1">
            <div v-if="user && (user._id === keeb.owner)" id="keeb-edit-button">
              <b-button
                size="sm"
                style=" margin-right: 1rem; border: none; margin-top: -.3rem"
                variant="outline-primary"
                @click="editExistingKeyboard(keeb._id)"
              >
                <b-icon icon="pencil-square" />
              </b-button>

              <b-button
                size="sm"
                style="border: none; margin-top: -.3rem"
                variant="outline-danger"
                @click="removeExistingKeyboard()"
              >
                <b-icon icon="trash" />
              </b-button>
            </div>
          </b-col>
          <b-col cols="3" align="right">
            <span class="text-muted timeago">
              {{ format(keeb.createdAt) }}
            </span>
          </b-col>
        </b-row>
      </template>
      <b-carousel
        v-if="keeb.images && keeb.images.length > 1"
        id="carousel"
        v-model="keeb.slide"
        :interval="999999"
        controls
      >
        <a style="cursor: pointer" @click="goToKeyboard(keeb._id)">
          <b-carousel-slide
            v-for="(img, index) in keeb.images"
            :key="index"
            :img-src="`https://click-clack.cc:5000/files/images/${img}`"
          />
        </a>
      </b-carousel>
      <b-carousel
        v-else-if="keeb.images"
        id="carousel"
        v-model="keeb.slide"
        :interval="999999"
      >
        <a style="cursor: pointer" @click="goToKeyboard(keeb._id)">
          <b-carousel-slide
            v-for="(img, index) in keeb.images"
            :key="index"
            :img-src="`https://click-clack.cc:5000/files/images/${img}`"
          />
        </a>
      </b-carousel>
      <b-row>
        <b-col no-gutters>
          <div id="no-img-parts-list-container">
            <b-col class="keeb-info">
              <a v-if="keeb.url" style="font-weight: bold" :href="keeb.url"> {{ truncate(keeb.url, 30, false) }}
                <b-icon icon="link45deg" />
              </a>
              <br v-if="keeb.url">
              <br v-if="keeb.url">
              <a :href="`/keyboard/${[keeb._id]}`">
                <div v-html="$md.render(truncate(keeb.description,350,true))" />
              </a>
              <a style="cursor: pointer" @click="goToKeyboard(keeb._id)">
                <div>
                  <b-row>
                    <b-col cols="6" v-if="keeb.keycaps" >
                      <span style="font-weight: bold; margin-right: 1rem">
                        Keycaps
                      </span>
                      {{ keeb.keycaps }} <br v-if="keeb.keycaps">
                    </b-col>
                    <b-col cols="6" v-if="keeb.switches">
                      <span  style="font-weight: bold; margin-right: 1rem">
                        Switches
                      </span>
                      {{ keeb.switches }} <br v-if="keeb.switches">
                    </b-col>
                    <b-col cols="6" v-if="keeb.stabs" >
                      <span style="font-weight: bold; margin-right: 1rem">
                        Stabilizers
                      </span>
                      {{ keeb.stabs }} <br v-if="keeb.stabs">
                    </b-col>
                    <b-col cols="6" v-if="keeb.plate">
                      <span   style="font-weight: bold; margin-right: 1rem">
                        Plate
                      </span>
                      {{ keeb.plate }} <br v-if="keeb.plate">
                    </b-col>
                    <b-col cols="6"  v-if="keeb.pcb" >
                      <span style="font-weight: bold; margin-right: 1rem">
                        PCB
                      </span>
                      {{ keeb.pcb }} <br v-if="keeb.pcb">
                    </b-col>
                    <b-col cols="6" v-if="keeb.case">
                      <span  style="font-weight: bold; margin-right: 1rem">
                        Case
                      </span>
                      {{ keeb.case }} <br v-if="keeb.case">
                    </b-col>
                  </b-row>
                </div>
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
                  fill="none"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-miterlimit="4"
                  stroke-width="36"
                  stroke="currentColor"
                  @click="toggleHeart(keeb)"
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
                <span v-else class="text-primary">
                  <svg
                    v-b-tooltip.top="`Like`"
                    stroke="currentColor"
                    fill="none"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 1024 1024"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-miterlimit="4"
                    stroke-width="42"
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
                </span>
                {{ ' ' + keeb.hearts?keeb.hearts.length:0 }}
                <a :href="`/keyboard/${[keeb._id]}`">
                  <b-icon icon="chat-square" scale="1.2" style="margin-left: 1rem; margin-top: 0.2rem; margin-bottom: -0.1rem; margin-right: 0.2rem" />
                  {{ ' ' + keeb.comments?keeb.comments.length:0 }}
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
	name: 'Keyboard',
	components: {},
	props: [
		'user',
		'token',
		'keeb',
		'showOwner',
		'showEdit',
		'owner'
	],
	data () {
		return {
			editKeyboard: this.keeb,
			photos: this.photos,
			uploading: false,
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
		keeb: {
			immediate: true,
			handler () {
				this.checkIsHearted()
			}
		}
	},
	created () {

	},
	methods: {
		goToKeyboard (id) {
			this.$router.push(`/keyboard/${id}`)
		},
		editExistingKeyboard (id) {
			this.$router.push(`/editkeyboard/${id}`)
		},
		removeExistingKeyboard () {
			this.$bvModal.msgBoxConfirm('Are you sure you want to remove this keyboard?', {
				title: 'Removing keyboard',
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
					this.$services.keyboardService.deleteKeyboard(this.owner._id || this.keeb.owner._id || this.keeb.owner, this.editKeyboard._id, this.token).then(() => {
						this.$bvToast.toast('Keyboard deleted successfully', {
							title: 'Success',
							toaster: 'b-toaster-top-center',
							variant: 'success'
						})
					}).catch(() => {
						this.$bvToast.toast('Failed to delete keyboard', {
							title: 'Error',
							toaster: 'b-toaster-top-center',
							variant: 'danger'
						})
					})
				}
			})
		},
		toggleHeart (keeb) {
			if (!this.user) {
				this.$router.push('/profile')
			}

			this.$services.keyboardService.heart(this.user._id, keeb._id, this.token).then(() => {
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
		truncate (str, n, useWordBoundary) {
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

    .keeb-info {
        margin: 0;
    }

    #container {
        margin-top: 0;
    }

    #carousel {
        margin: auto;
        margin-bottom: 0.5rem;
        /*max-width: 40rem;*/
    }

    #no-img-parts-list-container {
        margin: 0.5rem;
    }

    #keebtitle {
        font-weight: bold;
        margin-left: 0;
        margin-right: 0.5rem;
    }

    #keebowner, .timeago {
        margin-top: 0;
    }

</style>
