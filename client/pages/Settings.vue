<template>
    <div>
        <h4>
            Themes
            <br>
            <br>
        </h4>
        <b-modal
            id="theme-preview-modal"
            ref="theme-preview-modal"
            centered
            ok-only
            size="xl"
            title="Theme preview"
            @hidden="reset"
            @ok="reset"
            v-if='previewSelection'
        >
            <ThemePreview

                :theme="previewSelection"
                style="margin: 5rem"
            />
        </b-modal>
        <b-row>
            <b-col v-for="(theme, index) in themes" :id="`preview_${theme.name}`" :key="index" cols="6">
                <b-card
                    :title='`"${theme.name}\"`'
                    footer-tag="footer"
                    style="margin-bottom: 2rem; height: 26rem"
                >
                    <b-card-text>
                        <h6>
                            {{ theme.category }}
                        </h6>
                    </b-card-text>
                    <br>
                    <b-card-text>{{ theme.desc }}</b-card-text>
                    <b-row style="bottom: 0">
                        <b-col
                            v-for="(colour, index) in theme.colours"
                            :key="index"
                            :style="`height: 8rem; background-color: ${colour}`"
                        >
                            <p style="bottom: 0; width: 100%; padding: 0.4rem; font-weight: bolder; background: rgba(130,130,130,0.5)">
                                {{ colour }}
                            </p>
                        </b-col>
                    </b-row>
                    <template v-slot:footer>
                        <div>
                            <b-icon
                                v-if="isEnabled(theme.name)"
                                icon="lock"
                                style="margin-right: 1rem"
                                variant="primary"
                            />
                            <b-icon v-else icon="unlock" style="margin-right: 1rem" variant="primary" />
                            <b-button
                                :disabled="isEnabled(theme.name)"
                                :variant="currentLightTheme!==theme.name?'outline-primary':'primary'"
                                href="#"
                                style="margin-right: 1rem"
                                @click="setLightTheme(theme.name)"
                            >
                                <b-icon icon="sun" />
                                Use
                            </b-button>
                            <b-button
                                :disabled="isEnabled(theme.name)"
                                :variant="currentDarkTheme!==theme.name?'outline-primary':'primary'"
                                href="#"
                                style="margin-right: 1rem"
                                @click="setDarkTheme(theme.name)"
                            >
                                <b-icon icon="moon" />
                                Use
                            </b-button>
                            <b-button href="#" variant="outline-secondary" @click="previewTheme(theme.name)">
                                <b-icon icon="eye" />
                                Preview
                            </b-button>
                        </div>
                    </template>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>

<script>

    import { mapState } from 'vuex'
    import ThemePreview from '../components/ThemePreview'

    export default {
        name: 'Settings',
        layout: 'index',
        components: {
            ThemePreview
        },
        props: [],
        data () {
            return {
                themes: [
                    {
                        name: 'light',
                        desc: 'Default light theme. Clean and elegant.',
                        category: 'Base theme'
                    }, {
                        name: 'fekete',
                        desc: 'Default dark theme.',
                        category: 'Base theme'
                    }, {
                        name: 'pressó',
                        desc: 'Original click-clack theme. Achieve 100WPM on a typing test to unlock it.',
                        colours: [
                            '#e9ecef',
                            '#f70',
                            '#6610f2',
                            '#fff'
                        ],
                        category: 'Unlockable'
                    }, {
                        name: 'cinnamon-latte',
                        desc: 'Warm and friendly. Achieve 125WPM on a typing test to unlock it.',
                        colours: [
                            '#d7d6d4',
                            '#adaca6',
                            '#836E5B'
                        ],
                        category: 'Unlockable'
                    }, {
                        name: 'blueberry-cappucino',
                        desc: 'Just something sweet. Finish 100 typing tests to unlock this cute theme.',
                        colours: [
                            '#f2eaf3',
                            '#ceb0d9',
                            '#b0d9d6'
                        ],
                        category: 'Unlockable'
                    }, {
                        name: 'iced-mocha',
                        desc: 'Cold and refreshing.',
                        colours: [
                            '#2a2a2a',
                            '#8fffea',
                            '#bababa'
                        ],
                        category: '❤️ Supporter only'
                    }, {
                        name: 'mint-latte',
                        desc: 'Refined and smooth.',
                        colours: [
                            '#f3eeea',
                            '#BDD9B0',
                            '#836E5B'
                        ],
                        category: '❤️ Supporter only'
                    }, {
                        name: 'americano',
                        desc: '69 20 6c 75 76 20 63 6f 66 79 ',
                        colours: [
                            '#2bbf4a',
                            '#000000'
                        ],
                        category: '❤️ Supporter only'
                    }
                ],
                previewSelection: this.previewSelection,
                currentLightTheme: 'light',
                currentDarkTheme: 'dark'
            }
        },
        computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
        created () {
            if (process.server) {
                return
            }
            this.currentLightTheme = this.$cookies.get('lighttheme')
            this.currentDarkTheme = this.$cookies.get('darktheme')

            if (this.currentLightTheme === null) {
                this.lightTheme = 'light'
            }
            if (this.currentDarkTheme === null) {
                this.darkTheme = 'dark'
            }
        },
        methods: {
            setLightTheme (theme) {
                if (this.isEnabled(theme)) {
                    return
                }
                if (!this.user) {
                    this.$router.push('/profile')
                    return
                }
                this.$cookies.set('lighttheme', theme, '7d')
                this.$router.go()
            },
            setDarkTheme (theme) {
                if (this.isEnabled(theme)) {
                    return
                }
                if (!this.user) {
                    this.$router.push('/profile')
                    return
                }
                this.$cookies.set('darktheme', theme, '7d')
                this.$router.go()
            },
            previewTheme (theme) {
                this.$nextTick(() => {
                    this.previewSelection = theme
                    this.$nextTick(() => {
                        this.$bvModal.show('theme-preview-modal')
                    })
                })
            },
            reset () {
                this.$router.go()
            },
            isEnabled (theme) {
                if (!this.user) {
                    return true
                }
                if (theme === 'pressó') {
                    if (!this.user.achievements) {
                        return true
                    }
                    return !this.user.achievements.includes('100wpm')
                } else if (theme === 'cinnamon-latte') {
                    if (!this.user.achievements) {
                        return true
                    }
                    return !this.user.achievements.includes('125wpm')
                } else if (theme === 'blueberry-cappucino') {
                    if (!this.user.achievements) {
                        return true
                    }
                    return !this.user.achievements.includes('100tests')
                } else if (theme === 'mint-latte') {
                    return !['supporter', 'developer', 'admin'].includes(this.user.role)
                } else if (theme === 'americano') {
                    return !['supporter', 'developer', 'admin'].includes(this.user.role)
                } else if (theme === 'iced-mocha') {
                    return !['supporter', 'developer', 'admin'].includes(this.user.role)
                }
            }
        },
        head () {
            const description = 'Sign up to Click-Clack and check out the newest and nicest custom mechanical keyboard builds.'
            const title = 'Click-Clack - Settings'
            const image = 'https://click-clack.cc:5000/files/images/indeximage.jpg'
            const url = 'https://click-clack.cc/settings'
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

                    { name: 'twitter:image', hid: 'twitter:image', property: 'twitter:image', content: image },
                    { name: 'og:image', hid: 'og:image', property: 'og:image', content: image },
                    { name: 'image', hid: 'image', property: 'image', content: image },

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
    /*#preview_light */

    /*#preview_dark*/

    /*#preview_espresso*/

    /*#preview_blueberry-cappucino*/

    /*#preview_mint-latte*/

    /*#preview_americano*/
</style>
