const url = '/listings'

export default class listingService {
	http = null

	constructor (axios) {
		this.http = axios
	}

	async getListings (user) {
		const { data } = await this.http.get(`${url}/u`, { params: { user } })
		return data.map(keyboard => ({ ...keyboard, createdAt: new Date(keyboard.createdAt), lastModified: new Date(keyboard.lastModified) }))
	}

	async getOwn (user) {
		const { data } = await this.http.get(`${url}/own`, { params: { user } })
		return data.map(listing => ({ ...listing, createdAt: new Date(listing.createdAt), lastModified: new Date(listing.lastModified) }))
	}

	async getNewListings (method) {
		const { data } = await this.http.get(`${url}/${method}`)
		return data.map(keyboard => ({ ...keyboard, createdAt: new Date(keyboard.createdAt), lastModified: new Date(keyboard.lastModified) }))
	}

	async getListing (id) {
		const { data: [response] } = await this.http.get(`${url}/id`, { params: { id } })
		return { ...response, createdAt: new Date(response.createdAt), lastModified: new Date(response.lastModified) }
	}

	async newListing (id, keyboard) {
		const { data: [response] } = await this.http.post(`${url}/`, { id, keyboard })
		return response
	}

	async updateListing (id, keyboard) {
		const { data: [response] } = await this.http.post(`${url}/update`, { id, keyboard })
		return response
	}

	async deleteListing (id, keyboard) {
		const { data: [response] } = await this.http.post(`${url}/delete`, { id, keyboard })
		return response
	}
}
