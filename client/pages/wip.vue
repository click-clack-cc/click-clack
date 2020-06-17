<template>
    <div>
        <b-card
            id="card"
            bg-variant="light"
            class="mb-2"
            style="max-width: 20rem;"
            tag="article"
            title="Construction Area"
        >
            <b-card-text>
                This page is under construction. Check back a bit later!
            </b-card-text>

            <b-button to="/" variant="primary">
                Go home
            </b-button>
        </b-card>
    </div>
</template>

<script>

    export default {
        name: 'PageNotFound',
        layout: 'index',
        data () {
            return {}
        },
        async created () {
        },
        methods: {}
    }
</script>

<style scoped>
    #card {
        text-align: center;
        margin: auto;
        margin-top: 14rem;
    }
</style>
