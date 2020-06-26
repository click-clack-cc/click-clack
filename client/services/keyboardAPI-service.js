const url = '/kbapi'

export default class KeyboardAPIService {
	http = null

	constructor (axios) {
		this.http = axios
	}

	async getSwitches () {
		const { data } = await this.http.get(url + '/switches')
		return data.switches
	}

	async getPCBs () {
		const { data } = await this.http.get(url + '/pcbs')
		return data.pcbs
	}

	async getPlates () {
		const { data } = await this.http.get(url + '/plates')
		return data.plates
	}

	async getCases () {
		const { data } = await this.http.get(url + '/cases')
		return data.cases
	}

	async getKeycaps () {
		const { data } = await this.http.get(url + '/keycaps')
		return data.keycaps
	}
}
