<template>
    <div id="self-user-data-container">
        <b-overlay :show="loading" blur="0.5rem" opacity="1" variant="transparent">
            <b-card style='margin-bottom: 1rem'>
                <b-row no-gutters>

                    <b-col align="middle" lg="3" md='12' sm='12'>
                        <b-card style='border-left: none; border-top: none; border-bottom: none; border-radius: 0; padding-right: 1rem'>
                            <b-row>
                                <b-col>
                                    <b-row>
                                        <b-col>
                                            <b-avatar
                                                :src="img"
                                                badge-offset="-0.4rem"
                                                class="avatar"
                                                size="8rem"
                                                variant="light"
                                            >
                                            </b-avatar>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col align='middle' style='margin-left: 2rem; margin-right: 2.75rem; margin-top: 2rem'>
                                            <b-row>
                                                <b-col align='middle' cols='3'
                                                       v-if="user.role.includes('admin')"
                                                       style='margin-bottom: 1rem'>
                                                    <b-icon scale='1.4' v-b-tooltip.bottom icon="shield-shaded"
                                                            title="Administrator"/>
                                                </b-col>
                                                <b-col cols='3' v-if="user.role.includes('developer')"
                                                       style='margin-bottom: 1rem'>
                                                    <b-icon scale='1.4' v-b-tooltip.bottom icon="cup"
                                                            title="Developer"/>
                                                </b-col>
                                                <b-col align='middle' cols='3'
                                                       v-if="user.role.includes('verified')"
                                                       style='margin-bottom: 1rem'>
                                                    <b-icon scale='1.4' v-b-tooltip.bottom icon="check-circle"
                                                            title="Verified user"/>
                                                </b-col>
                                                <b-col align='middle' cols='3'
                                                       v-if="user.role.includes('partner')"
                                                       style='margin-bottom: 1rem'>
                                                    <b-icon scale='1.4' v-b-tooltip.bottom icon="people"
                                                            title="Click-Clack Partner"/>
                                                </b-col>
                                                <b-col align='middle' cols='3'
                                                       v-if="user.role.includes('supporter')"
                                                       style='margin-bottom: 1rem'>
                                                    <b-icon scale='1.4' v-b-tooltip.bottom icon="heart"
                                                            title="Supporter"/>
                                                </b-col>
                                                <b-col align='middle' cols='3'
                                                       v-if="user.role.includes('betatester')"
                                                       style='margin-bottom: 1rem'>
                                                    <b-icon
                                                        scale='1.4'
                                                        v-b-tooltip.bottom
                                                        icon="egg"
                                                        title="Beta tester - I was there when it all started"
                                                    />
                                                </b-col>
                                            </b-row>
                                        </b-col>
                                    </b-row>
                                </b-col>
                            </b-row>
                        </b-card>
                    </b-col>

                    <b-col id="name" style='padding-left: 1rem' align="left" lg="9" md='12' sm='12'>
                        <b-row>
                            <b-col>
                                <a v-b-modal.recommendationsModal>
                                    <h3>
                                        {{ userName }} <span v-if="showStarCount"
                                                             style="font-size: 1.2rem; color: #ff7700">{{ recommendations.length }}<b-icon
                                        icon="star-fill"
                                        scale="0.8"
                                    /> </span>
                                        <p class="text-muted" style="font-size: 1.2rem">
                                            @{{ publicUserName }}
                                        </p>
                                    </h3>
                                </a>
                            </b-col>
                            <b-col align='right'>
                                <b-button
                                    id="edit-username-button"
                                    style='border: none'
                                    v-b-modal.username-edit-modal
                                    size="sm"
                                    variant="outline-primary"
                                >
                                    <b-icon icon="pencil-square"/>
                                </b-button>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <b-row>
                                    <b-col lg="10" md='12'>
                                        <h5>
                                            About me
                                        </h5>
                                    </b-col>
                                    <b-col align="right">
                                        <b-button
                                            id="edit-bio-button"
                                            v-b-modal.bio-edit-modal
                                            style='border: none'
                                            size="sm"
                                            variant="outline-primary"
                                        >
                                            <b-icon icon="pencil-square"/>
                                        </b-button>
                                    </b-col>
                                </b-row>
                                <b-row id='bio'>
                                    <div v-html='$md.render(bio)'>

                                    </div>
                                </b-row>
                                <b-row no-gutters class='text-muted' style='font-size: x-small'>
                                    <b-col>
                                        <p>
                                            Member since {{dateformat(user.createdAt, "mmmm dS, yyyy")}}<br>
                                            Last active {{dateformat(user.lastLogIn, "mmmm dS, yyyy")}}
                                        </p>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>

                <b-modal
                    id='recommendationsModal'
                    ref='recommendationsModal'
                    centered
                    title='Recommendations'
                    ok-only>
                    <div v-if='user.recommendations && user.recommendations.length > 0'>
                        Other members have said these about {{user.firstname}}
                        <br>
                        <br>
                        <recommendation-list style='margin-bottom: 1rem' v-if="user" :inspected-user="user"/>
                    </div>
                    <div v-else>
                        No recommendations yet
                    </div>

                </b-modal>
                <b-modal
                    id="bio-edit-modal"
                    ref="bio-edit-modal"
                    centered
                    title="Bio"
                    @hidden="resetModal"
                    @ok="handleOk"
                    @show="resetModal"
                >
                    <form ref="form" @submit.stop.prevent="handleSubmit">
                        <b-form-group
                            :state="editBioState"
                            label-for="bio-input"
                        >
                            <b-form-textarea
                                id="name-input"
                                v-model="editBio"
                                :state="editBioState"
                                max-rows="6"
                                required
                                rows="4"
                            />
                        </b-form-group>
                    </form>
                </b-modal>
                <b-modal
                    id="username-edit-modal"
                    ref="username-edit-modal"
                    centered
                    title="User info"
                    @hidden="resetUsernameEditModal"
                    @ok="handleUsernameOk"
                    @show="resetUsernameEditModal"
                >
                    <form ref="form" @submit.stop.prevent="handleUsernameSubmit">
                        <h5>
                            Profile picture
                        </h5>

                        <b-col align="middle">
                            <b-avatar
                                :src="img"
                                variant='light'
                                badge-offset="-0.5rem"
                                size="6rem"
                            >
                            </b-avatar>
                        </b-col>
                        <br>
                        <b-form>
                            <b-row>
                                <b-col align="left" cols="9">
                                    <b-form-file
                                        v-model="file"
                                        accept=".jpg"
                                        drop-placeholder="Drop file here..."
                                        placeholder="Choose a file or drop it here..."
                                    />
                                </b-col>
                                <b-col align="middle">
                                    <b-button :disabled='!Boolean(file)' variant="outline-primary" @click="uploadImage">
                                        Upload
                                    </b-button>
                                </b-col>
                            </b-row>
                        </b-form>
                        <br>
                        <b-form-group
                            label-for="username-input"
                        >
                            <h5>
                                User ID
                            </h5>
                            <b-input-group id="username-input" prepend="@">
                                <b-form-input
                                    v-model="editUsername"
                                    required
                                />
                            </b-input-group>
                            <h5>
                                First name (nickname)
                            </h5>
                            <b-input-group id="firstname-input">
                                <b-form-input
                                    v-model="editFirstname"
                                    required
                                />
                            </b-input-group>
                        </b-form-group>
                    </form>
                </b-modal>

            </b-card>
            <b-card no-body class="mb-1" v-if='keyboards && keyboards.length > 0'>
                <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button block v-b-toggle.keyboards-accordion variant="light">{{keyboards.length}}
                        keyboard{{keyboards.length>1?"s":""}}
                    </b-button>
                </b-card-header>
                <b-collapse visible id="keyboards-accordion" accordion="profile-accordion" role="tabpanel">
                    <div id="keyboards" style='padding: 1rem'>
                        <b-row>
                            <b-col cols="10">
                                <h5>
                                    Keyboards
                                </h5>
                            </b-col>
                            <b-col align="right">
                                <b-button
                                    size="sm"
                                    variant="outline-primary"
                                    @click='$nuxt.$router.push("editkeyboard")'
                                >
                                    <b-icon icon="plus"/>
                                </b-button>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col lg='6' md='12' v-for="(keeb, index) in keyboards" :key="index">
                                <Keyboard
                                    style='margin-bottom: 1rem'
                                    :keeb="keeb"
                                    :owner="user"
                                    :show-edit="true"
                                    :show-owner="false"
                                    :token="token"
                                    :user="user"
                                />
                            </b-col>
                        </b-row>
                    </div>
                </b-collapse>
            </b-card>
            <b-card no-body class="mb-1" v-if='listings && listings.length > 0'>
                <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button block v-b-toggle.listings-accordion variant="light">{{listings.length}} market
                        listing{{listings.length>1?"s":""}}
                    </b-button>
                </b-card-header>
                <b-collapse id="listings-accordion" accordion="profile-accordion" role="tabpanel">
                    <div id="listings" style='padding: 1rem'>
                        <b-row>
                            <b-col cols="10">
                                <h5>
                                    Listings
                                </h5>
                            </b-col>
                            <b-col align="right">
                                <b-button
                                    size="sm"
                                    variant="outline-primary"
                                    @click='$nuxt.$router.push("editlisting")'
                                >
                                    <b-icon icon="plus"/>
                                </b-button>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col lg='6' md='12' v-for="(listing, index) in listings" :key="index">
                                <ListingSmall style='margin-bottom: 1rem'
                                              :listing="listing"
                                              :owner="user"
                                              :show-owner="true"
                                              :token="token"
                                              :user="user"
                                              :showEdit="true"
                                >
                                </ListingSmall>
                            </b-col>
                        </b-row>
                    </div>
                </b-collapse>
            </b-card>
            <b-card no-body class="mb-1" v-if='posts && posts.length > 0'>
                <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button block v-b-toggle.posts-accordion variant="light">{{posts.length}}
                        post{{posts.length>1?"s":""}}
                    </b-button>
                </b-card-header>
                <b-collapse id="posts-accordion" accordion="profile-accordion" role="tabpanel">
                    <div id="posts" style='padding: 1rem'>
                        <b-row>
                            <b-col cols="10">
                                <h5>
                                    Posts
                                </h5>
                            </b-col>
                            <b-col align="right">
                                <b-button
                                    size="sm"
                                    variant="outline-primary"
                                    @click='$nuxt.$router.push("editpost")'
                                >
                                    <b-icon icon="plus"/>
                                </b-button>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col lg='6' md='12' v-for="(post, index) in posts" :key="index">
                                <PostSmall style='margin-bottom: 1rem'
                                           :post="post"
                                           :author="user"
                                           :showAuthor="false"
                                           :token="token"
                                           :user="user"
                                >
                                </PostSmall>
                            </b-col>
                        </b-row>
                    </div>
                </b-collapse>
            </b-card>
        </b-overlay>
    </div>
