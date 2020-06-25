export default function ({ $axios, app }, inject) {
	const api = $axios.create()

	const token = app.$cookies.get('token')

	if (token) {
		api.setToken(token, 'Bearer')
	}

	inject('api', api)
}
