const url = '/posts'

export default class PostService {
	http = null

	constructor (axios) {
		this.http = axios
	}

	async getPosts (user) {
		const { data } = await this.http.get(`${url}/u`, { params: { user } })
		return data.map(post => ({ ...post, createdAt: new Date(post.createdAt), lastModified: new Date(post.lastModified) }))
	}

	async getOwn (user) {
		const { data } = await this.http.get(`${url}/own`, { params: { user } })
		return data.map(post => ({ ...post, createdAt: new Date(post.createdAt), lastModified: new Date(post.lastModified) }))
	}

	async getNewPosts (method) {
		const { data } = await this.http.get(`${url}/${method}`)
		return data.map(post => ({
			...post,
			createdAt: new Date(post.createdAt),
			lastModified: new Date(post.lastModified)
		})
		)
	}

	async heart (id, post) {
		const { data: [ps] } = await this.http.post(`${url}/heart`, { id, post })

		return ps
	}

	async comment (id, post, text) {
		const { data: [ps] } = await this.http.post(`${url}/comment`, { id, post, text })
		return ps
	}

	async getPost (id) {
		const { data: [lt] } = await this.http.get(`${url}/id`, { params: { id } })
		return { ...lt, createdAt: new Date(lt.createdAt), lastModified: new Date(lt.lastModified) }
	}

	async updatePost (id, edit, post) {
		const { data: [lt] } = await this.http.post(`${url + (edit ? '/update' : '/')}`, { id, post })
		return lt
	}

	async deletePost (id, post) {
		const { data: [lt] } = await this.http.post(`${url}/delete`, { id, post })
		return lt
	}
}
