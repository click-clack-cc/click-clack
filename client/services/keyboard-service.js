const url = '/keyboards'

export default class KeyboardService {
	http = null

	constructor (axios) {
		this.http = axios
	}

	async getKeyboards (user) {
		const { data } = await this.http.get(`${url}/u`, { params: { user } })
		return data.map(keyboard => ({ ...keyboard, createdAt: new Date(keyboard.createdAt), lastModified: new Date(keyboard.lastModified) }))
	}

	async getNewKeyboards (method, page) {
		const { data } = await this.http.get(`${url}/${method}`, { params: { page } })
		return data.map(keyboard => ({
			...keyboard,
			createdAt: new Date(keyboard.createdAt),
			lastModified: new Date(keyboard.lastModified)
		})
		)
	}

	async getKeyboard (id) {
		const { data: [keyboard] } = await this.http.get(`${url}/id`, { params: { id } })
		return { ...keyboard, createdAt: new Date(keyboard.createdAt), lastModified: new Date(keyboard.lastModified) }
	}

	async updateKeyboard (id, edit, keyboard) {
		const { data: [kb] } = await this.http.post(`${url}/${edit ? '/update' : ''}`, { id, keyboard })

		return kb
	}

	async deleteKeyboard (id, keyboard) {
		const { data: [response] } = await this.http.post(`${url}/delete`, { id, keyboard })

		return response
	}

	async comment (id, keyboard, text) {
		const { data: [response] } = await this.http.post(`${url}/comment`, { id, keyboard, text })

		return response
	}

	async heart (id, keyboard) {
		const { data: [response] } = await this.http.post(`${url}/heart`, { id, keyboard })

		return response
	}
}
