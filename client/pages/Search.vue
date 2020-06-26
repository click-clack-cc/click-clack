<template>
  <div>
    <b-modal
      id="search-results-user-preview-modal"
      ref="search-results-user-preview-modal"
      centered
      hide-header
      ok-only
    >
      <OtherUserDataPreview :inspected-user="userSelected" />
    </b-modal>

    <h2>Members</h2>
    <br>
    <div v-if="users && users.length > 0">
      <b-row>
        <b-col v-for="(u, index) in users" :key="index" cols="6">
          <b-card class="user-thumbnail">
            <b-avatar
              :src="`https://click-clack.cc:5000/files/images/${u._id}.jpg`"
              badge-offset="-0.3rem"
              button
              class="avatar"
              size="3rem"
              variant="light"
              @click="previewUser(u.id)"
            >
              <template v-if="u.role.includes('admin')" v-slot:badge>
                <b-icon v-b-tooltip.right icon="shield-shaded" title="Administrator" />
              </template>
            </b-avatar>
            <b-link :href="`/u/${u.id}`" class="name">
              <span style="font-weight: bold">
                {{ u.firstname }} {{ u.lastname }}
              </span>
              <span class="text-muted">
                @{{ u.id }}
              </span>
            </b-link>
            <span v-if="u.recommendations" class="starcount" style="font-size: 1.2rem; color: #ff7700">{{ u.recommendations.length }}<b-icon
              icon="star-fill"
              scale="0.8"
            /> </span>
          </b-card>
        </b-col>
      </b-row>
    </div>
    <div v-else>
      <br>
      <b-icon icon="x" scale="2" style="width: 100%; margin: auto" />
    </div>
    <br>

    <h2>Keyboards</h2>
    <br>
    <div v-if="keyboards && keyboards.length > 0">
      <b-row>
        <b-col v-for="(keeb, index) in keyboards" :key="index" cols="6">
          <Keyboard
            :keeb="keeb"
            :owner="keeb.owner"
            :show-owner="true"
            style="margin-bottom: 1rem"
            :user="user"
          />
        </b-col>
      </b-row>
    </div>
    <b-col v-else align="middle">
      <div>
        <br>
        <b-icon icon="x" scale="2" style="width: 100%; margin: auto" />
      </div>
    </b-col>

    <br>
    <h2>Listings</h2>
    <br>

    <div v-if="listings && listings.length > 0">
      <b-row>
        <b-col v-for="(listing, index) in listings" :key="index" cols="6">
          <ListingSmall
            style="margin-bottom: 1rem"
            :listing="listing"
            :owner="listing.userdata"
            :show-owner="true"
            :token="token"
            :user="user"
          />
        </b-col>
      </b-row>
    </div>
    <b-col v-else align="middle">
      <div>
        <br>
        <b-icon icon="x" scale="2" style="width: 100%; margin: auto" />
      </div>
    </b-col>

    <br>
    <h2>Posts</h2>
    <br>

    <div v-if="posts && posts.length > 0">
      <b-row>
        <b-col v-for="(post, index) in posts" :key="index" cols="6">
          <PostSmall
            style="margin-bottom: 1rem"
            :post="post"
            :author="post.userdata"
            :show-author="true"
            :token="token"
            :user="user"
          />
        </b-col>
      </b-row>
    </div>
    <b-col v-else align="middle">
      <div>
        <br>
        <b-icon icon="x" scale="2" style="width: 100%; margin: auto" />
      </div>
    </b-col>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import Keyboard from '../components/KeyboardSmall'
import OtherUserDataPreview from '../components/OtherUserDataPreview'
import ListingSmall from '../components/ListingSmall'
import PostSmall from '../components/PostSmall'

export default {
	name: 'Search',
	layout: 'index',
	components: {
		ListingSmall,
		Keyboard,
		OtherUserDataPreview,
		PostSmall
	},
	props: [],
	data () {
		return {
			keyboards: [],
			users: [],
			posts: [],
			listings: [],
			userSelected: null
		}
	},
	computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
	watch: {
		search: {
			immediate: true,
			handler () {
				this.doSearch()
			}
		}
	},
	created () {

	},
	methods: {
		doSearch () {
			this.$services.searchService.search(this.search).then((results) => {
				this.keyboards = results.keyboards
				if (this.keyboards) {
					for (let i = 0; i < this.keyboards.length; i++) {
						this.$services.userService.getUser(this.keyboards[i].owner).then((res) => {
							this.keyboards[i].owner = res
						})
					}
				}
				this.users = results.users
				this.listings = results.listings
				this.posts = results.posts
			})
		},
		previewUser (userid) {
			this.$bvModal.show('search-results-user-preview-modal')
			this.userSelected = null
			this.$services.userService.getUser(userid).then((result) => {
				this.userSelected = result
				Vue.prototype.$forceUpdate()
			})
		}
	},
	head () {
		const description = 'Search for newest and nicest custom mechanical keyboard builds, members and community posts'
		const title = 'Click-Clack - Search'
		const image = 'https://click-clack.cc:5000/files/images/indeximage.jpg'
		const url = 'https://click-clack.cc/search'
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
    .avatar {
        margin-left: 1rem;
    }

    .name {
        margin-left: 1.2rem;
        margin-top: 0.5rem;
    }

    .starcount {
        margin-left: 2rem;
    }

    .user-thumbnail {
        margin-bottom: 0.5rem;
    }

</style>
