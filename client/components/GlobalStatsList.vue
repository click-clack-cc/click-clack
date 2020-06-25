<template>
  <div role="tablist">
    <b-card class="mb-1" no-body>
      <b-card-header class="p-1" header-tag="header" role="tab">
        <b-button v-b-toggle.accordion-1 block variant="light">
          Statistics
        </b-button>
      </b-card-header>
      <b-collapse id="accordion-1" accordion="my-accordion" role="tabpanel" visible>
        <b-modal
          id="user-preview-modal"
          ref="user-preview-modal"
          centered
          hide-header
          ok-only
        >
          <other-user-data :inspected-user="userSelected" />
        </b-modal>
        <b-overlay :show="loading" blur="0.5rem" opacity="1" variant="transparent">
          <b-row style="width: 80%; margin: auto">
            <b-col>
              <b-form-select
                v-model="selectedDataRange"
                :options="dataRangeOptions"
                class="mt-3"
                size="sm"
                @change="loadData"
              />
            </b-col>
            <b-col>
              <b-form-select
                v-model="selectedDifficulty"
                :options="difficultyOptions"
                class="mt-3"
                size="sm"
                @change="loadData"
              />
            </b-col>
          </b-row>
          <b-card-body>
            <b-row id="values">
              <b-col>
                <b-list-group>
                  <b-list-group-item>
                    <b-row>
                      <b-col>
                        Last {{ testsTaken }} tests
                      </b-col>
                    </b-row>
                  </b-list-group-item>
                  <b-list-group-item>
                    <b-row>
                      <b-col>
                        Highest WPM
                      </b-col>
                      <b-col align="right">
                        {{ highestWPM.toFixed(1) }}
                      </b-col>
                    </b-row>
                  </b-list-group-item>
                </b-list-group>
              </b-col>
              <b-col>
                <b-list-group>
                  <b-list-group-item>
                    <b-row>
                      <b-col>
                        Average Adjusted WPM
                      </b-col>
                      <b-col align="right" cols="3">
                        {{ avgWPM.toFixed(1) }}
                      </b-col>
                    </b-row>
                  </b-list-group-item>
                  <b-list-group-item>
                    <b-row>
                      <b-col>
                        Average Accuracy
                      </b-col>
                      <b-col align="right">
                        {{ avgAcc.toFixed(1) }} %
                      </b-col>
                    </b-row>
                  </b-list-group-item>
                </b-list-group>
              </b-col>
            </b-row>

            <div v-if="testsTaken > 0">
              <div>
                <div>
                  <line-chart
                    id="chart"
                    :chart-data="datacollection1"
                    :height="150"
                    type="line"
                  />
                </div>
              </div>
            </div>
            <div v-else>
              <p align="middle">
                No data to show yet
              </p>
            </div>

            <b-row id="doughnuts" align="middle">
              <b-col>
                <doughnut-chart
                  v-if="datacollection2"
                  :chart-data="datacollection2"
                  :height="200"
                  type="pie"
                />
              </b-col>
              <b-col>
                <doughnut-chart
                  v-if="datacollection3"
                  :chart-data="datacollection3"
                  :height="200"
                  type="pie"
                />
              </b-col>
            </b-row>
          </b-card-body>
        </b-overlay>
      </b-collapse>
    </b-card>

    <b-card class="mb-1" no-body>
      <b-card-header class="p-1" header-tag="header" role="tab">
        <b-button v-b-toggle.accordion-2 block variant="light">
          Results
        </b-button>
      </b-card-header>
      <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <b-table
            id="stats-table"
            :busy.sync="loading"
            :fields="fields"

            :items="stats"
            borderless
            foot-clone
            small
          >
            <template v-slot:cell(adjustedwpm)="data">
              <p style="font-weight: bold">
                {{ data.value.toFixed(1) }}
              </p>
            </template>
            <template v-slot:cell(wpm)="data">
              <p>{{ data.value.toFixed(1) }}</p>
            </template>
            <template v-slot:cell(acc)="data">
              <p>{{ data.value.toFixed(1) }}</p>
            </template>
            <template v-slot:cell(userdata)="data">
              <div @click="previewUser(data.value._id)">
                <b-avatar
                  :src="`https://click-clack.cc:5000/files/images/${data.value._id}.jpg`"
                  button
                  class="avatar"
                  size="2rem"
                  style="margin-right: 1rem"
                  variant="light"
                  @click="previewUser(data.value._id)"
                />
                <b-link :href="`/u/${data.value.id}`" class="name">
                  {{ data.value.firstname }} {{ data.value.lastname }}
                </b-link>
                <span class="text-muted"> @{{ data.value.id }} </span>
              </div>
            </template>
            <template v-slot:cell(createdAt)="data">
              <p>{{ format(data.value) }}</p>
            </template>

            <template v-slot:table-busy>
              <div class="text-center text-danger my-2">
                <b-spinner class="align-middle" />
                <strong> Loading...</strong>
              </div>
            </template>
          </b-table>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
