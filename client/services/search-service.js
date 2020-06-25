const keyboardsurl = '/keyboards/search'
const usersurl = '/users/search'

export default class SearchService {
	http = null
	constructor (axios) {
		this.http = axios
	}

	async search (searchtext) {
		if (searchtext.length < 1) { return }
		const usersReq = this.http.get(usersurl, { params: { text: searchtext } })
		const keyboardsReq = this.http.get(keyboardsurl, { params: { text: searchtext } })
		const [{ data: usersRes }, { data: keyboardsRes }] = await Promise.all([usersReq, keyboardsReq])
		return { usersRes, keyboardsRes }
	}
}
