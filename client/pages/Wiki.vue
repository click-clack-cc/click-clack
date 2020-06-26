<template>
  <div>
    <div id="title">
      <h4>
        <b-icon scale="1.6" style="margin-right: 0.5rem; margin-bottom: 0.2rem" icon="files" />
        Keyboard Wiki
      </h4>
      <p class="text-muted">
        Powered by <a href="https://keyboardapi.readme.io/">Keyboard API</a>
      </p>
    </div>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Switches" active>
          <b-row>
            <b-col>
              <div id="toolbar">
                <b-button-group>
                  <b-dropdown text="Manufacturer" />
                  <b-dropdown text="Type" />
                  <b-dropdown text="RGB" />
                  <b-dropdown text="Actuation Force" />
                </b-button-group>
                <b-button-group>
                  <b-button>
                    Sort by
                  </b-button>
                  <b-button>
                    <b-icon icon="chevron-up" />
                  </b-button>
                </b-button-group>
                <b-button-group>
                  <b-button v-b-tooltip.top="`Card view`">
                    <b-icon icon="grid" />
                  </b-button>
                  <b-button v-b-tooltip.top="`Compact list`">
                    <b-icon icon="list" />
                  </b-button>
                </b-button-group>
              </div>
            </b-col>
            <b-col align="right" cols="2">
              {{ switches.length + ` switches` }}
            </b-col>
          </b-row>
          <div>
            <b-row>
              <b-col v-for="(sw, i) in switches" :key="i" cols="4">
                <b-card class="dataCard" header-tag="header">
                  <template v-slot:header>
                    <b-row no-gutters>
                      <b-col align="left" cols="2">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 1024 1024">
                          <path
                            fill="none"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M204.502 512.298v-22.598l22.598-13.085 28.548-34.49 34.49-16.649 55.903-103.477 128.461-35.683-2.378-60.659 9.514-7.135 2.378-14.27 23.791-7.135 24.977 15.463 36.876-10.706 17.841 16.649-1.193 52.339 191.499 98.721 24.977 95.157 28.548 17.841 16.649 40.44 28.548 17.841-3.571 30.926-36.876 11.892v30.926l-15.463 82.072-21.413 8.328-13.085-7.135-52.339 22.598-7.135 11.892-3.571 48.767 2.378-52.339-53.524 20.22-21.412 15.463h-23.791l-91.586 27.355-30.926-5.949-15.463 8.328-5.949 26.169-13.085-2.378-19.034-5.949-15.463-2.378-7.135-14.27-134.404-110.62-14.27-2.378-5.949-14.27-17.841-17.841-13.085-109.427z"
                          />
                          <path
                            fill="none"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M264.174 546.657l190.082 140.459 24.39 10.936 27.751-4.206 329.697-110.176"
                          />
                          <path
                            fill="none"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M422.292 382.645l110.176 68.963 140.459-41.212"
                          />
                          <path
                            fill="none"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M562.751 391.9l-2.525-106.814"
                          />
                          <path
                            fill="none"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M498.83 391.056l34.482-12.617-1.681-54.666"
                          />
                          <path
                            fill="none"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M460.142 615.62l35.326 21.865c0 0 93.36-23.553 91.672-26.914s-23.553-118.587-23.553-118.587"
                          />
                          <path
                            fill="none"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M730.117 454.141l24.39 103.452 57.191-14.298"
                          />
                          <path
                            fill="none"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M314.634 514.693l113.544 77.375"
                          />
                        </svg>
                      </b-col>
                      <b-col align="left" cols="7">
                        <h6>{{ sw.manufacturer }}</h6>
                        <h5>{{ sw.name }}</h5>
                      </b-col>
                      <b-col align="right">
                        <p class="text-muted">
                          {{ sw.yearintroduced }}
                        </p>
                      </b-col>
                    </b-row>
                  </template>
                  <b-row>
                    <b-col cols="6">
                      <span style="font-weight: bold">Type </span><br> {{ sw.type }}
                    </b-col>
                    <b-col cols="6">
                      <span style="font-weight: bold">RGB Variant </span><br> {{ sw.rgbvarient?"Available":"No" }}
                    </b-col>
                    <b-col cols="6">
                      <span style="font-weight: bold">Actuation Force </span><br> {{ sw.operating_force }}g
                    </b-col>
                    <b-col cols="6">
                      <span style="font-weight: bold">Bottom Out Force </span><br> {{ sw.bottomout_force }}g
                    </b-col>
                    <b-col cols="6">
                      <span style="font-weight: bold">Pre Travel </span><br> {{ sw.pretravel }}mm
                    </b-col>
                    <b-col cols="6">
                      <span style="font-weight: bold">Total Travel </span><br> {{ sw.totaltravel }}mm
                    </b-col>
                    <b-col v-if="sw.sellers && sw.sellers.length > 0" cols="12">
                      <span style="font-weight: bold">Sellers </span><br>
                      <a v-for="(seller, index) in sw.sellers" :key="index" :href="seller"> - {{ truncate(seller, 30, false) }}
                        <b-icon icon="link45deg" />
                      </a>
                    </b-col>
                  </b-row>
                </b-card>
              </b-col>
            </b-row>
          </div>
        </b-tab>
        <b-tab title="Keycaps" />
        <b-tab title="Cases">
          <div>
            <b-row>
              <b-col v-for="(cs, j) in cases" :key="j" cols="4">
                <b-card class="dataCard" header-tag="header">
                  <template v-slot:header>
                    <b-row>
                      <b-col cols="2">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 1024 1024">
                          <path
                            fill="none"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M36.864 499.961l171.757 179.785 788.155-245.593-197.439-150.887z"
                          />
                          <path
                            fill="none"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M36.864 499.961l-9.632 104.337 36.918 25.682 16.049-4.812 125.207 115.574 783.336-252.017 8.028-54.578"
                          />
                          <path
                            fill="none"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M147.618 535.275l643.685-192.626 8.028-59.391"
                          />
                          <path
                            fill="none"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M791.303 342.649l89.892 60.995"
                          />
                          <path
                            fill="none"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M221.462 527.247l43.342 51.362 468.72-150.887"
                          />
                        </svg>
                      </b-col>
                      <b-col align="left">
                        <h6>{{ cs.manufacturer }}</h6>
                        <h5>{{ cs.name }}</h5>
                      </b-col>
                    </b-row>
                  </template>
                  <b-row>
                    <b-col cols="6">
                      <span style="font-weight: bold">Size </span><br> {{ cs.size }}
                    </b-col>
                    <b-col cols="6">
                      <span style="font-weight: bold">Material </span><br> {{ cs.material }}
                    </b-col>
                    <b-col v-if="cs.colors && cs.colors.length > 0" cols="12">
                      <span style="font-weight: bold">Variants </span><br>
                      <a v-for="(seller, k) in cs.colors" :key="k">{{ truncate(seller, 30, false) }}, </a>
                    </b-col>
                    <b-col v-if="cs.sellers && cs.sellers.length > 0" cols="12">
                      <span style="font-weight: bold">Sellers </span><br>
                      <a v-for="(seller, k) in cs.sellers" :key="k" :href="seller"> - {{ truncate(seller, 30, false) }}
                        <b-icon icon="link45deg" />
                      </a>
                    </b-col>
                  </b-row>
                </b-card>
              </b-col>
            </b-row>
          </div>
        </b-tab>
        <b-tab title="PCBs">
          <div>
            <b-row>
              <b-col v-for="(cs, j) in pcbs" :key="j" cols="4">
                <b-card class="dataCard" header-tag="header">
                  <template v-slot:header>
                    <b-row>
                      <b-col cols="2">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="38" viewBox="0 0 1024 1024">
                          <path
                            fill="none"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M57.946 357.789h911.669v297.811h-911.669v-297.811z"
                          />
                          <path
                            fill="none"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M240.28 412.49l-127.633 189.93"
                          />
                          <path
                            fill="none"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M347.585 412.868l-126.872 188.792"
                          />
                          <path
                            fill="none"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M450.713 412.868l-126.683 188.792"
                          />
                          <path
                            fill="none"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M561.443 412.49l-128.015 189.17"
                          />
                          <path
                            fill="none"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M678.064 411.73l-127.633 189.93"
                          />
                          <path
                            fill="none"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M795.063 411.73l-127.633 189.93"
                          />
                          <path
                            fill="none"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M907.313 411.73l-127.633 189.93"
                          />
                          <path
                            fill="none"
                            stroke-linejoin="miter"
                            stroke-linecap="butt"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M60.984 603.937l718.697-2.277"
                          />
                          <path
                            fill="none"
                            stroke-linejoin="miter"
                            stroke-linecap="butt"
                            stroke-miterlimit="4"
                            stroke-width="24"
                            stroke="currentColor"
                            d="M240.28 412.49l727.814-1.521"
                          />
                        </svg>
                      </b-col>
                      <b-col align="left">
                        <h6>{{ cs.manufacturer }}</h6>
                        <h5>{{ cs.name }}</h5>
                      </b-col>
                    </b-row>
                  </template>
                  <b-row>
                    <b-col cols="6">
                      <span style="font-weight: bold">Size </span><br> {{ cs.size }}
                    </b-col>
                    <b-col cols="6">
                      <span style="font-weight: bold">Material </span><br> {{ cs.material }}
                    </b-col>
                    <b-col cols="6">
                      <span style="font-weight: bold">Color </span><br> {{ cs.color }}
                    </b-col>
                    <b-col cols="6">
                      <span style="font-weight: bold">Underglow </span><br> {{ cs.rgbunderglow?`Yes`:`No` }}
                    </b-col>
                    <b-col cols="6">
                      <span style="font-weight: bold">Switch Lighting </span><br> {{ cs.rgbswitch?`Yes`:`No` }}
                    </b-col>
                    <b-col cols="6">
                      <span style="font-weight: bold">Hotswappable </span><br> {{ cs.hotswappable?`Yes`:`No` }}
                    </b-col>
                    <b-col cols="6">
                      <span style="font-weight: bold">Firmware </span><br> {{ cs.firmware }}
                    </b-col>
                    <b-col v-if="cs.usboptions && cs.usboptions.length > 0" cols="12">
                      <span style="font-weight: bold">Connector options </span><br>
                      <a v-for="(seller, k) in cs.usboptions" :key="k">{{ truncate(seller, 30, false) }}, </a>
                    </b-col>
                    <b-col v-if="cs.sellers && cs.sellers.length > 0" cols="12">
                      <span style="font-weight: bold">Sellers </span><br>
                      <a v-for="(seller, k) in cs.sellers" :key="k" :href="seller"> - {{ truncate(seller, 30, false) }}
                        <b-icon icon="link45deg" />
                      </a>
                    </b-col>
                  </b-row>
                </b-card>
              </b-col>
            </b-row>
          </div>
        </b-tab>
        <b-tab title="Plates" />
        <b-tab title="Builds" />
        <b-tab title="A-Z" />
      </b-tabs>
    </b-card>
  </div>
  <!--        CASES-->
  <!--       {{cases}}-->
  <!--        PLATES-->
  <!--       {{plates}}-->
  <!--        PCBS-->
  <!--       {{pcbs}}-->
