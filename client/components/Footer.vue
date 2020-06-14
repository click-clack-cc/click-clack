<template>
    <b-row id="footer-container">
        <b-col>
            <b-row>
                <b-col align="left">
                    <div id="subtitle">
                        <p id="contact">
                            Need help? Contact us at
                            <a href="mailto:support@click-clack.cc">
                                support@click-clack.cc</a><br>
                        </p>
                        <p id="contact">
                            Want to contribute? Message <a href='/u/daniel'>@daniel</a> at
                            <a href="mailto:support@click-clack.cc">
                                daniel.szabo@click-clack.cc</a><br>
                        </p>
                        <p id="madeinhungary">
                            Click-clack beta v0.9.3 proudly made in Hungary<br>
                        </p>
                    </div>
                </b-col>
            </b-row>
        </b-col>
        <b-col>
            <b-row>
                <b-col align="right">
                    <p id="support">
                        <a href="https://www.patreon.com/clickclackcc">
                            <b-button variant='outline-primary'>
                                Support click-clack
                                <b-icon style='margin-left: 0.5rem' icon="heart"/>
                            </b-button>
                        </a><br>
                    </p>
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        name: 'Footer'
    }
</script>

<style scoped>
    #footer-container {
        text-align: left;
        margin-top: 0.5rem;
        /*margin-left: auto;*/
        /*margin-right: auto;*/
    }

    #title {
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        font-style: italic;
    }

    #subtitle {
        font-size: 0.7rem;
        font-weight: lighter;
        margin-left: auto;
        margin-right: auto;
    }

    #hu-flag {
        margin-top: 2.2rem;
        margin-right: 2rem;
        margin-bottom: -1.5rem;
        transform: scale(0.35);
    }

    #contact, #support {
        line-height: 0.5;
    }

    #madeinhungary, #version {
        line-height: 0.7;
    }
</style>
