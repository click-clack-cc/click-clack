<template>
    <div>
        <h4>
            Test page
            <br>
            <br>
        </h4>
        <p>
            Hello there
        </p>
    </div>
</template>

<script>

    export default {
        name: 'Test',
        layout: 'index',
        components: {},
        props: [],
        head () {
            return {
                title: 'test page'
            }
        }
    }
</script>

<style scoped>

</style>
