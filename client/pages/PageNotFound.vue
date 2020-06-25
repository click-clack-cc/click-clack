<template>
  <div>
    <b-card
      id="card"
      bg-variant="light"
      class="mb-2"
      style="max-width: 20rem;"
      tag="article"
      title="404 😢"
    >
      <b-card-text>
        There is nothing here
      </b-card-text>

      <b-button to="/" variant="primary">
        Go home
      </b-button>
    </b-card>
  </div>
</template>

<script>

export default {
	name: 'PageNotFound',
	layout: 'index',
	data () {
		return {}
	},
	async created () {
	},
	methods: {}
}
</script>

<style scoped>
    #card {
        text-align: center;
        margin: auto;
        margin-top: 2rem;
    }
</style>
