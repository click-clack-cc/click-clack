<template>
  <div v-if="comments" id="comment-list-container">
    <b-overlay :show="loading" blur="0.5rem" opacity="1" variant="transparent">
      <b-card v-for="(com, index) in comments" :key="index" class="comment" no-body>
        <b-row>
          <b-col cols="3">
            <b-row>
              <b-col cols="4">
                <b-avatar
                  :src="$config.imageBaseUrl + com.submitter._id + `.jpg`"
                  badge-offset="-0.2rem"
                  button
                  class="avatar"
                  size="2rem"
                  variant="light"
                  @click="previewUser(com.submitter.id)"
                >
                  <template v-if="com.submitter.role.includes('admin')" v-slot:badge>
                    <b-icon v-b-tooltip.right icon="shield-shaded" title="Administrator" />
                  </template>
                </b-avatar>
              </b-col>
              <b-col align="left">
                <b-link :href="`/u/${com.submitter.id}`" class="name">
                  <b-col>
                    <b-row>
                      {{ com.submitter.firstname }}
                    </b-row>
                    <b-row>
                      <span class="tag text-muted"> @{{ com.submitter.id }} </span>
                    </b-row>
                  </b-col>
                </b-link>
              </b-col>
            </b-row>
          </b-col>
          <b-col>
            <div style="margin-top: 0.3rem;" v-html="$md.render(com.text)" />
          </b-col>
          <b-col cols="2">
            <div style="margin-top: 0.3rem;">
              {{ format(com.createdAt) }}
            </div>
          </b-col>
        </b-row>
      </b-card>
    </b-overlay>
    <b-modal
      id="comment-list-user-preview-modal"
      ref="comment-list-user-preview-modal"
      centered
      hide-header
      ok-only
    >
      <OtherUserDataPreview v-if="userSelected" :inspected-user="userSelected" />
    </b-modal>
  </div>
</template>

<script>

import Vue from 'vue'
import { format } from 'timeago.js'
import userService from '../services/user-service'
import OtherUserDataPreview from '../components/OtherUserDataPreview'

export default {
	name: 'CommentList',
	components: {
		OtherUserDataPreview
	},
	props: [
		'user',
		'comments'
	],
	data () {
		return {
			loading: true,
			userSelected: this.userSelected
		}
	},
	watch: {
		comments: {
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
			this.loading = false
		},
		previewUser (userid) {
			this.$bvModal.show('comment-list-user-preview-modal')
			this.userSelected = null
			userService.getUser(userid).then((result) => {
				this.userSelected = result
				Vue.prototype.$forceUpdate()
			})
		},
		format
	}
}
</script>

<style scoped>
    .comment {
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        max-width: 80%;
        margin-left: auto;
        margin-right: auto;
    }

    .name {
        margin-right: 0;
    }
    .avatar {
        margin-top: 0.5rem;
        margin-left: 0.5rem;
    }

</style>
