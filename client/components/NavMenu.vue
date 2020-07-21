<template>
  <b-nav
    id="nav"
    class="justify-content-lg-end justify-content-around"
    no-gutters
    pill
  >
    <b-nav-item v-for="(item, idx) in navItems" :key="`nav-item-${idx}`" class="text-center">
      <b-button variant="link" :to="item.link">
        <b-icon v-b-tooltip.hover.bottom :title="item.name" :icon="item.icon" />
      </b-button>
    </b-nav-item>
    <b-nav-item class="text-center">
      <b-dropdown variant="link" no-caret right toggle-class="text-decoration-none">
        <template v-slot:button-content>
          <b-avatar
            v-if="user"
            :src="$config.imageBaseUrl + user._id + `.jpg`"
            variant="light"
            badge-top
            badge-variant="danger"
            badge-offset="-0.23rem"
          >
            <template v-if="unseen > 0" v-slot:badge>
              {{ unseen }}
            </template>
          </b-avatar>
          <b-avatar
            v-else
            variant="light"
          />
        </template>
        <b-dropdown-item @click="$nuxt.$router.push(`/profile`)">
          <nuxt-link to="/profile">
            <b-icon icon="person" />
            <span v-if="user">Profile</span>
            <span v-else>Sign in</span>
          </nuxt-link>
        </b-dropdown-item>
        <b-dropdown-item v-if="user && (user.role.includes('admin') || user.role.includes('developer'))" @click=" $nuxt.$router.push(`/admintools`)">
          <nuxt-link to="/profile">
            <b-icon icon="shield" />
            <span>AdminTools</span>
          </nuxt-link>
        </b-dropdown-item>
        <b-dropdown-item v-if="!user" @click="$nuxt.$router.push(`/signup`)">
          <nuxt-link to="/profile">
            <b-icon icon="person-plus" />
            <span>Sign up</span>
          </nuxt-link>
        </b-dropdown-item>
        <b-dropdown-item v-if="user" @click="$nuxt.$router.push(`/messages`)">
          <nuxt-link to="/messages">
            <b-icon v-if="unseen === 0" icon="envelope-open" />
            <b-icon v-else icon="envelope" />
            Messages
            <b-badge v-if="unseen > 0" variant="danger">
              {{ unseen }}
            </b-badge>
          </nuxt-link>
        </b-dropdown-item>
        <b-dropdown-item v-if="user" @click="$nuxt.$router.push(`/settings`)">
          <nuxt-link exact exact-active-class="active" to="/settings">
            <b-icon icon="window" />
            Themes
          </nuxt-link>
        </b-dropdown-item>
        <b-dropdown-item @click="changeTheme">
          <div v-if="nightmode">
            <b-icon icon="sun" />
            Disable night mode
          </div>
          <div v-else>
            <b-icon icon="moon" />
            Enable night mode
          </div>
        </b-dropdown-item>
        <b-dropdown-item-btn>
          <a href="https://www.patreon.com/clickclackcc">
            <b-icon icon="heart" />
            Become a supporter
          </a>
        </b-dropdown-item-btn>
        <b-dropdown-divider />
        <b-dropdown-item @click="$nuxt.$router.push(`/wip`)">
          <nuxt-link to="/wip" class="active">
            <b-icon icon="question-circle" />
            FAQ
          </nuxt-link>
        </b-dropdown-item>
        <b-dropdown-item @click="$nuxt.$router.push(`/termsandconditions`)">
          <nuxt-link to="/termsandconditions">
            <b-icon icon="justify" />
            T&C
          </nuxt-link>
        </b-dropdown-item>
        <b-dropdown-item-btn>
          <a href="mailto:support@click-clack.cc">
            <b-icon icon="person" />
            Contact support
          </a>
        </b-dropdown-item-btn>
        <b-dropdown-item @click="$nuxt.$router.push(`/bugreport`)">
          <b-icon icon="exclamation-square" />
          Report bug
        </b-dropdown-item>
        <b-dropdown-divider v-if="user" />
        <b-dropdown-item-btn v-if="user" @click="signOut">
          <b-icon icon="arrow-right-circle" />
          Sign out
        </b-dropdown-item-btn>
      </b-dropdown>
    </b-nav-item>
  </b-nav>
</template>

<script>
import { mapState } from 'vuex'

export default {
	props: {
		navItems: {
			type: Array,
			required: true,
			default: () => []
		},
		user: {
			type: Object,
			required: false,
			default: () => {}
		},
		unseen: {
			type: Number,
			required: false,
			default: 0
		}
	},
	data () {
		return {
			 nightmodeSwitchValue: this.nightmode
		}
	},
	computed: mapState(['nightmode']),
	methods: {
		changeTheme () {
			this.$emit('change-theme')
		},
		signOut () {
			this.$emit('sign-out')
		}
	}
}
</script>

<style>
/* Removed scope here because scoped styles cannot be applied to bootstrap generated elements */
/* Wrapped every item with unique #nav parent to avoid leaking styles to the rest of the site */

    #nav {
        width: 100%;
    }

    #nav .nav-link {
        padding: 0;
    }

    #nav .nav-link .dropdown-toggle {
        padding: 0;
    }

    #nav .dropdown-menu .dropdown-item .active {
        font-weight: bold;
    }

    @media (max-width: 991px) {
        #nav {
            background-color: #ffffff;
            border-top: 1px solid #eeeeee;
            bottom: 0;
            left: 0;
            margin: 0;
            padding: 0.5rem 0;
            position: fixed;
            right: 0;
            z-index: 99;
        }

        #nav .nav-item .b-icon {
            font-size: 180%;
        }
    }
</style>
