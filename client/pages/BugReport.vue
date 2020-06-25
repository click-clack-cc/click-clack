<template>
  <div>
    <br>
    <br>
    <h4>
      Reporting a bug
    </h4>
    <p>
      When you encounter an error in the system, you should let us know about it so we can fix it as soon as
      possible.
      Fixing all these errors or "bugs" will make click-clack more enjoyable to use, safer and faster as well!
    </p>

    <h5>Where?</h5>
    <p>
      If you ever find a bug, there are three main ways you can choose from to report it.
    </p>
    <ul>
      <li>
        By emailing <a style="font-weight: bold" href="mailto:support@click-clack.cc">support@click-clack.cc</a>.
      </li>
      <li>
        On our <a style="font-weight: bold" href="https://github.com/click-clack-cc/click-clack-public">Discord
          server</a>
      </li>
      <li>
        On the <a style="font-weight: bold" href="https://discord.gg/3yz24CB">open GitHub issue tracker
          repository</a>.
      </li>
    </ul>

    <h5>How?</h5>
    When you report a bug, we need to know certain things to be able to identify and fix the problem.
    Please make sure to include these details:
    <br>
    <br>
    <ul>
      <li>
        <span style="font-weight: bold">A short description of the bug.</span> Try to answer these questions:
        What anomaly do you experience?
        What is not working the way you expected? What is it doing/not doing, and what did you expect?
      </li>
      <li>
        <span style="font-weight: bold">How to reproduce the bug.</span> We need to understand how to reproduce
        what happened to you. What
        were you doing before and when this bug occured? Did it occur multiple times or only once?
      </li>
      <li>
        <span style="font-weight: bold">What is your setup?</span> Please let us know what browser, what version
        of it (e.g. Google Chrome 83.0.4103.106),
        what operating system, please also let us know how fast your internet connection is (<a
          href="mailto:https://www.speedtest.net"
        >test it here</a>)
        and what specifications your device has (CPU, RAM). If you don't know all of these, that's not a
        problem,
        but please include as much of these info as you can.
      </li>
      <li>
        <span style="font-weight: bold"> Where are you?</span> Just roughly where in the world. Country will be
        perfectly enough.
      </li>
    </ul>
  </div>
</template>

<script>
export default {
	name: 'BugReport',
	layout: 'index',
	data () {
		return {}
	},
	async created () {
	},
	methods: {},
	head () {
		const description = 'If you find a bug on click-clack, you should let the team know, so we can fix it quickly. Learn how to report a bug.'
		const title = 'Click-Clack Bugreport Guide'
		const url = 'https://click-clack.cc/bugreport'
		return {
			title,
			htmlAttrs: {
				lang: 'en'
			},
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },

				{ name: 'title', property: 'title', hid: 'title', content: title },
				{ name: 'og:title', property: 'og:title', hid: 'og:title', content: title },
				{ name: 'twitter:title', property: 'twitter:title', hid: 'twitter:title', content: title },

				{ name: 'description', property: 'description', hid: 'description', content: description },
				{ name: 'og:description', property: 'og:description', hid: 'og:description', content: description },
				{
					name: 'twitter:description',
					property: 'twitter:description',
					hid: 'twitter:description',
					content: description
				},

				// {name: 'twitter:image', hid: 'twitter:image', property: 'twitter:image', content: image},
				// {name: 'og:image', hid: 'og:image', property: 'og:image', content: image},
				// {name: 'image', hid: 'image', property: 'image', content: image},

				{ name: 'og:site_name', property: 'og:site_name', hid: 'og:site_name', content: 'click-clack' },
				{ name: 'og:type', property: 'og:type', hid: 'og:type', content: 'website' },
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
</style>
