<template>
    <div id="self-user-data-container">
        <b-overlay :show="loading" blur="0.5rem" opacity="1" variant="transparent">
            <b-list-group>
                <b-list-group-item>
                    <b-row>
                        <b-col align="left">
                            <b-avatar
                                :src="img"
                                badge-offset="-0.4rem"
                                class="avatar"
                                size="4rem"
                                variant="light"
                            >
                                <template v-if="role == 'admin'" v-slot:badge>
                                    <b-icon v-b-tooltip.right icon="shield-shaded" title="Administrator"/>
                                </template>
                                <template v-else-if="role == 'verified'" v-slot:badge>
                                    <b-icon v-b-tooltip.right icon="check-circle" title="Verified user"/>
                                </template>
                                <template v-else-if="role == 'supporter'" v-slot:badge>
                                    <b-icon v-b-tooltip.right icon="heart" title="Supporter"/>
                                </template>
                                <template v-else-if="role == 'betatester'" v-slot:badge>
                                    <b-icon
                                        v-b-tooltip.right
                                        icon="egg"
                                        title="I was there when it all started"
                                    />
                                </template>
                                <template v-else-if="role == 'developer'" v-slot:badge>
                                    <b-icon v-b-tooltip.right icon="cup" title="Developer"/>
                                </template>
                            </b-avatar>
                        </b-col>
                        <b-col id="name" align="left" cols="9">
                            <h2>
                                {{ userName }} <span v-if="showStarCount" style="font-size: 1.2rem; color: #ff7700">{{ recommendations.length }}<b-icon
                                icon="star-fill"
                                scale="0.8"
                            /> </span>
                                <p class="text-muted" style="font-size: 1.2rem">
                                    @{{ publicUserName }}
                                </p>
                            </h2>
                        </b-col>
                        <b-col align="right">
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
                </b-list-group-item>
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
                                badge-offset="-0.5rem"
                                size="6rem"
                            >
                                <template v-if="role == 'admin'" v-slot:badge>
                                    <b-icon v-b-tooltip.right icon="shield-shaded" title="Administrator"/>
                                </template>
                                <template v-else-if="role == 'verified'" v-slot:badge>
                                    <b-icon v-b-tooltip.right icon="check-circle" title="Verified user"/>
                                </template>
                                <template v-else-if="role == 'supporter'" v-slot:badge>
                                    <b-icon v-b-tooltip.right icon="heart" title="Supporter"/>
                                </template>
                            </b-avatar>
                        </b-col>
                        <br>
                        <b-form>
                            <br>
                            <br>
                            <b-row>
                                <b-col align="left" cols="9">
                                    <b-form-file
                                        v-model="file"
                                        :state="Boolean(file)"
                                        accept=".jpg"
                                        drop-placeholder="Drop file here..."
                                        placeholder="Choose a file or drop it here..."
                                    />
                                </b-col>
                                <b-col align="middle">
                                    <b-button variant="outline-primary" @click="uploadImage">
                                        Upload
                                    </b-button>
                                </b-col>
                            </b-row>
                        </b-form>
                        <br>
                        <b-form-group
                            :state="editUsernameState"
                            label-for="username-input"
                        >
                            <h5>
                                User ID
                            </h5>
                            <b-input-group id="username-input" prepend="@">
                                <b-form-input

                                    v-model="editUsername"
                                    :state="editUsernameState"
                                    required
                                />
                                <b-form-invalid-feedback :state="editUsernameState">
                                    This user ID is either already taken or inappropriate.
                                </b-form-invalid-feedback>
                                <b-form-valid-feedback :state="editUsernameState">
                                    Looks Good.
                                </b-form-valid-feedback>
                            </b-input-group>

                            <h5>
                                First name (nickname)
                            </h5>
                            <b-input-group id="firstname-input">
                                <b-form-input
                                    v-model="editFirstname"
                                    :state="editFirstnameState"
                                    required
                                />
                                <b-form-invalid-feedback :state="editFirstnameState">
                                    Please input a valid first name
                                </b-form-invalid-feedback>
                                <b-form-valid-feedback :state="editFirstnameState">
                                    Looks Good.
                                </b-form-valid-feedback>
                            </b-input-group>

                            <h5>
                                Last name (optional)
                            </h5>
                            <b-input-group id="secondname-input">
                                <b-form-input
                                    v-model="editSecondname"
                                    :state="editSecondnameState"
                                    required
                                />
                                <b-form-invalid-feedback :state="editSecondnameState">
                                    Please input a valid second name or leave empty
                                </b-form-invalid-feedback>
                                <b-form-valid-feedback :state="editSecondnameState">
                                    Looks Good.
                                </b-form-valid-feedback>
                            </b-input-group>
                        </b-form-group>
                    </form>
                </b-modal>
                <b-modal
                    id="keeb-edit-modal"
                    ref="keeb-edit-modal"
                    centered
                    title="New keyboard"
                    @ok="handleKeebOk"
                >
                    <form ref="form" @submit.stop.prevent="handleKeebSubmit">
                        <b-form @submit="handleKeebOk">
                            <b-form-group label="Build title">
                                <b-form-input
                                    v-model="editKeyboard.name"
                                    placeholder="Enter name of this build"
                                    required
                                />
                            </b-form-group>
                            <b-form-group label="Description">
                                <b-form-textarea
                                    v-model="editKeyboard.description"
                                    max-rows="4"
                                    placeholder="What makes your build special?"
                                    required
                                    rows="2"
                                />
                            </b-form-group>
                            <b-form-group label="Layout">
                                <b-form-select
                                    v-model="editKeyboard.layout"
                                    :options="[{value: null, text: 'Please select a layout'}, 'sub 40', '40', '50', '60', '65', '75', '87', '1800', 'Full', 'Battlecruiser', 'Battleship', 'Other']"
                                    required
                                />
                            </b-form-group>
                            <b-form-group label="Switches">
                                <b-form-input
                                    v-model="editKeyboard.switches"
                                    placeholder="Enter switch type/model"
                                    required
                                />
                            </b-form-group>
                            <b-form-group label="Keycap set">
                                <b-form-input
                                    v-model="editKeyboard.keycaps"
                                    placeholder="Enter keycap set name"
                                    required
                                />
                            </b-form-group>
                            <b-form-group label="Case">
                                <b-form-input
                                    v-model="editKeyboard.case"
                                    placeholder="Enter case name"
                                    required
                                />
                            </b-form-group>
                            <b-form-group label="PCB">
                                <b-form-input
                                    v-model="editKeyboard.pcb"
                                    placeholder="Enter PCB type"
                                    required
                                />
                            </b-form-group>
                            <b-form-group label="Photos">
                                <b-form-file
                                    v-model="photos"
                                    accept="image/jpeg, image/png"
                                    multiple
                                >
                                </b-form-file>
                            </b-form-group>
                        </b-form>
                    </form>
                </b-modal>
                <b-list-group-item>
                    <b-row>
                        <b-col cols="10">
                            <h4>
                                Bio
                            </h4>
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
                        {{bio}}
                    </b-row>
                </b-list-group-item>
                <b-list-group-item id="keyboards">
                    <b-row>
                        <b-col cols="10">
                            <h4>
                                Keyboards
                            </h4>
                        </b-col>
                        <b-col align="right">
                            <b-button
                                id="edit-keebs-button"
                                v-b-modal.keeb-edit-modal
                                size="sm"
                                variant="outline-primary"
                            >
                                <b-icon icon="plus"/>
                            </b-button>
                        </b-col>
                    </b-row>
                    <b-card-group columns :style='`column-count: ${this.keyboards.length>1?2:1}`'
                                  v-if="keyboards && keyboards.length > 0">
                        <Keyboard
                            v-for="(keeb, index) in keyboards"
                            :key="index"
                            :keeb="keeb"
                            :owner="user"
                            :show-edit="true"
                            :show-owner="false"
                            :token="token"
                            :user="user"
                        />
                    </b-card-group>

                </b-list-group-item>
                <b-list-group-item id="listings">
                    <b-row>
                        <b-col cols="10">
                            <h4>
                                Listings
                            </h4>
                        </b-col>
                        <b-col align="right">
                            <b-button
                                id="edit-listings-button"
                                @click='$nuxt.$router.push(`/newlisting`)'
                                size="sm"
                                variant="outline-primary"
                            >
                                <b-icon icon="plus"/>
                            </b-button>
                        </b-col>
                    </b-row>
                    <br>
                    <b-card-group columns :style='`column-count: ${listings.length>1?2:1}`' v-if="listings">
                        <ListingSmall style='display: inline-block; width: 100%'
                                      v-for="(listing, index) in listings"
                                      :listing="listing"
                                      :owner="user"
                                      :show-owner="true"
                                      :token="token"
                                      :user="user"
                                      :showEdit="true"
                                      :key="index">
                        </ListingSmall>
                    </b-card-group>
                </b-list-group-item>
            </b-list-group>
        </b-overlay>
    </div>
