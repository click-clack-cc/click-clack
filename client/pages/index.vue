<template>
  <div>
    <b-row class="posts">
      <b-col md="12" lg="8">
        <b-row id="topcards" align="middle">
          <b-col>
            <b-card no-body style="padding-top: 1rem; padding-bottom: 1rem">
              <b-button variant="outline" to="/typing">
                <b-row no-gutters>
                  <b-col cols="3">
                    <b-row align="left" style="margin-top: 0.8rem; margin-left: 1rem">
                      <b-icon v-b-tooltip.hover.bottom="`Showroom`" scale="1.1" icon="lightning" />
                    </b-row>
                  </b-col>
                  <b-col>
                    <b-row no-gutters style="font-weight: bold" align="middle">
                      Typing Test
                    </b-row>
                    <b-row no-gutters align="left">
                      Let's see how fast you can type
                    </b-row>
                  </b-col>
                </b-row>
              </b-button>
            </b-card>
          </b-col><b-col>
            <b-card no-body style="padding-top: 1rem; padding-bottom: 1rem">
              <b-button variant="outline" to="/showroom">
                <b-row no-gutters>
                  <b-col cols="3">
                    <b-row align="middle" style="margin-top: 0.8rem; margin-left: 1rem">
                      <b-icon v-b-tooltip.hover.bottom="`Showroom`" scale="1.1" icon="star" />
                    </b-row>
                  </b-col>
                  <b-col>
                    <b-row no-gutters style="font-weight: bold" align="middle">
                      Showroom
                    </b-row>
                    <b-row no-gutters align="left">
                      Custom keyboard showroom
                    </b-row>
                  </b-col>
                </b-row>
              </b-button>
            </b-card>
          </b-col>
          <!--            <b-button variant="outline" to="/settings">-->
          <!--              <b-row no-gutters>-->
          <!--                <b-col cols="3">-->
          <!--                  <b-row align="middle" style="margin-top: 1.7rem; margin-left: 1rem">-->
          <!--                    <b-icon v-b-tooltip.hover.bottom="`Themes`" scale="1.1" icon="window" />-->
          <!--                  </b-row>-->
          <!--                </b-col>-->
          <!--                <b-col>-->
          <!--                  <b-row no-gutters style="font-weight: bold" align="middle">-->
          <!--                    Themes-->
          <!--                  </b-row>-->
          <!--                  <b-row no-gutters align="left">-->
          <!--                    Customize click-clack with themes-->
          <!--                  </b-row>-->
          <!--                </b-col>-->
          <!--              </b-row>-->
          <!--            </b-button>-->
          <!--      <b-col>-->
          <!--        <nuxt-link to="/market">-->
          <!--            <b-row no-gutters>-->
          <!--              <b-col cols="3">-->
          <!--                <b-row align="middle" style="margin-top: 2.6rem; margin-left: 2rem">-->
          <!--                  <b-icon v-b-tooltip.hover.bottom="`Market`" scale="1.4" icon="shop-window" />-->
          <!--                </b-row>-->
          <!--              </b-col>-->
          <!--              <b-col style="margin: 1rem">-->
          <!--                <b-row no-gutters style="font-weight: bold" align="middle">-->
          <!--                  Market-->
          <!--                </b-row>-->
          <!--                <b-row no-gutters>-->
          <!--                  Buy and sell items, services-->
          <!--                </b-row>-->
          <!--              </b-col>-->
          <!--            </b-row>-->
          <!--        </nuxt-link>-->
          <!--      </b-col>-->
        </b-row>
        <b-row id="postbuttons">
          <b-col align="right">
            <b-button block pill style="height: 2.5rem" @click="$nuxt.$router.push(user?`/editpost`:`/profile`)">
              <b-icon icon="pencil" style="margin-right: 1rem" />
              Write post
            </b-button>
          </b-col>
          <b-col>
            <b-button pill block style="height: 2.5rem" @click="$nuxt.$router.push(user?`editkeyboard`:`/profile`)">
              <svg
                version="1.1"
                style="margin: -0.5rem; margin-right: 1rem; margin-bottom: -0.7rem"
                xmlns="http://www.w3.org/2000/svg"
                width="2.5rem"
                height="2.5rem"
                viewBox="0 0 1024 1024"
                fill="none"
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-miterlimit="4"
                stroke-width="36"
                stroke="currentColor"
              >
                <path d="M30.257 310.582l1.929 321.281h971.565l0.965-320.318z" />
                <path d="M 274.353,621.84417 V 578.01694" />
                <path d="M 680.154,622.94481 V 578.98482" />
                <path d="m 168.66743,311.77919 c 0,0 -25.69019,-100.27378 161.44779,-99.67143 l 309.62841,-0.84755" />
                <path d="m 274.353,578.01694 405.801,0.96788" />
              </svg>
              Submit a keyboard
            </b-button>
          </b-col>
        </b-row>
