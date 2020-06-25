<template lang="html">
  <div v-if="loading" class="loading-page">
    <b-spinner type="grow" variant="primary" />
  </div>
</template>

<script>
export default {
	data: () => ({
		loading: false
	}),
	methods: {
		start () {
			this.loading = true
		},
		finish () {
			this.loading = false
		}
	}
}
</script>

<style scoped>
    .loading-page {
        z-index: 10000;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 1);
        text-align: center;
        padding-top: 45vh;
        font-size: 30px;
        font-family: sans-serif;
    }
</style>
