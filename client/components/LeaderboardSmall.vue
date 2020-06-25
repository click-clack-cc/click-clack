<template>
  <b-card id="leaderboard-container" header-tag="header">
    <b-modal
      id="leaderboard-user-preview-modal"
      ref="leaderboard-user-preview-modal"
      centered
      hide-header
      ok-only
    >
      <OtherUserDataPreview :inspected-user="userSelected" />
    </b-modal>
    <template v-slot:header>
      <a href="communityresults">
        <h4 style="margin-bottom: 0.5rem">
          Leaderboard
        </h4>
        <p>
          Users with the fastest fingers. You need to take at least 5 tests to start competing.
          The calculated WPM is accuracy adjusted.
        </p>
        <b-button block variant="outline-primary">
          See more
        </b-button>
      </a>
    </template>
    <div v-if="!loading" id="newest-members-body">
      <b-row>
        <b-col cols="3">
          Rank
        </b-col>
        <b-col cols="6">
          User
        </b-col>
        <b-col>
          WPM
        </b-col>
      </b-row>
      <b-row v-for="(stat, index) in stats" :key="index" class="user-thumbnail">
        <b-col align="middle" cols="2">
          {{ stat.pos }}
        </b-col>
        <b-col cols="7">
          <b-avatar
            :src="`https://click-clack.cc:5000/files/images/${stat.user._id}.jpg`"
            button
            class="avatar"
            size="2rem"
            variant="light"
            @click="previewUser(stat.user.id)"
          />
          <b-link :href="`/u/${stat.user.id}`" class="name">
            <span class="text-muted"> @{{ stat.user.id }} </span>
          </b-link>
        </b-col>
        <b-col>
          <p align="middle">
            {{ stat.avg.toFixed(1) }}
          </p>
        </b-col>
      </b-row>
    </div>
    <div v-else id="loading" class="text-center">
      <b-spinner :variant="'primary'" type="grow" />
    </div>
  </b-card>
</template>

<script>
import Vue from 'vue'
import { format } from 'timeago.js'
import OtherUserDataPreview from '../components/OtherUserDataPreview'

export default {
	name: 'Leaderboard',
	components: {
		OtherUserDataPreview
	},
	props: {},
	data () {
		return {
			stats: this.stats,
			loading: this.loading | true,
			userSelected: this.userSelected
		}
	},
	computed: {},
	created () {
		this.$services.statService.getTop().then((result) => {
			this.stats = result
			for (let i = 0; i < this.stats.length; i++) {
				this.stats[i].pos = (i + 1)
				if (i === 0) {
					this.stats[i].pos = '👑'
				}
			}
			this.loading = false
		})
	},
	methods: {
		previewUser (userid) {
			this.$bvModal.show('leaderboard-user-preview-modal')
			this.userSelected = null
			this.$services.userService.getUser(userid).then((result) => {
				this.userSelected = result
				Vue.prototype.$forceUpdate()
			})
		},
		format
	}
}
</script>

<style scoped>
    .avatar {
        margin-left: 1rem;
    }

    .name {
        margin-left: 1rem;
        margin-top: 0.3rem;
    }

    .user-thumbnail {
        margin-top: 0.5rem;
    }

    .timeago {
        margin-left: 1rem;
        margin-top: 0.3rem;
    }

    #newest-members-body {
        min-height: 10rem;
    }

    #leaderboard-container {
        height: 500px;
    }

    #loading {
        margin: 5rem;
    }
</style>