<!--        <b-row id="sortbuttons">-->
<!--          <b-col align="left">-->
<!--            <b-button-group size="sm">-->
<!--              <b-button-->
<!--                variant="outline-primary"-->
<!--                :pressed="sortMethod === 'rising'"-->
<!--                @click="setSort('rising')"-->
<!--              >-->
<!--                <b-icon v-if="sortMethod === 'best'" icon="star-fill" />-->
<!--                <b-icon v-else icon="star" />-->
<!--                Best-->
<!--              </b-button>-->
<!--              &lt;!&ndash;              <b-button&ndash;&gt;-->
<!--              &lt;!&ndash;                variant="outline-primary"&ndash;&gt;-->
<!--              &lt;!&ndash;                :pressed="sortMethod === 'rising'"&ndash;&gt;-->
<!--              &lt;!&ndash;                @click="sortBy('rising')"&ndash;&gt;-->
<!--              &lt;!&ndash;              >&ndash;&gt;-->
<!--              &lt;!&ndash;                <b-icon v-if="sortMethod === 'rising'" icon="brightness-alt-high-fill" />&ndash;&gt;-->
<!--              &lt;!&ndash;                <b-icon v-else icon="brightness-alt-high" />&ndash;&gt;-->
<!--              &lt;!&ndash;                Rising&ndash;&gt;-->
<!--              &lt;!&ndash;              </b-button>&ndash;&gt;-->
<!--              <b-button-->
<!--                variant="outline-primary"-->
<!--                :pressed="sortMethod === 'new'"-->
<!--                @click="setSort('new')"-->
<!--              >-->
<!--                <b-icon v-if="sortMethod === 'new'" icon="egg-fill" />-->
<!--                <b-icon v-else icon="egg" />-->
<!--                New-->
<!--              </b-button>-->
<!--            </b-button-group>-->
<!--          </b-col>-->
<!--        </b-row>-->
        <div v-if="!loaded" id="loading" class="text-center">
          <b-spinner :variant="'primary'" type="grow" />
        </div>
        <div v-if="allContent" ref="contentContainer">
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
        <b-row>
          <b-col align="middle">
            <b-spinner v-if="!(this.keebsEndReached && this.postsEndReached)" />
            <p v-else class="text-muted" style="font-size: x-large">
              That's it for now, you've seen everything.
            </p>
          </b-col>
        </b-row>
      </b-col>
      <b-col class="d-none d-lg-block">
        <other-user-data-preview v-if="user && token" id="usercard" :inspected-user="user" />
        <span id="support">
          <a href="https://www.patreon.com/clickclackcc">
            <b-button block variant="outline-primary">
              Become a Supporter
              <b-icon style="margin-left: 0.5rem" icon="heart" />
            </b-button>
          </a><br>
        </span>
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
import OtherUserDataPreview from '../components/OtherUserDataPreview'

export default {
	name: 'Showroom',
	layout: 'index',
	components: {
		OtherUserDataPreview,
		KeyboardSmall,
		Announcements,
		Leaderboard,
		Footer,
		PostSmall
	},
	props: [],
	data () {
		return {
			keyboards: [],
			posts: [],
			loaded: false,
			allContent: [],
			page: 1,
			sortMethod: 'new',
			keebsEndReached: false,
			postsEndReached: false
		}
	},
	computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
	created () {
		this.getPage(false)
		if (process.client) {
			// eslint-disable-next-line nuxt/no-globals-in-created
			window.addEventListener('scroll', this.onScroll)
		}
	},
	destroyed () {
		// eslint-disable-next-line nuxt/no-globals-in-created
		window.removeEventListener('scroll', this.onScroll)
	},
	methods: {
		async getPage (append) {
			if (this.keebsEndReached && this.postsEndReached) { return }
			this.loaded = false
			let allContent = append ? this.allContent : []
			if (!this.keebsEndReached) {
				const keebs = await this.$services.keyboardService.getNewKeyboards(this.sortMethod, this.page)
				this.keyboards = this.keyboards.concat(keebs)
				allContent = allContent.concat(keebs)
				if (keebs.length < 3) { this.keebsEndReached = true }
			}
			if (!this.postsEndReached) {
				const posts = await this.$services.postService.getNewPosts(this.sortMethod, this.page)
				this.posts = this.posts.concat(posts)
				allContent = allContent.concat(posts)
				if (posts.length < 3) { this.postsEndReached = true }
			}
			if (!append) {
				if (this.sortMethod === ('new')) {
					allContent.sort((b, a) => a.createdAt - b.createdAt)
				}
				if (this.sortMethod === ('best') || this.sortMethod === ('rising')) {
					allContent.sort((b, a) => a.heartsNum - b.heartsNum)
				}
			}
			this.allContent = allContent
			this.page++
			this.loaded = true
		},
		nextPage () {
			this.getPage(true)
		},
		setSort (sort) {
			this.sortMethod = sort
			this.page = 1
			this.keebsEndReached = false
			this.postsEndReached = false
			this.getPage(false)
		},
		onScroll () {
			if ((window.innerHeight + window.scrollY) > (this.$refs.contentContainer.clientHeight)) {
				if (this.loaded) { this.nextPage() }
			}
		}
	},
	head () {
		const description = ' Newest custom mechanical keyboard builds on click-clack. Join our community, check out the nicest custom mech keebs uploaded by our members and share yur own keyboards!'
		const title = 'Click-Clack - Newest Mechanical Keyboard Builds'
		const image = this.$config.imageBaseUrl + 'indeximage.JPG'
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
								margin-top: 2rem;
        margin-bottom: 2rem;
    }

    #sortbuttons {
        margin-bottom: 1rem;
    }

    .posts {
        margin-top: 1rem;
    }

    #new-users, #leaderboard, #announcements, #usercard {
        margin-bottom: 1.25rem;
    }

    #topcards {
        margin-bottom: 1rem;
    }

    #loading {
        margin: 5rem;
    }

</style>