import { format } from 'timeago.js'
import Vue from 'vue'
import OtherUserData from '../components/OtherUserData'
import LineChart from './charts/LineChart.js'
import DoughnutChart from './charts/DoughnutChart.js'

const loading = true
const loggedIn = true

const avgWPM = 0
const avgAcc = 0
const highestWPM = 0
const testsTaken = 0

export default {
	name: 'StatsList',
	components: {
		LineChart,
		DoughnutChart,
		OtherUserData
	},
	props: [
		'user'
	],
	data () {
		return {
			fields: [{
				key: 'wct',
				label: 'Word Count',
				sortable: true
			}, {
				key: 'adjustedwpm',
				label: 'Adjusted WPM',
				sortable: true
			}, {
				key: 'wpm',
				label: 'WPM',
				sortable: true
			}, {
				key: 'acc',
				label: 'Accuracy',
				sortable: true
			}, {
				key: 'userdata',
				label: 'User',
				sortable: true
			}, {
				key: 'createdAt',
				label: 'Time',
				sortable: true
			}],
			stats: [],
			dailystats: null,
			error: '',
			text: '',
			loading,
			loggedIn,
			datacollection1: null,
			datacollection2: null,
			datacollection3: null,
			dataRangeOptions: [
				{ value: 'last20', text: 'Last 20 results' },
				{ value: 'last1000', text: 'Last 1000  results' }
			],
			selectedDataRange: 'last20',
			difficultyOptions: [
				{ value: 'all', text: 'All difficulties' },
				{ value: 'easy', text: 'Easy' },
				{ value: 'mixed', text: 'Mixed' },
				{ value: 'hard', text: 'Hard' }
			],
			selectedDifficulty: 'all',
			avgWPM,
			highestWPM,
			avgAcc,
			testsTaken,
			userSelected: this.userSelected
		}
	},
	created () {
		this.loadData()
	},
	methods: {
		loadData () {
			this.$services.statService.getStats().then((result) => {
				this.stats = result.map(a => ({
					...a,
					userdata: {
						_id: a.user,
						id: a.userdata.id,
						firstname: a.userdata.firstname
					}
				}))
				this.fillData()
				this.loading = false
			})
		},
		fillData () {
			const twentyeightdaysago = new Date()
			twentyeightdaysago.setDate(new Date().getDate() - 28)

			const keyboardsstats = []
			const difficultysstats = []

			for (let i = 0; i < this.stats.length; i++) {
				this.stats[i].adjustedwpm = this.stats[i].wpm * this.stats[i].acc / 100

				if (this.selectedDifficulty !== 'all') {
					if (this.stats[i].difficulty !== this.selectedDifficulty) {
						this.stats.splice(i, 1)
						i--
						continue
					}
				}

				if (this.stats[i].keyboard !== null &&
                        this.stats[i].keyboard !== undefined &&
                        this.stats[i].keyboard !== 'No keyboard selected' &&
                        this.stats[i].keyboard !== 'none') {
					let found = false
					for (let j = 0; j < keyboardsstats.length; j++) {
						if (keyboardsstats[j].keyboard === this.stats[i].keyboard) {
							keyboardsstats[j].n++
							found = true
							break
						}
					}
					if (!found) {
						keyboardsstats.push({
							keyboard: this.stats[i].keyboard,
							n: 1
						})
					}
				}

				if (this.stats[i].difficulty !== null &&
                        this.stats[i].difficulty !== undefined) {
					let found = false
					for (let j = 0; j < difficultysstats.length; j++) {
						if (difficultysstats[j].difficulty === this.stats[i].difficulty) {
							difficultysstats[j].n++
							found = true
							break
						}
					}
					if (!found) {
						difficultysstats.push({
							difficulty: this.stats[i].difficulty,
							n: 1
						})
					}
				}
			}

			const doughnutcolours = [
				'rgba(96,7,224,0.70)',
				'rgb(255,119,0,0.70)',
				'rgb(157,224,0,0.70)',
				'rgb(0,224,217,0.70)',
				'rgb(224,0,34,0.70)',
				'rgb(224,187,0,0.70)',
				'rgb(0,146,224,0.70)',
				'rgb(0,224,30,0.70)',
				'rgb(224,0,213,0.70)'
			]

			const keyboardLabels = keyboardsstats.map(a => a.keyboard)
			const keyboardData = keyboardsstats.map(a => a.n)

			this.datacollection2 = {
				labels: keyboardLabels,
				datasets: [{
					data: keyboardData,
					backgroundColor: doughnutcolours,
					borderColor: 'rgba(0,0,0,0)'
				}],
				options: {
					cutoutPercentage: 90,
					legend: {
						position: 'bottom',
						align: 'left',
						boxWidth: 10
					}
				}
			}

			const difficultyLabels = difficultysstats.map(a => a.difficulty)
			const difficultyData = difficultysstats.map(a => a.n)

			this.datacollection3 = {
				labels: difficultyLabels,
				datasets: [{
					data: difficultyData,
					backgroundColor: doughnutcolours,
					borderColor: 'rgba(0,0,0,0)'
				}],
				options: {
					cutoutPercentage: 90,
					legend: {
						position: 'bottom',
						align: 'left',
						boxWidth: 10
					}
				}
			}

			if (this.selectedDataRange === 'last20') {
				this.datacollection1 = {
					labels: this.stats.slice(0, 20).map(a => `${a.createdAt.getDate()}/${a.createdAt.getMonth() + 1}/${a.createdAt.getFullYear()}`).reverse(),
					datasets: [
						{
							label: 'Accuracy (%)',
							backgroundColor: 'rgb(255,119,0,0.70)',
							data: this.stats.slice(0, 20).map(a => a.acc).reverse(),
							pointStyle: 'line',
							position: 'nearest'
						},
						{
							label: 'WPM',
							backgroundColor: 'rgb(93,0,224,0.70)',
							data: this.stats.slice(0, 20).map(a => a.wpm).reverse(),
							pointStyle: 'line',
							position: 'nearest'
						}

					],
					tooltips: {
						mode: 'x-axis',
						intersect: false
					},
					hover: {
						mode: 'nearest',
						intersect: true
					}
				}
			} else {
				this.datacollection1 = {
					labels: this.dailystats.map(a => `${a.createdAt.getDate()}/${a.createdAt.getMonth() + 1}/${a.createdAt.getFullYear()}`).reverse(),
					datasets: [
						{
							label: 'Accuracy (%)',
							backgroundColor: 'rgb(255,119,0,0.70)',
							data: this.dailystats.map(a => a.acc).reverse(),
							lineTension: 0.2,
							position: 'nearest'
						},
						{
							label: 'WPM',
							backgroundColor: 'rgb(93,0,224,0.70)',
							data: this.dailystats.map(a => a.wpm).reverse(),
							pointStyle: 'line',
							position: 'nearest'
						}
					],
					tooltips: {
						mode: 'x-axis',
						intersect: false
					},
					hover: {
						mode: 'nearest',
						intersect: true
					}
				}
			}

			this.avgWPM = 0
			this.avgAcc = 0
			this.highestWPM = 0
			for (let i = 0; i < this.stats.length; i++) {
				this.avgWPM += (this.stats[i].adjustedwpm / this.stats.length)
				this.avgAcc += (this.stats[i].acc / this.stats.length)
				if (this.stats[i].wpm > this.highestWPM) {
					this.highestWPM = this.stats[i].wpm
				}
			}
			this.testsTaken = this.stats.length
		},
		previewUser (userid) {
			this.$bvModal.show('user-preview-modal')
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
    #stats-table {
        vertical-align: middle !important;
        text-align: center !important;
    }

    #values {
        margin: 1rem;
        margin-left: 5.3rem;
        margin-right: 5.3rem;
    }

    #doughnuts {
        margin-top: 3.5rem;
        margin-bottom: 2rem;
        margin-left: 2rem;
        margin-right: 2rem;
    }

    #chart {
        margin-left: 6rem;
        margin-right: 6rem;
        margin-top: 2rem;
    }
</style>
