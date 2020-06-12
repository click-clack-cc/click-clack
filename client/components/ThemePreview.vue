<template>
    <div id="theme-preview">
        <link :href="`../bootstrap-themes/${theme}.css`" rel="stylesheet">
        <Typer />
    </div>
</template>

<script>

    import Typer from '../components/Typer'

    export default {
        name: 'ThemePreview',
        components: {
            Typer
        },
        props: [
            'theme'
        ],
        data () {
            return {}
        },
        computed: {},
        watch: {
            theme: {
                immediate: true,
                handler () {
                    this.$forceUpdate()
                }
            }
        },
        async created () {
            await import(`../bootstrap-themes/${this.theme}.css`)
        },
        methods: {}
    }
</script>

<style scoped>
    /*@import url("../bootstrap-themes/dark.css");*/
</style>
