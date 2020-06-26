<template>
  <div>
    <b-row id="topcards" class="d-none d-lg-inline-flex">
      <b-col>
        <nuxt-link to="/typing">
          <b-card no-body>
            <b-row no-gutters>
              <b-col cols="3">
                <b-row align="middle" style="margin-top: 2.6rem; margin-left: 2rem">
                  <b-icon v-b-tooltip.hover.bottom="`Typing Test`" scale="1.4" icon="lightning" />
                </b-row>
              </b-col>
              <b-col style="margin: 1rem">
                <b-row no-gutters style="font-weight: bold" align="middle">
                  Typing Test
                </b-row>
                <b-row no-gutters>
                  Test your typing speed
                </b-row>
              </b-col>
            </b-row>
          </b-card>
        </nuxt-link>
      </b-col>
      <b-col>
        <nuxt-link to="/market">
          <b-card no-body>
            <b-row no-gutters>
              <b-col cols="3">
                <b-row align="middle" style="margin-top: 2.6rem; margin-left: 2rem">
                  <b-icon v-b-tooltip.hover.bottom="`Market`" scale="1.4" icon="shop-window" />
                </b-row>
              </b-col>
              <b-col style="margin: 1rem">
                <b-row no-gutters style="font-weight: bold" align="middle">
                  Market
                </b-row>
                <b-row no-gutters>
                  Buy and sell items, services
                </b-row>
              </b-col>
            </b-row>
          </b-card>
        </nuxt-link>
      </b-col>
      <b-col>
        <nuxt-link to="/showroom">
          <b-card no-body>
            <b-row no-gutters>
              <b-col cols="3">
                <b-row align="middle" style="margin-top: 2.6rem; margin-left: 2rem">
                  <b-icon v-b-tooltip.hover.bottom="`Showroom`" scale="1.4" icon="star" />
                </b-row>
              </b-col>
              <b-col style="margin: 1rem">
                <b-row no-gutters style="font-weight: bold" align="middle">
                  Showroom
                </b-row>
                <b-row no-gutters>
                  Custom keyboard showroom
                </b-row>
              </b-col>
            </b-row>
          </b-card>
        </nuxt-link>
      </b-col>
      <b-col>
        <nuxt-link to="/settings">
          <b-card no-body>
            <b-row no-gutters>
              <b-col cols="3">
                <b-row align="middle" style="margin-top: 2.6rem; margin-left: 2rem">
                  <b-icon v-b-tooltip.hover.bottom="`Themes`" scale="1.4" icon="window" />
                </b-row>
              </b-col>
              <b-col style="margin: 1rem">
                <b-row no-gutters style="font-weight: bold" align="middle">
                  Themes
                </b-row>
                <b-row no-gutters>
                  Customize click-clack with themes
                </b-row>
              </b-col>
            </b-row>
          </b-card>
        </nuxt-link>
      </b-col>
    </b-row>

    <b-row class="posts">
      <b-col md="12" lg="8">
        <b-row id="postbuttons">
          <b-col align="right">
            <b-button block pill @click="$nuxt.$router.push(user?`/editpost`:`/profile`)">
              <b-icon icon="pencil" />
              Write post
            </b-button>
          </b-col>
          <b-col>
            <b-button block pill @click="$nuxt.$router.push(user?`editkeyboard`:`/profile`)">
              <svg
                version="1.1"
                style="margin: -0.5rem; margin-right: 0"
                xmlns="http://www.w3.org/2000/svg"
                width="2rem"
                height="2rem"
                viewBox="0 0 1024 1024"
              >
                <path
                  fill="none"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-miterlimit="4"
                  stroke-width="36"
                  stroke="currentColor"
                  d="M284.991 354.558l227.242 119.907c0 0 178.891-8.704 220.472-102.499l-221.439-114.104c0 0-109.269 65.754-226.275 96.699z"
                />
                <path
                  fill="none"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-miterlimit="4"
                  stroke-width="36"
                  stroke="currentColor"
                  d="M284.991 354.558l-79.293 222.406 277.524 174.058 29.009 6.77 26.109-2.901 291.062-135.378 2.901-29.009-99.6-218.538"
                />
                <path
                  fill="none"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-miterlimit="4"
                  stroke-width="36"
                  stroke="currentColor"
                  d="M519.001 515.079l-6.77 180.826"
                />
              </svg>
              Submit a keyboard
            </b-button>
          </b-col>
        </b-row>
        <b-row id="sortbuttons">
          <b-col align="middle">
            <b-button-group size="sm">
              <b-button
                variant="outline-primary"
                :pressed="sortMethod === 'best'"
                @click="sortBy('best')"
              >
                <b-icon v-if="sortMethod === 'best'" icon="star-fill" />
                <b-icon v-else icon="star" />
                Best
              </b-button>
              <b-button
                variant="outline-primary"
                :pressed="sortMethod === 'rising'"
                @click="sortBy('rising')"
              >
                <b-icon v-if="sortMethod === 'rising'" icon="brightness-alt-high-fill" />
                <b-icon v-else icon="brightness-alt-high" />
                Rising
              </b-button>
              <b-button
                variant="outline-primary"
                :pressed="sortMethod === 'new'"
                @click="sortBy('new')"
              >
                <b-icon v-if="sortMethod === 'new'" icon="egg-fill" />
                <b-icon v-else icon="egg" />
                New
              </b-button>
            </b-button-group>
          </b-col>
        </b-row>

        <div v-if="!loaded" id="loading" class="text-center">
          <b-spinner :variant="'primary'" type="grow" />
        </div>

        <div v-if="allContent">
          <b-card-group
            v-for="(content, index) in allContent"
            :key="index"
            columns
            style="column-count: 1"
          >
            <PostSmall
              v-if="posts.includes(content)"
              style="display: inline-block; width: 100%; margin-bottom: 0.5rem"
              :post="content"
              :author="content.userdata"
              :show-author="true"
              :token="token"
              :user="user"
            />
            <KeyboardSmall
              v-if="keyboards.includes(content)"
              style="display: inline-block; width: 100%; margin-bottom: 0.5rem"
              :keeb="content"
              :owner="content.userdata"
              :show-owner="true"
              :token="token"
              :user="user"
            />
          </b-card-group>
        </div>
      </b-col>
      <b-col class="d-none d-lg-block">
        <announcements id="announcements" />
        <Leaderboard id="leaderboard" />
        <!--                <NewUsers id="new-users"/>-->
        <iframe src="https://discordapp.com/widget?id=715624140606013471&theme=dark" style="width: 100%; height: 25rem" allowtransparency="true" frameborder="0" />
        <Footer />
      </b-col>
    </b-row>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import KeyboardSmall from '../components/KeyboardSmall'
