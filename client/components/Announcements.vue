<template>
    <b-card id="announcements-container" header-tag="header">
        <template v-slot:header>
            <h4 class="mb-0">
                Announcements
            </h4>
        </template>
        <div v-if="announcements">
            <div v-for="(ann, index) in announcements" :key="index">
                <span class="text-muted">{{ format(ann.createdAt) }}</span><br>
                {{ ann.text }}
                <br><br>
            </div>
        </div>
        <div v-else id="loading" class="text-center">
            <b-spinner :variant="'primary'" type="grow" />
        </div>
    </b-card>
</template>

<script>
    import { format } from 'timeago.js'
    import AnnouncementService from '../services/announcement-service'

    export default {
        name: 'NewUsers',
        components: {},
        props: {},
        data () {
            return {
                announcements: null
            }
        },
        computed: {},
        created () {
            AnnouncementService.getAnnouncements().then((announcements) => {
                this.announcements = announcements
            })
        },
        methods: {

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
