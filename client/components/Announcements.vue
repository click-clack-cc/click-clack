<template>
  <b-card id="announcements-container" header-tag="header" no-body>
    <template v-slot:header>
      <h4 class="mb-0">
        Announcements
      </h4>
    </template>
    <div v-if="announcements" id="announcements-body">
      <div v-for="(ann, index) in announcements" :key="index">
        <span class="text-muted">{{ format(ann.createdAt) }}</span><br>
        <div v-html="$md.render(ann.text)" />
      </div>
    </div>
    <div v-else id="loading" class="text-center">
      <b-spinner :variant="'primary'" type="grow" />
    </div>
  </b-card>
</template>

<script>
import { format } from 'timeago.js'

export default {
	name: 'NewUsers',
	components: {},
	props: {},
	data () {
		return {
			announcements: null
		}
	},
	computed: {},
	created () {
		this.$services.announcementService.getAnnouncements().then((announcements) => {
			this.announcements = announcements
		})
	},
	methods: {

		format
	}
}
</script>

<style scoped>
    #announcements-body {
        max-height: 30rem;
        padding: 1rem;
        overflow-y: scroll;
    }

    #loading {
        margin: 5rem;
    }
</style>
