<template>
    <div id="self-user-data-container">
        <b-overlay :show="loading" blur="0.5rem" opacity="1" variant="transparent">
            <b-list-group v-if="!loading">
                <b-list-group-item v-for="(rec, index) in this.recommendations" :key="index">
                    <b-avatar
                        :src="`https://click-clack.cc:5000/files/images/${rec.submitter}.jpg`"
                        button
                        class="avatar"
                        size="2rem"
                        variant="light"
                        @click="previewUser(rec.user.id)"
                    />
                    <b-link :href="`/u/${rec.user.id}`" class="name">
                        {{ rec.user.firstname }} {{ rec.user.lastname }}
                    </b-link>
                    <span class="tag text-muted"> @{{ rec.user.id }} </span>
                    {{ rec.reason }}
                </b-list-group-item>
            </b-list-group>
        </b-overlay>
        <b-modal
            v-if="userSelected"
            id="recommendation-list-user-preview-modal"
            ref="recommendation-list-user-preview-modal"
            centered
            hide-header
            ok-only
        >
            <OtherUserDataPreview :inspected-user="userSelected" />
        </b-modal>
    </div>
</template>

<script>

    import Vue from 'vue'
    import userService from '../services/user-service'
    import OtherUserDataPreview from '../components/OtherUserDataPreview'

    export default {
        name: 'RecommendationList',
        components: {
            OtherUserDataPreview
        },
        props: [
            'inspectedUser'
        ],
        data () {
            return {
                recommendations: [],
                loading: true,
                userSelected: this.userSelected
            }
        },
        watch: {
            inspectedUser: {
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
            async loadUserData () {
                if (!this.inspectedUser) {
                    return
                }
                this.recommendations = this.inspectedUser.recommendations
                if (!this.recommendations) {
                    this.recommendations = []
                }
                for (let i = 0; i < this.recommendations.length; i++) {
                    this.recommendations[i].user = (await userService.getUser(this.recommendations[i].submitter))
                }
                this.loading = false
            },
            previewUser (userid) {
                userService.getUser(userid).then((result) => {
                    this.$bvModal.show('recommendation-list-user-preview-modal')
                    this.userSelected = result
                    Vue.prototype.$forceUpdate()
                    console.log(result)
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

    .name {
        margin-left: 1rem;
        margin-top: 0.3rem;
        margin-right: 0rem;
    }

    .tag {
        margin-right: 1rem;
    }

</style>
