<template>
    <b-card id="new-users-container" header-tag="header">
        <b-modal
            id="new-members-user-preview-modal"
            ref="new-members-user-preview-modal"
            centered
            hide-header
            ok-only
        >
            <OtherUserDataPreview :inspected-user="userSelected" />
        </b-modal>
        <template v-slot:header>
            <h4 class="mb-0">
                Newest Members
            </h4>
        </template>
        <div v-if="!newMembersLoading" id="newest-members-body">
            <b-row v-for="(user, index) in users" :key="index" class="user-thumbnail">
                <b-avatar
                    :src="`https://click-clack.cc:5000/files/images/${user._id}.jpg`"
                    button
                    class="avatar"
                    size="2rem"
                    variant="light"
                    @click="previewUser(user.id)"
                />
                <b-link :href="`/u/${user.id}`" class="name">
                    {{ user.firstname }} {{ user.lastname }}
                    <span class="text-muted"> @{{ user.id }} </span>
                </b-link>
                <b-col>
                    <p align="right" class="text-muted timeago">
                        {{ format(user.createdAt) }}
                    </p>
                </b-col>
            </b-row>
        </div>
        <div v-else id="loading" class="text-center">
            <b-spinner :variant="'primary'" type="grow" />
        </div>
    </b-card>
</template>

<script>
    import Vue from 'vue'
    import { format } from 'timeago.js'
    import userService from '../services/user-service.js'
    import OtherUserDataPreview from '../components/OtherUserDataPreview'

    export default {
        name: 'NewUsers',
        components: {
            OtherUserDataPreview
        },
        props: {},
        data () {
            return {
                users: this.users,
                newMembersLoading: this.newMembersLoading | true,
                userSelected: this.userSelected
            }
        },
        computed: {},
        created () {
            userService.getNewUsers().then((result) => {
                this.users = result
                this.newMembersLoading = false
            })
        },
        methods: {
            previewUser (userid) {
                console.log(userid)
                this.$bvModal.show('new-members-user-preview-modal')
                this.userSelected = null
                userService.getUser(userid).then((result) => {
                    this.userSelected = result
                    Vue.prototype.$forceUpdate()
                })
            },
            format
        }
    }
</script>

<style scoped>
    .avatar {
        margin-left: 1rem;
    }

    .name {
        margin-left: 1rem;
        margin-top: 0.3rem;
    }

    .user-thumbnail {
        margin-top: 0.5rem;
    }

    .timeago {
        margin-left: 1rem;
        margin-top: 0.3rem;
    }

    #newest-members-body {
        min-height: 10rem;
    }

    #new-users-container {
        height: 500px;
    }

    #loading {
        margin: 5rem;
    }
</style>
