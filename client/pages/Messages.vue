<template>
    <div>
        <client-only>
            <b-row>
                <b-col cols='4'>
                    <b-card>
                        <h4>
                            Conversations
                        </h4>
                        <br>
                        <b-col no-gutters >
                            <b-row no-gutters v-for='(convo, index) in conversations' v-bind:key='index' style='margin-bottom: 1rem'>
                                <b-button style='width: 100%' variant='outline-primary'  @click='openConvo(index)'>
                                    <b-row no-gutters >
                                        <b-col cols='3'>
                                            <b-avatar
                                                :src="`https://click-clack.cc:5000/files/images/${index}.jpg`"
                                                badge-offset="-0.25rem"
                                                button
                                                class="avatar"
                                                size="2.5rem"
                                                variant="light"
                                            >
                                                <template v-if="convo.user.role.includes('admin')" v-slot:badge>
                                                    <b-icon v-b-tooltip.right icon="shield-shaded" title="Administrator"/>
                                                </template>
                                            </b-avatar>
                                        </b-col>
                                        <b-col cols='6' style='margin-left: 0.5rem' align='left' >
                                            <div>
                                                <span class="text-muted">  </span>
                                                {{ convo.user.firstname }}<br>
                                                <span class="text-muted"> @{{convo.user.id }} </span>
                                            </div>
                                        </b-col>
                                        <b-col v-if='!convo.seen' cols='2'>
                                            <b-icon scale='1' style='margin-top: 0.8rem' icon='envelope'></b-icon>
                                        </b-col>
                                    </b-row>
                                </b-button>
                            </b-row>
                        </b-col>
                    </b-card>
                </b-col>
                <b-col>
                    <div v-if='currentConversation'>
                        <div v-if='currentConversation'>
                            <h4>
                                <span class="text-muted">  </span>
                                {{ conversations[currentConversation].user.firstname }}
                                <span class="text-muted"> @{{conversations[currentConversation].user.id }} </span>
                            </h4>
                        </div>
                        <b-card >
                            <b-col class="messages" v-chat-scroll="{always: false, smooth: true}" v-if='this.currentConversation' style="height: 25rem; overflow-y: scroll;" id='chatbox'>
                                <b-row v-for='(message, index) in conversations[this.currentConversation].messages' v-bind:key='index' class='message'>
                                    <b-col align='left'>
                                        <br v-if='index === 0 || conversations[currentConversation].messages[index-1] && conversations[currentConversation].messages[index-1].from!== message.from'>
                                        <div id="from" v-if='index === 0 || conversations[currentConversation].messages[index-1] && conversations[currentConversation].messages[index-1].from!== message.from'>
                                            <span class="text-muted">  </span>
                                            <a :href="`/u/${message.fromuserdata.id}`" style='font-weight: bold'> {{ message.fromuserdata.firstname }}
                                                <span class="text-muted"> @{{ message.fromuserdata.id }} </span></a>
                                        </div>
                                        <div v-html='$md.renderInline(message.text)' class='message-text'>
                                        </div>
                                    </b-col>
                                    <b-col cols='3' align='right' >
                                        <br v-if='index === 0 || conversations[currentConversation].messages[index-1] && conversations[currentConversation].messages[index-1].from!== message.from'>
                                        <span class='text-muted' style='font-size: x-small'>
                                        {{format(message.createdAt)}}
                                    </span>
                                    </b-col>
                                </b-row>
                            </b-col>
                            <br>
                            <b-input-group>
                                <b-form-input @keyup.enter='send'
                                              v-model='messageInput'
                                              placeholder='Message'>
                                </b-form-input>
                                <template v-slot:append>
                                    <b-button @click='send'>Send</b-button>
                                </template>
                            </b-input-group>
                        </b-card>
                    </div>
                    <b-row  v-if='currentConversation' class='text-muted'  style='margin: 2rem auto auto;max-width: 50%'>
                        <b-col cols='2' align='right'>
                            <b-icon scale='1.4' shift-v='-16' icon='info-circle'></b-icon>
                        </b-col>
                        <b-col align='left'>
                            <p style='font-size: small'>Please contact <a href='mailto:support@click-clack.cc'>support@click-clack.cc</a> if you're not feeling comfortable with this conversation.</p>
                        </b-col>
                    </b-row>
                    <b-row v-else class='text-muted' style='margin: 2rem auto auto;max-width: 50%'>
                        <b-col cols='2' align='middle'>
                            <b-icon scale='1.4' shift-v='-16' icon='info-circle'></b-icon>
                        </b-col>
                        <b-col>
                            <p style='font-size: small'>Select a conversation to start. If you don't have any conversations yet, you can start one by visiting a user's profile.</p>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </client-only>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import messageService from "../services/message-service";
    import {format} from "timeago.js"

    export default {
        name: 'Messages',
        layout: 'index',
        components: {},
        props: [],
        created() {
            if (this.user && this.token) {
                this.loadMessages()
                if(this.messagePollerStarted) return
                if(!this.interval) this.interval = setInterval(this.loadMessages, 5000)
                this.messagePollerStarted = true
            }
        },
        watch: {
            user: {
                immediate: true,
                handler() {
                    if (this.user && this.token) {
                        this.loadMessages()
                        if(this.messagePollerStarted) return
                        if(!this.interval) this.interval = setInterval(this.loadMessages, 5000)
                        this.messagePollerStarted = true
                    }
                }
            }
        },
        data() {
            return {
                conversations: [],
                currentConversation: null,
                messageInput: null,
                messagePollerStarted: false,
                interval: null
            }
        },
        computed: mapState(['user', 'token', 'nightmode', 'zenmode', 'darktheme', 'lighttheme', 'search']),
        asyncData() {
            return {}
        },
        beforeDestroy() {
            clearInterval(this.interval)
        },
        methods: {
            loadMessages() {
                messageService.getMessages(this.user._id, this.token).then((res) => {
                    this.conversations = {}
                    res.reverse();
                    for (let i = 0; i < res.length; i++) {
                        let otherUserId = res[i].from === this.user._id?res[i].to:res[i].from
                        if(!this.conversations[otherUserId]){
                            this.conversations[otherUserId] = {}
                            this.conversations[otherUserId].seen = true
                                this.conversations[otherUserId].user = res[i].from === this.user._id?res[i].touserdata:res[i].fromuserdata
                            this.conversations[otherUserId].messages = []
                        }
                        if(res[i].to === this.user._id && !res[i].seen) {
                            this.conversations[otherUserId].seen = false;
                        }
                        this.conversations[otherUserId].messages.push(res[i])
                    }
                }).catch((error) => {
                    this.$bvToast.toast(error.response.statusText, {
                        title: 'Error',
                        variant: 'danger',
                        toaster: 'b-toaster-top-center'
                    })
                })
            },
            send() {
                messageService.sendMessage(this.user._id, this.currentConversation, this.messageInput, this.token).then(() => {
                    this.loadMessages()
                }).catch((error) => {
                    this.$bvToast.toast(error.response.statusText, {
                        title: 'Error',
                        variant: 'danger',
                        toaster: 'b-toaster-top-center'
                    })
                })
                this.messageInput = null
            },
            openConvo(convo){
                this.currentConversation = convo
                messageService.markSeen(this.user._id, convo, this.token).then((res) => {
                    this.loadMessages()
                }).catch((error) => {
                    this.$bvToast.toast(error.response.statusText, {
                        title: 'Error',
                        variant: 'danger',
                        toaster: 'b-toaster-top-center'
                    })
                })
            },
            format
        },
        head() {
            const description = 'Chat with other members on Click-Clack'
            const title = 'Click-Clack - Messages'
            const image = 'https://click-clack.cc:5000/files/images/indeximage.JPG'
            const url = 'https://click-clack.cc/messages'
            return {
                title,
                htmlAttrs: {
                    lang: 'en'
                },
                meta: [
                    {charset: 'utf-8'},
                    {name: 'viewport', content: 'width=device-width, initial-scale=1'},

                    {name: 'title', property: 'title', hid: 'title', content: title},
                    {name: 'og:title', property: 'og:title', hid: 'og:title', content: title},
                    {name: 'twitter:title', property: 'twitter:title', hid: 'twitter:title', content: title},

                    {name: 'description', property: 'description', hid: 'description', content: description},
                    {name: 'og:description', property: 'og:description', hid: 'og:description', content: description},
                    {
                        name: 'twitter:description',
                        property: 'twitter:description',
                        hid: 'twitter:description',
                        content: description
                    },

                    {name: 'twitter:image', hid: 'twitter:image', property: 'twitter:image', content: image},
                    {name: 'og:image', hid: 'og:image', property: 'og:image', content: image},
                    {name: 'image', hid: 'image', property: 'image', content: image},

                    {name: 'og:site_name', property: 'og:site_name', hid: 'og:site_name', content: 'click-clack'},
                    {name: 'og:type', property: 'og:type', hid: 'og:type', content: 'website'},
                    {
                        name: 'og:url',
                        property: 'og:url',
                        hid: 'og:url',
                        content: url
                    }
                ]
            }
        }
    }
</script>

<style scoped>
    .message {
        /*margin-bottom: 0.5rem;*/
    }

    .avatar {
        /*margin-top: 1rem;*/
        margin: 0.2rem;
    }

    .message-text {
        margin-left: 1rem;
    }
</style>