</template>

<script>
    import userService from '../services/user-service'
    import keyboardService from '../services/keyboard-service'
    import fileService from '../services/file-service'
    import Keyboard from './KeyboardSmall'
    import listingService from "../services/listing-service";
    import ListingSmall from "./ListingSmall";

    export default {
        name: 'SelfUserData',
        components: {
            Keyboard,
            ListingSmall
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

            listingService.getOwn(this.user._id).then((listings) => {
                this.listings = listings
            })

            this.newKeyboard = this.user.keyboards
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
            handleKeebSubmit() {
                if (!this.editKeyboard.name ||
                    !this.editKeyboard.description ||
                    !this.editKeyboard.layout ||
                    !this.editKeyboard.switches ||
                    !this.editKeyboard.keycaps ||
                    !this.editKeyboard.pcb ||
                    !this.editKeyboard.case) {
                    this.$bvToast.toast('Please fill in every field to submit keyboard', {
                        title: 'Warning',
                        toaster: 'b-toaster-top-center',
                        variant: 'danger'
                    })
                    return
                }
                if (this.editKeyboard.name.length < 1 ||
                    this.editKeyboard.description.length < 1 ||
                    this.editKeyboard.layout.length < 1 ||
                    this.editKeyboard.switches.length < 1 ||
                    this.editKeyboard.keycaps.length < 1 ||
                    this.editKeyboard.pcb.length < 1 ||
                    this.editKeyboard.case.length < 1) {
                    this.$bvToast.toast('Please fill in every field to submit keyboard', {
                        title: 'Warning',
                        toaster: 'b-toaster-top-center',
                        variant: 'danger'
                    })
                    return
                }
                if (this.editKeyboard.name.length > 100 ||
                    this.editKeyboard.description.length > 500 ||
                    this.editKeyboard.layout.length > 100 ||
                    this.editKeyboard.switches.length > 100 ||
                    this.editKeyboard.keycaps.length > 100 ||
                    this.editKeyboard.pcb.length > 100 ||
                    this.editKeyboard.case.length > 100) {
                    this.$bvToast.toast('One of your fields is too long', {
                        title: 'Warning',
                        toaster: 'b-toaster-top-center',
                        variant: 'danger'
                    })
                    return
                }

                if (this.photos.length > 0) {
                    if (!this.editKeyboard.images) {
                        this.editKeyboard.images = []
                    }
                    for (let i = 0; i < this.photos.length; i++) {
                        this.editKeyboard.images.push(`${this.editKeyboard.name.replace(' ', '-').replace(/[^a-z0-9d-]/ig, '').toLowerCase()}_${i + this.editKeyboard.images.length}.${this.photos[i].name.split('.')[1]}`)
                    }
                }

                keyboardService.newKeyboard(this.user._id, this.editKeyboard, this.token).then(() => {
                    if (this.photos) {
                        fileService.uploadKeyboardImages(
                            this.user._id,
                            this.editKeyboard.name.replace(' ', '-').replace(/[^a-z0-9d-]/ig, '').toLowerCase(),
                            this.photos,
                            this.token
                        ).catch((error) => {
                            this.$bvToast.toast(error.response.statusText, {
                                title: 'Error',
                                toaster: 'b-toaster-top-center',
                                variant: 'danger'
                            })
                        })
                    }
                    this.$bvToast.toast('Successfully added new keyboard', {
                        title: 'Success',
                        toaster: 'b-toaster-top-center',
                        variant: 'success'
                    })
                    this.$router.go()
                }).catch((error) => {
                    this.$bvToast.toast(error.response.statusText, {
                        title: 'Error',
                        toaster: 'b-toaster-top-center',
                        variant: 'danger'
                    })
                }).then(() => {
                    this.$bvToast.toast('Successfully added new keyboard', {
                        title: 'Success',
                        toaster: 'b-toaster-top-center',
                        variant: 'success'
                    })
                })
                this.$nextTick(() => {
                    this.$bvModal.hide('keeb-edit-modal')
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
                fileService.uploadProfileImage(
                    this.user._id,
                    this.file,
                    this.token
                )
            }
        }
    }
</script>

<style scoped>
    #self-user-data-container {
        width: 100%;
    }

    .avatar {
        margin-top: 1rem;
    }

    #name {
        margin-top: 1rem;
    }

    #bio-card {

    }

    #bio {
        margin: 1rem;
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
