const url = '/img'

export default class ImgService {
	http = null

	constructor (axios) {
		this.http = axios
	}

	async uploadProfileImage (id, img) {
		const formData = new FormData()
		formData.append('id', id)
		formData.append('image', img, `${id}.jpg`)

		const { data } = await this.http.post(`${url}/upload`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
		return data
	}

	async uploadKeyboardImages (id, keyboard, imageNames, images) {
		const formData = new FormData()
		formData.append('id', id)
		formData.append('keyboard', keyboard)

		images.forEach((image, index) => {
			formData.append('image', image, imageNames[index])
		})

		const { data } = await this.http.post(`${url}/keebphotos`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
		return data
	}

	async uploadListingImages (id, listing, imageNames, images, token) {
		const formData = new FormData()
		formData.append('id', id)
		formData.append('listing', listing)

		images.forEach((image, index) => {
			formData.append('image', image, imageNames[index])
		})

		const { data } = await this.http.post(`${url}/listingphotos`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `Bearer ${token}`
			}
		})
		return data
	}

	async uploadPostImages (id, post, imageNames, images, token) {
		const formData = new FormData()
		formData.append('id', id)
		formData.append('post', post)

		images.forEach((image, index) => {
			formData.append('image', image, imageNames[index])
		})

		const { data } = await this.http.post(`${url}/postphotos`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `Bearer ${token}`
			}
		})
		return data
	}
}
