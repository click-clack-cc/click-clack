<template>
    <div>
        <b-modal
            id="search-results-user-preview-modal"
            ref="search-results-user-preview-modal"
            centered
            hide-header
            ok-only
        >
            <OtherUserDataPreview :inspected-user="userSelected" />
        </b-modal>

        <h2>Members</h2>
        <br>
        <div v-if="this.users && this.users.length > 0">
            <b-card v-for="(u, index) in this.users" :key="index" class="user-thumbnail">
                <b-avatar
                    :src="`https://click-clack.cc:5000/files/images/${u._id}.jpg`"
                    badge-offset="-0.3rem"
                    button
                    class="avatar"
                    size="3rem"
                    variant="light"
                    @click="previewUser(u.id)"
                >
                    <template v-if="u.role == 'admin'" v-slot:badge>
                        <b-icon v-b-tooltip.right icon="shield-shaded" title="Administrator" />
                    </template>
                    <template v-else-if="u.role == 'verified'" v-slot:badge>
                        <b-icon v-b-tooltip.right icon="check-circle" title="Verified user" />
                    </template>
                    <template v-else-if="u.role == 'supporter'" v-slot:badge>
                        <b-icon v-b-tooltip.right icon="heart" title="Supporter" />
                    </template>
                    <template v-else-if="u.role == 'betatester'" v-slot:badge>
                        <b-icon
                            v-b-tooltip.right
                            icon="egg"
                            title="I was there when it all started"
                        />
                    </template>
                    <template v-else-if="u.role == 'developer'" v-slot:badge>
                        <b-icon v-b-tooltip.right icon="cup" title="Developer" />
                    </template>
                </b-avatar>
                <b-link :href="`/u/${u.id}`" class="name">
          <span style="font-weight: bold">
            {{ u.firstname }} {{ u.lastname }}
          </span>
                    <span class="text-muted">
            @{{ u.id }}
          </span>
                </b-link>
                <span v-if="u.recommendations" class="starcount" style="font-size: 1.2rem; color: #ff7700">{{ u.recommendations.length }}<b-icon
                    icon="star-fill"
                    scale="0.8"
                /> </span>
            </b-card>
        </div>
        <div v-else>
            <br>
            <b-icon icon="x" scale="2" style="width: 100%; margin: auto" />
        </div>
        <br>

        <h2>Keyboards</h2>
        <br>
        <div v-if="this.keyboards && this.keyboards.length > 0">
            <Keyboard
                v-for="(keeb, index) in this.keyboards"
                :key="index"
                :keeb="keeb"
                :owner="keeb.owner"
                :show-owner="true"
                :user="user"
            />
        </div>
        <div v-else>
            <br>
            <b-icon icon="x" scale="2" style="width: 100%; margin: auto" />
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { mapState } from 'vuex'
    import searchService from '../services/search-service'
    import userService from '../services/user-service.js'
    import Keyboard from '../components/KeyboardSmall'
    import OtherUserDataPreview from '../components/OtherUserDataPreview'

    export default {
        name: 'Search',
        layout: 'index',
        components: {
            Keyboard,
            OtherUserDataPreview
        },
        props: [],
        data () {
            return {
                keyboards: null,
                users: null,
                userSelected: null
            }
        },
        computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
        watch: {
            search: {
                immediate: true,
                handler () {
                    this.doSearch()
                }
            }
        },
        created () {

        },
        methods: {
            doSearch () {
                searchService.search(this.search).then((results) => {
                    this.keyboards = results.keyboards
                    for (let i = 0; i < this.keyboards.length; i++) {
                        console.log(this.keyboards[i].owner)
                        userService.getUser(this.keyboards[i].owner).then((res) => {
                            this.keyboards[i].owner = res
                        })
                    }
                    this.users = results.users
                })
            },
            previewUser (userid) {
                this.$bvModal.show('search-results-user-preview-modal')
                this.userSelected = null
                userService.getUser(userid).then((result) => {
                    this.userSelected = result
                    Vue.prototype.$forceUpdate()
                })
            }
        }
    }
</script>

<style scoped>
    .avatar {
        margin-left: 1rem;
    }

    .name {
        margin-left: 1.2rem;
        margin-top: 0.5rem;
    }

    .starcount {
        margin-left: 2rem;
    }

    .user-thumbnail {
        margin-top: 0;
    }

    .keyboard-owner-thumbnal {
        margin-top: -1rem
    }

    .image {
        float: left;
        background-size: cover;
        background-repeat: no-repeat;
        margin: 1px;
        background-position: center center;
    }

    .gallery-item-title {
        padding: 0.2rem;
        background: rgba(255, 255, 255, 0.7);
        font-weight: bold;
        color: #000000;
    }

    .keeb-info {
        margin: 1rem;
    }

</style>
