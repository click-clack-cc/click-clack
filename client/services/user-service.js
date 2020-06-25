const url = '/users/'
export default class UserService {
	http = null

	constructor (axios) {
		this.http = axios
	}

	async logIn (username, password) {
		const { data } = await this.http.post(`${url}/login`, { id: username, password })
		return { ...data, createdAt: new Date(data.createdAt) }
	}

	async signUp (id, email, firstname, lastname, password) {
		const { data } = await this.http.post(`${url}/register`, { id, email, firstname, lastname, password })
		return data
	}

	async getUser (id) {
		const { data: [user] } = await this.http.get(url, { params: { id } })
		return { ...user, createdAt: new Date(user.createdAt) }
	}

	async resolveId (id) {
		const { data: [user] } = await this.http.get(`${url}/resolveid`, { params: { id } })
		return { ...user, createdAt: new Date(user.createdAt) }
	}

	async getNewUsers () {
		const { data } = await this.http.get(`${url}/new`)
		return data.map(user => ({ ...user, createdAt: new Date(user.createdAt) }))
	}

	changeId (oldid, newid) {
		return this.http.post(url + 'id', { id: oldid, newid })
	}

	changeUserBio (id, bio) {
		return this.http.post(url + 'bio', { id, bio })
	}

	changeKeebs (id, keyboards) {
		return this.http.post(url + 'keebs', { id, keebs: keyboards })
	}

	async recommend (submitterid, recommendedid, recommendationtext) {
		const { data } = await this.http.post(`${url}/recommend`, {
			id: submitterid,
			user: recommendedid,
			text: recommendationtext
		})
		return data
	}

	async report (submitterid, reportedid, reporttext) {
		const { data } = await this.http.post(url + 'report', {
			id: submitterid,
			user: reportedid,
			text: reporttext
		})
		return data
	}

	deleteUser (id) {
		return this.http.post(url + '/delete', { id })
	}

	async validateUsername (publicUserName) {
		const { data } = await this.http.get(`${url}/validateUsername`, { params: { id: publicUserName } })
		return data
	}

	changeLastname (id, lastname) {
		return this.http.post(url + 'lastname', { id, lastname })
	}

	changeFirstname (id, firstname) {
		return this.http.post(url + 'firstname', { id, firstname })
	}
}
