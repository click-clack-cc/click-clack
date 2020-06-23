<template>
    <div id="self-user-data-container">
        <b-overlay :show="loading" blur="0.5rem" opacity="1" variant="transparent">
            <b-list-group>
                <b-list-group-item>
                    <b-row>
                        <b-col align="left" cols="2">
                            <b-avatar id="avatar" :src="img" size="4rem" variant="light">
                                <template v-if="role && role.includes('admin')" v-slot:badge>
                                    <b-icon v-b-tooltip.right icon="shield-shaded" title="Administrator" />
                                </template>
                            </b-avatar>
                        </b-col>
                        <b-col id="name" align="left" cols="10">
                            <h2>
                                {{ userName }} <span v-if="showStarCount" style="font-size: 1.2rem; color: #ff7700">{{ recommendations.length }}<b-icon
                                icon="star-fill"
                                scale="0.8"
                            /> </span>
                                <p class="text-muted" style="font-size: 1.2rem">
                                    {{ publicUserName }}
                                </p>
                            </h2>
                        </b-col>
                        <b-modal
                            v-if="this.user"
                            id="report-modal"
                            ref="report-modal"
                            centered
                            title="Submit report"
                            @ok="handleReportOk"
                        >
                            <form ref="form" @submit.stop.prevent="handleReportSubmit">
                                <br>
                                <b-form-group
                                    label-for="report-input"
                                >
                                    <b-form-textarea
                                        id="recommendation-input"
                                        v-model="editReport"
                                        max-rows="6"
                                        placeholder="Please explain your reason for reporting this user"
                                        required
                                        rows="4"
                                    />
                                </b-form-group>
                            </form>
                        </b-modal>
                    </b-row>
                </b-list-group-item>
                <b-list-group-item id="bio-container">
                    <b-row>
                        <b-col cols="10">
                            <h4>
                                About me
                            </h4>
                        </b-col>
                    </b-row>
                    <b-row>
                        <div v-if='bio' id="bio" v-html='$md.render(bio)'>
                        </div>
                    </b-row>
                </b-list-group-item>
                <!--                <b-list-group-item id="keyboards">-->
                <!--                    <b-row>-->
                <!--                        <b-col cols="10">-->
                <!--                            <h4>-->
                <!--                                Keyboards-->
                <!--                            </h4>-->
                <!--                        </b-col>-->
                <!--                    </b-row>-->
                <!--                    <div v-if="keyboards && keyboards.length > 0">-->
                <!--                        &lt;!&ndash;                        <b-list-group id="keeblist">&ndash;&gt;-->
                <!--                        &lt;!&ndash;                            <b-list-group-item v-bind:key="keeb" v-for="keeb in keyboards">{{keeb}}</b-list-group-item>&ndash;&gt;-->
                <!--                        &lt;!&ndash;                        </b-list-group>&ndash;&gt;-->
                <!--                        <Keyboard :showOwner="false" :keeb="keeb" :owner="inspectedUser" v-for="(keeb, index) in keyboards" v-bind:key="index"></Keyboard>-->
                <!--                    </div>-->
                <!--                </b-list-group-item>-->
            </b-list-group>
        </b-overlay>
    </div>
</template>

