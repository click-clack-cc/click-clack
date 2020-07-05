<template>
  <b-alert
    class="position-fixed fixed-bottom m-0 rounded-0"
    style="z-index: 2000; "
    variant="info"
    show
    @dismissed="cookiesClosed"
  >
    <b-container>
      <b-row no-gutters>
        <b-col cols="12" align="left">
          <div class="d-flex flex-md-row flex-column align-items-md-center align-items-stretch justify-content-between">
            <div class="d-flex align-items-center justify-content-start">
              <b-icon class="align-middle d-md-block d-none mr-3" icon="info-circle" scale="1.4" />
              <div>We use a few cookies to save your settings and for basic analytics. We hope you're okay with that.</div>
              <button class="remove-style" @click="cookiesClosed">
                <b-icon class="align-self-start" icon="x" scale="1.5" />
              </button>
            </div>
            <b-button
              class="d-md-block d-none"
              style="margin-top: -0.5rem; margin-bottom: -0.5rem"
              variant="primary"
              @click="cookiesClosed"
            >
              Okay, thank you
            </b-button>
          </div>
        </b-col>
        <b-col cols="12" class="d-md-none d-block">
          <b-button
            class="mt-3 w-100"
            variant="primary"
            @click="cookiesClosed"
          >
            Okay, thank you
          </b-button>
        </b-col>
      </b-row>
    </b-container>
  </b-alert>
</template>

<script>
export default {
	methods: {
		cookiesClosed () {
			this.$emit('dismiss-cookies')
		}
	}
}
</script>

<style scoped>
.remove-style {
    background-color: transparent;
    border: 0;
    color: rgba(0, 0, 0, 0.7);
    position: fixed;
    bottom: 15px;
    right: 5px;
}

@media (min-width: 768px) and (max-width: 991px) {
    .remove-style {
        bottom: 35px;
    }
}

@media (max-width: 767px) {
    .remove-style {
        position: relative;
    }
}
</style>
