const keyboardsurl = '/keyboards/search'
const usersurl = '/users/search'
const listingsurl = '/listings/search'
const postssurl = '/posts/search'

export default class SearchService {
	http = null

	constructor (axios) {
		this.http = axios
	}

	async search (searchtext) {
		if (!searchtext || searchtext.length < 1) {
			return
		}

		const usersReq = this.http.get(usersurl, { params: { text: searchtext } })
		const keyboardsReq = this.http.get(keyboardsurl, { params: { text: searchtext } })
		const listingsReq = this.http.get(listingsurl, { params: { text: searchtext } })
		const postsReq = this.http.get(postssurl, { params: { text: searchtext } })

		const [{ data: usersRes }, { data: keyboardsRes }, { data: listingsRes }, { data: postsRes }] =
			await Promise.all([usersReq, keyboardsReq, listingsReq, postsReq])
		return { users: usersRes, keyboards: keyboardsRes, listings: listingsRes, posts: postsRes }
	}
}
