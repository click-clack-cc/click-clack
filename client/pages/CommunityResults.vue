<template>
  <div id="community-container">
    <Leaderboard id="leaderboard" />
    <global-stats-list id="stats" />
  </div>
</template>

<script>
import GlobalStatsList from '../components/GlobalStatsList'
import Leaderboard from '../components/Leaderboard'

export default {
	name: 'Community',
	layout: 'index',
	components: {
		GlobalStatsList,
		Leaderboard
	},
	props: {},
	data () {
		return {}
	},
	computed: {},
	created () {
	},
	methods: {},
	meta () {
		return {
			title: 'Community'
		}
	},
	head () {
		const description = 'Best place to hang out for mechanical keyboard enthusiasts.' +
                ' Test your typing speed with our feature rich and clean typing test and check out' +
                'the newest custom mech keeb builds in the showroom'
		const title = 'Community - Click-Clack'
		const image = 'https://click-clack.cc:5000/files/images/indeximage.jpg'
		const url = 'https://click-clack.cc/communityresults'
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
    #discord-widget {
        width: 100%;
        margin-top: 2rem;
        margin-bottom: -0.4rem;
    }

    #new-users {
        height: 100%;
    }

    #stats {
        margin-top: 1.5rem;
    }

    #leaderboard {
        margin-bottom: 1.5rem;
    }

    #announcements {
        height: 100%;
        /*margin-top: 1rem;*/
    }
</style>
