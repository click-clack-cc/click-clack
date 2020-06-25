const url = '/stats'

export default class StatService {
	http = null

	constructor (axios) {
		this.http = axios
	}

	async getStats (id) {
		const { data } = await this.http.get(url, { params: { id } })
		return data.map(stat => ({ ...stat, createdAt: new Date(stat.createdAt) }))
	}

	async getTop () {
		const { data } = await this.http.get(`${url}/leaderboard`)
		return data
	}

	insertStat (id, stat) {
		return this.http.post(url, { id, stat })
	}
}