</template>

<script>
    import userService from '../services/user-service'
    import keyboardService from '../services/keyboard-service'
    import fileService from '../services/file-service'
    import Keyboard from './KeyboardSmall'
    import listingService from "../services/listing-service"
    import ListingSmall from "./ListingSmall"
    import postService from "../services/post-service"
    import PostSmall from "./PostSmall";
    import RecommendationList from "./RecommendationList";
    import dateformat from "dateformat"

    export default {
        name: 'SelfUserData',
        components: {
            Keyboard,
            ListingSmall,
            PostSmall,
            RecommendationList
        },
        props: [
            'user',
            'token'
        ],
        data() {
            return {
                img: this.img,
                userName: this.userName,
                email: this.email,
                bio: this.bio,
                role: this.role,
                keyboards: this.keyboards,
                listings: this.listings,
                posts: this.posts,
                editBio: this.editBio,
                editKeyboard: {layout: null},
                editBioState: this.editBioState,
                loading: true,
                publicUserName: this.publicUserName,
                editUsername: this.editUsername,
                editUsernameState: this.editUsernameState,
                editFirstname: this.editFirstname,
                editFirstnameState: this.editFirstnameState,
                editSecondname: this.editSecondname,
                editSecondnameState: this.editSecondnameState,
                file: this.file,
                photos: this.photos,
                showStarCount: false,
                recommendations: this.recommendations
            }
        },
        created() {
            this.img = `https://click-clack.cc:5000/files/images/${this.user._id}.jpg`
            this.userName = this.user.firstname + (this.user.lastname == null ? '' : (' ' + this.user.lastname))
            this.publicUserName = this.user.id
            this.bio = this.user.bio
            this.editBio = this.user.bio

            this.role = this.user.role

            this.keyboards = []
            if (this.user.keyboards === null) {
                this.keyboards = []
            }
            keyboardService.getKeyboards(this.user._id).then((keebs) => {
                this.keyboards = keebs
            })

            listingService.getOwn(this.user._id, this.token).then((listings) => {
                this.listings = listings
            })

            postService.getOwn(this.user._id).then((posts) => {
                this.posts = posts
            })

            this.loading = false
            this.recommendations = this.user.recommendations
            if (!this.recommendations) {
                this.recommendations = []
            }
            if (this.recommendations.length > 0) {
                this.showStarCount = true
            }
        },
        methods: {
            checkFormValidity() {
                const valid = this.$refs.form.checkValidity()
                this.editBioState = valid
                return valid
            },
            async checkUsernameValidity() {
                let usernameValid = true
                let firstnameValid = true
                let secondnameValid = true
                if (this.editUsername === this.publicUserName) {
                    usernameValid = true
                } else {
                    usernameValid = await userService.validateUsername(this.editUsername)
                }
                const allowedUsernameCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.'.split('')
                if (this.editUsername.length < 4 || this.editUsername.length > 16) {
                    usernameValid = false
                }
                for (let i = 0; i < this.editUsername.length; i++) {
                    if (!allowedUsernameCharacters.includes(this.editUsername.charAt(i))) {
                        usernameValid = false
                    }
                }
                firstnameValid = firstnameValid && this.editFirstname.length > 0
                firstnameValid = firstnameValid && this.editFirstname.length < 50
                secondnameValid = secondnameValid && this.editSecondname.length < 50
                const allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
                for (let i = 0; i < this.editFirstname.length; i++) {
                    if (!allowedCharacters.includes(this.editFirstname.charAt(i))) {
                        firstnameValid = false
                    }
                }
                for (let i = 0; i < this.editSecondname.length; i++) {
                    if (!allowedCharacters.includes(this.editSecondname.charAt(i))) {
                        secondnameValid = false
                    }
                }
                this.editUsernameState = usernameValid
                this.editFirstnameState = firstnameValid
                this.editSecondnameState = secondnameValid

                return usernameValid && firstnameValid && secondnameValid
            },
            resetModal() {
                this.editBio = this.bio
                this.editBioState = null
            },
            resetUsernameEditModal() {
                this.editUsername = this.publicUserName
                this.editUsernameState = null
                this.editFirstname = this.user.firstname
                this.editFirstnameState = null
                this.editSecondname = this.user.lastname
                this.editSecondnameState = null
            },
            handleOk(bvModalEvt) {
                bvModalEvt.preventDefault()
                this.handleSubmit()
            },
            handleKeebOk(bvModalEvt) {
                bvModalEvt.preventDefault()
                this.handleKeebSubmit()
            },
            handleUsernameOk(bvModalEvt) {
                bvModalEvt.preventDefault()
                this.handleUsernameSubmit()
            },
            handleSubmit() {
                if (!this.checkFormValidity()) {
                    return
                }

                userService.changeUserBio(this.user._id, this.editBio, this.token).then(() => {
                    this.$bvToast.toast('Successfully updated your bio', {
                        title: 'Success',
                        toaster: 'b-toaster-top-center',
                        variant: 'success'
                    })
                    this.bio = this.editBio
                    this.$router.go()
                })

                this.$nextTick(() => {
                    this.$bvModal.hide('bio-edit-modal')
                })
            },
            async handleUsernameSubmit() {
                let changed = false
                if (this.editUsername !== this.publicUserName) {
                    if (!await this.checkUsernameValidity()) {
                        return
                    }
                    userService.changeId(this.user._id, this.editUsername, this.token).then(() => {
                        this.publicUserName = this.editUsername
                        this.$cookies.set('id', this.editUsername, '7d')
                        changed = true
                    })
                    this.$router.go()
                }
                if (this.editFirstname !== this.user.firstname && this.token) {
                    if (!await this.checkUsernameValidity()) {
                        return
                    }
                    userService.changeFirstname(this.user._id, this.editFirstname, this.token).then(() => {
                        this.user.firstname = this.editFirstname
                        this.userName = this.user.firstname + ' ' + this.user.lastname
                        changed = true
                    })
                    this.$router.go()
                }

                if (this.editSecondname !== this.user.lastname) {
                    if (!await this.checkUsernameValidity()) {
                        return
                    }
                    userService.changeLastname(this.user._id, this.editSecondname, this.token).then(() => {
                        this.user.lastname = this.editSecondname
                        this.userName = this.user.firstname + ' ' + this.user.lastname
                        changed = true
                    })
                    this.$router.go()
                }

                if (changed) {
                    this.$bvToast.toast('Successfully updated user info', {
                        title: 'Success',
                        toaster: 'b-toaster-top-center',
                        variant: 'success'
                    })
                    this.$router.go()
                }
                this.$nextTick(() => {
                    this.$bvModal.hide('username-edit-modal')
                })
            },
            uploadImage() {
                this.loading = true
                fileService.uploadProfileImage(
                    this.user._id,
                    this.file,
                    this.token
                ).then((res) => {
                    this.loading = false
                    this.$nuxt.$forceUpdate()
                    this.$bvToast.toast('Successfully updated profile picture', {
                        title: 'Success',
                        toaster: 'b-toaster-top-center',
                        variant: 'success'
                    })
                }).catch((e) => {
                    this.loading = false
                    this.$bvToast.toast('Failed to update profile picture', {
                        title: 'Error',
                        toaster: 'b-toaster-top-center',
                        variant: 'danger'
                    })
                })
            },
            dateformat
        }
    }
</script>

<style scoped>
    #self-user-data-container {
        width: 100%;
    }

    .avatar {
        /*margin-top: 1rem;*/
    }

    #name {
        /*margin-top: 1rem;*/
    }

    #bio-card {

    }

    #bio {
        margin: 0;
        /*margin: 1rem;*/
    }

    #edit-bio-button {
    }

    #edit-username-button {
        /*margin: 1rem;*/
    }

    #keyboards {

    }

    #keeblist {
        margin-top: 1rem;
    }

    #username-input, #firstname-input, #secondname-input {
        margin-bottom: 2rem;
    }
</style>
