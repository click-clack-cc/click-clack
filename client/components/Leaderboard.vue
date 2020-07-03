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
      <h4 class="mb-0">
        Leaderboard
      </h4>
    </template>

    <p>
      Users with the fastest fingers. You need to take at least 5 tests to start competing.
      The calculated WPM is accuracy adjusted.
    </p>
    <br>

    <div v-if="!loading" id="newest-members-body">
      <b-row>
        <b-col align="middle" cols="1">
          <h6>
            Rank
          </h6>
        </b-col>
        <b-col align="middle" cols="7">
          <h6>
            User
          </h6>
        </b-col>
        <b-col>
          <h6 align="middle">
            WPM
          </h6>
        </b-col>
        <b-col>
          <h6 align="middle">
            Tests taken
          </h6>
        </b-col>
      </b-row>
      <br>
      <b-row v-for="(stat, index) in stats" :key="index" class="user-thumbnail">
        <b-col cols="1">
          <p align="middle">
            {{ stat.pos }}
          </p>
        </b-col>
        <b-col cols="7">
          <b-avatar
            v-if="stat.user"
            :src="$config.imageBaseUrl + stat.user._id + `.jpg`"
            button
            class="avatar"
            size="2rem"
            variant="light"
            @click="previewUser(stat.user.id)"
          />
          <b-avatar
            v-else
            class="avatar"
            size="2rem"
            variant="light"
          />
          <b-link v-if="stat.user" :href="`/u/${stat.user.id}`" class="name">
            <span class="text-muted"> @{{ stat.user.id }} </span>
          </b-link>
          <span v-else class="name">
            <span class="text-muted"> Deleted User </span>
          </span>
        </b-col>
        <b-col>
          <p align="middle">
            {{ stat.avg.toFixed(1) }}
          </p>
        </b-col>
        <b-col>
          <p align="middle">
            {{ stat.tests }}
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
					this.stats[i].pos += ' 👑'
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
