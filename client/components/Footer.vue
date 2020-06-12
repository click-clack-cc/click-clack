<template>
    <div id="footer-container">
        <div id="title" />

        <b-row>
            <b-col align="left">
                <div id="subtitle">
                    <p id="contact">
                        Contact us at
                        <a href="mailto:support@click-clack.cc">
                            support@click-clack.cc</a><br>
                    </p>

                    <p id="support">
                        <a href="https://www.patreon.com/danielszabo">

                            Support click-clack
                            <b-icon icon="heart-fill" />
                        </a><br>
                    </p>

                    <p id="madeinhungary">
                        Made in Hungary<br>
                    </p>

                    <p id="version">
                        Beta v0.9.1 b024112062020 <br>
                    </p>
                </div>
            </b-col>
        </b-row>
    </div>
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
