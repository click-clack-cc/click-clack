<template>
    <div v-if="comments" id="comment-list-container">
        <b-overlay :show="loading" blur="0.5rem" opacity="1" variant="transparent">

            <b-card class='comment' v-for="(com, index) in comments" :key="index" no-body>
                <b-row>
                    <b-col cols='3'>
                        <b-row>
                            <b-col cols='4'>
                                <b-avatar
                                    :src="`https://click-clack.cc:5000/files/images/${com.submitter._id}.jpg`"
                                    badge-offset="-0.2rem"
                                    button
                                    class="avatar"
                                    size="2rem"
                                    variant="light"
                                    @click="previewUser(com.submitter.id)"
                                >
                                    <template v-if="com.submitter.role == 'admin'" v-slot:badge>
                                        <b-icon v-b-tooltip.right icon="shield-shaded" title="Administrator"/>
                                    </template>
                                    <template v-else-if="com.submitter.role == 'verified'" v-slot:badge>
                                        <b-icon v-b-tooltip.right icon="check-circle" title="Verified user"/>
                                    </template>
                                    <template v-else-if="com.submitter.role == 'supporter'" v-slot:badge>
                                        <b-icon v-b-tooltip.right icon="heart" title="Supporter"/>
                                    </template>
                                    <template v-else-if="com.submitter.role == 'betatester'" v-slot:badge>
                                        <b-icon
                                            v-b-tooltip.right
                                            icon="egg"
                                            title="I was there when it all started"
                                        />
                                    </template>
                                    <template v-else-if="com.submitter.role == 'developer'" v-slot:badge>
                                        <b-icon v-b-tooltip.right icon="cup" title="Developer"/>
                                    </template>
                                </b-avatar>
                            </b-col>
                            <b-col align='left'>
                                <b-link :href="`/u/${com.submitter.id}`" class="name">
                                    {{ com.submitter.firstname }}
                                    <br>
                                    <span class="tag text-muted"> @{{ com.submitter.id }} </span>
                                </b-link>
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col><div style='margin-top: 0.3rem;'>
                        {{ com.text }}</div></b-col>
                    <b-col cols='2'><div style='margin-top: 0.3rem;'>
                        {{format(com.createdAt)}}</div></b-col>
                </b-row>
            </b-card>
        </b-overlay>
        <b-modal
            id="comment-list-user-preview-modal"
            ref="comment-list-user-preview-modal"
            centered
            hide-header
            ok-only
        >
            <OtherUserDataPreview v-if="userSelected" :inspected-user="userSelected"/>
        </b-modal>
    </div>
</template>

<script>

    import Vue from 'vue'
    import userService from '../services/user-service'
    import OtherUserDataPreview from '../components/OtherUserDataPreview'
    import {format} from 'timeago.js'

    export default {
        name: 'CommentList',
        components: {
            OtherUserDataPreview
        },
        props: [
            'user',
            'comments'
        ],
        data() {
            return {
                loading: true,
                userSelected: this.userSelected
            }
        },
        watch: {
            comments: {
                immediate: true,
                handler() {
                    this.loadUserData()
                }
            }
        },
        created() {
            this.loadUserData()
        },
        methods: {
            loadUserData() {
                this.loading = false
            },
            previewUser(userid) {
                this.$bvModal.show('comment-list-user-preview-modal')
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
    .comment {
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        max-width: 80%;
        margin-left: auto;
        margin-right: auto;
    }


    .name {
        margin-left: 1rem;
        /*margin-top: 0.3rem;*/
        margin-right: 0rem;
    }

    .tag {
        margin-right: 1rem;
    }

    .avatar {
        margin-left: 0.5rem;
    }

</style>
