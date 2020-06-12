<template>
    <div id="statistics-container">
        <StatsList :scope="'global'" />
    </div>
</template>

<script>

    import { mapState } from 'vuex'
    import StatsList from '../components/StatsList'

    export default {
        name: 'Statistics',
        layout: 'index',
        components: { StatsList },
        props: {},
        data () {
            return {}
        },
        computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
        created () {
        },
        methods: {}
    }
</script>

<style scoped>

</style>