<script>

    import userService from '../services/user-service'
    import keyboardService from '../services/keyboard-service'
    // import Keyboard from "./KeyboardSmall"

    export default {
        name: 'OtherUserDataPreview',
        components: {
            // Keyboard
        },
        props: [
            'inspectedUser',
            'user',
            'token'
        ],
        data () {
            return {
                img: this.img,
                userName: this.userName,
                email: this.email,
                bio: this.bio,
                role: this.role,
                keyboards: this.keyboards,
                editBio: this.editBio,
                editKeebs: this.editKeebs,
                editBioState: null,
                loading: true,
                publicUserName: this.publicUserName,
                editRecommendation: this.editRecommendation,
                editReport: this.editReport,
                recommendations: [],
                showStarCount: false,
                canGiveStar: true,
                showStarReportButtons: false
            }
        },
        watch: {
            inspectedUser: {
                immediate: true,
                handler () {
                    this.loadUserData()
                }
            },
            user: {
                immediate: true,
                handler () {
                    this.loadUserData()
                }
            }
        },
        created () {
            this.loadUserData()
        },
        methods: {
            loadUserData () {
                if (this.inspectedUser) {
                    this.img = `https://click-clack.cc:5000/files/images/${this.inspectedUser._id}.jpg`
                    this.userName = this.inspectedUser.firstname + (this.inspectedUser.lastname == null ? '' : (' ' + this.inspectedUser.lastname))
                    this.publicUserName = `@${this.inspectedUser.id}`
                    this.bio = this.inspectedUser.bio
                    this.editBio = this.inspectedUser.bio
                    this.keyboards = this.inspectedUser.keyboards
                    this.role = this.inspectedUser.role
                    this.keyboards = []
                    if (this.inspectedUser.keyboards === null) {
                        this.keyboards = []
                    }
                    keyboardService.getKeyboards(this.inspectedUser._id).then((keebs) => {
                        this.keyboards = keebs
                        for (let i = 0; i < this.keyboards.length; i++) {
                            for (let j = 0; j < this.keyboards[i].images.length; j++) {
                                this.keyboards[i].images[j] = `https://click-clack.cc:5000/files/images/${this.keyboards[i].images[j]}`
                            }
                        }
                    })
                    this.loading = false
                    this.recommendations = this.inspectedUser.recommendations
                    if (this.user) {
                        if (this.user._id === this.inspectedUser._id) {
                            this.canGiveStar = false
                            this.showStarReportButtons = false
                            this.canReport = false
                        } else {
                            this.showStarReportButtons = true
                        }
                    }

                    if (!this.recommendations) {
                        this.recommendations = []
                    }
                    if (this.recommendations.length > 0) {
                        this.showStarCount = true
                        if (this.user) {
                            for (let i = 0; i < this.recommendations.length; i++) {
                                if (this.recommendations[i].submitter === this.user._id) {
                                    this.canGiveStar = false
                                }
                            }
                        }
                    }
                }
            },
            handleRecommendationOk (bvModalEvt) {
                bvModalEvt.preventDefault()
                this.handleRecommendationSubmit()
            },
            checkRecommendationValidity () {
                if (this.editRecommendation) {
                    if (this.editRecommendation.length > 200) {
                        this.$bvToast.toast('Please make the recommendation less than 200 letters', {
                            title: 'Error',
                            toaster: 'b-toaster-top-center',
                            variant: 'danger'
                        })
                        return false
                    }
                }
                return true
            },
            handleRecommendationSubmit () {
                if (!this.checkRecommendationValidity()) {
                    return
                }
                userService.recommend(this.user._id, this.inspectedUser.id, this.editRecommendation, this.token).then(() => {
                    this.$bvToast.toast('Thank you for your recommendation', {
                        title: 'Success',
                        toaster: 'b-toaster-top-center',
                        variant: 'success'
                    })
                    this.$router.go()
                })

                this.$nextTick(() => {
                    this.$bvModal.hide('bio-edit-modal')
                })
            },
            handleReportOk (bvModalEvt) {
                bvModalEvt.preventDefault()
                this.handleReportSubmit()
            },
            checkReportValidity () {
                if (this.editReport) {
                    if (this.editReport.length > 500 || this.editReport.length < 50) {
                        this.$bvToast.toast('Please make the recommendation 50 - 500 letters', {
                            title: 'Error',
                            toaster: 'b-toaster-top-center',
                            variant: 'danger'
                        })
                        return false
                    }
                    return true
                } else {
                    this.$bvToast.toast('Please make the recommendation 50 - 500 letters', {
                        title: 'Error',
                        toaster: 'b-toaster-top-center',
                        variant: 'danger'
                    })
                    return false
                }
            },
            handleReportSubmit () {
                if (!this.checkReportValidity()) {
                    return
                }
                userService.report(this.user._id, this.inspectedUser.id, this.editReport, this.token).then(() => {
                    this.$bvToast.toast('Thank you for your report', {
                        title: 'Success',
                        toaster: 'b-toaster-top-center',
                        variant: 'success'
                    })
                    this.$router.go()
                })

                this.$nextTick(() => {
                    this.$bvModal.hide('bio-edit-modal')
                })
            }
        }
    }
</script>

<style scoped>
    #self-user-data-container {
        width: 100%;
    }

    #avatar {
        margin-bottom: 1rem;
        margin-top: 0.5rem;
        position: absolute;
    }

    #name {
        margin-top: 0.5rem;
    }

    #bio-card {

    }

    #bio {
        margin: 1rem;
        margin-top: 0rem;
    }

    #edit-bio-button {
    }

    #keyboards {

    }

    #keeblist {
        margin-top: 1rem;
    }

    #star-report-button-group {
        margin-top: 0.5rem;
    }
</style>
