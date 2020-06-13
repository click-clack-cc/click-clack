<template>
    <div>
        <h4>
            Test page
            <br>
            <br>
        </h4>
        <p>
            Hello there, what are you looking for?
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
                title: 'Test page'
            }
        }
    }
</script>

<style scoped>

</style>
