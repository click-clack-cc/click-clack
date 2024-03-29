<template>
  <div @keydown.esc="closeModal">
    <b-row id="toolbar">
      <div>
        <b-button-group v-if="showToolbar">
          <b-dropdown :text="wordLimit + ' words'" right>
            <div v-for="(num, index) in wordOptions" :key="`word-count-option-${index}`" @click="setWordLimit(num)">
              <b-dropdown-divider v-if="num === `Infinite`" />
              <b-dropdown-item>
                <span v-if="num === `Infinite`" style="font-weight: bold; font-size: large">∞</span> {{ num }}
              </b-dropdown-item>
            </div>
          </b-dropdown>
          <b-dropdown :text="wordType" right>
            <b-dropdown-item v-for="(diff, index) in difficultyOptions" :key="`difficulty-option-${index}`" @click="setWordType(diff)">
              {{ diff }}
            </b-dropdown-item>
          </b-dropdown>
          <b-dropdown :text="textBehaviour" right>
            <b-dropdown-item v-for="(tb, index) in textBehaviorOptions" :key="`text-behavior-option-${index}`" @click="setTextBehaviour(tb)">
              {{ tb }}
            </b-dropdown-item>
          </b-dropdown>
          <b-dropdown :text="'Show '+showText" right>
            <!-- Disable option to show all text if infinite words -->
            <b-dropdown-item v-if="wordLimit !== 'Infinite'" @click="setShowText('entire text')">
              Show entire text
            </b-dropdown-item>
            <b-dropdown-item @click="setShowText('10 words')">
              Show 10 words
            </b-dropdown-item>
            <b-dropdown-item @click="setShowText('50 words')">
              Show 50 words
            </b-dropdown-item>
          </b-dropdown>
          <b-dropdown :text="textFont" right>
            <b-dropdown-item v-for="(font, index) in fontOptions" :key="`font-option-${index}`" :style="`font-family: '${font}'`" @click="setTextFont(font)">
              {{ font }}
            </b-dropdown-item>
          </b-dropdown>
        </b-button-group>
        <b-button-group v-if="showToolbar && user" class="mx-1">
          <b-dropdown :text="truncate(selectedKeyboard.name,16,true)" right>
            <b-dropdown-item @click="setKeyboard('No keyboard selected')">
              <span
                :style="{ fontWeight: selectedKeyboard=='No keyboard selected'?'bold':'normal', color: selectedKeyboard=='No keyboard selected'?'#6610f2':''}"
              >
                No keyboard selected
              </span>
            </b-dropdown-item>
            <b-dropdown-item
              v-for="(keeb, index) in user.keyboards"
              :key="index"
              @click="setKeyboard(keeb)"
            >
              <span
                :style="{ fontWeight: selectedKeyboard==keeb?'bold':'normal', color: selectedKeyboard==keeb?'#6610f2':''}"
              >{{ keeb.name }}</span>
            </b-dropdown-item>
          </b-dropdown>
        </b-button-group>
        <span>
          <b-button-group v-if="showToolbar">
            <b-button
              size="sm"
              title="Resets default settings"
              variant="transparent"
              @click="resetSettings"
            >
              <b-icon icon="arrow-repeat" />
            </b-button>
          </b-button-group>
          <b-button-group v-if="showToolbar">
            <b-button
              size="sm"
              variant="transparent"
              @click="toggleZenmode"
            >
              <b-icon v-if="!zenMode" icon="arrows-expand" />
              <b-icon v-else icon="arrows-collapse" />
            </b-button>
          </b-button-group>
          <b-button-group>
            <b-button
              v-b-tooltip.hover.top="`Toggle toolbar`"
              size="sm"
              variant="transparent"
              @click="toggleToolbar"
            >
              <b-icon v-if="showToolbar" icon="chevron-double-left" />
              <b-icon v-else icon="chevron-double-right" />
            </b-button>
          </b-button-group>
        </span>
      </div>
    </b-row>
    <b-card id="typer-card">
      <b-modal ref="done-modal" block centered hide-footer hide-header>
        <h2>
          WPM: {{ (60 / (resultTime / 1000) * (characters / 5)).toFixed(2) }}
        </h2>
        <h5>
          Accuracy adjusted WPM: {{ ((60 / (resultTime / 1000) * (characters /
            5))*(1-(mistakeCounter/wordLimit))).toFixed(2) }}
        </h5>
        <br>
        <b-list-group>
          <b-list-group-item>
            <b-row>
              <b-col cols="8">
                Time
              </b-col>
              <b-col>
                {{ (resultTime/1000).toFixed(1) }} seconds
              </b-col>
            </b-row>
          </b-list-group-item>
          <b-list-group-item>
            <b-row>
              <b-col cols="8">
                Mistyped words
              </b-col>
              <b-col>
                {{ mistakeCounter }}
              </b-col>
            </b-row>
          </b-list-group-item>
          <b-list-group-item>
            <b-row>
              <b-col cols="8">
                Accuracy
              </b-col>
              <b-col>
                {{ (100-mistakeCounter*100/wordCounter).toFixed(1) }}%
              </b-col>
            </b-row>
          </b-list-group-item>
          <br>
          <line-chart
            id="chart"
            :chart-data="wordtimesdatacollection"
            :height="150"
            type="line"
          />

          <b-button
            block
            class="mt-2"
            @click="closeModal"
          >
            Thanks
          </b-button>
        </b-list-group>
      </b-modal>
      <span
        v-for="word in words"
        :key="word.id"
        :class="word.state"
        :style="{fontFamily : textFont, fontSize: `20px`}"
      >{{ word.word +' ' }}</span>
      <br>
    </b-card>
    <b-row id="progress-bars">
      <b-col>
        <b-progress
          id="wpm-bar"
          v-b-tooltip.hover
          :max="200"
          animated
          class="mb-3"
          show-value
          title="Your current WPM"
        >
          <b-progress-bar
            :label-html="`${currentwpm} WPM`"
            :value="currentwpm"
            style="font-weight: bold"
            variant="info"
          />
        </b-progress>
      </b-col>
      <b-col>
        <b-progress
          id="progress-bar"
          v-b-tooltip.hover
          :max="wordLimit === 'Infinite' ? wordCounter : words.length"
          animated
          class="mb-3"
          show-value
          title="Your progress"
        >
          <b-progress-bar
            :value="wordCounter-mistakeCounter"
            style="font-weight: bold"
            variant="success"
          />
          <b-progress-bar :value="mistakeCounter" style="font-weight: bold" variant="danger" />
        </b-progress>
      </b-col>
    </b-row>
    <b-input-group id="input-container">
      <b-form-input
        id="input-field"
        ref="inputfield"
        v-model="uinput"
        :state="inputState"
        autocomplete="off"
        autofocus="autofocus"
        placeholder="Start clacking"
        @keydown="checkState"
        @keydown.enter="enterRedo"
        @keydown.space="nextWord"
        @keydown.space.prevent
        @keyup="checkState"
      />
      <b-input-group-append is-text>
        {{ miniTimer }}
      </b-input-group-append>
      <template v-slot:append>
        <b-dropdown
          id="redo-button"
          v-b-tooltip.hover
          right
          split
          text="Redo"
          title="Press enter to redo quickly"
          variant="secondary"
          @click="redo"
        >
          <b-dropdown-item @click="redoSame">
            Redo same
          </b-dropdown-item>
        </b-dropdown>
      </template>
    </b-input-group>
  </div>