import Announcements from '../components/Announcements'
import Leaderboard from '../components/LeaderboardSmall'
import Footer from '../components/Footer'
import PostSmall from '../components/PostSmall'

export default {
	name: 'Showroom',
	layout: 'index',
	components: {
		KeyboardSmall,
		Announcements,
		Leaderboard,
		Footer,
		PostSmall
	},
	props: [],
	data () {
		return {
			keyboards: null,
			posts: null,
			loaded: false,
			allContent: null,
			sortMethod: 'rising'
		}
	},
	computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
	created () {
		this.sortBy('rising')
	},
	methods: {
		async sortBy (method) {
			this.sortMethod = method
			this.loaded = false
			let allContent = []
			const keebs = await this.$services.keyboardService.getNewKeyboards(this.sortMethod)
			this.keyboards = keebs

			allContent = allContent.concat(keebs)
			const posts = await this.$services.postService.getNewPosts(this.sortMethod)
			this.posts = posts

			allContent = allContent.concat(posts)
			if (method === ('new')) {
				allContent.sort((b, a) => a.createdAt - b.createdAt)
			}
			if (method === ('best') || method === ('rising')) {
				allContent.sort((b, a) => a.heartsNum - b.heartsNum)
			}
			this.allContent = allContent
			this.loaded = true
		}
	},
	head () {
		const description = ' Newest custom mechanical keyboard builds on click-clack. Join our community, check out the nicest custom mech keebs uploaded by our members and share yur own keyboards!'
		const title = 'Click-Clack - Newest Mechanical Keyboard Builds'
		const image = 'https://click-clack.cc:5000/files/images/indeximage.JPG'
		const url = 'https://click-clack.cc/'
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

    #postbuttons {
        margin-bottom: 1rem;
    }

    #sortbuttons {
        margin-bottom: 1rem;
    }

    .posts {
        margin-top: 1rem;
    }

    #new-users, #leaderboard, #announcements {
        margin-bottom: 1.25rem;
    }

    #topcards {
        margin-bottom: 1rem;
    }

    #loading {
        margin: 5rem;
    }

</style>
