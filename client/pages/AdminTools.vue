<template>
    <div>

        <h4>Announcement</h4>
        <b-row>
            <b-col>
                <b-row>
                    <b-col>
                        <b-form-group label="Text">
                            <b-textarea v-model='announcement' rows='4' placeholder='Announcement'>
                            </b-textarea>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        Preview
                        <div v-html="$md.render( announcement?announcement:``)"></div>
                    </b-col>
                </b-row>
                <b-button @click='submitAnnouncement'>
                    Submit Announcement
                </b-button>
            </b-col>
        </b-row>
        <br>
        <h4>Moderation</h4>
        <b-card class='dataListCard'>
            <h5>New Posts</h5>
            <b-table fixed hover striped small :fields='postFields'
                     :items="posts">
                <template v-slot:cell(userdata)="data">
                    <a :href='`/u/${data.value.id}`'>{{data.value.firstname}} @{{data.value.id}}</a>
                </template>
                <template v-slot:cell(lastModified)="data">
                    {{ format(data.value) }}
                </template>
                <template v-slot:cell(_id)="data">
                    <b-button size='sm' @click='$nuxt.$router.push(`/post/${data.value}`)'> Visit</b-button>
                </template>
            </b-table>
        </b-card>
        <b-card class='dataListCard'>
            <h5>New Listings</h5>
            <b-table fixed hover striped small :fields='listingFields'
                     :items="listings">
                <template v-slot:cell(userdata)="data">
                    <a :href='`/u/${data.value.id}`'>{{data.value.firstname}} @{{data.value.id}}</a>
                </template>
                <template v-slot:cell(state)="data">
                    <span v-if="data.value.state === 'approved'" style='color: green; font-weight: bold'>Approved</span>
                    <span v-if="data.value.state === 'declined'" style='color: red; font-weight: bold'>Declined</span>
                    <span v-if="data.value.state === 'pending'">
                        <b-button @click='approveListing(data.value.id)' variant='success'>
                            APPROVE
                        </b-button>
                        <b-button @click='declineListing(data.value.id)' variant='danger'>
                            DECLINE
                        </b-button>
                    </span>
                </template>
                <template v-slot:cell(lastModified)="data">
                    {{ format(data.value) }}
                </template>
                <template v-slot:cell(_id)="data">
                    <b-button size='sm' @click='$nuxt.$router.push(`/listing/${data.value}`)'> Visit</b-button>
                </template>
            </b-table>
        </b-card>
        <b-card class='dataListCard'>
            <h5>New Keyboards</h5>
            <b-table fixed hover striped small :fields='keyboardFields'
                     :items="keyboards">
                <template v-slot:cell(userdata)="data">
                    <a :href='`/u/${data.value.id}`'>{{data.value.firstname}} @{{data.value.id}}</a>
                </template>
                <template v-slot:cell(lastModified)="data">
                    {{ format(data.value) }}
                </template>
                <template v-slot:cell(_id)="data">
                    <b-button size='sm' @click='$nuxt.$router.push(`/keyboard/${data.value}`)'> Visit</b-button>
                </template>
            </b-table>
        </b-card>
        <b-card class='dataListCard'>
            <h5>New Users</h5>
            <b-table fixed hover striped small :fields='userFields'
                     :items="users">
                <template v-slot:cell(id)="data">
                    <a :href='`/u/${data.value}`'>@{{data.value}}</a>
                </template>
                <template v-slot:cell(createdAt)="data">
                    {{ format(data.value) }}
                </template>
                <template v-slot:cell(idcopy)="data">
                    <b-button size='sm' @click='$nuxt.$router.push(`/u/${data.value}`)'> Visit</b-button>
                </template>
            </b-table>
        </b-card>
    </div>
</template>