</template>

<script>

import Vue from 'vue'
import easywords from '../assets/easywords.json'
import hardwords from '../assets/hardwords.json'
import LineChart from './charts/LineChart.js'

const wordCounter = 0
const mistakeCounter = 0
const uinput = ''
const wordLimit = 100
const infinitePrefetch = 1000
const wordOptions = [
	10,
	50,
	100,
	250,
	500,
	1000,
	'Infinite'
]
const difficultyOptions = [
	'Easy',
	'Hard',
	'Mixed'
]
const textBehaviorOptions = [
	'Keep typed',
	'Hide typed'
]
const fontOptions = [
	'Courier Prime',
	'IBM Plex Sans',
	'Roboto',
	'Open Sans',
	'Open Sans Condensed',
	'Playfair Display',
	'Poppins',
	'PT Serif',
	'Source Code Pro'
]
const wordType = difficultyOptions[0]
const words = []
let characters = 0
for (let i = 0; i < words.length; i++) {
	characters += words[i].word.length
}
const startTime = null
const finishTime = null
const resultTime = null
const textBehaviour = 'Keep typed'
const textFont = 'IBM Plex Sans'
const showText = '50 words'
const selectedKeyboard = 'No keyboard selected'

function shuffle (array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]]
	}
}

export default {
	name: 'Typer',
	components: {
		LineChart
	},
	props: [
		'user',
		'token'
	],
	data () {
		return {
			wordCounter,
			mistakeCounter,
			words,
			characters,
			uinput,
			wordLimit,
			infinitePrefetch,
			wordOptions,
			difficultyOptions,
			textBehaviorOptions,
			fontOptions,
			startTime,
			finishTime,
			resultTime,
			wordType,
			textBehaviour,
			textFont,
			showText,
			selectedKeyboard,
			miniTimer: '00:00',
			miniTimerInterval: null,
			currentwpm: this.currentwpm,
			wordtimes: [],
			wordtimesdatacollection: this.wordtimesdatacollection,
			infinityCounter: 0,
			showToolbar: true,
			zenMode: false,
			enterToRedo: true
		}
	},
	computed: {
		inputState () {
			if (this.uinput === '') {
				return null
			}
			if (this.words[this.wordCounter]) {
				if (this.wordCounter < this.wordLimit && !this.words[this.wordCounter].word.startsWith(this.uinput)) {
					return false
				} else {
					return null
				}
			} else {
				return null
			}
		}
	},
	watch: {
		user: {
			immediate: true,
			handler () {
				this.loadCookies()
				Vue.prototype.$forceUpdate()
			}
		}
	},
	created () {
		this.zenMode = false
		this.$emit('event', {
			name: 'zen',
			value: false
		})
		this.loadCookies()
		this.redo()
	},
	mounted () {
		window.setTimeout(() => {
			this.$refs.inputfield.$el.focus()
		}, 300)
	},
	methods: {
		getWords (wordLimit, wordType) {
			const newwordlist = []
			for (let i = 0; i < wordLimit; i++) {
				let newword = null
				if (wordType === 'Easy' || (wordType === 'Mixed' && Math.random() < 0.6)) {
					// Prevent duplicate ID when generating on the fly with infinite mode
					newword = {
						id: this.wordLimit === 'Infinite' ? ((this.infinityCounter) * this.infinitePrefetch + i) : i,
						word: easywords[parseInt(Math.random() * easywords.length)],
						state: 'waiting'
					}
				} else if (wordType === 'Hard' || (wordType === 'Mixed')) {
					// Prevent duplicate ID when generating on the fly with infinite mode
					newword = {
						id: this.wordLimit === 'Infinite' ? ((this.infinityCounter) * this.infinitePrefetch + i) : i,
						word: hardwords[parseInt(Math.random() * hardwords.length)],
						state: 'waiting'
					}
				}

				if (!(newword in newwordlist)) {
					newwordlist.push(newword)
				} else {
					i--
				}
			}
			shuffle(newwordlist)

			for (let i = 0; i < newwordlist.length; i++) {
				if (this.showText === '10 words') {
					if (i >= 10) {
						newwordlist[i].state = 'hidden'
					} else {
						newwordlist[i].state = 'waiting'
					}
				} else if (this.showText === '50 words') {
					if (i >= 50) {
						newwordlist[i].state = 'hidden'
					} else {
						newwordlist[i].state = 'waiting'
					}
				}
			}

			newwordlist[0].state = 'next'
			return newwordlist
		},
		nextWord () {
			if (this.uinput === '') {
				return
			}
			if (this.wordCounter < this.words.length) {
				if (this.words[this.wordCounter].word === this.uinput) {
					if (this.textBehaviour === 'Keep typed') {
						this.words[this.wordCounter].state = 'done'
					} else if (this.textBehaviour === 'Hide scroll') {
						this.words[this.wordCounter].state = 'hidden'
					}
				} else {
					if (this.textBehaviour === 'Keep typed') {
						this.words[this.wordCounter].state = 'fail'
					} else if (this.textBehaviour === 'Hide scroll') {
						this.words[this.wordCounter].state = 'hidden'
					}
					this.mistakeCounter++
				}

				if (this.textBehaviour === 'Keep typed') {
					for (let i = 0; i < this.words.length; i++) {
						if (this.showText === '10 words') {
							if ((this.wordCounter + 1) % 10 !== 0) {
								break
							}
							if (i >= this.wordCounter + 11 || i <= this.wordCounter) {
								this.words[i].state = 'hidden'
							} else {
								this.words[i].state = 'waiting'
							}
						} else if (this.showText === '50 words') {
							if ((this.wordCounter + 1) % 50 !== 0) {
								break
							}
							if (i >= this.wordCounter + 51 || i <= this.wordCounter) {
								this.words[i].state = 'hidden'
							} else {
								this.words[i].state = 'waiting'
							}
						}
					}
				} else if (this.textBehaviour === 'Hide typed') {
					for (let i = 0; i < this.words.length; i++) {
						if (this.showText === '10 words') {
							if (i >= this.wordCounter + 11 || i <= this.wordCounter) {
								this.words[i].state = 'hidden'
							} else {
								this.words[i].state = 'waiting'
							}
						} else if (this.showText === '50 words') {
							if (i >= this.wordCounter + 51 || i <= this.wordCounter) {
								this.words[i].state = 'hidden'
							} else {
								this.words[i].state = 'waiting'
							}
						}
					}
				}

				const currentfinishTime = new Date().getTime()
				const currentresultTime = currentfinishTime - this.startTime
				let currentcharacters = 0
				for (let i = 0; i < this.wordCounter; i++) {
					currentcharacters += this.words[i].word.length + 1
				}
				this.currentwpm = Math.round(10 * (60 / (currentresultTime / 1000) * currentcharacters / 5)) / 10
				this.wordtimes.push({
					currentTime: currentfinishTime,
					time: this.wordCounter < 1 ? (currentresultTime) : (currentfinishTime - (this.wordtimes[this.wordtimes.length - 1].currentTime))
				})

				if (this.wordCounter + 1 < this.words.length) {
					this.words[this.wordCounter + 1].state = 'next'
				} else {
					this.wordCounter++
					this.enterToRedo = false
					this.done()
				}

				this.wordCounter++
				this.uinput = ''
			}
			// Fetch new batch of words when current word is close enough to currently stored word count
			if (this.wordLimit === 'Infinite' && this.wordCounter > ((this.infinityCounter + 1) * this.infinitePrefetch - this.infinitePrefetch / 2)) {
				this.infinityCounter++
				const newWords = this.getWords(this.infinitePrefetch, this.wordType)
				newWords.forEach((w) => { w.state = 'hidden' })
				this.words.push(...newWords)
			}
		},
		async done () {
			if (this.miniTimerInterval) {
				clearInterval(this.miniTimerInterval)
				this.miniTimer = '00:00'
			}
			this.$refs['done-modal'].show()
			this.finishTime = new Date().getTime()
			this.resultTime = this.finishTime - this.startTime

			this.wordtimesdatacollection = {
				labels: this.words.map(a => a.word),
				datasets: [
					{
						label: 'Milliseconds per word',
						backgroundColor: 'rgb(93,0,224,0.70)',
						data: this.wordtimes.map(a => a.time),
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

			if (this.user) {
				const accuracy = Math.round(10 * (100 - this.mistakeCounter * 100 / this.wordLimit)) / 10
				const wpm = Math.round(10 * (60 / (this.resultTime / 1000) * this.characters / 5)) / 10
				const wct = Math.round(10 * this.wordLimit) / 10

				if (accuracy < 80) {
					this.$bvToast.toast('Typing test result discarded because your accuracy was below 80%', {
						title: 'Warning',
						toaster: 'b-toaster-top-center',
						variant: 'warning'
					})
				} else if (wct === 10) {
					this.$bvToast.toast('Typing test result discarded', {
						title: '10 word typing tests are not saved in your profile',
						toaster: 'b-toaster-top-center',
						variant: 'info'
					})
				} else {
					const result = {
						keyboard: this.selectedKeyboard._id === 'No keyboard selected' ? null : this.selectedKeyboard._id,
						difficulty: this.wordType.toLowerCase(),
						wct,
						wpm,
						acc: accuracy
					}
					await this.$services.statService.insertStat(
						this.user._id, result, this.token
					)
				}
			}

			this.startTime = null
			this.currentwpm = 0
		},
		enterRedo () {
			if (this.enterToRedo) {
				this.redo()
			}
		},
		redo () {
			if (this.wordLimit === 'Infinite') {
				this.words = this.getWords(this.infinitePrefetch, this.wordType)
				this.infinityCounter = 0
			} else {
				this.words = this.getWords(this.wordLimit, this.wordType)
			}
			this.characters = 0
			for (let i = 0; i < this.words.length; i++) {
				this.characters += this.words[i].word.length + 1
			}
			this.wordCounter = 0
			this.mistakeCounter = 0
			this.uinput = ''
			this.startTime = null
			this.currentwpm = 0
			this.wordtimes = []
			this.enterToRedo = true
			if (this.miniTimerInterval) {
				clearInterval(this.miniTimerInterval)
				this.miniTimer = '00:00'
			}
		},
		redoSame () {
			this.setShowText(this.showText)
			this.infinityCounter = 0
			this.wordtimes = []
			this.enterToRedo = true
			if (this.miniTimerInterval) {
				clearInterval(this.miniTimerInterval)
				this.miniTimer = '00:00'
			}
		},
		setWordLimit (wordNumber) {
			this.wordLimit = wordNumber
			this.$cookies.set('typer.wordLimit', wordNumber, '7d')
			this.redo()
		},
		setShowText (showText) {
			this.showText = showText
			for (let i = 0; i < this.words.length; i++) {
				if (this.showText === '10 words') {
					if (i >= 10) {
						this.words[i].state = 'hidden'
					} else {
						this.words[i].state = 'waiting'
					}
				} else if (this.showText === '50 words') {
					if (i >= 50) {
						this.words[i].state = 'hidden'
					} else {
						this.words[i].state = 'waiting'
					}
				} else {
					this.words[i].state = 'waiting'
				}
			}
			this.words[0].state = 'next'
			this.wordCounter = 0
			this.mistakeCounter = 0
			this.uinput = ''
			this.startTime = null
			this.$cookies.set('typer.showText', showText, '7d')
		},
		setWordType (wordType) {
			this.wordType = wordType
			if (this.wordLimit === 'Infinite') {
				this.words = this.getWords(this.infinitePrefetch, this.wordType)
				this.infinityCounter = 0
			} else {
				this.words = this.getWords(this.wordLimit, this.wordType)
			}
			this.wordCounter = 0
			this.mistakeCounter = 0
			this.uinput = ''
			this.startTime = null
			this.$cookies.set('typer.wordType', wordType, '7d')
		},
		setKeyboard (keyboard) {
			this.selectedKeyboard = keyboard

			this.$cookies.set('typer.keyboard', keyboard._id, '7d')
		},
		setKeyboardByID (id) {
			if (this.user) {
				if (!this.user.keyboards) {
					return
				}
				for (let i = 0; i < this.user.keyboards.length; i++) {
					if (this.user.keyboards[i]._id === id) {
						this.selectedKeyboard = this.user.keyboards[i]
						this.$cookies.set('typer.keyboard', this.selectedKeyboard._id, '7d')
					}
				}
			}
		},
		checkState () {
			if (this.wordCounter < this.words.length) {
				if (!this.words[this.wordCounter].word.startsWith(this.uinput)) {
					this.words[this.wordCounter].state = 'next danger'
				} else {
					this.words[this.wordCounter].state = 'next'
				}
				if (this.wordCounter === this.wordLimit - 1) {
					if (this.words[this.wordCounter].word === this.uinput) {
						this.nextWord()
					}
				}

				if (this.startTime === null && this.uinput.length > 0) {
					this.startTime = new Date().getTime()
					this.startMiniTimer()
				}
			}
		},
		startMiniTimer () {
			if (this.miniTimerInterval) {
				clearInterval(this.miniTimerInterval)
				this.miniTimer = '00:00'
			}
			this.miniTimerInterval = setInterval(() => {
				let s = Math.floor((new Date() - this.startTime) / 1000)
				let m = Math.floor(s / 60)
				s = s % 60
				if (s < 10) { s = '0' + s }
				if (m < 10) { m = '0' + m }
				this.miniTimer = `${m}:${s}`
			}, 1000)
		},
		setTextBehaviour (behaviour) {
			this.textBehaviour = behaviour
			this.$cookies.set('typer.textBehaviour', behaviour, '7d')
		},
		setTextFont (font) {
			this.textFont = font
			this.$cookies.set('typer.textFont', font, '7d')
		},
		resetSettings () {
			this.textFont = 'Poppins'
			this.setWordType('Easy')
			this.setWordLimit(100)
			this.setTextBehaviour('Keep typed')
			this.setKeyboard('No keyboard selected')
		},
		closeModal () {
			this.$refs['done-modal'].hide()
			this.redo()
		},
		toggleToolbar () {
			this.showToolbar = !this.showToolbar
		},
		toggleZenmode () {
			this.zenMode = !this.zenMode
			this.$emit('event', {
				name: 'zen',
				value: this.zenMode
			})
			this.$store.commit('updateZenmode', this.zenMode)
		},
		loadCookies () {
			if (process.server) {
				return
			}
			if (this.$cookies.get('typer.wordLimit')) {
				this.setWordLimit(this.$cookies.get('typer.wordLimit'))
			}
			if (this.$cookies.get('typer.textFont')) {
				this.setTextFont(this.$cookies.get('typer.textFont'))
			}
			if (this.$cookies.get('typer.wordType')) {
				this.setWordType(this.$cookies.get('typer.wordType'))
			}
			if (this.$cookies.get('typer.textBehaviour')) {
				this.setTextBehaviour(this.$cookies.get('typer.textBehaviour'))
			}
			if (this.$cookies.get('typer.keyboard')) {
				this.setKeyboardByID(this.$cookies.get('typer.keyboard'))
			}
			if (this.$cookies.get('typer.showText')) {
				this.setShowText(this.$cookies.get('typer.showText'))
			}
		},
		truncate (str, n, useWordBoundary) {
			if (!str) {
				return 'Keyboard'
			}
			if (str.length <= n) {
				return str
			}
			const subString = str.substr(0, n - 1)
			return (useWordBoundary
				? subString.substr(0, subString.lastIndexOf(' '))
				: subString)
		}
	}
}
</script>

<style scoped>
    #typer-card {
        font-size: x-large;
    }

    #input-field {

    }

    #input-container {
        margin-top: 0.5rem;
    }

    #redo-button {

    }

    #progress-bar, #wpm-bar {
        margin-top: 1.5rem;
    }

    #toolbar {
        margin-left: -0.2rem;
        margin-bottom: 1rem;
        margin-top: 6rem;
    }

    .waiting {

    }

    .next {
        /*font-weight: bold;*/
        overflow: hidden;
        text-shadow: 0.3px 0.3px 0.1px black;
    }

    .done {
        color: #5d00e0;
    }

    .fail {
        color: #930022;
    }

    .hidden {
        display: none;
    }

    .danger {
        color: #930022;
    }

    #currentwpm {
        margin-top: 1rem;
    }
</style>
