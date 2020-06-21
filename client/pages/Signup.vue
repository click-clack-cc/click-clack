<template>
    <div>
        <b-modal centered id="businessModal" title="Business users" ok-only>
            <b-row class='text-muted' >
                <b-col cols='2' align='middle'>
                    <b-icon scale='2' shift-v='-50' icon='info-circle'></b-icon>
                </b-col>
                <b-col>
                    <p >
                        If you are registering as/on behalf of a business, please proceed with the registration normally and
                        contact <a href="mailto:support@click-clack.cc">support@click-clack.cc</a> at your earliest convenience so we can verify your account and provide
                        business support.
                    </p>
                </b-col>
            </b-row>
        </b-modal>
        <b-card
            id="signup-form-card"
            footer-tag="footer"
        >
            <h4>
                Sign up
            </h4>
            <br>
            <b-form id="signup-form">
                <b-form-group
                    description="We will never share your email with anyone or send you any emails"
                    label="Email address"
                    label-for="input"
                >
                    <b-form-input
                        id="input"
                        v-model="email"
                        placeholder="Enter email"
                        required
                        type="email"
                    />
                </b-form-group>

                <b-form-group
                    label="Username"
                    label-for="input"
                    :description='`click-clack.cc/u/${username?username:""}`'
                >
                    <b-form-input
                        autocomplete="off"
                        id="input"
                        v-model="username"
                        placeholder="Username"
                        required
                        type="text"
                    />
                </b-form-group>

                <b-row>
                    <b-col>
                        <b-form-group
                            label="Display name"
                            label-for="input"
                        >
                            <b-form-input
                                id="input"
                                v-model="displayname"
                                placeholder="Display name"
                                required
                                type="text"
                            />
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col>
                        <b-form-group
                            label="Password"
                            label-for="input"
                        >
                            <b-form-input
                                id="input"
                                v-model="password"
                                placeholder="Password"
                                required
                                type="password"
                            />
                        </b-form-group>

                    </b-col>
                </b-row>
                <b-form-group>
                    <b-form-checkbox-group id="checkbox">
                        <b-form-checkbox v-model="checked" value="me">
                            I have read and I accept the <a  target="_blank" href='/termsandconditions'> Terms and Conditions and the Privacy</a>
                            Policy
                        </b-form-checkbox>
                    </b-form-checkbox-group>
                </b-form-group>
            </b-form>
            <template v-slot:footer>
                <b-row align="middle">
<!--                    <b-col>-->
<!--                        <b-button v-b-modal.businessModal variant='outline-primary'>I'm a business user</b-button>-->
<!--                    </b-col>-->
                    <b-col>
                        <b-button variant="primary" @click="submit">
                            Sign up
                        </b-button>
                    </b-col>
                </b-row>
            </template>
        </b-card>
        <br>
        <br>
    </div>
</template>

<script>

    import { mapState } from 'vuex'
    import userService from '../services/user-service.js'

    export default {
        name: 'Profile',
        components: {},
        layout: 'index',
        props: [],
        data () {
            return {
                username: this.username,
                displayname: this.displayname,
                password: this.password,
                passwordconfirm: this.passwordconfirm,
                email: this.email,
                checked: this.checked
            }
        },
        computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
        methods: {
            submit () {
                if (!this.validate()) {
                    return
                }

                userService.signUp(this.username, this.email, this.displayname, this.password).then((data) => {
                    if (data.user && data.token) {
                        this.$cookies.set('id', data.user.id, '7d')
                        this.$cookies.set('token', data.token, '7d')

                        window.location.href = '/profile'
                    }
                }).catch((error) => {
                    this.$bvToast.toast(error.response.statusText, {
                        title: 'Error',
                        variant: 'danger',
                        toaster: 'b-toaster-top-center'
                    })
                })
            },
            validate () {
                let valid = true
                let allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
                if (this.displayname) {
                    if (this.displayname.length < 2 || this.displayname.length > 20) {
                        valid = false
                    }
                    for (let i = 0; i < this.displayname.length; i++) {
                        if (!allowedCharacters.includes(this.displayname.charAt(i))) {
                            valid = false
                        }
                    }
                } else {
                    valid = false
                }

                if (!valid) {
                    this.$bvToast.toast('Please enter a valid display/nickname', {
                        title: 'Error',
                        variant: 'danger',
                        toaster: 'b-toaster-top-center'
                    })
                    return false
                }

                valid = true
                allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.'.split('')
                if (this.username) {
                    if (this.username.length < 4 || this.username.length > 16) {
                        valid = false
                    }
                    for (let i = 0; i < this.username.length; i++) {
                        if (!allowedCharacters.includes(this.username.charAt(i))) {
                            valid = false
                        }
                    }
                } else {
                    valid = false
                }
                if (!valid) {
                    this.$bvToast.toast('Your username has to be between 4 and 16 characters and contain letters a-z, A-Z, numbers, "-", "_" or "."', {
                        title: 'Error',
                        variant: 'danger',
                        toaster: 'b-toaster-top-center'
                    })
                    return false
                }

                valid = true
                allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.@'.split('')
                if (this.email) {
                    if (this.email.length < 5 || this.email.length > 60) {
                        valid = false
                    }
                    for (let i = 0; i < this.email.length; i++) {
                        if (!allowedCharacters.includes(this.email.charAt(i))) {
                            valid = false
                        }
                    }
                } else {
                    valid = false
                }
                if (!valid) {
                    this.$bvToast.toast('Please enter a valid email address', {
                        title: 'Error',
                        variant: 'danger',
                        toaster: 'b-toaster-top-center'
                    })
                    return false
                }

                if (!this.checked) {
                    this.$bvToast.toast('Please accept the Terms and Conditions to proceed', {
                        title: 'Error',
                        variant: 'danger',
                        toaster: 'b-toaster-top-center'
                    })
                    return false
                }

                if (this.password.length < 10) {
                    this.$bvToast.toast('Your password has to be at least 10 characters long', {
                        title: 'Error',
                        variant: 'danger',
                        toaster: 'b-toaster-top-center'
                    })
                    return false
                }
                return true
            }
        },
        head () {
            const description = 'Sign up to Click-Clack and check out the newest and nicest custom mechanical keyboard builds.'
            const title = 'Sign up to Click-Clack'
            const image = 'https://click-clack.cc:5000/files/images/indeximage.jpg'
            const url = 'https://click-clack.cc/signup'
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
    #signup-form {

    }

    #signup-form-card {
        max-width: 30rem;
        margin: auto;
        margin-top: 4rem;
    }
</style>