<script>
    import postService from "../services/post-service";
    import userService from "../services/user-service";
    import keyboardService from "../services/keyboard-service";
    import listingService from "../services/listing-service";
    import {format} from "timeago.js"
    import announcementService from "../services/announcement-service";
    import {mapState} from "vuex";

    export default {
        name: 'AdminTools',
        layout: 'index',
        computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
        async asyncData() {
            return {
                posts: await postService.getNewPosts('new'),
                listings: [],
                keyboards: await keyboardService.getNewKeyboards('new'),
                users: (await userService.getNewUsers()).map(user => ({...user, idcopy: user.id})),
            }
        },
        data() {
            return {
                postFields: [{
                    key: 'userdata',
                    label: 'User',
                    sortable: true
                }, "title", {
                    key: 'lastModified',
                    label: 'Date',
                    sortable: true
                }, {
                    key: '_id',
                    label: 'URL',
                    sortable: true
                }],
                listingFields: [{
                    key: 'userdata',
                    label: 'User',
                    sortable: true
                }, "name", {
                    key: 'state',
                    label: 'State',
                    sortable: true
                }, {
                    key: 'lastModified',
                    label: 'Date',
                    sortable: true
                }, {
                    key: "_id",
                    label: 'URL',
                    sortable: true
                }],
                keyboardFields: [{
                    key: 'userdata',
                    label: 'User',
                    sortable: true
                }, "name", {
                    key: 'lastModified',
                    label: 'Date',
                    sortable: true
                }, {
                    key: "_id",
                    label: 'URL',
                    sortable: true
                }],
                userFields: ["firstname", {
                    key: 'id',
                    label: 'ID',
                    sortable: true
                }, {
                    key: 'createdAt',
                    label: 'Date',
                    sortable: true
                }, {
                    key: 'idcopy',
                    label: 'URL',
                    sortable: true
                }],
                announcement: null
            }
        },
        watch: {
            user: {
                immediate: true,
                handler() {
                    this.getAdminLimitedStuff();
                }
            }
        },
        async created() {
            this.getAdminLimitedStuff();
        },
        methods: {
            getAdminLimitedStuff() {
                if(!this.user) return;
                listingService.getNewListingsForMod(this.user._id, this.token).then((res) => {
                    this.listings = res.map(listing => ({
                        ...listing,
                        state: {state: listing.state, id: listing._id}
                    }))
                }).catch((e) => {
                    this.$bvToast.toast(e.statusText, {
                        variant: `danger`,
                        title: `Error`,
                        toaster: 'b-toaster-top-center'
                    })
                })
            },
            submitAnnouncement() {
                if (!this.announcement || this.announcement.length < 25) {
                    this.$bvToast.toast(`You probably don't want to announce that`, {
                        variant: `danger`,
                        title: `Error`,
                        toaster: 'b-toaster-top-center'
                    })
                }
                announcementService.sendAnnouncement(this.user._id, this.announcement, this.token).then((res) => {
                    this.$bvToast.toast(`Announcement published successfully`, {
                        variant: `success`,
                        title: `Success`,
                        toaster: 'b-toaster-top-center'
                    })
                }).catch((res) => {
                    this.$bvToast.toast(res.statusText, {
                        variant: `danger`,
                        title: `Error`,
                        toaster: 'b-toaster-top-center'
                    })
                })
            },
            approveListing(id) {
                listingService.approve(this.user._id, id, this.token).then((res) => {
                    this.$bvToast.toast(`Listing approved`, {
                        variant: `success`,
                        title: `Success`,
                        toaster: 'b-toaster-top-center'
                    })
                }).catch((res) => {
                    this.$bvToast.toast(res.statusText, {
                        variant: `danger`,
                        title: `Error`,
                        toaster: 'b-toaster-top-center'
                    })
                })
            },
            declineListing(id) {
                listingService.decline(this.user._id, id, this.token).then((res) => {
                    this.$bvToast.toast(`Listing declined`, {
                        variant: `success`,
                        title: `Success`,
                        toaster: 'b-toaster-top-center'
                    })
                }).catch((res) => {
                    this.$bvToast.toast(res.statusText, {
                        variant: `danger`,
                        title: `Error`,
                        toaster: 'b-toaster-top-center'
                    })
                })
            },
            format
        }
    }
</script>

<style scoped>
    .dataListCard {
        max-height: 20rem;
        overflow-y: scroll;
        margin-bottom: 1rem;
    }
</style>