</template>

<script>

export default {
	name: 'Wiki',
	layout: 'index',
	async asyncData ({ app }) {
		const switches = await app.$services.keyboardAPIService.getSwitches()
		const keycaps = await app.$services.keyboardAPIService.getKeycaps()
		const cases = await app.$services.keyboardAPIService.getCases()
		const plates = await app.$services.keyboardAPIService.getPlates()
		const pcbs = await app.$services.keyboardAPIService.getPCBs()

		return {
			switches,
			keycaps,
			cases,
			plates,
			pcbs
		}
	},
	data () {
		return {}
	},
	watch: {},
	methods: {
		truncate (str, n, useWordBoundary) {
			if (str.length <= n) {
				return str
			}
			const subString = str.substr(0, n - 1)
			return (useWordBoundary
				? subString.substr(0, subString.lastIndexOf(' '))
				: subString) + '...'
		}
	},
	head () {
		const description = 'Click-Clack Wiki'
		const title = 'Click-Clack Wiki'
		const url = 'https://click-clack.cc/wiki'
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

				// {name: 'twitter:image', hid: 'twitter:image', property: 'twitter:image', content: image},
				// {name: 'og:image', hid: 'og:image', property: 'og:image', content: image},
				// {name: 'image', hid: 'image', property: 'image', content: image},

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
	#title {
		margin-top: 2rem;
		margin-left: 1rem;
	}

	.dataCard {
		margin-bottom: 2rem;
	}

	#toolbar {
		margin-bottom: 2rem;
	}
</style>
